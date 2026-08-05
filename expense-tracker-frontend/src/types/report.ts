import type { MonthlyTrend, CategoryBreakdownItem } from "./dashboard";

export type MonthlyTrendResponse = MonthlyTrend[];

export type MonthComparisonResponse = {
current_month: number;
previous_month: number;
difference: number;
percentage_change: number;
};

export type CategoryPercentageResponse =   CategoryBreakdownItem[];

export type MonthlyCategoryAmount = {
  month: string;
  amount: number;
};

export type CategoryTrend = {
  category: string;
  trend: MonthlyCategoryAmount[];
};

export type CategoryTrendResponse =
  CategoryTrend[];