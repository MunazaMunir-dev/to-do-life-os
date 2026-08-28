import {
  CheckSquare,
  Target,
  Flame,
  CalendarDays,
  Play,
  Wallet,
  BookOpen,
  TrendingUp,
  Users,
  Code2,
  Brain,
  Clock,
  BarChart3,
  Trophy,
  Zap,
  CircleDollarSign,
  PenLine,
} from "lucide-react";

import { useLife } from "../context/LifeContext";
import "./Dashboard.css";

function Dashboard() {
  const {
    tasks = [],
    goals = [],
    habits = [],
    youtubeVideos = [],
    clients = [],
  } = useLife();

  // ==========================================
  // TASK STATS
  // ==========================================

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const taskProgress =
    tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0;

  // ==========================================
  // GOAL STATS
  // ==========================================

  const completedGoals = goals.filter(
    (goal) =>
      goal.completed ||
      Number(goal.progress || 0) === 100
  ).length;

  const averageGoalProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce(
            (total, goal) =>
              total + Number(goal.progress || 0),
            0
          ) / goals.length
        )
      : 0;

  // ==========================================
  // HABITS
  // ==========================================

  const today = new Date()
    .toISOString()
    .split("T")[0];

  const completedHabitsToday = habits.filter(
    (habit) =>
      habit.completedDates?.includes(today)
  ).length;

  const habitProgress =
    habits.length > 0
      ? Math.round(
          (completedHabitsToday / habits.length) * 100
        )
      : 0;

  // ==========================================
  // YOUTUBE
  // ==========================================

  const publishedVideos = youtubeVideos.filter(
    (video) => video.status === "Published"
  ).length;

  const totalViews = youtubeVideos.reduce(
    (total, video) =>
      total + Number(video.views || 0),
    0
  );

  const contentProgress =
    youtubeVideos.length > 0
      ? Math.round(
          (publishedVideos / youtubeVideos.length) *
            100
        )
      : 0;

  // ==========================================
  // CLIENTS
  // ==========================================

  const totalClients = clients.length;

  const wonClients = clients.filter(
    (client) => client.status === "Won"
  ).length;

  const activeClients = clients.filter(
    (client) =>
      client.status === "Contacted" ||
      client.status === "Negotiating" ||
      client.status === "In Progress"
  ).length;

  const clientRevenue = clients
    .filter((client) => client.status === "Won")
    .reduce(
      (total, client) =>
        total + Number(client.amount || 0),
      0
    );

  const clientProgress =
    totalClients > 0
      ? Math.round(
          (wonClients / totalClients) * 100
        )
      : 0;

  // ==========================================
  // LEARNING
  // ==========================================

  const learningToday = [
    {
      title: "DSA",
      subtitle: "2 problems",
      icon: Code2,
    },
    {
      title: "Machine Learning",
      subtitle: "1.5 hours",
      icon: Brain,
    },
    {
      title: "Web Development",
      subtitle: "3 hours",
      icon: BookOpen,
    },
  ];

  const totalLearningHours = 6.5;

  // ==========================================
  // OVERALL PROGRESS
  // ==========================================

  const progressValues = [
    taskProgress,
    averageGoalProgress,
    habitProgress,
    contentProgress,
    clientProgress,
  ];

  const overallProgress = Math.round(
    progressValues.reduce(
      (sum, value) => sum + value,
      0
    ) / progressValues.length
  );

  // ==========================================
  // RECENT DATA
  // ==========================================

  const recentTasks = tasks.slice(0, 5);
  const recentClients = clients.slice(0, 4);

  // ==========================================
  // PROGRESS DATA
  // ==========================================

  const progressData = [
    {
      name: "Tasks",
      value: taskProgress,
      icon: CheckSquare,
    },
    {
      name: "Goals",
      value: averageGoalProgress,
      icon: Target,
    },
    {
      name: "Habits",
      value: habitProgress,
      icon: Flame,
    },
    {
      name: "Content",
      value: contentProgress,
      icon: Play,
    },
    {
      name: "Clients",
      value: clientProgress,
      icon: Users,
    },
  ];

  // ==========================================
  // DONUT CIRCLE
  // ==========================================

  const radius = 74;
  const circumference = 2 * Math.PI * radius;

  const progressOffset =
    circumference -
    (overallProgress / 100) * circumference;

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="dashboard-page">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="dashboard-header">
        <div>
          <p className="eyebrow">
            YOUR LIFE OS
          </p>

          <h1>
            Welcome back 👋
          </h1>

          <p className="subtitle">
            Plan your day. Build your future.
          </p>
        </div>

        <div className="dashboard-date">
          <CalendarDays size={18} />

          <span>
            {new Date().toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                month: "long",
                day: "numeric",
              }
            )}
          </span>
        </div>
      </div>

      {/* ======================================
          OVERVIEW CARDS
      ====================================== */}

      <div className="dashboard-stats">

        <div className="dashboard-stat-card">
          <div className="stat-icon">
            <CheckSquare size={22} />
          </div>

          <div className="stat-content">
            <span>Tasks</span>

            <strong>
              {completedTasks}/{tasks.length}
            </strong>

            <small>
              {pendingTasks} remaining
            </small>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">
            <Target size={22} />
          </div>

          <div className="stat-content">
            <span>Goals</span>

            <strong>
              {averageGoalProgress}%
            </strong>

            <small>
              {completedGoals} completed
            </small>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">
            <Flame size={22} />
          </div>

          <div className="stat-content">
            <span>Habits</span>

            <strong>
              {completedHabitsToday}
            </strong>

            <small>
              completed today
            </small>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">
            <Play size={22} />
          </div>

          <div className="stat-content">
            <span>YouTube</span>

            <strong>
              {publishedVideos}
            </strong>

            <small>
              videos published
            </small>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">
            <Users size={22} />
          </div>

          <div className="stat-content">
            <span>Clients</span>

            <strong>
              {wonClients}
            </strong>

            <small>
              {activeClients} active leads
            </small>
          </div>
        </div>

      </div>

      {/* ======================================
          ⭐ MY PROGRESS
      ====================================== */}

      <section className="progress-dashboard-card">

        <div className="progress-dashboard-header">

          <div>
            <p className="eyebrow">
              LIFE PROGRESS
            </p>

            <h2>
              My Progress
            </h2>

            <p>
              See your complete life system
              progress in one place.
            </p>
          </div>

          <div className="progress-header-icon">
            <BarChart3 size={23} />
          </div>

        </div>

        <div className="progress-dashboard-content">

          {/* DONUT */}

          <div className="overall-progress">

            <div className="progress-circle">

              <svg
                width="190"
                height="190"
                viewBox="0 0 190 190"
              >

                <circle
                  cx="95"
                  cy="95"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="14"
                  className="circle-background"
                />

                <circle
                  cx="95"
                  cy="95"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="14"
                  strokeLinecap="round"
                  className="circle-progress"
                  strokeDasharray={
                    circumference
                  }
                  strokeDashoffset={
                    progressOffset
                  }
                  transform="rotate(-90 95 95)"
                />

              </svg>

              <div className="circle-center">

                <strong>
                  {overallProgress}%
                </strong>

                <span>
                  Overall
                </span>

              </div>

            </div>

            <div className="progress-achievement">
              <Trophy size={17} />
              <span>
                Keep building every day
              </span>
            </div>

          </div>

          {/* PROGRESS BARS */}

          <div className="progress-breakdown">

            {progressData.map(
              (item) => {

                const Icon = item.icon;

                return (
                  <div
                    className="progress-row"
                    key={item.name}
                  >

                    <div className="progress-row-top">

                      <div className="progress-name">

                        <div className="progress-small-icon">
                          <Icon size={16} />
                        </div>

                        <strong>
                          {item.name}
                        </strong>

                      </div>

                      <span>
                        {item.value}%
                      </span>

                    </div>

                    <div className="progress-track">

                      <div
                        className="progress-track-fill"
                        style={{
                          width: `${item.value}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

      </section>

      {/* ======================================
          MAIN GRID
      ====================================== */}

      <div className="dashboard-grid">

        {/* ====================================
            TODAY TASKS
        ==================================== */}

        <section className="dashboard-card">

          <div className="dashboard-card-header">

            <div>
              <h2>
                Today's Tasks
              </h2>

              <p>
                Stay focused on what matters.
              </p>
            </div>

            <CheckSquare size={21} />

          </div>

          {recentTasks.length === 0 ? (

            <div className="dashboard-empty">

              <CheckSquare size={35} />

              <h3>
                No tasks yet
              </h3>

              <p>
                Add your first task from My Tasks.
              </p>

            </div>

          ) : (

            <div className="dashboard-task-list">

              {recentTasks.map(
                (task) => (

                  <div
                    className="dashboard-task"
                    key={task.id}
                  >

                    <div
                      className={
                        task.completed
                          ? "task-check completed"
                          : "task-check"
                      }
                    >
                      {task.completed && "✓"}
                    </div>

                    <div className="dashboard-task-info">

                      <strong
                        className={
                          task.completed
                            ? "completed-text"
                            : ""
                        }
                      >
                        {task.title}
                      </strong>

                      <span>
                        {task.category ||
                          "General"}
                      </span>

                    </div>

                    <span
                      className={`priority ${
                        task.priority
                          ? task.priority.toLowerCase()
                          : "normal"
                      }`}
                    >
                      {task.priority ||
                        "Normal"}
                    </span>

                  </div>

                )
              )}

            </div>
          )}

        </section>

        {/* ====================================
            GOALS
        ==================================== */}

        <section className="dashboard-card">

          <div className="dashboard-card-header">

            <div>
              <h2>
                Goals Progress
              </h2>

              <p>
                Keep moving forward.
              </p>
            </div>

            <Target size={21} />

          </div>

          {goals.length === 0 ? (

            <div className="dashboard-empty">

              <Target size={35} />

              <h3>
                No goals yet
              </h3>

              <p>
                Create a goal to start your journey.
              </p>

            </div>

          ) : (

            <div className="dashboard-goals">

              {goals
                .slice(0, 4)
                .map((goal) => {

                  const progress = Math.min(
                    100,
                    Math.max(
                      0,
                      Number(goal.progress || 0)
                    )
                  );

                  return (
                    <div
                      className="dashboard-goal"
                      key={goal.id}
                    >

                      <div className="goal-top">

                        <strong>
                          {goal.title}
                        </strong>

                        <span>
                          {progress}%
                        </span>

                      </div>

                      <div className="progress-bar">

                        <div
                          className="progress-fill"
                          style={{
                            width: `${progress}%`,
                          }}
                        />

                      </div>

                      <small>
                        {goal.category ||
                          "Personal"}
                      </small>

                    </div>
                  );
                })}

            </div>
          )}

        </section>

        {/* ====================================
            LEARNING
        ==================================== */}

        <section className="dashboard-card learning-today-card">

          <div className="dashboard-card-header">

            <div>
              <h2>
                Learning Today
              </h2>

              <p>
                Keep building your skills.
              </p>
            </div>

            <BookOpen size={21} />

          </div>

          <div className="learning-today-list">

            {learningToday.map(
              (item) => {

                const Icon = item.icon;

                return (
                  <div
                    className="learning-today-item"
                    key={item.title}
                  >

                    <div className="overview-icon">
                      <Icon size={19} />
                    </div>

                    <div className="learning-today-info">

                      <strong>
                        {item.title}
                      </strong>

                      <span>
                        {item.subtitle}
                      </span>

                    </div>

                  </div>
                );
              }
            )}

          </div>

          <div className="learning-total">

            <div>
              <Clock size={17} />

              <span>
                Total Learning
              </span>
            </div>

            <strong>
              {totalLearningHours} hours
            </strong>

          </div>

        </section>

        {/* ====================================
            LIFE OVERVIEW
        ==================================== */}

        <section className="dashboard-card life-overview">

          <div className="dashboard-card-header">

            <div>
              <h2>
                Life Overview
              </h2>

              <p>
                Your current progress.
              </p>
            </div>

            <TrendingUp size={21} />

          </div>

          <div className="overview-list">

            <div className="overview-item">

              <div className="overview-icon">
                <BookOpen size={19} />
              </div>

              <div>
                <strong>
                  Study
                </strong>

                <span>
                  Keep learning every day
                </span>
              </div>

            </div>

            <div className="overview-item">

              <div className="overview-icon">
                <Flame size={19} />
              </div>

              <div>
                <strong>
                  Habits
                </strong>

                <span>
                  {completedHabitsToday} habits
                  completed today
                </span>
              </div>

            </div>

            <div className="overview-item">

              <div className="overview-icon">
                <Play size={19} />
              </div>

              <div>
                <strong>
                  Content
                </strong>

                <span>
                  {youtubeVideos.length} videos
                  in pipeline
                </span>
              </div>

            </div>

            <div className="overview-item">

              <div className="overview-icon">
                <Users size={19} />
              </div>

              <div>
                <strong>
                  Clients
                </strong>

                <span>
                  {wonClients} won •{" "}
                  {totalClients} total leads
                </span>
              </div>

            </div>

            <div className="overview-item">

              <div className="overview-icon">
                <Wallet size={19} />
              </div>

              <div>
                <strong>
                  Money
                </strong>

                <span>
                  Rs.{" "}
                  {clientRevenue.toLocaleString()}{" "}
                  earned
                </span>
              </div>

            </div>

          </div>

        </section>

        {/* ====================================
            CLIENT PIPELINE
        ==================================== */}

        <section className="dashboard-card">

          <div className="dashboard-card-header">

            <div>
              <h2>
                Client Pipeline
              </h2>

              <p>
                Turn leads into paying clients.
              </p>
            </div>

            <Users size={21} />

          </div>

          {recentClients.length === 0 ? (

            <div className="dashboard-empty">

              <Users size={35} />

              <h3>
                No clients yet
              </h3>

              <p>
                Start hunting for your first client.
              </p>

            </div>

          ) : (

            <div className="dashboard-task-list">

              {recentClients.map(
                (client) => (

                  <div
                    className="dashboard-task"
                    key={client.id}
                  >

                    <div className="overview-icon">
                      <Users size={18} />
                    </div>

                    <div className="dashboard-task-info">

                      <strong>
                        {client.name ||
                          client.company ||
                          "Unnamed Client"}
                      </strong>

                      <span>
                        {client.service ||
                          client.category ||
                          "Web Development"}
                      </span>

                    </div>

                    <span
                      className={`priority ${
                        client.status
                          ? client.status
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )
                          : "lead"
                      }`}
                    >
                      {client.status ||
                        "Lead"}
                    </span>

                  </div>
                )
              )}

            </div>
          )}

        </section>

        {/* ====================================
            MONEY MINI CARD
        ==================================== */}

        <section className="dashboard-card money-progress-card">

          <div className="dashboard-card-header">

            <div>
              <h2>
                Money Progress
              </h2>

              <p>
                Track what you're earning.
              </p>
            </div>

            <CircleDollarSign size={21} />

          </div>

          <div className="money-big-number">
            Rs. {clientRevenue.toLocaleString()}
          </div>

          <div className="money-stat-row">

            <div>
              <span>
                Won Clients
              </span>

              <strong>
                {wonClients}
              </strong>
            </div>

            <div>
              <span>
                Active Leads
              </span>

              <strong>
                {activeClients}
              </strong>
            </div>

          </div>

          <div className="money-message">
            <Zap size={16} />
            <span>
              Keep hunting. Every conversation
              is a potential opportunity.
            </span>
          </div>

        </section>

        {/* ====================================
            CONTENT PROGRESS
        ==================================== */}

        <section className="dashboard-card">

          <div className="dashboard-card-header">

            <div>
              <h2>
                Content Progress
              </h2>

              <p>
                Build your creator journey.
              </p>
            </div>

            <PenLine size={21} />

          </div>

          <div className="content-stats">

            <div className="content-stat">

              <strong>
                {youtubeVideos.length}
              </strong>

              <span>
                Total Videos
              </span>

            </div>

            <div className="content-stat">

              <strong>
                {publishedVideos}
              </strong>

              <span>
                Published
              </span>

            </div>

            <div className="content-stat">

              <strong>
                {totalViews.toLocaleString()}
              </strong>

              <span>
                Total Views
              </span>

            </div>

          </div>

          <div className="content-progress-bar">

            <div
              style={{
                width: `${contentProgress}%`,
              }}
            />

          </div>

          <div className="content-progress-label">
            <span>
              Publishing progress
            </span>

            <strong>
              {contentProgress}%
            </strong>
          </div>

        </section>

        {/* ====================================
            DAILY FOCUS
        ==================================== */}

        <section className="dashboard-card focus-card">

          <div className="focus-content">

            <div className="focus-icon">
              ✦
            </div>

            <p className="eyebrow">
              TODAY'S FOCUS
            </p>

            <h2>
              Build the life
              <br />
              you want.
            </h2>

            <p>
              One focused day at a time.
              Small actions become big results.
            </p>

          </div>

        </section>

      </div>

      {/* ======================================
          FOOTER SUMMARY
      ====================================== */}

      <div className="dashboard-footer">

        <div>
          <strong>
            {tasks.length}
          </strong>

          <span>
            Total Tasks
          </span>
        </div>

        <div>
          <strong>
            {goals.length}
          </strong>

          <span>
            Active Goals
          </span>
        </div>

        <div>
          <strong>
            {habits.length}
          </strong>

          <span>
            Daily Habits
          </span>
        </div>

        <div>
          <strong>
            {totalViews.toLocaleString()}
          </strong>

          <span>
            YouTube Views
          </span>
        </div>

        <div>
          <strong>
            {wonClients}
          </strong>

          <span>
            Clients Won
          </span>
        </div>

        <div>
          <strong>
            Rs.{" "}
            {clientRevenue.toLocaleString()}
          </strong>

          <span>
            Client Revenue
          </span>
        </div>

      </div>

    </main>
  );
}

export default Dashboard;