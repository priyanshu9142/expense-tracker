import "./App.css"; 
import{ useState , useEffect } from "react";

function App() {

  const [transactions, setTransactions] = useState(() => {
  const savedTransactions = localStorage.getItem("transactions");

  return savedTransactions
    ? JSON.parse(savedTransactions)
    : [];
  });

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );
}, [transactions]);

  const handleSubmit = (e) => {
  e.preventDefault();

  if (!description.trim()) {
  alert("Please enter a description");
  return;
}

if (description.trim().length < 2) {
  alert("Description must be at least 2 characters");
  return;
}
if (description.trim().length > 50) {
  alert("Description cannot exceed 50 characters");
  return;
}

  if (!amount || Number(amount) <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  const newTransaction = {
    id: Date.now(),
    description: description.trim(),
    amount: Number(amount),
    type: type,
    date: new Date().toLocaleDateString("en-IN")
  }

  setTransactions([...transactions, newTransaction]);

  setDescription("");
  setAmount("");
  setType("expense");
};
    const handleDelete = (id) => {
  const updatedTransactions = transactions.filter(
    (transaction) => transaction.id !== id
  );

  setTransactions(updatedTransactions);
};
const handleClearAll = () => {
  if (transactions.length === 0) {
    alert("There are no transactions to clear");
    return;
  }

  const confirmClear = window.confirm(
    "Are you sure you want to delete all transactions?"
  );

  if (confirmClear) {
    setTransactions([]);
  }
};

const income = transactions
  .filter((transaction) => transaction.type === "income")
  .reduce((total, transaction) => total + transaction.amount, 0);

const expenses = transactions
  .filter((transaction) => transaction.type === "expense")
  .reduce((total, transaction) => total + transaction.amount, 0);

const balance = income - expenses;

const filteredTransactions = transactions.filter((transaction) => {
  if (filter === "income") {
    return transaction.type === "income";
  }

  if (filter === "expense") {
    return transaction.type === "expense";
  }

  return true;
});
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

    
  return (
  <div className="app">

      <header className="header">
        <h1>Expense Tracker</h1>
        <p>Track your income and expenses</p>
      </header>

      <section className="summary">

        <div className="balance-card">
          <h2>Current Balance</h2>
          <p>{formatCurrency(balance)}</p>
        </div>

        <div className="summary-cards">

          <div className="income-card">
            <h3>Income</h3>
            <p>{formatCurrency(income)}</p>
          </div>

          <div className="expense-card">
            <h3>Expenses</h3>
            <p>{formatCurrency(expenses)}</p>
          </div>

        </div>
      </section>

     
      <section className="transaction-form">

        <h2>Add Transaction</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Transaction description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <button type="submit">
            Add Transaction
          </button>

        </form>

      </section>

      <section className="transactions">

        <div className="transactions-header">
          <h2>Transactions</h2>
          <button onClick={handleClearAll}>Clear All</button>
        </div>

        <div className="filters">
          <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
          > All
          </button>

          <button
          className={filter === "income" ? "active" : ""}
          onClick={() => setFilter("income")}
          >Income
          </button>

          <button
          className={filter === "expense" ? "active" : ""}
          onClick={() => setFilter("expense")}>
          Expenses
          </button>

        </div>

        <div className="transaction-list">

        {filteredTransactions.length === 0 ? (
        <p className="empty-message">
        {transactions.length === 0
        ? "No transactions yet. Add your first transaction!"
        : filter === "income"
        ? "No income transactions found."
        : filter === "expense"
        ? "No expense transactions found."
        : "No transactions found."}
        </p>

        ) : (
        filteredTransactions.map((transaction) => (

        <div
          className="transaction-item"
          key={transaction.id}
        >

          <div>
            <h3>{transaction.description}</h3>
            <p>{transaction.date && ` : ${transaction.date}`}</p>
          </div>

          <span className={transaction.type}>
            {transaction.type === "income" ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </span>

          <button onClick={() => handleDelete(transaction.id)}>
            Delete
          </button>

        </div>
            ))
          )}
        </div>

      </section>

  </div>
  );
}

export default App;
