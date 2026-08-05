import api from "../api/client";
import type { MonthComparisonResponse, MonthlyTrendResponse, CategoryPercentageResponse } from "../types/report";
import type { CategoryTrendResponse } from "../types/report";

export async function getMonthComparison(): Promise<MonthComparisonResponse> {
const response = await api.get(
"/reports/month-comparison"
);

return response.data;
}

export async function getMonthlyTrend(
  start?: string,
  end?: string
): Promise<MonthlyTrendResponse> {
  const response = await api.get(
    "/reports/monthly-trend",
    {
      params: {
        start,
        end,
      },
    }
  );

  return response.data;
}

export async function getCategoryPercentage(
  start?: string,
  end?: string
): Promise<CategoryPercentageResponse> {
  const response = await api.get(
    "/reports/category-percentage",
    {
      params: {
        start,
        end,
      },
    }
  );

  return response.data;
}

export async function getCategoryTrends(
  start?: string,
  end?: string
): Promise<CategoryTrendResponse> {
  const response = await api.get(
    "/reports/category-trends",
    {
      params: {
        start,
        end,
      },
    }
  );

  return response.data;
}

export async function exportReportCsv(
    start?: string,
    end?: string
    ) {
    const response = await api.get(
    "/reports/export",
    {
    responseType: "blob",
    params: {
    start,
    end,
    },
    }
    );

    return response.data;
    }
