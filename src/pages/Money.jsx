import { useState } from "react";
import {
  Plus,
  Wallet,
  Trash2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useLife } from "../context/LifeContext";

function Money() {
  const {
    moneyTransactions = [],
    addMoneyTransaction,
    deleteMoneyTransaction,
  } = useLife();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("Income");
  const [category, setCategory] = useState("Freelancing");
  const [date, setDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !amount) return;

    addMoneyTransaction({
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      date,
    });

    setTitle("");
    setAmount("");
    setType("Income");
    setCategory("Freelancing");
    setDate("");
  };

  const income = moneyTransactions
    .filter((item) => item.type === "Income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const expenses = moneyTransactions
    .filter((item) => item.type === "Expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = income - expenses;

  return (
    <main className="money-page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <p className="eyebrow">
            FINANCIAL SYSTEM
          </p>

          <h1>My Money</h1>

          <p className="subtitle">
            Track income, expenses and build your financial future.
          </p>
        </div>

        <div className="money-summary-icon">
          <Wallet size={24} />
        </div>
      </div>

      {/* STATS */}

      <div className="money-stats">

        <div className="money-stat">
          <div className="money-stat-icon income-icon">
            <TrendingUp size={19} />
          </div>

          <div>
            <span>Total Income</span>
            <strong>
              Rs. {income.toLocaleString()}
            </strong>
          </div>
        </div>

        <div className="money-stat">
          <div className="money-stat-icon expense-icon">
            <TrendingDown size={19} />
          </div>

          <div>
            <span>Total Expenses</span>
            <strong>
              Rs. {expenses.toLocaleString()}
            </strong>
          </div>
        </div>

        <div className="money-stat">
          <div className="money-stat-icon balance-icon">
            <Wallet size={19} />
          </div>

          <div>
            <span>Balance</span>
            <strong>
              Rs. {balance.toLocaleString()}
            </strong>
          </div>
        </div>

      </div>

      {/* ADD TRANSACTION */}

      <form
        className="money-form"
        onSubmit={handleSubmit}
      >

        <div className="input-group">
          <label>Title</label>

          <input
            type="text"
            placeholder="e.g. First Fiverr Client"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />
        </div>

        <div className="input-group">
          <label>Amount</label>

          <input
            type="number"
            min="0"
            placeholder="e.g. 25000"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
          />
        </div>

        <div className="input-group">
          <label>Type</label>

          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >
            <option>Income</option>
            <option>Expense</option>
          </select>
        </div>

        <div className="input-group">
          <label>Category</label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option>Freelancing</option>
            <option>Fiverr</option>
            <option>Client</option>
            <option>Salary</option>
            <option>Business</option>
            <option>Food</option>
            <option>Education</option>
            <option>Shopping</option>
            <option>Other</option>
          </select>
        </div>

        <div className="input-group">
          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
          />
        </div>

        <button
          type="submit"
          className="add-task-btn"
        >
          <Plus size={18} />
          Add Transaction
        </button>

      </form>

      {/* TRANSACTIONS */}

      <div className="money-container">

        <div className="money-header">
          <div>
            <h2>
              Money Activity
            </h2>

            <p>
              Keep track of every rupee.
            </p>
          </div>
        </div>

        {moneyTransactions.length === 0 ? (

          <div className="empty-money">
            <Wallet size={48} />

            <h3>
              No transactions yet
            </h3>

            <p>
              Add your first income or expense.
            </p>
          </div>

        ) : (

          <div className="money-list">

            {moneyTransactions.map((item) => (

              <div
                className="money-card"
                key={item.id}
              >

                <div className="money-card-left">

                  <div
                    className={
                      item.type === "Income"
                        ? "transaction-icon income-icon"
                        : "transaction-icon expense-icon"
                    }
                  >
                    {item.type === "Income"
                      ? <TrendingUp size={18} />
                      : <TrendingDown size={18} />
                    }
                  </div>

                  <div>
                    <h3>
                      {item.title}
                    </h3>

                    <span>
                      {item.category}
                    </span>
                  </div>

                </div>

                <div className="money-card-right">

                  <strong
                    className={
                      item.type === "Income"
                        ? "income-text"
                        : "expense-text"
                    }
                  >
                    {item.type === "Income"
                      ? "+"
                      : "-"
                    }
                    Rs. {Number(item.amount).toLocaleString()}
                  </strong>

                  <small>
                    {item.date || "No date"}
                  </small>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() =>
                      deleteMoneyTransaction(item.id)
                    }
                  >
                    <Trash2 size={16} />
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}

export default Money;