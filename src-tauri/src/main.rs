// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod cpu;
mod ram;
mod disk;
mod ws_handler;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, ws_handler::start_websocket_server])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
