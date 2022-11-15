use anyhow::{anyhow, Result};
use spin_sdk::{
    http::{Request, Response},
    http_component,
};
use std::collections::HashMap;

const REDIS_ADDRESS_ENV: &str = "REDIS_ADDRESS";

/// A simple Spin HTTP component.
#[http_component]
fn poll(req: Request) -> Result<Response> {
    let address = std::env::var(REDIS_ADDRESS_ENV)?;
    let queries_str = req.uri().query().ok_or_else(|| anyhow!("expected at least one query with request"))?;
    let queries = simple_query_parser(queries_str);
    let option = queries.get("option").unwrap();
    if let &http::Method::POST = req.method() {
        spin_sdk::redis::incr(&address, &option).map_err(|_| anyhow!("Error querying Redis"))?;
    }

    let cnt = spin_sdk::redis::get(&address, &option).map_err(|_| anyhow!("Error querying Redis"))?;

    println!("{:?}", req.headers());
    Ok(http::Response::builder()
        .status(200)
        .body(Some(cnt.into()))?)
}

fn simple_query_parser(q: &str) -> HashMap<String, String> {
    let mut dict = HashMap::new();
    q.split('&').for_each(|s| {
        if let Some((k, v)) = s.split_once('=') {
            dict.insert(k.to_string(), v.to_string());
        }
    });
    dict
}