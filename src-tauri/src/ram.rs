use sysinfo::System;

pub fn fetch_ram_usage() -> (u64, u64) {
    let mut sys = System::new();
    sys.refresh_memory();

    let total_memory = sys.total_memory();
    let used_memory: u64 = sys.used_memory();

    (used_memory, total_memory)
}
