import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Label,
} from "recharts";

type CategoryData = {
    category: string;
    amount: number;
    percentage: number;
};

type CategoryBreakdownProps = {
    data: CategoryData[];
};

const COLORS = [
    '#2563EB',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#06B6D4',
    '#84CC16',
];

function CategoryBreakdownChart({
    data,
}: CategoryBreakdownProps) {
    const total = data.reduce(
        (sum, item) => sum + item.amount,
        0
    );

    const sortedData = [...data].sort(
    (a, b) =>
        b.amount - a.amount
    );

    const topCategory = sortedData[0];

    return ( 
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"> 
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 text-left">
                    Category Breakdown
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                    Distribution of spending across categories
                    </p>
                </div>

                {topCategory && (
                <div className="text-right">
                    <p className="text-xs text-gray-500">
                        Top Category
                    </p>

                    <p className="text-sm font-semibold text-gray-900">
                        {topCategory.category}
                    </p>
                </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="h-64 sm:h-72">
                    <ResponsiveContainer
                        width="100%"
                        height="100%"
                    >
                        <PieChart>
                            <Pie
                                data={data}
                                dataKey="amount"
                                nameKey="category"
                                innerRadius={75}
                                outerRadius={110}
                                paddingAngle={2}
                            >
                            {data.map((_, index) => (
                            <Cell
                                key={index}
                                fill={
                                COLORS[
                                    index % COLORS.length
                                ]
                                }
                            />
                            ))}
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        "cx" in viewBox &&
                                        "cy" in viewBox
                                    ) {
                                    return (
                                        <text
                                            x={viewBox.cx}
                                            y={viewBox.cy}
                                            textAnchor="middle"
                                            dominantBaseline="middle"
                                        >
                                        <tspan
                                            x={viewBox.cx}
                                            dy="-10"
                                            fill="#6B7280"
                                            fontSize="13"
                                        >
                                            Total spent
                                        </tspan>

                                        <tspan
                                            x={viewBox.cx}
                                            dy="26"
                                            fill="#111827"
                                            fontSize="22"
                                            fontWeight="700"
                                        >
                                            ₹
                                            {Math.round(
                                            total
                                            ).toLocaleString(
                                            "en-IN"
                                            )}
                                        </tspan>
                                        </text>
                                    );
                                    }
                                    return null;
                                }}
                                />
                            </Pie>

                            <Tooltip
                                content={({ active, payload }) => {
                                    if (
                                        active &&
                                        payload &&
                                        payload.length
                                    ) {
                                    const item =
                                        payload[0]
                                        .payload as CategoryData;

                                    return (
                                        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3">
                                            <p className="font-medium text-gray-900">
                                                {item.category}
                                            </p>

                                            <p className="text-sm text-gray-500 mt-1">
                                                Total spent
                                            </p>

                                            <p className="text-lg font-semibold text-gray-900">
                                                ₹
                                                {item.amount.toLocaleString(
                                                "en-IN"
                                                )}
                                            </p>

                                            <p className="text-sm text-blue-600 mt-1">
                                                {item.percentage.toFixed(
                                                1
                                                )}
                                                % of total
                                            </p>
                                        </div>
                                    );
                                    }

                                return null;
                                }}
                                />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-4">
                    {sortedData
                        .slice(0, 5)
                        .map((item, index) => ( (
                        <div
                            key={item.category}
                            className="flex items-start gap-3 py-2"
                        >
                            <div
                                className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                                style={{
                                backgroundColor:
                                    COLORS[
                                    index %
                                        COLORS.length
                                    ],
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-4">
                                    <p className="font-medium text-gray-900 truncate">
                                            {item.category}
                                    </p>
    
                                    <span className="font-semibold text-gray-700 flex-shrink-0">
                                        {item.percentage.toFixed(
                                            1
                                        )}
                                        %
                                    </span>
                                </div>

                                <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                                    <div
                                        className="h-2 rounded-full"
                                        style={{
                                            width: `${item.percentage}%`,
                                            backgroundColor:
                                            COLORS[
                                                index %
                                                COLORS.length
                                            ],
                                        }}
                                    />
                                </div>

                                <p className="text-sm text-gray-500 mt-1 text-left">
                                    ₹
                                    {item.amount.toLocaleString(
                                    "en-IN"
                                    )}
                                </p>
                            </div>
                        </div>
                        )))
                    }
                </div>
            </div>
        </div>
    );
}

export default CategoryBreakdownChart;
