import { useLife } from "../context/LifeContext";

import {
  TrendingUp,
  BookOpen,
  Check,
  Clock,
  Target,
  BarChart3,
  Shield,
  Brain,
  LineChart,
} from "lucide-react";

function Trading() {
  const {
    learningTracks = [],
    toggleLearningTopic,
    updateLearningHours,
  } = useLife();

  const tradingTrack = learningTracks.find(
    (track) => track.id === "trading"
  );

  if (!tradingTrack) {
    return (
      <main className="trading-page">
        <div className="trading-empty">
          <TrendingUp size={42} />
          <h2>Trading Track Not Found</h2>
          <p>
            Please make sure the Trading track exists inside
            LifeContext.
          </p>
        </div>
      </main>
    );
  }

  const topics = tradingTrack.topics || [];

  const completedTopics = topics.filter(
    (topic) => topic.completed
  ).length;

  const totalTopics = topics.length;

  const progress =
    totalTopics > 0
      ? Math.round(
          (completedTopics / totalTopics) * 100
        )
      : 0;

  const months = [
    {
      month: "Month 01",
      title: "Trading Foundations",
      icon: BookOpen,
      topics: [
        "Trading Basics",
        "Market Structure",
      ],
    },
    {
      month: "Month 02",
      title: "Technical Analysis",
      icon: BarChart3,
      topics: [
        "Support & Resistance",
        "Technical Analysis",
      ],
    },
    {
      month: "Month 03",
      title: "Risk & Psychology",
      icon: Shield,
      topics: [
        "Risk Management",
        "Trading Psychology",
      ],
    },
    {
      month: "Month 04",
      title: "Testing & Strategy",
      icon: LineChart,
      topics: [
        "Backtesting",
        "Trading Strategy",
      ],
    },
  ];

  const handleHoursChange = (e) => {
    updateLearningHours(
      "trading",
      e.target.value
    );
  };

  return (
    <main className="trading-page">

      {/* ================================
          HEADER
      ================================= */}

      <section className="trading-header">
        <div>
          <p className="trading-eyebrow">
            TRADING LEARNING SYSTEM
          </p>

          <h1>
            Trading
            <span> Mastery</span>
          </h1>

          <p className="trading-subtitle">
            Learn trading systematically. Understand
            the market before risking real money.
          </p>
        </div>

        <div className="trading-header-icon">
          <TrendingUp size={32} />
        </div>
      </section>

      {/* ================================
          STATS
      ================================= */}

      <section className="trading-stats">

        <div className="trading-stat-card">
          <div className="trading-stat-icon">
            <BookOpen size={21} />
          </div>

          <div>
            <span>Total Lessons</span>
            <strong>{totalTopics}</strong>
          </div>
        </div>

        <div className="trading-stat-card">
          <div className="trading-stat-icon">
            <Check size={21} />
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedTopics}</strong>
          </div>
        </div>

        <div className="trading-stat-card">
          <div className="trading-stat-icon">
            <Target size={21} />
          </div>

          <div>
            <span>Progress</span>
            <strong>{progress}%</strong>
          </div>
        </div>

        <div className="trading-stat-card">
          <div className="trading-stat-icon">
            <Clock size={21} />
          </div>

          <div>
            <span>Study Hours</span>

            <input
              className="trading-hours-input"
              type="number"
              min="0"
              value={tradingTrack.hours || 0}
              onChange={handleHoursChange}
            />
          </div>
        </div>

      </section>

      {/* ================================
          PROGRESS
      ================================= */}

      <section className="trading-progress-card">

        <div className="trading-progress-heading">
          <div>
            <p className="trading-eyebrow">
              YOUR PROGRESS
            </p>

            <h2>
              {progress === 100
                ? "Trading Track Completed 🎉"
                : "Build Your Trading Foundation"}
            </h2>
          </div>

          <strong>{progress}%</strong>
        </div>

        <div className="trading-progress-bar">
          <div
            className="trading-progress-fill"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="trading-progress-footer">
          <span>
            {completedTopics} of {totalTopics} lessons
            completed
          </span>

          <span>
            {totalTopics - completedTopics} remaining
          </span>
        </div>

      </section>

      {/* ================================
          4 MONTH ROADMAP
      ================================= */}

      <section className="trading-roadmap">

        <div className="trading-section-heading">
          <div>
            <p className="trading-eyebrow">
              4 MONTH ROADMAP
            </p>

            <h2>
              Your Trading Learning Journey
            </h2>

            <p>
              Four months of structured learning before
              serious trading decisions.
            </p>
          </div>
        </div>

        <div className="trading-month-grid">

          {months.map((month) => {
            const Icon = month.icon;

            return (
              <div
                className="trading-month-card"
                key={month.month}
              >

                <div className="trading-month-top">

                  <div className="trading-month-icon">
                    <Icon size={21} />
                  </div>

                  <span>
                    {month.month}
                  </span>

                </div>

                <h3>{month.title}</h3>

                <div className="trading-month-topics">

                  {month.topics.map((topicName) => {

                    const topic = topics.find(
                      (item) =>
                        item.name === topicName
                    );

                    return (
                      <div
                        className={`trading-roadmap-topic ${
                          topic?.completed
                            ? "completed"
                            : ""
                        }`}
                        key={topicName}
                      >

                        <span>
                          {topic?.completed ? (
                            <Check size={13} />
                          ) : (
                            "•"
                          )}
                        </span>

                        <p>{topicName}</p>

                      </div>
                    );
                  })}

                </div>

              </div>
            );
          })}

        </div>

      </section>

      {/* ================================
          LESSONS
      ================================= */}

      <section className="trading-lessons">

        <div className="trading-section-heading">
          <div>
            <p className="trading-eyebrow">
              LEARNING TRACK
            </p>

            <h2>
              Trading Lessons
            </h2>

            <p>
              Complete each lesson only when you
              actually understand it.
            </p>
          </div>
        </div>

        <div className="trading-topic-list">

          {topics.map((topic, index) => (

            <div
              className={`trading-topic-card ${
                topic.completed
                  ? "completed"
                  : ""
              }`}
              key={`${topic.name}-${index}`}
            >

              <button
                type="button"
                className={`trading-check ${
                  topic.completed
                    ? "checked"
                    : ""
                }`}
                onClick={() =>
                  toggleLearningTopic(
                    "trading",
                    index
                  )
                }
              >
                {topic.completed && (
                  <Check size={16} />
                )}
              </button>

              <div className="trading-topic-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <div className="trading-topic-content">
                <h3>{topic.name}</h3>

                <p>
                  {topic.completed
                    ? "Lesson completed"
                    : "Not completed yet"}
                </p>
              </div>

              <div
                className={`trading-topic-status ${
                  topic.completed
                    ? "done"
                    : ""
                }`}
              >
                {topic.completed
                  ? "Completed"
                  : "Pending"}
              </div>

            </div>

          ))}

        </div>

      </section>

      {/* ================================
          TRADING RULE
      ================================= */}

      <section className="trading-rule">

        <div className="trading-rule-icon">
          <Brain size={25} />
        </div>

        <div>
          <p className="trading-eyebrow">
            YOUR TRADING RULE
          </p>

          <h2>
            Learn first.
            <br />
            Practice second.
            <br />
            Risk money last.
          </h2>

          <p>
            Your goal for these four months is not
            to make quick money. Build knowledge,
            risk-management skills, a tested strategy,
            and disciplined execution first.
          </p>
        </div>

      </section>

    </main>
  );
}

export default Trading;