extern crate serde;
use serde::{ Serialize };
use std::collections::HashMap;

#[derive(Serialize, Debug)]
struct Message {
  message: String,
}

#[derive(Serialize, Debug)]
struct Response {
  statusCode: i32,
  headers: HashMap<String, String>,
  body: String,
}

fn main() {
  let message = Message {
    message: "Hello world from Rust application!".to_string(),
  };

  let response = Response {
    statusCode: 200,
    headers: HashMap::from([
      ("Content-Type".to_string(), "application/json".to_string()),
    ]),
    body: serde_json::to_string(&message).unwrap(),
  };

  let output = serde_json::to_string(&response).unwrap();
  println!("{}", output);
}
