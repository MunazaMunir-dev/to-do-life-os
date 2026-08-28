import { useState } from "react";

import {
  Plus,
  Trash2,
  Target,
  CalendarDays,
  CheckCircle2,
} from "lucide-react";

import { useLife } from "../context/LifeContext";

function Goals() {
  const {
    goals,
    addGoal,
    updateGoalProgress,
    deleteGoal,
  } = useLife();

  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState("Career");
  const [deadline, setDeadline] =
    useState("");
  const [description, setDescription] =
    useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    addGoal({
      title: title.trim(),
      category,
      deadline,
      description: description.trim(),
    });

    setTitle("");
    setCategory("Career");
    setDeadline("");
    setDescription("");
  };

  const completedGoals = goals.filter(
    (goal) => goal.completed
  ).length;

  return (
    <main className="goals-page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <p className="eyebrow">
            YOUR FUTURE
          </p>

          <h1>My Goals</h1>

          <p className="subtitle">
            Turn your dreams into measurable goals.
          </p>
        </div>

        <div className="goal-summary">

          <Target size={20} />

          <div>
            <strong>
              {completedGoals}/{goals.length}
            </strong>

            <span>
              Goals completed
            </span>
          </div>

        </div>

      </div>

      {/* CREATE GOAL */}

      <form
        className="goal-form"
        onSubmit={handleSubmit}
      >

        <div className="input-group">

          <label>Goal</label>

          <input
            type="text"
            placeholder="e.g. Get my first international client"
            value={title}
            onChange={(event) =>
              setTitle(event.target.value)
            }
          />

        </div>

        <div className="input-group">

          <label>Category</label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
          >
            <option>Career</option>
            <option>Money</option>
            <option>Study</option>
            <option>YouTube</option>
            <option>Health</option>
            <option>Personal</option>
            <option>Business</option>
          </select>

        </div>

        <div className="input-group">

          <label>Deadline</label>

          <input
            type="date"
            value={deadline}
            onChange={(event) =>
              setDeadline(event.target.value)
            }
          />

        </div>

        <div className="input-group goal-description">

          <label>Description</label>

          <input
            type="text"
            placeholder="Why is this goal important?"
            value={description}
            onChange={(event) =>
              setDescription(event.target.value)
            }
          />

        </div>

        <button
          type="submit"
          className="add-task-btn"
        >
          <Plus size={18} />
          Add Goal
        </button>

      </form>

      {/* GOALS */}

      <div className="goals-container">

        <div className="goals-header">

          <div>
            <h2>
              Active Goals
            </h2>

            <p>
              Keep moving forward.
            </p>
          </div>

          <span>
            {goals.length} goals
          </span>

        </div>

        {goals.length === 0 ? (

          <div className="empty-goals">

            <Target size={45} />

            <h3>
              No goals yet
            </h3>

            <p>
              Add your first goal and start
              building your future.
            </p>

          </div>

        ) : (

          <div className="goals-grid">

            {goals.map((goal) => (

              <div
                className={`goal-card ${
                  goal.completed
                    ? "goal-completed"
                    : ""
                }`}
                key={goal.id}
              >

                <div className="goal-card-top">

                  <div className="goal-icon">
                    {goal.completed ? (
                      <CheckCircle2 />
                    ) : (
                      <Target />
                    )}
                  </div>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteGoal(goal.id)
                    }
                  >
                    <Trash2 size={17} />
                  </button>

                </div>

                <div className="goal-category">
                  {goal.category}
                </div>

                <h3>
                  {goal.title}
                </h3>

                {goal.description && (
                  <p className="goal-description-text">
                    {goal.description}
                  </p>
                )}

                {goal.deadline && (
                  <div className="goal-deadline">

                    <CalendarDays size={15} />

                    <span>
                      {goal.deadline}
                    </span>

                  </div>
                )}

                {/* PROGRESS */}

                <div className="goal-progress">

                  <div className="progress-header">

                    <span>
                      Progress
                    </span>

                    <strong>
                      {goal.progress}%
                    </strong>

                  </div>

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${goal.progress}%`,
                      }}
                    />

                  </div>

                </div>

                {/* PROGRESS CONTROLS */}

                {!goal.completed && (

                  <div className="progress-controls">

                    <button
                      onClick={() =>
                        updateGoalProgress(
                          goal.id,
                          goal.progress - 10
                        )
                      }
                    >
                      −10
                    </button>

                    <button
                      onClick={() =>
                        updateGoalProgress(
                          goal.id,
                          goal.progress + 10
                        )
                      }
                    >
                      +10
                    </button>

                    <button
                      onClick={() =>
                        updateGoalProgress(
                          goal.id,
                          100
                        )
                      }
                    >
                      Complete
                    </button>

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}

export default Goals;