import {
LineChart,
Line,
XAxis,
YAxis,
CartesianGrid,
Tooltip,
Legend,
ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "../utils/formatCurrency";
import type { CategoryTrend } from "../types/report";

type CategoryTrendChartProps = {
data: CategoryTrend[];
};

function CategoryTrendChart({
data,
}: CategoryTrendChartProps) {
    console.log(data);
    const topCategories = getTopCategories(data);

    const chartData =
    transformData(topCategories);

    const colors = [
    "#2563EB",
    "#16A34A",
    "#EA580C",
    "#9333EA",
    "#DC2626",
    "#0891B2",
    "#CA8A04",
    "#4F46E5",
    ];

    const topCategory =
      topCategories[0];

    return ( 
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
       <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 text-left">
              Category Trends
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Monthly spending trends across your top 5 categories
            </p>
          </div>

          {topCategory && (
            <div className="text-right">
              <p className="text-xs text-gray-500">
                Highest Spending
              </p>

              <p className="text-sm font-semibold text-gray-900">
                {topCategory.category}
              </p>
            </div>
          )}
        </div>

        <div className="h-72 sm:h-80 lg:h-96">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "#6B7280",
                }}
              />

              <YAxis
                tickFormatter={(
                  value
                ) =>
                  `₹${Math.round(
                    value / 1000
                  )}k`
                }
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 12,
                  fill: "#6B7280",
                }}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (
                    active &&
                    payload &&
                    payload.length
                  ) {
                    return (
                      <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-3">
                        <p className="font-medium text-gray-900 mb-2">
                          {label}
                        </p>

                        <div className="space-y-1">
                          {payload.map(
                            (entry, index) => (
                              <div
                                key={index}
                                className="flex justify-between gap-4 text-sm"
                              >
                                <span
                                  style={{
                                    color:
                                      entry.color,
                                  }}
                                >
                                  {entry.name}
                                </span>

                                <span className="font-medium text-gray-900">
                                  {formatCurrency(
                                    Number(
                                      entry.value ??
                                        0
                                    )
                                  )}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    );
                  }

                  return null;
                }}
              />
              
              <Legend
                wrapperStyle={{
                  paddingTop: 12,
                  paddingBottom: 12,
                  fontSize: "13px",
                }}
              />

              {topCategories.map(
                (category, index) => (
                  <Line
                    key={category.category}
                    type="monotone"
                    dataKey={category.category}
                    stroke={
                      colors[
                        index %
                          colors.length
                      ]
                    }
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      stroke: "#847474",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                    connectNulls={false}
                  />
                )
              )}
            </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
    );
}

function transformData(
  data: CategoryTrend[]
) {
  const monthFormatter =
    new Intl.DateTimeFormat("en-US", {
      month: "short",
    });

  const monthSet = new Set<string>();

  data.forEach((category) => {
    category.trend.forEach((item) => {
      monthSet.add(item.month);
    });
  });

  const sortedMonths = Array.from(monthSet).sort();

  const chartData = sortedMonths.map(
    (monthKey) => {
      const date = new Date(
        `${monthKey}-01`
      );

      const row: Record<
        string,
        string | number
      > = {
        month:
          monthFormatter.format(date),
      };

      data.forEach((category) => {
        const monthData =
          category.trend.find(
            (item) =>
              item.month === monthKey
          );

        row[category.category] =
          monthData?.amount ?? 0;
      });

      return row;
    }
  );

  return chartData;
}

function getTopCategories(
  data: CategoryTrend[]
): CategoryTrend[] {
  return [...data]
    .sort((a, b) => {
      const totalA = a.trend.reduce(
        (sum, item) =>
          sum + item.amount,
        0
      );

      const totalB = b.trend.reduce(
        (sum, item) =>
          sum + item.amount,
        0
      );

      return totalB - totalA;
    })
    .slice(0, 5);
}

export default CategoryTrendChart;
