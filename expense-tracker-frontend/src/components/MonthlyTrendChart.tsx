import {
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
CartesianGrid,
Area,
ComposedChart,
} from "recharts";
import { formatCurrency } from "../utils/formatCurrency";

type TrendData = {
month: string;
total_spent: number;
};

type MonthlyTrendChartProps = {
data: TrendData[];
};

function MonthlyTrendChart({
data,
}: MonthlyTrendChartProps) {
const totalSpent = data.reduce(
(sum, item) =>
sum + item.total_spent,
0
);

const averageSpent =
data.length > 0
? totalSpent / data.length
: 0;

return ( 
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
    {/* Header */} 
        <div className="flex items-center justify-between mb-6">
            <div> 
                <h3 className="text-lg font-semibold text-gray-900 text-left">
                    Monthly spending trend 
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                    Your spending across the last {data.length} months
                </p>
            </div>

            <div className="text-right">
                <p className="text-sm text-gray-500">
                    Average
                </p>

                <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(
                    averageSpent
                    )}
                </p>
            </div>
        </div>

            {/* Chart */}
        <div className="h-64 sm:h-72 lg:h-80">
            <ResponsiveContainer
                width="100%"
                height="100%"
            >
            <ComposedChart data={data}>
                <defs>
                    <linearGradient
                        id="trendGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                    <stop
                        offset="5%"
                        stopColor="#2563EB"
                        stopOpacity={0.18}
                    />
                    <stop
                        offset="95%"
                        stopColor="#2563EB"
                        stopOpacity={0}
                    />
                    </linearGradient>
                </defs>

                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E5E7EB"
                />

                <XAxis
                    dataKey="month"
                    tickFormatter={(
                        value
                    ) =>
                        new Date(
                        `${value}-01`
                        ).toLocaleString(
                        "en-IN",
                        {
                            month: "short",
                        }
                        )
                    }
                    tick={{
                        fontSize: 12,
                        fill: "#6B7280",
                    }}
                    axisLine={false}
                    tickLine={false}
                />

                <YAxis
                    tickFormatter={(
                        value
                    ) =>
                        `₹${Math.round(
                        value / 1000
                        )}k`
                    }width={50}
                    tick={{
                        fontSize: 12,
                        fill: "#6B7280",
                    }}
                    axisLine={false}
                    tickLine={false}
                />

                <Tooltip
                    contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #E5E7EB",
                    }}
                    content={({ active, payload, label }) => {
                        if (
                            active &&
                            payload &&
                            payload.length
                        ) {
                            const amount = Number(
                                payload[0].value ?? 0
                            );
                            return (
                                <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3">
                                <p className="text-sm font-medium text-gray-900 mb-1">
                                    {new Date(
                                    `${label}-01`
                                    ).toLocaleString(
                                    "en-IN",
                                    {
                                        month: "long",
                                        year: "numeric",
                                    }
                                    )}
                                </p>

                                <p className="text-sm text-gray-600">
                                    Total spent
                                </p>

                                <p className="text-1sm font-semibold text-gray-900">
                                    {formatCurrency(amount)}
                                </p>
                                </div>
                            );
                            }

                            return null;
                        }}
                        />

                <Area
                    type="monotone"
                    dataKey="total_spent"
                    fill="url(#trendGradient)"
                    stroke="none"
                />

                <Line
                    type="monotone"
                    dataKey="total_spent"
                    stroke="#2563EB"
                    strokeWidth={3}
                    dot={{
                        r: 4,
                        fill: "#2563EB",
                        stroke: "#fff",
                        strokeWidth: 2,
                    }}
                    activeDot={{
                        r: 6,
                        fill: "#2563EB",
                    }}
                />
            </ComposedChart>
            </ResponsiveContainer>
        </div>
    </div>
);
}

export default MonthlyTrendChart;
