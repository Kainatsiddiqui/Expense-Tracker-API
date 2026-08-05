import api from "../api/client";
import type {
BudgetResponse,
BudgetUpdate,
} from "../types/budget";

export async function getBudget(): Promise<BudgetResponse> {
const response = await api.get(
"/budget"
);

return response.data;
}

export async function updateBudget(
budget: number
): Promise<BudgetResponse> {
const response = await api.put(
"/budget",
{
monthly_budget: budget,
} satisfies BudgetUpdate
);

return response.data;
}
