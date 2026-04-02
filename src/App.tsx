import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

function App() {
  const [role, setRole] = useState("viewer");
  const [search, setSearch] = useState("");

  const [transactions, setTransactions] = useState([
    { id: 1, date: "2026-04-01", amount: 500, category: "Food", type: "expense" },
    { id: 2, date: "2026-04-02", amount: 2000, category: "Salary", type: "income" },
    { id: 3, date: "2026-04-03", amount: 1000, category: "Shopping", type: "expense" }
  ]);

  const [form, setForm] = useState({
    date: "",
    amount: "",
    category: "",
    type: "expense"
  });

  // Calculations
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = income - expense;

  // Line Chart Data
  const lineData = [...transactions]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((t) => ({
      date: t.date,
      amount: t.amount
    }));

  // Pie Chart Data
  const categoryData = Object.values(
    transactions.reduce((acc, t) => {
      if (t.type === "expense") {
        acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
        acc[t.category].value += t.amount;
      }
      return acc;
    }, {})
  );

  // Insights
  const categoryTotals = transactions.reduce((acc, t) => {
    if (t.type === "expense") {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {});

  const highestCategory =
    Object.keys(categoryTotals).length > 0
      ? Object.keys(categoryTotals).reduce((a, b) =>
          categoryTotals[a] > categoryTotals[b] ? a : b
        )
      : "None";

  return (
    <div style={{
      padding: "20px",
      background: "#f3f4f6",
      minHeight: "100vh",
      maxWidth: "900px",
      margin: "auto"
    }}>
      <h1 style={{ textAlign: "center" }}>💰 Finance Dashboard</h1>

      {/* Role */}
      <div style={{ textAlign: "center" }}>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px", justifyContent: "center", flexWrap: "wrap" }}>
        <div style={card}><h3>Total Balance</h3>
          <p style={{ color: balance < 0 ? "red" : "green" }}>₹{balance}</p>
        </div>

        <div style={card}><h3>Income</h3>
          <p style={{ color: "green" }}>₹{income}</p>
        </div>

        <div style={card}><h3>Expenses</h3>
          <p style={{ color: "red" }}>₹{expense}</p>
        </div>
      </div>

      {/* Transactions */}
      <h2 style={{ textAlign: "center", marginTop: "30px" }}>Transactions</h2>

      <div style={{ textAlign: "center" }}>
        <input
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table style={{
        width: "100%",
        background: "white",
        marginTop: "10px",
        borderCollapse: "collapse"
      }}>
        <thead>
          <tr style={{ background: "#4f46e5", color: "white" }}>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Type</th>
            {role === "admin" && <th>Action</th>}
          </tr>
        </thead>

        <tbody>
          {transactions
            .filter((t) =>
              t.category.toLowerCase().includes(search.toLowerCase())
            )
            .map((t) => (
              <tr key={t.id} style={{ textAlign: "center" }}>
                <td>{t.date}</td>
                <td>₹{t.amount}</td>
                <td>{t.category}</td>
                <td>{t.type}</td>

                {role === "admin" && (
                  <td>
                    <button
                      onClick={() =>
                        setTransactions(transactions.filter((x) => x.id !== t.id))
                      }
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "5px",
                        borderRadius: "5px"
                      }}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>

      {/* Form */}
      {role === "admin" && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <input type="date" onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <input placeholder="Amount" onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <input placeholder="Category" onChange={(e) => setForm({ ...form, category: e.target.value })} />

          <select onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>

          <button
            onClick={() => {
              if (!form.date || !form.amount || !form.category) return alert("Fill all fields");

              setTransactions([
                ...transactions,
                { ...form, id: Date.now(), amount: Number(form.amount) }
              ]);

              setForm({ date: "", amount: "", category: "", type: "expense" });
            }}
            style={{ marginLeft: "10px", background: "green", color: "white" }}
          >
            Add
          </button>
        </div>
      )}

      {/* Charts */}
      <h2 style={{ textAlign: "center", marginTop: "30px" }}>Charts</h2>

      <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
        <LineChart width={400} height={300} data={lineData}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="amount" stroke="#6366f1" />
        </LineChart>

        <PieChart width={300} height={300}>
          <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={100}>
            {categoryData.map((_, i) => (
              <Cell key={i} fill={["#22c55e", "#ef4444", "#6366f1"][i % 3]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {/* Insights */}
      <h2 style={{ textAlign: "center", marginTop: "30px" }}>Insights</h2>

      <div style={{
        background: "white",
        padding: "15px",
        borderRadius: "10px",
        textAlign: "center"
      }}>
        <p><b>Highest Spending Category:</b> {highestCategory}</p>
        <p><b>Total Income:</b> ₹{income}</p>
        <p><b>Total Expenses:</b> ₹{expense}</p>

        <p style={{ color: balance > 0 ? "green" : "red" }}>
          <b>Status:</b> {balance > 0 ? "Saving 👍" : "Overspending ⚠️"}
        </p>

        <p>
          <b>Comparison:</b> {income > expense ? "Income is higher 📈" : "Expenses are higher 📉"}
        </p>
      </div>

      {/* Footer */}
      <p style={{ textAlign: "center", marginTop: "20px", color: "gray" }}>
        © 2026 Finance Dashboard | Built with React
      </p>
    </div>
  );
}

const card = {
  background: "white",
  padding: "15px",
  borderRadius: "10px",
  width: "200px",
  textAlign: "center",
  boxShadow: "0 0 5px rgba(0,0,0,0.1)"
};

export default App;