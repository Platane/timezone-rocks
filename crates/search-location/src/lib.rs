use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};



#[wasm_bindgen]
extern {
    pub fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}



#[derive(Serialize, Deserialize)]
pub enum LocationType {
    City,
    Admin,
    Country,
    Timezone,
}

#[derive(Serialize, Deserialize)]
#[wasm_bindgen]
pub struct Location {
    pub latitude: u32,
    pub longitude: u32,
    name: String,
    typ: LocationType,
    countryCode: String,
    timezone: String,
}




#[wasm_bindgen]
pub fn get_location() -> JsValue {
    let l = Location {
        latitude: 12,
        longitude: 56,
        name: String::from("Hello, world"),
        countryCode: String::from("LU"),
        timezone: String::from("xr"),
        typ: LocationType::City,
    };

    JsValue::from_serde(&l).unwrap()
}



#[wasm_bindgen]
pub fn init_locations(_url: &str) {


}
