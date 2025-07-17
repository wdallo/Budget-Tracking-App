import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useFinance } from "../contexts/FinanceContext";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const { user } = useAuth();
  const { transactions, loading } = useFinance();
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    transactionCount: 0,
  });

  useEffect(() => {
    if (transactions.length > 0) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const recentTransactions = transactions.filter(
        (t) => new Date(t.date) >= thirtyDaysAgo
      );

      const newSummary = recentTransactions.reduce(
        (acc, transaction) => {
          const amount = parseFloat(transaction.amount);
          if (transaction.type === "income") {
            acc.totalIncome += amount;
          } else {
            acc.totalExpenses += amount;
          }
          return acc;
        },
        { totalIncome: 0, totalExpenses: 0 }
      );

      setSummary({
        ...newSummary,
        netIncome: newSummary.totalIncome - newSummary.totalExpenses,
        transactionCount: recentTransactions.length,
      });
    }
  }, [transactions]);

  const recentTransactions = transactions.slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Welcome back, {user.firstName} {user.lastName}!
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here's your financial overview for the last 30 days
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Income
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    ${summary.totalIncome.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Expenses
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    ${summary.totalExpenses.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign
                  className={`h-8 w-8 ${
                    summary.netIncome >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Net Income
                  </dt>
                  <dd
                    className={`text-lg font-semibold ${
                      summary.netIncome >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${summary.netIncome.toFixed(2)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCard className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Transactions
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {summary.transactionCount}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Recent Transactions
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Your latest financial activities
          </p>
        </div>
        <ul className="divide-y divide-gray-200">
          {recentTransactions.length === 0 ? (
            <li className="px-4 py-6 text-center text-gray-500">
              No transactions yet. Create your first transaction to get started!
            </li>
          ) : (
            recentTransactions.map((transaction) => (
              <li key={transaction._id} className="px-4 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
                        transaction.type === "income"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowUpRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.category?.name || "Uncategorized"} •{" "}
                        {format(new Date(transaction.date), "MMM d, yyyy")}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}$
                    {parseFloat(transaction.amount).toFixed(2)}
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Quick Actions
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Common tasks you might want to perform
          </p>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <a
              href="/transactions"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border hover:shadow-md transition-shadow"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-600 ring-4 ring-white">
                  <Plus className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Add Transaction
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Record a new income or expense transaction
                </p>
              </div>
            </a>

            <a
              href="/budgets"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border hover:shadow-md transition-shadow"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-600 ring-4 ring-white">
                  <Plus className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Create Budget
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Set spending limits for categories
                </p>
              </div>
            </a>

            <a
              href="/analytics"
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border hover:shadow-md transition-shadow"
            >
              <div>
                <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-600 ring-4 ring-white">
                  <TrendingUp className="h-6 w-6" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">
                  View Analytics
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Analyze your spending patterns
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
