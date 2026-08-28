import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Target,
  CheckSquare,
  CalendarDays,
  Flame,
  PlayCircle,
  FileText,
  Wallet,
  Users,
  BookOpen,
  GraduationCap,
  TrendingUp,
  Activity,
  Trophy,
} from "lucide-react";

import "./Progress.css";

const BOARDS = [
  {
    id: "tasks",
    name: "Tasks",
    icon: CheckSquare,
    color: "#6366f1",
    completed: 18,
    total: 24,
  },
  {
    id: "goals",
    name: "Goals",
    icon: Target,
    color: "#ec4899",
    completed: 7,
    total: 10,
  },
  {
    id: "planner",
    name: "Planner",
    icon: CalendarDays,
    color: "#06b6d4",
    completed: 16,
    total: 20,
  },
  {
    id: "habits",
    name: "Habits",
    icon: Flame,
    color: "#f97316",
    completed: 22,
    total: 30,
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: PlayCircle,
    color: "#ef4444",
    completed: 12,
    total: 20,
  },
  {
    id: "scripts",
    name: "Scripts",
    icon: FileText,
    color: "#8b5cf6",
    completed: 15,
    total: 20,
  },
  {
    id: "money",
    name: "Money",
    icon: Wallet,
    color: "#22c55e",
    completed: 8,
    total: 15,
  },
  {
    id: "clients",
    name: "Clients",
    icon: Users,
    color: "#0ea5e9",
    completed: 6,
    total: 12,
  },
  {
    id: "learning",
    name: "Learning",
    icon: BookOpen,
    color: "#a855f7",
    completed: 21,
    total: 30,
  },
  {
    id: "study",
    name: "Study",
    icon: GraduationCap,
    color: "#14b8a6",
    completed: 25,
    total: 30,
  },
];

const WEEKLY_DATA = [
  { day: "Mon", progress: 42 },
  { day: "Tue", progress: 58 },
  { day: "Wed", progress: 51 },
  { day: "Thu", progress: 69 },
  { day: "Fri", progress: 74 },
  { day: "Sat", progress: 82 },
  { day: "Sun", progress: 88 },
];

function Progress() {
  const overall = useMemo(() => {
    const completed = BOARDS.reduce(
      (sum, board) => sum + board.completed,
      0
    );

    const total = BOARDS.reduce(
      (sum, board) => sum + board.total,
      0
    );

    return Math.round((completed / total) * 100);
  }, []);

  const totalCompleted = BOARDS.reduce(
    (sum, board) => sum + board.completed,
    0
  );

  const totalItems = BOARDS.reduce(
    (sum, board) => sum + board.total,
    0
  );

  const chartData = BOARDS.map((board) => ({
    name: board.name,
    progress: Math.round(
      (board.completed / board.total) * 100
    ),
  }));

  return (
    <div className="progress-page">

      {/* HEADER */}
      <header className="progress-header">
        <div>
          <div className="progress-kicker">
            <Activity size={14} />
            <span>LIFE ANALYTICS</span>
          </div>

          <h1>My Progress</h1>

          <p>
            See your complete life progress across all
            your boards.
          </p>
        </div>

        <div className="progress-header-badge">
          <Trophy size={18} />
          <span>{overall}% Overall</span>
        </div>
      </header>

      {/* HERO */}
      <section className="progress-hero">

        <div
          className="hero-progress-circle"
          style={{
            "--progress": `${overall}%`,
          }}
        >
          <div className="circle-inner">
            <strong>{overall}%</strong>
            <span>Overall</span>
          </div>
        </div>

        <div className="hero-content">
          <span className="hero-label">
            YOUR 2026 JOURNEY
          </span>

          <h2>
            You are building your life
            <br />
            one board at a time.
          </h2>

          <p>
            Keep completing small actions every day.
            Your consistency is what creates the big
            results.
          </p>

          <div className="hero-stats">

            <div>
              <strong>{totalCompleted}</strong>
              <span>Completed</span>
            </div>

            <div>
              <strong>{totalItems}</strong>
              <span>Total Items</span>
            </div>

            <div>
              <strong>{BOARDS.length}</strong>
              <span>Boards</span>
            </div>

          </div>
        </div>
      </section>

      {/* BOARD PROGRESS */}
      <section className="section-block">

        <div className="section-heading">

          <div>
            <span className="section-kicker">
              10 LIFE AREAS
            </span>

            <h2>Board Progress</h2>
          </div>

          <span className="section-count">
            {BOARDS.length} boards
          </span>

        </div>

        <div className="board-progress-grid">

          {BOARDS.map((board) => {
            const Icon = board.icon;

            const percentage = Math.round(
              (board.completed / board.total) * 100
            );

            return (
              <div
                className="board-progress-card"
                key={board.id}
              >

                <div className="board-card-top">

                  <div
                    className="board-icon"
                    style={{
                      background: `${board.color}18`,
                      color: board.color,
                    }}
                  >
                    <Icon size={20} />
                  </div>

                  <span
                    className="board-percentage"
                    style={{
                      color: board.color,
                    }}
                  >
                    {percentage}%
                  </span>

                </div>

                <h3>{board.name}</h3>

                <div className="board-numbers">
                  <span>
                    {board.completed} completed
                  </span>

                  <span>
                    {board.total} total
                  </span>
                </div>

                <div className="progress-track">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${percentage}%`,
                      background: board.color,
                    }}
                  />

                </div>

              </div>
            );
          })}

        </div>
      </section>

      {/* CHARTS */}
      <section className="charts-grid">

        {/* BOARD CHART */}
        <div className="chart-card">

          <div className="chart-heading">

            <div>
              <span>COMPARISON</span>
              <h2>10 Boards Progress</h2>
            </div>

            <TrendingUp size={20} />

          </div>

          <div className="chart-wrapper">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                  height={65}
                />

                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                />

                <Tooltip
                  formatter={(value) => [
                    `${value}%`,
                    "Progress",
                  ]}
                />

                <Bar
                  dataKey="progress"
                  radius={[8, 8, 0, 0]}
                  fill="#6366f1"
                />

              </BarChart>
            </ResponsiveContainer>

          </div>
        </div>

        {/* WEEKLY CHART */}
        <div className="chart-card">

          <div className="chart-heading">

            <div>
              <span>THIS WEEK</span>
              <h2>Productivity Trend</h2>
            </div>

            <Activity size={20} />

          </div>

          <div className="chart-wrapper">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <LineChart
                data={WEEKLY_DATA}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                />

                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11 }}
                />

                <Tooltip
                  formatter={(value) => [
                    `${value}%`,
                    "Productivity",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="progress"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{
                    r: 5,
                  }}
                  activeDot={{
                    r: 7,
                  }}
                />

              </LineChart>
            </ResponsiveContainer>

          </div>
        </div>

      </section>

      {/* BOTTOM SUMMARY */}
      <section className="progress-summary">

        <div className="summary-icon">
          <Trophy size={22} />
        </div>

        <div className="summary-content">

          <span>KEEP GOING</span>

          <h2>
            Every completed task moves your life
            forward.
          </h2>

          <p>
            Your goal isn't to be perfect. Your goal is
            to become more consistent every day.
          </p>

        </div>

        <div className="summary-number">
          <strong>{overall}%</strong>
          <span>Life Progress</span>
        </div>

      </section>

    </div>
  );
}

export default Progress;