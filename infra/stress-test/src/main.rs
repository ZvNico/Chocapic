use std::collections::HashMap;

use anyhow::{bail, Context, Result};
use futures::StreamExt;
use reqwest::header::{HeaderMap, CONTENT_TYPE};
use reqwest::Client;

fn main() -> Result<()> {
    let rt = tokio::runtime::Builder::new_multi_thread()
        .worker_threads(4)
        .enable_all()
        .build()
        .unwrap();

    let args: Vec<_> = std::env::args().collect();
    let num_employees: usize = args[1].parse().unwrap();

    rt.block_on(perf_test(num_employees))
}

async fn perf_test(num_employees: usize) -> Result<()> {
    let mut default_headers = HeaderMap::new();
    default_headers.insert(CONTENT_TYPE, "application/json".parse().unwrap());
    let client = Client::builder()
        .connection_verbose(true)
        .default_headers(default_headers)
        .build()?;

    let instances = 'a'..='z';
    let mut errors = 0;
    let stream = futures::stream::iter(instances.map(|c| {
        let client = client.clone();
        tokio::spawn(async move { stress_instance(&client, c, num_employees).await })
    }))
    .buffer_unordered(3)
    .map(|r| {
        let res = r.unwrap(); // unwrap JoinError
        if let Err(err) = res {
            eprintln!("{:?}", err);
            errors += 1;
        }
    })
    .collect::<Vec<_>>();

    stream.await;

    if errors > 0 {
        bail!("Perf test failed with {} errors", errors);
    }

    Ok(())
}

async fn stress_instance(client: &Client, instance: char, num_employees: usize) -> Result<()> {
    put_employees(client, instance, num_employees).await
}

async fn put_employees(client: &Client, instance: char, num_employees: usize) -> Result<()> {
    for index in 1..=num_employees {
        put_employee(client, instance, index).await?;
    }
    Ok(())
}

async fn put_employee(client: &Client, instance: char, index: usize) -> Result<()> {
    let body = HashMap::from([
        ("name", format!("name-{}", index)),
        ("email", format!("email-{}@domain.tld", index)),
        ("address_line1", format!("line 1 -{}", index)),
        ("address_line2", format!("line 2 -{}", index)),
        ("city", "Paris".to_string()),
        ("zip_code", format!("75-{}", index)),
    ]);
    if index % 10 == 0 {
        println!("instance {} employee {}", instance, index);
    }
    let url = format!("https://{}.hr.dmerej.info/add_employee", instance);
    let response = client
        .put(url)
        .form(&body)
        .send()
        .await
        .with_context(|| format!("instance : {} could not put employee {}", instance, index))?;

    response
        .error_for_status()
        .with_context(|| format!("instance : {} could not put employee {}", instance, index))?;

    Ok(())
}
