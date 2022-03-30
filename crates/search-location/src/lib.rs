use anyhow::Result;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[derive(Serialize, Deserialize, Debug)]
pub enum LocationKind {
    City,
    Admin,
    Country,
    Timezone,
}

#[derive(Serialize, Deserialize, Debug)]
#[wasm_bindgen]
pub struct Location {
    name: String,
    kind: LocationKind,
    countryCode: String,
    timezone: String,
    latitude: f32,
    longitude: f32,
}

#[wasm_bindgen]
pub fn get_location() -> JsValue {
    let l = Location {
        latitude: 12.0,
        longitude: 56.0,
        name: String::from("Hello, world"),
        countryCode: String::from("LU"),
        timezone: String::from("xr"),
        kind: LocationKind::City,
    };

    JsValue::from_serde(&l).unwrap()
}

async fn get_locations(url: &str) -> Result<Vec<Location>> {
    let res = reqwest::get(url).await?;
    let body = res.text().await?;

    let mut rdr = csv::ReaderBuilder::new()
        .has_headers(false)
        .from_reader(body.as_bytes());

    fn parse_record(r: csv::StringRecord) -> Result<Location> {
        let kind_literal = &r[0];
        let kind = match kind_literal {
            "city" => LocationKind::City,
            "admin" => LocationKind::Admin,
            "country" => LocationKind::Country,
            "timezone" => LocationKind::Timezone,
            _ => panic!("Unknown kind: {}", kind_literal),
        };

        let name = &r[1];
        let country_code = &r[2];
        let latitude: f32 = *(&r[3].parse::<f32>()?) / 100.0;
        let longitude: f32 = *(&r[4].parse::<f32>()?) / 100.0;
        let timezone = &r[5];

        Ok(Location {
            kind,
            name: String::from(name),
            countryCode: String::from(country_code),
            latitude,
            longitude,
            timezone: String::from(timezone),
        })
    }

    let locations: Result<Vec<_>, _> = rdr.records().map(|r| (parse_record(r?))).collect();

    Ok(locations?)
}

#[wasm_bindgen]
pub async fn init_locations() {
    let url = "https://localhost:8080/4YoP5z3a3W0xhYgbqCZBkb.csv";

    let list = get_locations(url).await.unwrap();

    alert(&format!("{:#?}", list));
}
