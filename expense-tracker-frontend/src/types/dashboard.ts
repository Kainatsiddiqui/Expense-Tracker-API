export type FilterOption =
  | "2025"
  | "2026"
  | "custom";
  
export type DashboardSummary = {
  selected_period_spent: number;
  selected_month_spent: number;
  average_monthly_spend: number;
  top_category: string | null;
};

export type BudgetSummary = {
  monthly_budget: number;
  spent: number;
  remaining: number;
  percentage_used: number;
};

export type MonthlyTrend = {
  month: string;
  total_spent: number;
};

export type CategoryBreakdownItem = {
  category: string;
  amount: number;
  percentage: number;
};

export type HighestSpendingMonth = {
  month: string;
  total_spent: number;
};

export type DashboardResponse = {
  summary: DashboardSummary;
  budget: BudgetSummary;
  monthly_trend: MonthlyTrend[];
  category_breakdown: CategoryBreakdownItem[];
  highest_spending_month: HighestSpendingMonth | null;
};