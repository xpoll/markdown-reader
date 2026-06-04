#[tauri::command]
fn launch_document_paths() -> Vec<String> {
    std::env::args()
        .skip(1)
        .filter(|arg| {
            let lower = arg.to_lowercase();
            lower.ends_with(".md") || lower.ends_with(".markdown")
        })
        .map(|arg| arg.to_string())
        .collect()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![launch_document_paths])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
