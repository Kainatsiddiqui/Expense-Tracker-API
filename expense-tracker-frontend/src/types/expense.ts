export type Expense = {
id: number;
title: string;
amount: number;
category: string;
date: string;
};

export type PaginatedExpensesResponse = {
items: Expense[];
total: number;
page: number;
limit: number;
total_pages: number;
};

export type ExpenseFormData = {
  title: string;
  amount: number;
  category: string;
  date: string;
};