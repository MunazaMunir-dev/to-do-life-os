import { useState } from "react";
import {
  Plus,
  Trash2,
  Check,
  CalendarDays,
} from "lucide-react";
import { useLife } from "../context/LifeContext";

function Planner() {
  const {
    plannerItems,
    addPlannerItem,
    togglePlannerItem,
    deletePlannerItem,
  } = useLife();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("Work");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !date) return;

    addPlannerItem({
      title: title.trim(),
      date,
      category,
    });

    setTitle("");
    setDate("");
    setCategory("Work");
  };

  const sortedItems = [...plannerItems].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  return (
    <main className="planner-page">

      <div className="page-header">
        <div>
          <p className="eyebrow">PLAN YOUR LIFE</p>
          <h1>Planner</h1>
          <p className="subtitle">
            Turn your plans into daily action.
          </p>
        </div>

        <div className="planner-summary">
          <CalendarDays size={20} />
          <div>
            <strong>{plannerItems.length}</strong>
            <span>Planned items</span>
          </div>
        </div>
      </div>

      {/* ADD PLAN */}

      <form
        className="planner-form"
        onSubmit={handleSubmit}
      >
        <div className="input-group">
          <label>What are you planning?</label>

          <input
            type="text"
            placeholder="e.g. Send 20 client emails"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Work</option>
            <option>Client Hunting</option>
            <option>Study</option>
            <option>YouTube</option>
            <option>Coding</option>
            <option>Personal</option>
            <option>Money</option>
          </select>
        </div>

        <button
          type="submit"
          className="add-task-btn"
        >
          <Plus size={18} />
          Add Plan
        </button>
      </form>

      {/* PLANNER */}

      <div className="planner-container">

        <div className="planner-header">
          <div>
            <h2>My Schedule</h2>
            <p>Everything you have planned.</p>
          </div>
        </div>

        {sortedItems.length === 0 ? (

          <div className="empty-planner">
            <CalendarDays size={45} />

            <h3>No plans yet</h3>

            <p>
              Add your first plan above.
            </p>
          </div>

        ) : (

          <div className="planner-list">

            {sortedItems.map((item) => (

              <div
                className={`planner-item ${
                  item.completed ? "completed" : ""
                }`}
                key={item.id}
              >

                <button
                  className="planner-check"
                  onClick={() =>
                    togglePlannerItem(item.id)
                  }
                >
                  {item.completed ? (
                    <Check size={18} />
                  ) : (
                    <span></span>
                  )}
                </button>

                <div className="planner-date">
                  <strong>
                    {new Date(
                      item.date
                    ).toLocaleDateString(
                      "en-US",
                      {
                        day: "numeric",
                        month: "short",
                      }
                    )}
                  </strong>

                  <span>
                    {new Date(
                      item.date
                    ).toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                      }
                    )}
                  </span>
                </div>

                <div className="planner-info">
                  <h3>{item.title}</h3>

                  <span>
                    {item.category}
                  </span>
                </div>

                <button
                  className="delete-btn"
                  onClick={() =>
                    deletePlannerItem(item.id)
                  }
                >
                  <Trash2 size={17} />
                </button>

              </div>

            ))}

          </div>
        )}
      </div>

    </main>
  );
}

export default Planner;