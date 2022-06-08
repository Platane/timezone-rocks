mod search_engine;

use search_engine::SearchEngine;
use serde::{Deserialize, Serialize};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    // map [rust] fn alert(s: &str) => [ts] global.alert(s: string)
    pub fn alert(s: &str);

    // map [rust] jsLog(s: &str) => [ts] console.log(s: string)
    #[wasm_bindgen(js_namespace = console, js_name = log)]
    pub fn consoleLog(s: &str);
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub enum LocationKind {
    City,
    Admin,
    Country,
    Timezone,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Location {
    name: String,
    kind: LocationKind,
    countryCode: String,
    timezone: String,
    latitude: f32,
    longitude: f32,
}

#[wasm_bindgen]
pub async fn get_all_locations(url: String) -> Result<JsValue, JsValue> {
    let list = get_locations(&url).await.unwrap();

    Ok(JsValue::from_serde(&list).unwrap())
}

async fn get_locations(url: &str) -> Result<Vec<Location>, anyhow::Error> {
    let res = reqwest::get(url).await?;
    let body = res.text().await?;

    let mut rdr = csv::ReaderBuilder::new()
        .has_headers(false)
        .from_reader(body.as_bytes());

    fn parse_record(r: csv::StringRecord) -> Result<Location, anyhow::Error> {
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
pub struct Searcher {
    locations: Vec<Location>,
    search_engine: SearchEngine,
}

#[wasm_bindgen]
impl Searcher {
    pub async fn create(url: String) -> Searcher {
        let locations = get_locations(&url).await.unwrap();
        let word_list: Vec<_> = locations
            .iter()
            .map(|w| w.name.to_string())
            // .take(1478)
            .collect();

        consoleLog(&format!("{:#?}", &word_list.last()));

        let search_engine = SearchEngine::create(word_list);

        Searcher {
            locations,
            search_engine,
        }
    }

    pub async fn create_test() -> Searcher {
        let locations: Vec<_> = vec![
            "orange",
            "yellow",
            "purple",
            "redish",
            "red",
            "paris",
            "parisson",
            "qualisson",
            "poris",
            "peauris",
        ]
        .iter()
        .map(|name| Location {
            latitude: 0.0,
            longitude: 0.0,
            name: name.to_string(),
            timezone: "tz".to_string(),
            countryCode: "fr".to_string(),
            kind: LocationKind::Admin,
        })
        .collect();

        let word_list: Vec<_> = locations.iter().map(|w| w.name.to_string()).collect();

        let search_engine = SearchEngine::create(word_list);

        Searcher {
            locations,
            search_engine,
        }
    }

    pub fn search(&self, pattern: String, limit: usize) -> JsValue {
        let results = &(self.locations)[0..limit];
        let results: Vec<_> = self
            .search_engine
            .search(&pattern, limit)
            .iter()
            .map(|i| self.locations[*i].clone())
            .collect();
        JsValue::from_serde(&results).unwrap()
    }

    pub fn get_all_locations(&self) -> JsValue {
        JsValue::from_serde(&self.locations).unwrap()
    }
}
