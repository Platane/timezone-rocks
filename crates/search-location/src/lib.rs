use anyhow::Result;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
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
    pub latitude: f32,
    pub longitude: f32,
    name: String,
    kind: LocationKind,
    countryCode: String,
    timezone: String,
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

async fn get_locations(url: &str) -> Result<()> {
    let res = reqwest::get(url).await?;
    let body = res.text().await?;

    let mut rdr = csv::ReaderBuilder::new()
        .has_headers(false)
        .from_reader(body.as_bytes());

    for result in rdr.records() {
        let r = result?;
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
        let latitude = *(&r[3].parse::<f32>()?) / 100.0;
        let longitude = *(&r[4].parse::<f32>()?) / 100.0;
        let timezone = &r[5];
        let l = Location {
            kind,
            name: String::from(name),
            countryCode: String::from(country_code),
            latitude,
            longitude,
            timezone: String::from(timezone),
        };

        alert(&format!("{:?}", l));
    }

    Ok(())
}

#[wasm_bindgen]
pub async fn init_locations() {
    let url = "https://localhost:8080/4YoP5z3a3W0xhYgbqCZBkb.csv";

    get_locations(url).await.unwrap()
}
