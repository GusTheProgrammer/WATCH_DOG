'use client';

import { CpuUsageChart } from "./cpu-usage-chart";
import { CpuCoresChart } from "./cpu-cores-chart";
import { MemoryUsageChart } from "./memory-usage-chart";
import { DiskUsageCard } from "./disk-usage-chart";
import NetworkDataTable from "./network-data-table";
import ProcessTable from "./process-data-table";

export default function SystemInfoComponent({ data }) {
  return (
    <div className="p-4 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">System Usage</h1>
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[300px]">
          <CpuUsageChart overallCpuUsage={data.overall_cpu} />
        </div>

        <div className="flex-1 min-w-[300px]">
          <MemoryUsageChart usedRam={data.ram[0]} totalRam={data.ram[1]} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex-1 min-w-[300px]">
          <DiskUsageCard disks={data.disk} />
        </div>
        <div className="flex-1 min-w-[300px]">
          <CpuCoresChart cpuCoresUsage={data.cpu} />
        </div>
      </div>
{/* 
      <NetworkDataTable networkData={data.network} />

      <ProcessTable processes={data.processes} /> */}
    </div>
  );
}
