import api from '../api/client';
import type { Expense, PaginatedExpensesResponse } from '../types/expense';

type GetExpensesParams = {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  sort?: string;
};

export async function getExpenses({
  page,
  limit,
  search,
  category,
  startDate,
  endDate,
  sort,
}: GetExpensesParams): Promise<PaginatedExpensesResponse> {
  const params: Record<string, string | number> = {
    page,
    limit,
  };
  if (search) params.search = search;
  if (category) params.category = category;
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;
  if (sort) params.sort = sort;

  const response = await api.get("/expenses", {
    params,
  });
  return response.data;
}

export type CreateExpenseRequest = {
  title: string;
  amount: number;
  category: string;
  date: string;
};

export async function createExpense(
  expense: CreateExpenseRequest
): Promise<Expense> {
  const response = await api.post(
    "/expenses",
    expense
  );

  return response.data;
}

export async function updateExpense(
  id: number,
  expense: CreateExpenseRequest
): Promise<Expense> {
  const response = await api.patch(
    `/expenses/${id}`,
    expense
  );

  return response.data;
}

export async function deleteExpense(
  id: number
): Promise<void> {
  await api.delete(`/expenses/${id}`);
}