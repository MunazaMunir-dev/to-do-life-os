import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const LifeContext = createContext(null);

// ======================================================
// HELPERS
// ======================================================

const getToday = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDateOffset = (days) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const createId = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const safeLoad = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return fallback;
  }
};

// ======================================================
// LIFE PROVIDER
// ======================================================

export function LifeProvider({ children }) {
  // ====================================================
  // TASKS
  // ====================================================

  const [tasks, setTasks] = useState(() =>
    safeLoad("myLifeTasks", [])
  );

  // Deleted task for undo
  const [deletedTask, setDeletedTask] = useState(null);

  // Focus mode
  const [focusMode, setFocusMode] = useState(() =>
    safeLoad("myLifeFocusMode", false)
  );

  // Pomodoro
  const [pomodoro, setPomodoro] = useState(() =>
    safeLoad("myLifePomodoro", {
      taskId: null,
      mode: "focus",
      duration: 25 * 60,
      remaining: 25 * 60,
      running: false,
      sessionsCompleted: 0,
    })
  );

  // Productivity history
  const [productivityHistory, setProductivityHistory] =
    useState(() =>
      safeLoad("myLifeProductivityHistory", {})
    );

  // ====================================================
  // GOALS
  // ====================================================

  const [goals, setGoals] = useState(() =>
    safeLoad("myLifeGoals", [])
  );

  // ====================================================
  // PLANNER
  // ====================================================

  const [plannerItems, setPlannerItems] = useState(() =>
    safeLoad("myLifePlanner", [])
  );

  // ====================================================
  // HABITS
  // ====================================================

  const [habits, setHabits] = useState(() =>
    safeLoad("myLifeHabits", [])
  );

  // ====================================================
  // MONEY
  // ====================================================

  const [moneyTransactions, setMoneyTransactions] =
    useState(() =>
      safeLoad("myLifeMoney", [])
    );

  // ====================================================
  // YOUTUBE
  // ====================================================

  const [youtubeVideos, setYoutubeVideos] =
    useState(() =>
      safeLoad("myLifeYouTube", [])
    );

  // ====================================================
  // SCRIPTS
  // ====================================================

  const [scripts, setScripts] = useState(() =>
    safeLoad("myLifeScripts", [])
  );

  // ====================================================
  // LEARNING
  // ====================================================

  const [learningTracks, setLearningTracks] =
    useState(() =>
      safeLoad("myLifeLearning", [
        {
          id: "dsa",
          title: "DSA",
          progress: 42,
          stat: "87 Problems",
          hours: 34,
          topics: [
            { name: "Arrays", completed: true },
            { name: "Strings", completed: true },
            { name: "Linked List", completed: true },
            { name: "Stack", completed: false },
            { name: "Queue", completed: false },
            { name: "Trees", completed: false },
            { name: "Graphs", completed: false },
            {
              name: "Dynamic Programming",
              completed: false,
            },
          ],
        },

        {
          id: "ml",
          title: "Machine Learning",
          progress: 25,
          stat: "12 Topics",
          hours: 21,
          topics: [
            {
              name: "Python for ML",
              completed: true,
            },
            {
              name: "NumPy",
              completed: true,
            },
            {
              name: "Pandas",
              completed: false,
            },
            {
              name: "Data Cleaning",
              completed: false,
            },
            {
              name: "Visualization",
              completed: false,
            },
            {
              name: "Linear Regression",
              completed: false,
            },
            {
              name: "Classification",
              completed: false,
            },
            {
              name: "Model Evaluation",
              completed: false,
            },
          ],
        },

        {
          id: "web",
          title: "Web Development",
          progress: 85,
          stat: "4 Projects",
          hours: 120,
          topics: [
            {
              name: "HTML & CSS",
              completed: true,
            },
            {
              name: "JavaScript",
              completed: true,
            },
            {
              name: "React",
              completed: true,
            },
            {
              name: "Tailwind CSS",
              completed: true,
            },
            {
              name: "Node.js",
              completed: true,
            },
            {
              name: "Express.js",
              completed: true,
            },
            {
              name: "MongoDB",
              completed: true,
            },
            {
              name: "Deployment",
              completed: false,
            },
          ],
        },

        {
          id: "python",
          title: "Python",
          progress: 38,
          stat: "65 Problems",
          hours: 28,
          topics: [
            {
              name: "Python Basics",
              completed: true,
            },
            {
              name: "Variables & Data Types",
              completed: true,
            },
            {
              name: "Functions",
              completed: true,
            },
            {
              name: "OOP",
              completed: false,
            },
            {
              name: "File Handling",
              completed: false,
            },
            {
              name: "Exception Handling",
              completed: false,
            },
            {
              name: "Libraries",
              completed: false,
            },
            {
              name: "Python Projects",
              completed: false,
            },
          ],
        },

        {
          id: "english",
          title: "English Communication",
          progress: 31,
          stat: "24 Sessions",
          hours: 18,
          topics: [
            {
              name: "Daily Vocabulary",
              completed: true,
            },
            {
              name: "Basic Grammar",
              completed: true,
            },
            {
              name: "Speaking Practice",
              completed: false,
            },
            {
              name: "Listening Practice",
              completed: false,
            },
            {
              name: "Writing Practice",
              completed: false,
            },
            {
              name: "Presentation Skills",
              completed: false,
            },
            {
              name: "Interview English",
              completed: false,
            },
            {
              name: "Fluent Conversation",
              completed: false,
            },
          ],
        },

        {
          id: "trading",
          title: "Trading",
          progress: 18,
          stat: "15 Lessons",
          hours: 12,
          topics: [
            {
              name: "Trading Basics",
              completed: true,
            },
            {
              name: "Market Structure",
              completed: false,
            },
            {
              name: "Support & Resistance",
              completed: false,
            },
            {
              name: "Risk Management",
              completed: false,
            },
            {
              name: "Technical Analysis",
              completed: false,
            },
            {
              name: "Trading Psychology",
              completed: false,
            },
            {
              name: "Backtesting",
              completed: false,
            },
            {
              name: "Trading Strategy",
              completed: false,
            },
          ],
        },
      ])
    );

  // ====================================================
  // STUDY
  // ====================================================

  const [studyMaterials, setStudyMaterials] =
    useState(() =>
      safeLoad("myLifeStudy", [])
    );

  // ====================================================
  // CLIENTS
  // ====================================================

  const [clients, setClients] = useState(() =>
    safeLoad("myLifeClients", [])
  );

  // ====================================================
  // LOCAL STORAGE
  // ====================================================

  useEffect(() => {
    localStorage.setItem(
      "myLifeTasks",
      JSON.stringify(tasks)
    );
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      "myLifeGoals",
      JSON.stringify(goals)
    );
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(
      "myLifePlanner",
      JSON.stringify(plannerItems)
    );
  }, [plannerItems]);

  useEffect(() => {
    localStorage.setItem(
      "myLifeHabits",
      JSON.stringify(habits)
    );
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(
      "myLifeMoney",
      JSON.stringify(moneyTransactions)
    );
  }, [moneyTransactions]);

  useEffect(() => {
    localStorage.setItem(
      "myLifeYouTube",
      JSON.stringify(youtubeVideos)
    );
  }, [youtubeVideos]);

  useEffect(() => {
    localStorage.setItem(
      "myLifeScripts",
      JSON.stringify(scripts)
    );
  }, [scripts]);

  useEffect(() => {
    localStorage.setItem(
      "myLifeLearning",
      JSON.stringify(learningTracks)
    );
  }, [learningTracks]);

  useEffect(() => {
    localStorage.setItem(
      "myLifeStudy",
      JSON.stringify(studyMaterials)
    );
  }, [studyMaterials]);

  useEffect(() => {
    localStorage.setItem(
      "myLifeClients",
      JSON.stringify(clients)
    );
  }, [clients]);

  useEffect(() => {
    localStorage.setItem(
      "myLifeFocusMode",
      JSON.stringify(focusMode)
    );
  }, [focusMode]);

  useEffect(() => {
    localStorage.setItem(
      "myLifePomodoro",
      JSON.stringify(pomodoro)
    );
  }, [pomodoro]);

  useEffect(() => {
    localStorage.setItem(
      "myLifeProductivityHistory",
      JSON.stringify(productivityHistory)
    );
  }, [productivityHistory]);

  // ====================================================
  // TASK FUNCTIONS
  // ====================================================

  const addTask = (task) => {
    const newTask = {
      id: createId(),

      title: task.title?.trim() || "Untitled Task",

      category:
        task.category || "Personal",

      priority:
        task.priority || "Medium",

      dueDate:
        task.dueDate || "",

      time:
        task.time || "",

      notes:
        task.notes || "",

      tags:
        Array.isArray(task.tags)
          ? task.tags
          : [],

      subtasks:
        Array.isArray(task.subtasks)
          ? task.subtasks.map((subtask) => ({
              id: subtask.id || createId(),
              title: subtask.title || "",
              completed:
                Boolean(subtask.completed),
            }))
          : [],

      favorite:
        Boolean(task.favorite),

      pinned:
        Boolean(task.pinned),

      archived: false,

      reminder:
        task.reminder || "",

      completed: false,

      completedAt: null,

      createdAt:
        new Date().toISOString(),

      order:
        typeof task.order === "number"
          ? task.order
          : tasks.length,
    };

    setTasks((prev) => [
      newTask,
      ...prev,
    ]);

    return newTask;
  };

  // ----------------------------------------------------
  // EDIT TASK
  // ----------------------------------------------------

  const editTask = (
    id,
    updatedTask
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              ...updatedTask,

              title:
                updatedTask.title !== undefined
                  ? updatedTask.title.trim()
                  : task.title,

              tags:
                updatedTask.tags !== undefined
                  ? updatedTask.tags
                  : task.tags || [],

              subtasks:
                updatedTask.subtasks !== undefined
                  ? updatedTask.subtasks
                  : task.subtasks || [],
            }
          : task
      )
    );
  };

  // ----------------------------------------------------
  // TOGGLE TASK
  // ----------------------------------------------------

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) {
          return task;
        }

        const completed =
          !task.completed;

        return {
          ...task,

          completed,

          completedAt: completed
            ? new Date().toISOString()
            : null,
        };
      })
    );

    const today = getToday();

    setProductivityHistory((prev) => {
      const current =
        prev[today] || {
          completed: 0,
          focusMinutes: 0,
          xp: 0,
        };

      return {
        ...prev,

        [today]: {
          ...current,

          completed:
            current.completed +
            1,

          xp:
            current.xp +
            10,
        },
      };
    });
  };

  // ----------------------------------------------------
  // DELETE TASK
  // ----------------------------------------------------

  const deleteTask = (id) => {
    setTasks((prev) => {
      const task = prev.find(
        (item) => item.id === id
      );

      if (task) {
        setDeletedTask({
          task,
          deletedAt: Date.now(),
        });
      }

      return prev.filter(
        (item) => item.id !== id
      );
    });
  };

  // ----------------------------------------------------
  // UNDO DELETE
  // ----------------------------------------------------

  const undoDeleteTask = () => {
    if (!deletedTask?.task) {
      return;
    }

    setTasks((prev) => [
      deletedTask.task,
      ...prev,
    ]);

    setDeletedTask(null);
  };

  // ----------------------------------------------------
  // ARCHIVE TASK
  // ----------------------------------------------------

  const archiveTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              archived: true,
            }
          : task
      )
    );
  };

  // ----------------------------------------------------
  // RESTORE ARCHIVED TASK
  // ----------------------------------------------------

  const restoreTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              archived: false,
            }
          : task
      )
    );
  };

  // ----------------------------------------------------
  // CLEAR COMPLETED
  // ----------------------------------------------------

  const clearCompletedTasks = () => {
    setTasks((prev) =>
      prev.filter(
        (task) => !task.completed
      )
    );
  };

  // ----------------------------------------------------
  // PIN TASK
  // ----------------------------------------------------

  const toggleTaskPin = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              pinned: !task.pinned,
            }
          : task
      )
    );
  };

  // ----------------------------------------------------
  // FAVORITE TASK
  // ----------------------------------------------------

  const toggleTaskFavorite = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              favorite: !task.favorite,
            }
          : task
      )
    );
  };

  // ====================================================
  // SUBTASKS
  // ====================================================

  const addSubtask = (
    taskId,
    title
  ) => {
    if (!title?.trim()) {
      return;
    }

    const newSubtask = {
      id: createId(),
      title: title.trim(),
      completed: false,
    };

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,

              subtasks: [
                ...(task.subtasks || []),
                newSubtask,
              ],
            }
          : task
      )
    );
  };

  const toggleSubtask = (
    taskId,
    subtaskId
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,

              subtasks: (
                task.subtasks || []
              ).map((subtask) =>
                subtask.id === subtaskId
                  ? {
                      ...subtask,
                      completed:
                        !subtask.completed,
                    }
                  : subtask
              ),
            }
          : task
      )
    );
  };

  const deleteSubtask = (
    taskId,
    subtaskId
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,

              subtasks: (
                task.subtasks || []
              ).filter(
                (subtask) =>
                  subtask.id !== subtaskId
              ),
            }
          : task
      )
    );
  };

  // ====================================================
  // TAGS
  // ====================================================

  const addTaskTag = (
    taskId,
    tag
  ) => {
    if (!tag?.trim()) {
      return;
    }

    const cleanTag =
      tag.trim();

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId) {
          return task;
        }

        const tags =
          task.tags || [];

        if (tags.includes(cleanTag)) {
          return task;
        }

        return {
          ...task,
          tags: [
            ...tags,
            cleanTag,
          ],
        };
      })
    );
  };

  const removeTaskTag = (
    taskId,
    tag
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,

              tags: (
                task.tags || []
              ).filter(
                (item) =>
                  item !== tag
              ),
            }
          : task
      )
    );
  };

  // ====================================================
  // DRAG / DROP ORDER
  // ====================================================

  const reorderTasks = (
    draggedId,
    targetId
  ) => {
    setTasks((prev) => {
      const items = [...prev];

      const draggedIndex =
        items.findIndex(
          (task) =>
            task.id === draggedId
        );

      const targetIndex =
        items.findIndex(
          (task) =>
            task.id === targetId
        );

      if (
        draggedIndex === -1 ||
        targetIndex === -1
      ) {
        return prev;
      }

      const [
        draggedTask,
      ] = items.splice(
        draggedIndex,
        1
      );

      items.splice(
        targetIndex,
        0,
        draggedTask
      );

      return items.map(
        (task, index) => ({
          ...task,
          order: index,
        })
      );
    });
  };

  // ====================================================
  // REMINDERS
  // ====================================================

  const setTaskReminder = (
    taskId,
    reminder
  ) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              reminder,
            }
          : task
      )
    );
  };

  const requestNotificationPermission =
    async () => {
      if (
        typeof window === "undefined" ||
        !("Notification" in window)
      ) {
        return "unsupported";
      }

      if (
        Notification.permission ===
        "granted"
      ) {
        return "granted";
      }

      return Notification.requestPermission();
    };

  const sendTaskNotification = (
    task
  ) => {
    if (
      typeof window === "undefined" ||
      !("Notification" in window)
    ) {
      return;
    }

    if (
      Notification.permission !==
      "granted"
    ) {
      return;
    }

    new Notification(
      "Task Reminder",
      {
        body: task.title,
      }
    );
  };

  // Check reminders
  useEffect(() => {
    const checkReminders = () => {
      const now =
        new Date();

      tasks.forEach((task) => {
        if (
          task.completed ||
          !task.reminder
        ) {
          return;
        }

        const reminderTime =
          new Date(
            task.reminder
          );

        if (
          Math.abs(
            now.getTime() -
              reminderTime.getTime()
          ) < 30000
        ) {
          sendTaskNotification(
            task
          );
        }
      });
    };

    const interval =
      setInterval(
        checkReminders,
        30000
      );

    return () =>
      clearInterval(interval);
  }, [tasks]);

  // ====================================================
  // POMODORO
  // ====================================================

  const startPomodoro = (
    taskId,
    minutes = 25
  ) => {
    const duration =
      minutes * 60;

    setPomodoro({
      taskId,
      mode: "focus",
      duration,
      remaining: duration,
      running: true,
      sessionsCompleted:
        pomodoro.sessionsCompleted ||
        0,
    });

    setFocusMode(true);
  };

  const pausePomodoro = () => {
    setPomodoro((prev) => ({
      ...prev,
      running: false,
    }));
  };

  const resumePomodoro = () => {
    setPomodoro((prev) => ({
      ...prev,
      running: true,
    }));
  };

  const resetPomodoro = () => {
    setPomodoro({
      taskId: null,
      mode: "focus",
      duration: 25 * 60,
      remaining: 25 * 60,
      running: false,
      sessionsCompleted: 0,
    });

    setFocusMode(false);
  };

  const completePomodoro = () => {
    const minutes = Math.round(
      pomodoro.duration / 60
    );

    const today = getToday();

    setProductivityHistory(
      (prev) => {
        const current =
          prev[today] || {
            completed: 0,
            focusMinutes: 0,
            xp: 0,
          };

        return {
          ...prev,

          [today]: {
            ...current,

            focusMinutes:
              current.focusMinutes +
              minutes,

            xp:
              current.xp +
              minutes,
          },
        };
      }
    );

    setPomodoro((prev) => ({
      ...prev,

      remaining: 0,

      running: false,

      sessionsCompleted:
        prev.sessionsCompleted +
        1,
    }));
  };

  // ====================================================
  // POMODORO TIMER
  // ====================================================

  useEffect(() => {
    if (!pomodoro.running) {
      return;
    }

    const timer =
      setInterval(() => {
        setPomodoro((prev) => {
          if (
            prev.remaining <= 1
          ) {
            return {
              ...prev,
              remaining: 0,
              running: false,
            };
          }

          return {
            ...prev,
            remaining:
              prev.remaining - 1,
          };
        });
      }, 1000);

    return () =>
      clearInterval(timer);
  }, [pomodoro.running]);

  // Automatically finish Pomodoro
  useEffect(() => {
    if (
      pomodoro.remaining === 0 &&
      pomodoro.duration > 0 &&
      !pomodoro.running
    ) {
      if (
        pomodoro.sessionsCompleted <
        1000
      ) {
        completePomodoro();
      }
    }
  }, [
    pomodoro.remaining,
  ]);

  // ====================================================
  // FOCUS MODE
  // ====================================================

  const toggleFocusMode = () => {
    setFocusMode(
      (prev) => !prev
    );
  };

  // ====================================================
  // TASK ANALYTICS
  // ====================================================

  const taskAnalytics = useMemo(() => {
    const activeTasks =
      tasks.filter(
        (task) =>
          !task.archived
      );

    const total =
      activeTasks.length;

    const completed =
      activeTasks.filter(
        (task) =>
          task.completed
      ).length;

    const pending =
      activeTasks.filter(
        (task) =>
          !task.completed
      ).length;

    const today =
      getToday();

    const tomorrow =
      getDateOffset(1);

    const weekEnd =
      getDateOffset(7);

    const todayTasks =
      activeTasks.filter(
        (task) =>
          task.dueDate === today
      );

    const tomorrowTasks =
      activeTasks.filter(
        (task) =>
          task.dueDate ===
          tomorrow
      );

    const weekTasks =
      activeTasks.filter(
        (task) =>
          task.dueDate >= today &&
          task.dueDate <= weekEnd
      );

    const overdue =
      activeTasks.filter(
        (task) =>
          !task.completed &&
          task.dueDate &&
          task.dueDate < today
      ).length;

    const highPriority =
      activeTasks.filter(
        (task) =>
          String(
            task.priority
          ).toLowerCase() ===
            "high" &&
          !task.completed
      ).length;

    const todayCompleted =
      todayTasks.filter(
        (task) =>
          task.completed
      ).length;

    const completionRate =
      total > 0
        ? Math.round(
            (completed /
              total) *
              100
          )
        : 0;

    const todayProgress =
      todayTasks.length > 0
        ? Math.round(
            (todayCompleted /
              todayTasks.length) *
              100
          )
        : 0;

    return {
      total,
      completed,
      pending,
      overdue,
      highPriority,
      todayTasks,
      tomorrowTasks,
      weekTasks,
      todayCompleted,
      completionRate,
      todayProgress,
    };
  }, [tasks]);

  // ====================================================
  // XP
  // ====================================================

  const totalXP = useMemo(() => {
    const taskXP =
      tasks.filter(
        (task) =>
          task.completed
      ).length * 10;

    const historyXP =
      Object.values(
        productivityHistory
      ).reduce(
        (total, day) =>
          total +
          Number(day.xp || 0),
        0
      );

    return taskXP + historyXP;
  }, [
    tasks,
    productivityHistory,
  ]);

  // ====================================================
  // PRODUCTIVITY SCORE
  // ====================================================

  const productivityScore =
    useMemo(() => {
      const completion =
        taskAnalytics.completionRate;

      const today =
        taskAnalytics.todayProgress;

      const focusMinutes =
        productivityHistory[
          getToday()
        ]?.focusMinutes || 0;

      const focusScore =
        Math.min(
          100,
          Math.round(
            (focusMinutes /
              120) *
              100
          )
        );

      return Math.round(
        completion * 0.4 +
          today * 0.3 +
          focusScore * 0.3
      );
    }, [
      taskAnalytics,
      productivityHistory,
    ]);

  // ====================================================
  // STREAK
  // ====================================================

  const currentStreak =
    useMemo(() => {
      let streak = 0;

      for (
        let i = 0;
        i < 365;
        i++
      ) {
        const date =
          getDateOffset(-i);

        const completed =
          tasks.some(
            (task) => {
              if (
                !task.completed ||
                !task.completedAt
              ) {
                return false;
              }

              const completedDate =
                new Date(
                  task.completedAt
                );

              const year =
                completedDate.getFullYear();

              const month =
                String(
                  completedDate.getMonth() +
                    1
                ).padStart(
                  2,
                  "0"
                );

              const day =
                String(
                  completedDate.getDate()
                ).padStart(
                  2,
                  "0"
                );

              return (
                `${year}-${month}-${day}` ===
                date
              );
            }
          );

        if (completed) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    }, [tasks]);

  // ====================================================
  // DAILY ANALYTICS
  // ====================================================

  const getDailyAnalytics = (
    days = 7
  ) => {
    const result = [];

    for (
      let i = days - 1;
      i >= 0;
      i--
    ) {
      const date =
        getDateOffset(-i);

      const completed =
        tasks.filter(
          (task) => {
            if (
              !task.completed ||
              !task.completedAt
            ) {
              return false;
            }

            const completedDate =
              new Date(
                task.completedAt
              );

            const year =
              completedDate.getFullYear();

            const month =
              String(
                completedDate.getMonth() +
                  1
              ).padStart(
                2,
                "0"
              );

            const day =
              String(
                completedDate.getDate()
              ).padStart(
                2,
                "0"
              );

            return (
              `${year}-${month}-${day}` ===
              date
            );
          }
        ).length;

      result.push({
        date,
        completed,
        focusMinutes:
          productivityHistory[
            date
          ]?.focusMinutes || 0,
        xp:
          productivityHistory[
            date
          ]?.xp || 0,
      });
    }

    return result;
  };

  // ====================================================
  // EXPORT JSON
  // ====================================================

  const exportTasksJSON = () => {
    const data =
      JSON.stringify(
        tasks,
        null,
        2
      );

    const blob =
      new Blob(
        [data],
        {
          type: "application/json",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const anchor =
      document.createElement(
        "a"
      );

    anchor.href = url;
    anchor.download =
      `my-life-tasks-${getToday()}.json`;

    anchor.click();

    URL.revokeObjectURL(
      url
    );
  };

  // ====================================================
  // EXPORT CSV
  // ====================================================

  const exportTasksCSV = () => {
    const headers = [
      "Title",
      "Category",
      "Priority",
      "Due Date",
      "Time",
      "Completed",
      "Pinned",
      "Favorite",
      "Tags",
      "Notes",
    ];

    const rows =
      tasks.map(
        (task) => [
          task.title,
          task.category,
          task.priority,
          task.dueDate,
          task.time,
          task.completed
            ? "Yes"
            : "No",
          task.pinned
            ? "Yes"
            : "No",
          task.favorite
            ? "Yes"
            : "No",
          (task.tags || []).join(
            " | "
          ),
          task.notes || "",
        ]
      );

    const csv = [
      headers,
      ...rows,
    ]
      .map(
        (row) =>
          row
            .map(
              (value) =>
                `"${String(
                  value ?? ""
                ).replace(
                  /"/g,
                  '""'
                )}"`
            )
            .join(",")
      )
      .join("\n");

    const blob =
      new Blob(
        [csv],
        {
          type: "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const anchor =
      document.createElement(
        "a"
      );

    anchor.href = url;

    anchor.download =
      `my-life-tasks-${getToday()}.csv`;

    anchor.click();

    URL.revokeObjectURL(
      url
    );
  };

  // ====================================================
  // GOALS
  // ====================================================

  const addGoal = (goal) => {
    const newGoal = {
      id: createId(),
      title: goal.title,
      category:
        goal.category ||
        "Personal",
      deadline:
        goal.deadline || "",
      description:
        goal.description || "",
      progress: 0,
      completed: false,
      createdAt:
        new Date().toISOString(),
    };

    setGoals((prev) => [
      newGoal,
      ...prev,
    ]);
  };

  const updateGoalProgress = (
    id,
    progress
  ) => {
    const newProgress =
      Math.min(
        100,
        Math.max(
          0,
          Number(progress)
        )
      );

    setGoals((prev) =>
      prev.map((goal) =>
        goal.id === id
          ? {
              ...goal,
              progress:
                newProgress,
              completed:
                newProgress ===
                100,
            }
          : goal
      )
    );
  };

  const deleteGoal = (id) => {
    setGoals((prev) =>
      prev.filter(
        (goal) =>
          goal.id !== id
      )
    );
  };

  // ====================================================
  // PLANNER
  // ====================================================

  const addPlannerItem = (
    item
  ) => {
    const newItem = {
      id: createId(),
      title: item.title,
      date: item.date,
      category:
        item.category ||
        "Personal",
      completed: false,
      createdAt:
        new Date().toISOString(),
    };

    setPlannerItems(
      (prev) => [
        ...prev,
        newItem,
      ]
    );
  };

  const togglePlannerItem = (
    id
  ) => {
    setPlannerItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              completed:
                !item.completed,
            }
          : item
      )
    );
  };

  const deletePlannerItem = (
    id
  ) => {
    setPlannerItems((prev) =>
      prev.filter(
        (item) =>
          item.id !== id
      )
    );
  };

  // ====================================================
  // HABITS
  // ====================================================

  const addHabit = (habit) => {
    const newHabit = {
      id: createId(),
      name: habit.name,
      category:
        habit.category ||
        "Personal",
      completedDates: [],
      createdAt:
        new Date().toISOString(),
    };

    setHabits((prev) => [
      ...prev,
      newHabit,
    ]);
  };

  const toggleHabit = (
    id,
    date
  ) => {
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== id) {
          return habit;
        }

        const alreadyCompleted =
          habit.completedDates.includes(
            date
          );

        return {
          ...habit,

          completedDates:
            alreadyCompleted
              ? habit.completedDates.filter(
                  (completedDate) =>
                    completedDate !==
                    date
                )
              : [
                  ...habit.completedDates,
                  date,
                ],
        };
      })
    );
  };

  const deleteHabit = (id) => {
    setHabits((prev) =>
      prev.filter(
        (habit) =>
          habit.id !== id
      )
    );
  };

  // ====================================================
  // MONEY
  // ====================================================

  const addMoneyTransaction = (
    transaction
  ) => {
    const newTransaction = {
      id: createId(),
      title: transaction.title,
      amount:
        Number(
          transaction.amount
        ) || 0,
      type: transaction.type,
      category:
        transaction.category,
      date: transaction.date,
      createdAt:
        new Date().toISOString(),
    };

    setMoneyTransactions(
      (prev) => [
        newTransaction,
        ...prev,
      ]
    );
  };

  const deleteMoneyTransaction = (
    id
  ) => {
    setMoneyTransactions(
      (prev) =>
        prev.filter(
          (item) =>
            item.id !== id
        )
    );
  };

  // ====================================================
  // YOUTUBE
  // ====================================================

  const addYoutubeVideo = (
    video
  ) => {
    const newVideo = {
      id: createId(),
      title: video.title,
      category:
        video.category ||
        "Vlog",
      status:
        video.status ||
        "Idea",
      publishDate:
        video.publishDate ||
        "",
      views: 0,
      createdAt:
        new Date().toISOString(),
    };

    setYoutubeVideos(
      (prev) => [
        newVideo,
        ...prev,
      ]
    );
  };

  const updateYoutubeStatus = (
    id,
    status
  ) => {
    setYoutubeVideos((prev) =>
      prev.map((video) =>
        video.id === id
          ? {
              ...video,
              status,
            }
          : video
      )
    );
  };

  const updateYoutubeViews = (
    id,
    views
  ) => {
    setYoutubeVideos((prev) =>
      prev.map((video) =>
        video.id === id
          ? {
              ...video,
              views:
                Number(views) ||
                0,
            }
          : video
      )
    );
  };

  const deleteYoutubeVideo = (
    id
  ) => {
    setYoutubeVideos((prev) =>
      prev.filter(
        (video) =>
          video.id !== id
      )
    );
  };

  // ====================================================
  // SCRIPTS
  // ====================================================

  const addScript = (script) => {
    const newScript = {
      id: createId(),
      title: script.title,
      type: script.type,
      content:
        script.content || "",
      createdAt:
        new Date().toISOString(),
    };

    setScripts((prev) => [
      newScript,
      ...prev,
    ]);
  };

  const updateScript = (
    id,
    updatedScript
  ) => {
    setScripts((prev) =>
      prev.map((script) =>
        script.id === id
          ? {
              ...script,
              ...updatedScript,
            }
          : script
      )
    );
  };

  const deleteScript = (
    id
  ) => {
    setScripts((prev) =>
      prev.filter(
        (script) =>
          script.id !== id
      )
    );
  };

  // ====================================================
  // LEARNING
  // ====================================================

  const toggleLearningTopic = (
    trackId,
    topicIndex
  ) => {
    setLearningTracks(
      (prevTracks) =>
        prevTracks.map(
          (track) => {
            if (
              track.id !==
              trackId
            ) {
              return track;
            }

            const updatedTopics =
              track.topics.map(
                (
                  topic,
                  index
                ) =>
                  index ===
                  topicIndex
                    ? {
                        ...topic,
                        completed:
                          !topic.completed,
                      }
                    : topic
              );

            const completedTopics =
              updatedTopics.filter(
                (topic) =>
                  topic.completed
              ).length;

            const newProgress =
              updatedTopics.length >
              0
                ? Math.round(
                    (completedTopics /
                      updatedTopics.length) *
                      100
                  )
                : 0;

            return {
              ...track,
              topics:
                updatedTopics,
              progress:
                newProgress,
              stat: `${completedTopics} Topics`,
            };
          }
        )
    );
  };

  const updateLearningProgress = (
    id,
    progress
  ) => {
    const newProgress =
      Math.min(
        100,
        Math.max(
          0,
          Number(progress)
        )
      );

    setLearningTracks(
      (prev) =>
        prev.map((track) =>
          track.id === id
            ? {
                ...track,
                progress:
                  newProgress,
              }
            : track
        )
    );
  };

  const updateLearningHours = (
    id,
    hours
  ) => {
    setLearningTracks(
      (prev) =>
        prev.map((track) =>
          track.id === id
            ? {
                ...track,
                hours:
                  Number(hours) ||
                  0,
              }
            : track
        )
    );
  };

  // ====================================================
  // STUDY MATERIALS
  // ====================================================

  const addStudyMaterial = (
    material
  ) => {
    const newMaterial = {
      id: createId(),

      title:
        material.title ||
        material.fileName ||
        "Untitled Study Material",

      category:
        material.category ||
        "General",

      description:
        material.description ||
        "",

      fileName:
        material.fileName ||
        "",

      fileData:
        material.fileData ||
        "",

      fileSize:
        material.fileSize ||
        0,

      topics:
        Array.isArray(
          material.topics
        )
          ? material.topics
          : [],

      createdAt:
        new Date().toISOString(),
    };

    setStudyMaterials(
      (prev) => [
        newMaterial,
        ...prev,
      ]
    );
  };

  const deleteStudyMaterial = (
    id
  ) => {
    setStudyMaterials(
      (prev) =>
        prev.filter(
          (material) =>
            material.id !== id
        )
    );
  };

  const addStudyTopic = (
    materialId,
    topicName
  ) => {
    if (!topicName?.trim()) {
      return;
    }

    setStudyMaterials(
      (prev) =>
        prev.map(
          (material) => {
            if (
              material.id !==
              materialId
            ) {
              return material;
            }

            const newTopic = {
              id: createId(),
              name:
                topicName.trim(),
              completed: false,
            };

            return {
              ...material,

              topics: [
                ...(material.topics ||
                  []),
                newTopic,
              ],
            };
          }
        )
    );
  };

  const deleteStudyTopic = (
    materialId,
    topicId
  ) => {
    setStudyMaterials(
      (prev) =>
        prev.map(
          (material) =>
            material.id ===
            materialId
              ? {
                  ...material,

                  topics: (
                    material.topics ||
                    []
                  ).filter(
                    (topic) =>
                      topic.id !==
                      topicId
                  ),
                }
              : material
        )
    );
  };

  const toggleStudyTopic = (
    materialId,
    topicId
  ) => {
    setStudyMaterials(
      (prev) =>
        prev.map(
          (material) => {
            if (
              material.id !==
              materialId
            ) {
              return material;
            }

            return {
              ...material,

              topics: (
                material.topics ||
                []
              ).map(
                (topic) =>
                  topic.id ===
                  topicId
                    ? {
                        ...topic,
                        completed:
                          !topic.completed,
                      }
                    : topic
              ),
            };
          }
        )
    );
  };

  const updateStudyMaterial = (
    id,
    updatedMaterial
  ) => {
    setStudyMaterials(
      (prev) =>
        prev.map(
          (material) =>
            material.id === id
              ? {
                  ...material,
                  ...updatedMaterial,
                }
              : material
        )
    );
  };

  const getStudyProgress = (
    material
  ) => {
    const topics =
      material?.topics || [];

    if (
      topics.length === 0
    ) {
      return 0;
    }

    const completed =
      topics.filter(
        (topic) =>
          topic.completed
      ).length;

    return Math.round(
      (completed /
        topics.length) *
        100
    );
  };

  // ====================================================
  // CLIENTS
  // ====================================================

  const addClient = (client) => {
    const newClient = {
      id: createId(),

      name: client.name,

      platform:
        client.platform ||
        "LinkedIn",

      service:
        client.service ||
        "Web Development",

      status:
        client.status ||
        "Lead",

      amount:
        Number(client.amount) ||
        0,

      date:
        client.date || "",

      notes:
        client.notes || "",

      createdAt:
        new Date().toISOString(),
    };

    setClients((prev) => [
      newClient,
      ...prev,
    ]);
  };

  const updateClient = (
    id,
    updatedClient
  ) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === id
          ? {
              ...client,
              ...updatedClient,

              amount:
                updatedClient.amount !==
                undefined
                  ? Number(
                      updatedClient.amount
                    ) || 0
                  : client.amount,
            }
          : client
      )
    );
  };

  const updateClientStatus = (
    id,
    status
  ) => {
    setClients((prev) =>
      prev.map((client) =>
        client.id === id
          ? {
              ...client,
              status,
            }
          : client
      )
    );
  };

  const deleteClient = (id) => {
    setClients((prev) =>
      prev.filter(
        (client) =>
          client.id !== id
      )
    );
  };

  // ====================================================
  // CONTEXT
  // ====================================================

  return (
    <LifeContext.Provider
      value={{
        // ----------------------------------------------
        // TASKS
        // ----------------------------------------------

        tasks,

        addTask,

        editTask,

        toggleTask,

        deleteTask,

        undoDeleteTask,

        deletedTask,

        clearCompletedTasks,

        archiveTask,

        restoreTask,

        toggleTaskPin,

        toggleTaskFavorite,

        reorderTasks,

        addSubtask,

        toggleSubtask,

        deleteSubtask,

        addTaskTag,

        removeTaskTag,

        setTaskReminder,

        requestNotificationPermission,

        sendTaskNotification,

        // ----------------------------------------------
        // POMODORO
        // ----------------------------------------------

        pomodoro,

        startPomodoro,

        pausePomodoro,

        resumePomodoro,

        resetPomodoro,

        completePomodoro,

        // ----------------------------------------------
        // FOCUS MODE
        // ----------------------------------------------

        focusMode,

        setFocusMode,

        toggleFocusMode,

        // ----------------------------------------------
        // ANALYTICS
        // ----------------------------------------------

        taskAnalytics,

        productivityHistory,

        getDailyAnalytics,

        productivityScore,

        currentStreak,

        totalXP,

        // ----------------------------------------------
        // EXPORT
        // ----------------------------------------------

        exportTasksJSON,

        exportTasksCSV,

        // ----------------------------------------------
        // GOALS
        // ----------------------------------------------

        goals,

        addGoal,

        updateGoalProgress,

        deleteGoal,

        // ----------------------------------------------
        // PLANNER
        // ----------------------------------------------

        plannerItems,

        addPlannerItem,

        togglePlannerItem,

        deletePlannerItem,

        // ----------------------------------------------
        // HABITS
        // ----------------------------------------------

        habits,

        addHabit,

        toggleHabit,

        deleteHabit,

        // ----------------------------------------------
        // MONEY
        // ----------------------------------------------

        moneyTransactions,

        addMoneyTransaction,

        deleteMoneyTransaction,

        // ----------------------------------------------
        // YOUTUBE
        // ----------------------------------------------

        youtubeVideos,

        addYoutubeVideo,

        updateYoutubeStatus,

        updateYoutubeViews,

        deleteYoutubeVideo,

        // ----------------------------------------------
        // SCRIPTS
        // ----------------------------------------------

        scripts,

        addScript,

        updateScript,

        deleteScript,

        // ----------------------------------------------
        // LEARNING
        // ----------------------------------------------

        learningTracks,

        toggleLearningTopic,

        updateLearningProgress,

        updateLearningHours,

        // ----------------------------------------------
        // STUDY
        // ----------------------------------------------

        studyMaterials,

        addStudyMaterial,

        deleteStudyMaterial,

        addStudyTopic,

        deleteStudyTopic,

        toggleStudyTopic,

        updateStudyMaterial,

        getStudyProgress,

        // ----------------------------------------------
        // CLIENTS
        // ----------------------------------------------

        clients,

        addClient,

        updateClient,

        updateClientStatus,

        deleteClient,
      }}
    >
      {children}
    </LifeContext.Provider>
  );
}

// ======================================================
// CUSTOM HOOK
// ======================================================

export function useLife() {
  const context =
    useContext(LifeContext);

  if (!context) {
    throw new Error(
      "useLife must be used inside LifeProvider"
    );
  }

  return context;
}