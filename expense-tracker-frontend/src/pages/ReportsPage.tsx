import { useEffect, useState } from "react";
import MonthComparisonCard from "../components/MonthComparisonCard";
import { exportReportCsv, getMonthComparison, getMonthlyTrend, getCategoryPercentage, getCategoryTrends } from "../services/reportService";
import MonthlyTrendChart from "../components/MonthlyTrendChart";
import CategoryBreakdownChart from "../components/CategoryBreakdown";
import type { MonthComparisonResponse,CategoryTrend } from "../types/report";
import type { MonthlyTrend, CategoryBreakdownItem } from "../types/dashboard";
import CategoryTrendChart from "../components/CategoryTrendChart";
import { Download } from "lucide-react";

function ReportsPage() {

  const [monthlyTrend, setMonthlyTrend] =
    useState<MonthlyTrend[]>([]);

  const [monthComparison, setMonthComparison] =
    useState<MonthComparisonResponse | null>(null);

  const [categoryPercentage, setCategoryPercentage] =
  useState<CategoryBreakdownItem[]>([]);
  
  const [categoryTrends, setCategoryTrends] =
  useState<CategoryTrend[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [startDate, setStartDate] =
  useState("");

  const [endDate, setEndDate] =
    useState("");
    
  async function loadReports(
    start?: string,
    end?: string
  )  {
    
    try {
    setLoading(true);

      const [
        comparisonData,
        trendData,
        categoryData,
        categoryTrendData,
      ] = await Promise.all([
        getMonthComparison(),
      getMonthlyTrend(start, end),
      getCategoryPercentage(
        start,
        end
      ),
      getCategoryTrends(
        start,
        end
      ),
    ]);
      setMonthComparison(comparisonData);
      setMonthlyTrend(trendData);
      setCategoryPercentage(categoryData);
      setCategoryTrends(categoryTrendData);
    } catch (error) {
      console.error(
        "Failed to load reports",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  loadReports();
  }, []);

  function handleApplyFilter() {
    loadReports(startDate, endDate);
  }

  async function handleExport() {
    try{
    const blob =
      await exportReportCsv(
        startDate || undefined,
        endDate || undefined
      );

    const url =
      window.URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    const filename = startDate && endDate 
      ? `expense_report_${startDate}_to_${endDate}.csv` 
      : "expense_report.csv";
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(
      url
    );
  } catch (error) {
  console.error(
  "Failed to export report",
  error
  );
  }
  }

  
  return ( 
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-6">
      <div className="space-y-6"> 
      {/* Reports header */} 
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-5 gap-4">
          <div className="text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Spending analytics 
            </h2>
            <p className="text-gray-500 mt-1"> 
              Insights into your monthly spending patterns and category trends 
            </p> 
          </div>
          <button
            onClick={handleExport}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
              Export CSV
          </button>
        </div> 
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 text-left">
                Start date
              </p>
              <input
                type="date"
                value={startDate}
                onChange={(e) =>
                  setStartDate(e.target.value)
                }
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-2 text-left">
                End date
              </p>
              <input
                type="date"
                value={endDate}
                onChange={(e) =>
                  setEndDate(e.target.value)
                }
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

            <button
              onClick={handleApplyFilter}
              className="w-full lg:w-auto bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Apply filter
            </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-64 flex items-center justify-center">
          <p className="text-gray-500">
            Loading reports...
          </p>
        </div>
      ) : monthComparison ? (
        <MonthComparisonCard
          data={monthComparison}
        />
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-64 flex items-center justify-center">
          <p className="text-gray-500">
            No report data available.
          </p>
        </div>
      )}
      <div className="space-y-6">
        <MonthlyTrendChart
            data={monthlyTrend}
        />
        <CategoryBreakdownChart
          data={categoryPercentage}
        />
        <CategoryTrendChart
          data={categoryTrends}
        />
      </div>
    </div>
    </div>
  );
}

export default ReportsPage;
