use serde_json::json;
use tokio::net::TcpListener;
use tokio_tungstenite::accept_async;
use tokio_tungstenite::tungstenite::protocol::Message;
use futures_util::{stream::StreamExt, SinkExt};
use std::time::Duration;
use tokio::time::interval;

use crate::cpu::fetch_cpu_usage;
use crate::ram::fetch_ram_usage;
use crate::disk::fetch_disk_usage;

#[tauri::command] 
pub async fn start_websocket_server() -> Result<(), String> {
    let addr = "127.0.0.1:9001";
    let listener = TcpListener::bind(&addr).await.map_err(|e| e.to_string())?;

    println!("WebSocket server started on ws://{}", addr);

    loop {
        let (stream, _) = listener.accept().await.map_err(|e| e.to_string())?;
        tokio::spawn(handle_connection(stream));
    }
}

async fn handle_connection(stream: tokio::net::TcpStream) {
    let ws_stream = accept_async(stream).await.expect("Error during WebSocket handshake");
    let (mut write, _) = ws_stream.split();

    let mut interval = interval(Duration::from_millis(500)); 

    tokio::spawn(async move {
        loop {
            interval.tick().await;

            let (overall_cpu_usage, cpu_data) = fetch_cpu_usage(&mut interval).await;
            let ram_data = fetch_ram_usage();
            let disk_data = fetch_disk_usage();

            let usage_data = json!({
                "cpu": cpu_data,
                "overall_cpu": overall_cpu_usage,  
                "ram": [ram_data.0, ram_data.1],
                "disk": disk_data
            });

            // Send the data to the WebSocket client
            if let Err(e) = write.send(Message::Text(usage_data.to_string())).await {
                eprintln!("Error sending data: {:?}", e);
                break;
            }
        }
    });
}
