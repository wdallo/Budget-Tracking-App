import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  CreditCard,
} from "lucide-react";
const API_URL = import.meta.env.VITE_API_URL;

const Analytics = () => {
  const { token } = useAuth();
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    transactionCount: 0,
  });
  const [categoryData, setCategoryData] = useState([]);
  const [incomeCategoryData, setIncomeCategoryData] = useState([]);
  const [period, setPeriod] = useState("30");
  const [loading, setLoading] = useState(false);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  useEffect(() => {
    fetchAnalytics();
  }, [period, token]);

  const fetchAnalytics = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const [summaryResponse, categoryResponse, incomeCategoryResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/analytics/summary?period=${period}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          }),
          fetch(
            `${API_URL}/api/analytics/spending-by-category?period=${period}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              cache: "no-store",
            }
          ),
          fetch(
            `${API_URL}/api/analytics/income-by-category?period=${period}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              cache: "no-store",
            }
          ),
        ]);

      const summaryData = await summaryResponse.json();
      const categoryData = await categoryResponse.json();
      const incomeCategoryData = await incomeCategoryResponse.json();

      setSummary(summaryData);
      setCategoryData(categoryData);
      setIncomeCategoryData(incomeCategoryData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

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
            Analytics
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Visualize your financial data and spending patterns
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
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
                    $
                    {typeof summary.totalIncome === "number"
                      ? summary.totalIncome.toFixed(2)
                      : "0.00"}
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
                    $
                    {typeof summary.totalExpenses === "number"
                      ? summary.totalExpenses.toFixed(2)
                      : "0.00"}
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
                      typeof summary.netIncome === "number" &&
                      summary.netIncome >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    $
                    {typeof summary.netIncome === "number"
                      ? summary.netIncome.toFixed(2)
                      : "0.00"}
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

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Spending by Category Pie Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Spending by Category
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Breakdown of your expenses by category
            </p>
          </div>
          <div className="p-4">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No expense data available for this period
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Income by Category Pie Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Income by Category
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Breakdown of your income by category
            </p>
          </div>
          <div className="p-4">
            {incomeCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={incomeCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#00C49F"
                    dataKey="amount"
                  >
                    {incomeCategoryData.map((entry, index) => (
                      <Cell
                        key={`cell-income-${index}`}
                        fill={entry.color || COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No income data available for this period
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Details */}
      {categoryData.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Category Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Detailed breakdown of spending by category
            </p>
          </div>
          <ul className="divide-y divide-gray-200">
            {categoryData.map((category, index) => (
              <li key={category.name} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded-full mr-3"
                      style={{
                        backgroundColor:
                          category.color || COLORS[index % COLORS.length],
                      }}
                    />
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                  </div>
                  <div className="text-sm text-gray-900">
                    $
                    {typeof category.amount === "number"
                      ? category.amount.toFixed(2)
                      : "0.00"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Analytics;
