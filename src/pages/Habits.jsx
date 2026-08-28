import { useState } from "react";

import {
  Plus,
  Trash2,
  Flame,
  Check,
} from "lucide-react";

import { useLife } from "../context/LifeContext";

function Habits() {
  const {
    habits,
    addHabit,
    toggleHabit,
    deleteHabit,
  } = useLife();

  const [name, setName] = useState("");
  const [category, setCategory] =
    useState("Personal");

  // Today's date
  const today = new Date()
    .toISOString()
    .split("T")[0];

  // ========================================
  // ADD HABIT
  // ========================================

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    addHabit({
      name: name.trim(),
      category,
    });

    setName("");
    setCategory("Personal");
  };

  // ========================================
  // LAST 7 DAYS
  // ========================================

  const getLastSevenDays = () => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setDate(
        date.getDate() - i
      );

      days.push({
        date: date
          .toISOString()
          .split("T")[0],

        label: date.toLocaleDateString(
          "en-US",
          {
            weekday: "short",
          }
        ),

        number: date.getDate(),
      });
    }

    return days;
  };

  const days = getLastSevenDays();

  // ========================================
  // UI
  // ========================================

  return (
    <main className="habits-page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <p className="eyebrow">
            BUILD CONSISTENCY
          </p>

          <h1>My Habits</h1>

          <p className="subtitle">
            Small actions. Big results.
          </p>
        </div>

        <div className="habit-summary">

          <Flame size={20} />

          <div>
            <strong>
              {habits.length}
            </strong>

            <span>
              Active habits
            </span>
          </div>

        </div>

      </div>

      {/* ADD HABIT */}

      <form
        className="habit-form"
        onSubmit={handleSubmit}
      >

        <div className="input-group">

          <label>
            New Habit
          </label>

          <input
            type="text"
            placeholder="e.g. Code for 3 hours"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />

        </div>

        <div className="input-group">

          <label>
            Category
          </label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option value="Personal">
              Personal
            </option>

            <option value="Study">
              Study
            </option>

            <option value="Coding">
              Coding
            </option>

            <option value="Client Hunting">
              Client Hunting
            </option>

            <option value="YouTube">
              YouTube
            </option>

            <option value="Health">
              Health
            </option>

            <option value="Money">
              Money
            </option>
          </select>

        </div>

        <button
          type="submit"
          className="add-task-btn"
        >
          <Plus size={18} />

          Add Habit
        </button>

      </form>

      {/* HABITS CONTAINER */}

      <div className="habits-container">

        <div className="habits-header">

          <div>
            <h2>
              Daily Habits
            </h2>

            <p>
              Track your last 7 days.
            </p>
          </div>

        </div>

        {/* EMPTY */}

        {habits.length === 0 ? (

          <div className="empty-habits">

            <Flame size={45} />

            <h3>
              No habits yet
            </h3>

            <p>
              Add habits that move your
              life forward.
            </p>

          </div>

        ) : (

          /* HABIT LIST */

          <div className="habit-list">

            {habits.map((habit) => {

              return (
                <div
                  className="habit-card"
                  key={habit.id}
                >

                  {/* HABIT INFO */}

                  <div className="habit-info">

                    <div className="habit-icon">

                      <Flame
                        size={19}
                      />

                    </div>

                    <div>

                      <h3>
                        {habit.name}
                      </h3>

                      <span>
                        {habit.category}
                      </span>

                    </div>

                  </div>

                  {/* DAYS */}

                  <div className="habit-days">

                    {days.map((day) => {

                      const completed =
                        habit.completedDates.includes(
                          day.date
                        );

                      return (
                        <div
                          className="habit-day"
                          key={day.date}
                        >

                          <span>
                            {day.label}
                          </span>

                          <button
                            type="button"
                            className={
                              completed
                                ? "day-check active"
                                : "day-check"
                            }
                            onClick={() =>
                              toggleHabit(
                                habit.id,
                                day.date
                              )
                            }
                          >

                            {completed && (
                              <Check
                                size={14}
                              />
                            )}

                          </button>

                          <small>
                            {day.number}
                          </small>

                        </div>
                      );

                    })}

                  </div>

                  {/* ACTIONS */}

                  <div className="habit-actions">

                    <strong>
                      {
                        habit.completedDates
                          .length
                      }
                    </strong>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() =>
                        deleteHabit(
                          habit.id
                        )
                      }
                    >

                      <Trash2
                        size={16}
                      />

                    </button>

                  </div>

                </div>
              );

            })}

          </div>

        )}

      </div>

    </main>
  );
}

export default Habits;