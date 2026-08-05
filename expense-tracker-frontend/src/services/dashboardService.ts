import api from "../api/client";
import type {
  DashboardResponse,
  FilterOption,
} from "../types/dashboard";


export async function getDashboard(
  period: FilterOption,
  startDate?: string,
  endDate?: string
): Promise<DashboardResponse> 
{
  let url = "/reports/dashboard";

  if (period === "2025") {
    url +=
      "?start=2025-01-01&end=2025-12-31";
  }

  if (period === "2026") {
    url +=
      "?start=2026-01-01&end=2026-12-31";
  }

  if (
    period === "custom" &&
    startDate &&
    endDate
  ) {
    url += `?start=${startDate}&end=${endDate}`;
  }

  const token =
    localStorage.getItem("token");

  const response = await api.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}