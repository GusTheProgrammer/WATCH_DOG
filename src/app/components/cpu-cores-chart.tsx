"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/app/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/app/components/ui/chart";

const chartConfig = {
  cpu: {
    label: "CPU Cores",
    color: "hsl(var(--chart-1))",
  },
};

export function CpuCoresChart({ cpuCoresUsage }: { cpuCoresUsage: number[] }) {
  const chartData = cpuCoresUsage.map((usage, index) => ({
    core: `CPU ${index + 1}`, 
    usage: usage.toFixed(2),
  }));

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>CPU Usage per Core</CardTitle>
        <CardDescription>Real-time CPU utilization for each core</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="core"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="usage" fill="var(--color-cpu)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
