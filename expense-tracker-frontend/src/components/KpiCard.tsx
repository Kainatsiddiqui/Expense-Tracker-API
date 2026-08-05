import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";


type KpiCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: string;
  trendType?: "up" | "down" | "neutral";
  invertTrendColors?: boolean;
  sparklineData?: number[];
};

function KpiCard({
title,
value,
icon,
iconBg,
trend,
trendType = "neutral",
invertTrendColors,
sparklineData,
}: KpiCardProps) {
    
  const TrendIcon =
    trendType === "up"
    ? TrendingUp
    : trendType === "down"
    ? TrendingDown
    : Minus;

  const trendColor =
  trendType === "up"
    ? invertTrendColors
      ? "text-red-600"
      : "text-green-600"
    : trendType === "down"
    ? invertTrendColors
      ? "text-green-600"
      : "text-red-600"
    : "text-gray-500";

    
return ( 
  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-6 h-full hover:shadow-lg transition-all duration-200"> 
    <div className="flex items-start justify-between mb-6"> 
      <p className="text-sm font-medium text-gray-500">
        {title} 
      </p>

      <div
        className={`w-11 h-11 rounded-2xl flex items-center justify-center ${iconBg}`}
      >
        {icon}
      </div>
    </div>

    <div className="mb-6">
      <h3
        className={
          value.length > 18
            ? "text-2xl font-bold text-gray-900 leading-tight break-words"
            : "text-4xl font-bold text-gray-900 leading-none break-words"
        }
      >
        {value}
      </h3>
    </div>
    
    {sparklineData &&
      sparklineData.length > 1 && (
        <div className="h-10 mb-4">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <LineChart
              data={sparklineData.map(
                (value, index) => ({
                  index,
                  value,
                })
              )}
            >
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563EB"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      
    <div className="flex items-center justify-between">
      {trend ? (
        <div className={`flex items-center gap-1 text-sm ${trendColor}`}>
          <TrendIcon size={16} />
          <span className="font-medium">
            {trend}
          </span>
        </div>
      ) : (
        <div />
      )}
    </div>
  </div>
);
}

export default KpiCard;
