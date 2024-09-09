use sysinfo::System;

pub fn fetch_ram_usage(sys: &mut System) -> (u64, u64) {
    sys.refresh_memory();

    let total_memory = sys.total_memory();
    let used_memory = sys.used_memory();

    (used_memory, total_memory)
}
