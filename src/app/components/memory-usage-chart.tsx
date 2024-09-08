"use client"

import { TrendingUp } from "lucide-react"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/app/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/app/components/ui/chart"



const chartConfig = {
    usedRam: {
        label: "RAM",
        color: "hsl(var(--chart-1))",
    },
    availableRam: {
        label: "Available",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export function MemoryUsageChart({ usedRam, totalRam }: { usedRam: number, totalRam: number }) {
    const usedRamInGB = (usedRam / 1024 / 1024 / 1024).toFixed(2)
    const availableRamInGB = ((totalRam - usedRam) / 1024 / 1024 / 1024).toFixed(2)

    const chartData = [
        { usedRam: usedRamInGB, availableRam: availableRamInGB }
    ]

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>RAM Usage</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 items-center pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[250px]"
                >
                    <RadialBarChart
                        data={chartData}
                        endAngle={180}
                        innerRadius={80}
                        outerRadius={130}
                    >
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) - 16}
                                                    className="fill-foreground text-2xl font-bold"
                                                >
                                                    {usedRamInGB.toLocaleString() + " GB"}
                                                </tspan>

                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>

                        <RadialBar
                            dataKey="availableRam"
                            fill="var(--color-availableRam)"
                            stackId="a"
                            cornerRadius={5}
                            className="stroke-transparent stroke-2"
                        />
                        <RadialBar
                            dataKey="usedRam"
                            stackId="a"
                            cornerRadius={5}
                            fill="var(--color-usedRam)"
                            className="stroke-transparent stroke-2"
                        />
                    </RadialBarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
