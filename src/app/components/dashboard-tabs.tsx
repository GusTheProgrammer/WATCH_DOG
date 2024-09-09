'use client';

import { Tabs } from "@/app/components/ui/tabs";
import SystemInfoComponent from "@/app/components/system-info-component";
import NetworkDataTable from "@/app/components/network-data-table";
import ProcessTable from "@/app/components/process-data-table";

export default function DashboardTabs({ data }) {
    const tabs = [
        {
          title: "System Info",
          value: "system-info",
          content: (
            <div className="w-full overflow-hidden relative h-dvh rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-[#222222]">
              <SystemInfoComponent data={data} />
            </div>
          ),
        },
        {
          title: "Network",
          value: "network",
          content: (
            <div className="w-full overflow-hidden relative h-dvh rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-[#222222]">
              <NetworkDataTable networkData={data.network} />
            </div>
          ),
        },
        {
          title: "Playground",
          value: "playground",
          content: (
            <div className="w-full overflow-hidden relative h-dvh rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-[#222222]">
              <p>Playground tab</p>
              <ProcessTable processes={data.processes} />
            </div>
          ),
        },
      ];

      return (
        <div className="[perspective:1000px] relative b flex flex-col max-w-6xl mx-auto w-full items-start justify-start my-40">
          <Tabs tabs={tabs} />
        </div>
      );
    }
