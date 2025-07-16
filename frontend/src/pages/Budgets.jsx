import { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import Loading from "../components/Loading";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        let userStr = sessionStorage.getItem("user");
        if (!userStr) {
          userStr = localStorage.getItem("user");
        }
        const user = userStr ? JSON.parse(userStr) : null;
        const res = await apiClient.get("/api/budget", {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setBudgets(res.data);
      } catch (err) {
        setError(
          err?.response?.data?.msg ||
            err?.msg ||
            "An error occurred while fetching budgets."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Budgets</h2>
      <ul>
        {budgets.map((budget) => (
          <li key={budget._id || budget.id}>
            {budget.name}: {budget.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Budgets;
