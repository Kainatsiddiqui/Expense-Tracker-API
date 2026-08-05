import {
ArrowUpRight,
ArrowDownRight,
} from "lucide-react";
import { formatCurrency } from "../utils/formatCurrency";
import type { MonthComparisonResponse } from "../types/report";

type MonthComparisonCardProps = {
data: MonthComparisonResponse;
};

function MonthComparisonCard({
data,
}: MonthComparisonCardProps) {
const spendingIncreased =
data.percentage_change > 0;

return ( 
<div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"> 
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6"> 
    <div> 
      <h3 className="text-lg font-semibold text-gray-900 text-left">
        Month Comparison 
      </h3>

      <p className="text-sm text-gray-500 mt-1 text-left">
        Compared with the previous month
      </p>
    </div>

    <div
      className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
        spendingIncreased
          ? "bg-red-100 text-red-700"
          : "bg-green-100 text-green-700"
      }`}
    >
      {spendingIncreased ? (
        <ArrowUpRight size={16} />
      ) : (
        <ArrowDownRight size={16} />
      )}

      {Math.abs(
        data.percentage_change
      ).toFixed(1)}
      %
    </div>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
    <div>
      <p className="text-sm text-gray-500 mb-2">
        Current month
      </p>

      <p className="text-3xl font-bold text-gray-900">
        {formatCurrency(
          data.current_month
        )}
      </p>
    </div>

    <div>
      <p className="text-sm text-gray-500 mb-2">
        Previous month
      </p>

      <p className="text-2xl font-semibold text-gray-700">
        {formatCurrency(
          data.previous_month
        )}
      </p>
    </div>
  </div>

  <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
    <div>
      <p className="text-sm text-gray-500">
        Difference
      </p>

      <p
        className={`text-lg font-semibold ${
          spendingIncreased
            ? "text-red-600"
            : "text-green-600"
        }`}
      >
        {spendingIncreased
          ? "+"
          : "-"}
        {formatCurrency(
          Math.abs(data.difference)
        )}
      </p>
    </div>

    <p className="text-sm text-gray-500 text-right max-w-[300px]">
      {spendingIncreased
        ? "You spent more than last month"
        : "You spent less than last month"}
    </p>
  </div>
</div>

);
}

export default MonthComparisonCard;
