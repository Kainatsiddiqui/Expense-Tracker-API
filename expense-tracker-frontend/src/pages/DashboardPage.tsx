import { useEffect, useState } from "react";
import { getDashboard } from "../services/dashboardService";
import KpiCard from "../components/KpiCard";
import { formatCurrency } from "../utils/formatCurrency";
import BudgetCard from "../components/BudgetCard";
import DateFilter from "../components/DateFilter";
import type {
  DashboardResponse,
  FilterOption,
} from "../types/dashboard";
import MonthlyTrendChart from "../components/MonthlyTrendChart";
import CategoryBreakdown from "../components/CategoryBreakdown";
import {
  Receipt,
  Calendar,
  TrendingUp,
  ChartPie,
  Wallet,
} from "lucide-react";
import { getMonthComparison } from "../services/reportService";
import type { MonthComparisonResponse } from "../types/report";

function DashboardPage() {
  const [dashboard, setDashboard] =
    useState<DashboardResponse | null>(null);

  const [selectedPeriod, setSelectedPeriod] =
    useState<FilterOption>("2026");

  const [startDate, setStartDate] =
    useState("2026-01-01");

  const [endDate, setEndDate] =
    useState("2026-12-31");

  const [loading, setLoading] =
    useState(false);

  const [monthComparison, setMonthComparison] =
    useState<MonthComparisonResponse | null>(null);

  async function loadDashboard() {
    try {
      setLoading(true);

      const [dashboardData, comparisonData] =
        await Promise.all([
          getDashboard(
            selectedPeriod,
            startDate,
            endDate
          ),
          getMonthComparison(),
      ]);

      setDashboard(dashboardData);
      setMonthComparison(comparisonData);
    } finally {
      setLoading(false);
    }
  }

  function handleApplyCustomRange() {
    if (!startDate || !endDate) {
      alert("Please select both dates");
      return;
    }

    if (startDate > endDate) {
      alert(
        "Start date cannot be after end date"
      );
      return;
    }

    loadDashboard();
  }
  function handlePeriodChange(
    period: FilterOption
  ) {
    setSelectedPeriod(period);

    if (period === "2025") {
      setStartDate("2025-01-01");
      setEndDate("2025-12-31");
    }

    if (period === "2026") {
      setStartDate("2026-01-01");
      setEndDate("2026-12-31");
    }
  }
  useEffect(() => {
    if (selectedPeriod !== "custom") {
      loadDashboard();
    }
  }, [
    selectedPeriod,
    startDate,
    endDate,
  ]);
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  const spendingTrend =
  monthComparison?.percentage_change ?? 0;

  const spendingTrendType =
    spendingTrend > 0
      ? "up"
      : spendingTrend < 0
      ? "down"
      : "neutral";

  const spendingTrendText =
    spendingTrend === 0
      ? "No change"
      : `${Math.abs(spendingTrend).toFixed(
          1
        )}% vs last month`;
        
    const averageSpend =
  dashboard?.summary.average_monthly_spend ?? 0;

const currentMonthSpend =
  dashboard?.summary.selected_month_spent ?? 0;

const averageDifference =
  currentMonthSpend - averageSpend;

const averageTrendPercentage =
  averageSpend === 0
    ? 0
    : (averageDifference /
        averageSpend) *
      100;

const averageTrendType =
  averageTrendPercentage > 0
    ? "up"
    : averageTrendPercentage < 0
    ? "down"
    : "neutral";

const averageTrendText =
  averageTrendPercentage === 0
    ? "At average"
    : `${Math.abs(
        averageTrendPercentage
      ).toFixed(1)}% ${
        averageTrendPercentage > 0
          ? "above average"
          : "below average"
      }`;

      const monthlyTrendValues =
  dashboard?.monthly_trend.map(
    (item) => item.total_spent
  ) ?? [];

  
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 space-y-6">
      <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm">
        <DateFilter
          selected={selectedPeriod}
          startDate={startDate}
          endDate={endDate}
          onPeriodChange={handlePeriodChange}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onApply={handleApplyCustomRange}
        />
        </div>
      {/* Budget card */} 
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6"> 
       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
            <Wallet
              size={24}
              className="text-blue-600"
            />
          </div>

          <div className="text-left">
            <h2 className="text-xl font-semibold text-gray-900">
              Monthly budget
            </h2>

            <p className="text-sm text-gray-500">
              Spending progress for this month
            </p>
          </div>
        </div>
        
        {/* Status badge */}
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            (dashboard?.budget.percentage_used ?? 0) >= 100
              ? "bg-red-100 text-red-700"
              : (dashboard?.budget.percentage_used ?? 0) >= 80
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {(dashboard?.budget.percentage_used ?? 0) >= 100
            ? "Over budget"
            : (dashboard?.budget.percentage_used ?? 0) >= 80
            ? "Approaching limit"
            : "On track"}
        </span>
      </div>
        <BudgetCard
            monthly_budget={
              dashboard?.budget.monthly_budget ?? 0
            }
            spent={dashboard?.budget.spent ?? 0}
            remaining={
              dashboard?.budget.remaining ?? 0
            }
            percentage_used={
              dashboard?.budget.percentage_used ?? 0
            }
        />
      </div>

      {/* KPI cards */} 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <KpiCard
          title="This month spent"
          value={formatCurrency(
            dashboard?.summary.selected_month_spent ?? 0
          )}
          trend={spendingTrendText}
          trendType={spendingTrendType}
          icon={
            <Receipt
              size={22}
              className="text-red-600"
            />
          }
          iconBg="bg-red-100"
        />

        <KpiCard
        title="Selected period"
        value={formatCurrency(
        dashboard?.summary.selected_period_spent ?? 0
        )}
        trend="Custom range"
        trendType="neutral"
        icon={ <Calendar
            size={22}
            className="text-blue-600"
          />
        }
        iconBg="bg-blue-100"
        />

        <KpiCard
          title="Average monthly spend"
          value={formatCurrency(
            averageSpend
          )}
          trend={averageTrendText}
          trendType={averageTrendType}
          invertTrendColors={true}
          sparklineData={monthlyTrendValues}
          icon={
            <TrendingUp
              size={22}
              className="text-green-600"
            />
          }
          iconBg="bg-green-100"
        />

        <KpiCard
        title="Top spending category"
        value={
        dashboard?.summary.top_category ??
        "No data"
        }
        trend="This month"
        trendType="neutral"
        icon={ <ChartPie
            size={22}
            className="text-amber-600"
          />
        }
        iconBg="bg-amber-100"
        />
      </div>

      {/* Charts */} 
      
      <MonthlyTrendChart 
        data={dashboard?.monthly_trend ?? []} 
      /> 
      <CategoryBreakdown 
        data={ dashboard?.category_breakdown ?? [] } 
      />
    </div>
    </div>
  );
}
export default DashboardPage;