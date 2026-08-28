// import React, { useEffect, useMemo, useState } from "react";
// import {
//   Plus,
//   Trash2,
//   Check,
//   Circle,
//   Search,
//   CalendarDays,
//   Clock3,
//   Star,
//   Pencil,
//   X,
//   ListTodo,
//   CheckCircle2,
//   AlertCircle,
//   Flame,
//   ChevronDown,
//   RotateCcw,
//   Pin,
//   Timer,
//   BarChart3,
//   Tag,
//   Bell,
//   Archive,
//   Download,
//   Target,
//   Zap,
//   Maximize2,
//   Minimize2,
//   ChevronLeft,
//   ChevronRight,
//   GripVertical,
//   Undo2,
//   Trophy,
//   Layers,
//   Play,
//   Pause,
//   RotateCcw as ResetIcon,
// } from "lucide-react";

// import { useLife } from "../context/LifeContext";
// import "./Tasks.css";

// /* =========================================================
//    HELPERS
// ========================================================= */

// function getToday() {
//   const date = new Date();

//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// }

// function getTomorrow() {
//   const date = new Date();
//   date.setDate(date.getDate() + 1);

//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const day = String(date.getDate()).padStart(2, "0");

//   return `${year}-${month}-${day}`;
// }

// function formatToday() {
//   return new Date().toLocaleDateString("en-US", {
//     weekday: "long",
//     month: "long",
//     day: "numeric",
//     year: "numeric",
//   });
// }

// function formatDate(dateString) {
//   if (!dateString) return "";

//   const date = new Date(`${dateString}T00:00:00`);

//   return date.toLocaleDateString("en-US", {
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// }

// function createId() {
//   return `${Date.now()}-${Math.random()
//     .toString(36)
//     .slice(2)}`;
// }

// function getWeekStart(date = new Date()) {
//   const result = new Date(date);
//   const day = result.getDay();

//   const diff = day === 0 ? -6 : 1 - day;

//   result.setDate(result.getDate() + diff);
//   result.setHours(0, 0, 0, 0);

//   return result;
// }

// function getWeekDates() {
//   const start = getWeekStart();

//   return Array.from({ length: 7 }, (_, index) => {
//     const date = new Date(start);
//     date.setDate(start.getDate() + index);

//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");

//     return {
//       value: `${year}-${month}-${day}`,
//       date,
//     };
//   });
// }

// function isThisWeek(dateString) {
//   if (!dateString) return false;

//   const target = new Date(`${dateString}T00:00:00`);
//   const start = getWeekStart();

//   const end = new Date(start);
//   end.setDate(start.getDate() + 7);

//   return target >= start && target < end;
// }

// function escapeCsv(value) {
//   const stringValue = String(value ?? "");

//   return `"${stringValue.replace(/"/g, '""')}"`;
// }

// /* =========================================================
//    COMPONENT
// ========================================================= */

// function Tasks() {
//   const {
//     tasks = [],
//     addTask,
//     toggleTask,
//     deleteTask,
//   } = useLife();

//   /* =======================================================
//      BASIC FORM
//   ======================================================= */

//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("Personal");
//   const [priority, setPriority] = useState("Medium");
//   const [dueDate, setDueDate] = useState("");
//   const [time, setTime] = useState("");
//   const [notes, setNotes] = useState("");
//   const [tagsInput, setTagsInput] = useState("");
//   const [reminder, setReminder] = useState("");

//   /* =======================================================
//      CONTROLS
//   ======================================================= */

//   const [search, setSearch] = useState("");
//   const [filter, setFilter] = useState("All");
//   const [sortBy, setSortBy] = useState("Priority");

//   /* =======================================================
//      EXTRA TASK DATA
//   ======================================================= */

//   const [favoriteTasks, setFavoriteTasks] = useState([]);
//   const [pinnedTasks, setPinnedTasks] = useState([]);
//   const [archivedTasks, setArchivedTasks] = useState([]);
//   const [taskDetails, setTaskDetails] = useState({});
//   const [taskOrder, setTaskOrder] = useState([]);

//   /* =======================================================
//      UI STATES
//   ======================================================= */

//   const [editingTask, setEditingTask] = useState(null);
//   const [showAnalytics, setShowAnalytics] = useState(false);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [focusMode, setFocusMode] = useState(false);
//   const [showArchived, setShowArchived] = useState(false);

//   /* =======================================================
//      SUBTASK FORM
//   ======================================================= */

//   const [subtaskInput, setSubtaskInput] = useState("");

//   /* =======================================================
//      TIMER
//   ======================================================= */

//   const [timerTaskId, setTimerTaskId] = useState(null);
//   const [timerSeconds, setTimerSeconds] = useState(25 * 60);
//   const [timerRunning, setTimerRunning] = useState(false);

//   /* =======================================================
//      UNDO DELETE
//   ======================================================= */

//   const [deletedTask, setDeletedTask] = useState(null);

//   /* =======================================================
//      CALENDAR
//   ======================================================= */

//   const [calendarDate, setCalendarDate] = useState(
//     new Date()
//   );

//   const today = getToday();
//   const tomorrow = getTomorrow();

//   /* =======================================================
//      LOAD LOCAL DATA
//   ======================================================= */

//   useEffect(() => {
//     try {
//       const savedFavorites = localStorage.getItem(
//         "myLifeFavoriteTasks"
//       );

//       const savedPinned = localStorage.getItem(
//         "myLifePinnedTasks"
//       );

//       const savedArchived = localStorage.getItem(
//         "myLifeArchivedTasks"
//       );

//       const savedDetails = localStorage.getItem(
//         "myLifeTaskDetails"
//       );

//       const savedOrder = localStorage.getItem(
//         "myLifeTaskOrder"
//       );

//       if (savedFavorites) {
//         setFavoriteTasks(JSON.parse(savedFavorites));
//       }

//       if (savedPinned) {
//         setPinnedTasks(JSON.parse(savedPinned));
//       }

//       if (savedArchived) {
//         setArchivedTasks(JSON.parse(savedArchived));
//       }

//       if (savedDetails) {
//         setTaskDetails(JSON.parse(savedDetails));
//       }

//       if (savedOrder) {
//         setTaskOrder(JSON.parse(savedOrder));
//       }
//     } catch (error) {
//       console.error(
//         "Task upgraded data loading error:",
//         error
//       );
//     }
//   }, []);

//   /* =======================================================
//      SAVE LOCAL DATA
//   ======================================================= */

//   useEffect(() => {
//     localStorage.setItem(
//       "myLifeFavoriteTasks",
//       JSON.stringify(favoriteTasks)
//     );
//   }, [favoriteTasks]);

//   useEffect(() => {
//     localStorage.setItem(
//       "myLifePinnedTasks",
//       JSON.stringify(pinnedTasks)
//     );
//   }, [pinnedTasks]);

//   useEffect(() => {
//     localStorage.setItem(
//       "myLifeArchivedTasks",
//       JSON.stringify(archivedTasks)
//     );
//   }, [archivedTasks]);

//   useEffect(() => {
//     localStorage.setItem(
//       "myLifeTaskDetails",
//       JSON.stringify(taskDetails)
//     );
//   }, [taskDetails]);

//   useEffect(() => {
//     localStorage.setItem(
//       "myLifeTaskOrder",
//       JSON.stringify(taskOrder)
//     );
//   }, [taskOrder]);

//   /* =======================================================
//      KEEP ORDER IN SYNC
//   ======================================================= */

//   useEffect(() => {
//     if (!tasks.length) return;

//     setTaskOrder((previous) => {
//       const existingIds = new Set(
//         previous.map(String)
//       );

//       const currentIds = tasks.map((task) =>
//         String(task.id)
//       );

//       const newIds = currentIds.filter(
//         (id) => !existingIds.has(id)
//       );

//       const filtered = previous.filter((id) =>
//         currentIds.includes(String(id))
//       );

//       return [...filtered, ...newIds];
//     });
//   }, [tasks]);

//   /* =======================================================
//      TIMER
//   ======================================================= */

//   useEffect(() => {
//     if (!timerRunning) return;

//     const interval = setInterval(() => {
//       setTimerSeconds((previous) => {
//         if (previous <= 1) {
//           clearInterval(interval);
//           setTimerRunning(false);

//           if (
//             typeof window !== "undefined" &&
//             "Notification" in window &&
//             Notification.permission === "granted"
//           ) {
//             new Notification("Focus session complete 🎉", {
//               body: "Great work. Take a short break.",
//             });
//           }

//           return 0;
//         }

//         return previous - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [timerRunning]);

//   /* =======================================================
//      REQUEST NOTIFICATION
//   ======================================================= */

//   function requestNotifications() {
//     if (
//       typeof window !== "undefined" &&
//       "Notification" in window
//     ) {
//       Notification.requestPermission();
//     }
//   }

//   /* =======================================================
//      FORMAT TIMER
//   ======================================================= */

//   function formatTimer(seconds) {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;

//     return `${String(minutes).padStart(
//       2,
//       "0"
//     )}:${String(remainingSeconds).padStart(2, "0")}`;
//   }

//   /* =======================================================
//      START TIMER
//   ======================================================= */

//   function startTimer(task) {
//     setTimerTaskId(task.id);
//     setTimerSeconds(25 * 60);
//     setTimerRunning(true);

//     requestNotifications();
//   }

//   function pauseTimer() {
//     setTimerRunning(false);
//   }

//   function resetTimer() {
//     setTimerRunning(false);
//     setTimerSeconds(25 * 60);
//   }

//   /* =======================================================
//      TASK STATS
//   ======================================================= */

//   const totalTasks = tasks.length;

//   const completedTasks = tasks.filter(
//     (task) => task.completed
//   ).length;

//   const pendingTasks = tasks.filter(
//     (task) => !task.completed
//   ).length;

//   const overdueTasks = tasks.filter(
//     (task) =>
//       !task.completed &&
//       task.dueDate &&
//       task.dueDate < today
//   ).length;

//   const todayTasks = tasks.filter(
//     (task) => task.dueDate === today
//   );

//   const todayCompleted = todayTasks.filter(
//     (task) => task.completed
//   ).length;

//   const todayProgress =
//     todayTasks.length > 0
//       ? Math.round(
//           (todayCompleted / todayTasks.length) * 100
//         )
//       : 0;

//   /* =======================================================
//      XP SYSTEM
//   ======================================================= */

//   const totalXP = useMemo(() => {
//     return tasks.reduce((total, task) => {
//       if (!task.completed) return total;

//       const priorityXP =
//         task.priority === "High"
//           ? 30
//           : task.priority === "Medium"
//           ? 20
//           : 10;

//       return total + priorityXP;
//     }, 0);
//   }, [tasks]);

//   const currentLevel =
//     Math.floor(totalXP / 100) + 1;

//   const levelProgress = totalXP % 100;

//   /* =======================================================
//      STREAK SYSTEM
//   ======================================================= */

//   const streak = useMemo(() => {
//     let count = 0;

//     const completedDates = new Set(
//       tasks
//         .filter(
//           (task) =>
//             task.completed &&
//             task.dueDate
//         )
//         .map((task) => task.dueDate)
//     );

//     const date = new Date();

//     while (true) {
//       const year = date.getFullYear();
//       const month = String(
//         date.getMonth() + 1
//       ).padStart(2, "0");
//       const day = String(
//         date.getDate()
//       ).padStart(2, "0");

//       const value = `${year}-${month}-${day}`;

//       if (!completedDates.has(value)) {
//         break;
//       }

//       count++;

//       date.setDate(date.getDate() - 1);

//       if (count > 365) break;
//     }

//     return count;
//   }, [tasks]);

//   /* =======================================================
//      PRODUCTIVITY SCORE
//   ======================================================= */

//   const productivityScore = useMemo(() => {
//     if (totalTasks === 0) return 0;

//     const completionScore =
//       (completedTasks / totalTasks) * 60;

//     const overduePenalty =
//       Math.min(overdueTasks * 5, 20);

//     const focusScore =
//       Math.min(
//         todayCompleted * 5,
//         20
//       );

//     return Math.max(
//       0,
//       Math.min(
//         100,
//         Math.round(
//           completionScore +
//             focusScore -
//             overduePenalty
//         )
//       )
//     );
//   }, [
//     totalTasks,
//     completedTasks,
//     overdueTasks,
//     todayCompleted,
//   ]);

//   /* =======================================================
//      ADD TASK
//   ======================================================= */

//   function handleSubmit(event) {
//     event.preventDefault();

//     if (!title.trim()) return;

//     const tags = tagsInput
//       .split(",")
//       .map((tag) => tag.trim())
//       .filter(Boolean);

//     const newTask = {
//       title: title.trim(),
//       category,
//       priority,
//       dueDate,
//     };

//     addTask(newTask);

//     /*
//       addTask from LifeContext creates the actual ID.
//       We temporarily use the newest task after state update
//       for extra data.
//     */

//     setTimeout(() => {
//       try {
//         const latestTask = tasks[0];

//         if (!latestTask) return;

//         setTaskDetails((previous) => ({
//           ...previous,
//           [latestTask.id]: {
//             ...(previous[latestTask.id] || {}),
//             time,
//             notes,
//             tags,
//             reminder,
//             subtasks: [],
//           },
//         }));
//       } catch (error) {
//         console.error(
//           "Extra task data error:",
//           error
//         );
//       }
//     }, 50);

//     setTitle("");
//     setCategory("Personal");
//     setPriority("Medium");
//     setDueDate("");
//     setTime("");
//     setNotes("");
//     setTagsInput("");
//     setReminder("");
//   }

//   /* =======================================================
//      FAVORITE
//   ======================================================= */

//   function toggleFavorite(id) {
//     setFavoriteTasks((previous) =>
//       previous.includes(id)
//         ? previous.filter(
//             (taskId) => taskId !== id
//           )
//         : [...previous, id]
//     );
//   }

//   /* =======================================================
//      PIN
//   ======================================================= */

//   function togglePin(id) {
//     setPinnedTasks((previous) =>
//       previous.includes(id)
//         ? previous.filter(
//             (taskId) => taskId !== id
//           )
//         : [id, ...previous]
//     );
//   }

//   /* =======================================================
//      DELETE + UNDO
//   ======================================================= */

//   function handleDelete(id) {
//     const task = tasks.find(
//       (item) => item.id === id
//     );

//     if (!task) return;

//     deleteTask(id);

//     setDeletedTask({
//       task,
//       details: taskDetails[id] || {},
//       favorite: favoriteTasks.includes(id),
//       pinned: pinnedTasks.includes(id),
//     });

//     setFavoriteTasks((previous) =>
//       previous.filter(
//         (taskId) => taskId !== id
//       )
//     );

//     setPinnedTasks((previous) =>
//       previous.filter(
//         (taskId) => taskId !== id
//       )
//     );

//     setTaskDetails((previous) => {
//       const updated = { ...previous };

//       delete updated[id];

//       return updated;
//     });
//   }

//   /*
//     Your current Context doesn't expose restoreTask.
//     Therefore undo stores the deleted task and gives the UI
//     the information. If you add restoreTask to Context later,
//     this function can restore it completely.
//   */

//   function undoDelete() {
//     if (!deletedTask) return;

//     alert(
//       "Undo is prepared. Add restoreTask() to LifeContext to restore the task automatically."
//     );

//     setDeletedTask(null);
//   }

//   /* =======================================================
//      EDIT
//   ======================================================= */

//   function openEdit(task) {
//     const details =
//       taskDetails[task.id] || {};

//     setEditingTask({
//       ...task,
//       time: details.time || "",
//       notes: details.notes || "",
//       tags: details.tags || [],
//       reminder: details.reminder || "",
//       subtasks: details.subtasks || [],
//     });
//   }

//   function saveEdit() {
//     if (!editingTask?.title?.trim()) return;

//     setTaskDetails((previous) => ({
//       ...previous,
//       [editingTask.id]: {
//         ...(previous[editingTask.id] || {}),
//         editedTitle:
//           editingTask.title.trim(),
//         editedCategory:
//           editingTask.category,
//         editedPriority:
//           editingTask.priority,
//         editedDueDate:
//           editingTask.dueDate,
//         time: editingTask.time || "",
//         notes: editingTask.notes || "",
//         tags: editingTask.tags || [],
//         reminder:
//           editingTask.reminder || "",
//         subtasks:
//           editingTask.subtasks || [],
//       },
//     }));

//     setEditingTask(null);
//   }

//   /* =======================================================
//      SUBTASKS
//   ======================================================= */

//   function addSubtask(taskId, text) {
//     if (!text.trim()) return;

//     setTaskDetails((previous) => {
//       const current =
//         previous[taskId] || {};

//       const subtasks =
//         current.subtasks || [];

//       return {
//         ...previous,
//         [taskId]: {
//           ...current,
//           subtasks: [
//             ...subtasks,
//             {
//               id: createId(),
//               title: text.trim(),
//               completed: false,
//             },
//           ],
//         },
//       };
//     });
//   }

//   function toggleSubtask(
//     taskId,
//     subtaskId
//   ) {
//     setTaskDetails((previous) => {
//       const current =
//         previous[taskId] || {};

//       return {
//         ...previous,
//         [taskId]: {
//           ...current,
//           subtasks: (
//             current.subtasks || []
//           ).map((subtask) =>
//             subtask.id === subtaskId
//               ? {
//                   ...subtask,
//                   completed:
//                     !subtask.completed,
//                 }
//               : subtask
//           ),
//         },
//       };
//     });
//   }

//   function deleteSubtask(
//     taskId,
//     subtaskId
//   ) {
//     setTaskDetails((previous) => {
//       const current =
//         previous[taskId] || {};

//       return {
//         ...previous,
//         [taskId]: {
//           ...current,
//           subtasks: (
//             current.subtasks || []
//           ).filter(
//             (subtask) =>
//               subtask.id !== subtaskId
//           ),
//         },
//       };
//     });
//   }

//   /* =======================================================
//      ARCHIVE
//   ======================================================= */

//   function archiveTask(id) {
//     setArchivedTasks((previous) =>
//       previous.includes(id)
//         ? previous
//         : [...previous, id]
//     );
//   }

//   function restoreArchived(id) {
//     setArchivedTasks((previous) =>
//       previous.filter(
//         (taskId) => taskId !== id
//       )
//     );
//   }

//   /* =======================================================
//      CLEAR COMPLETED
//   ======================================================= */

//   function clearCompleted() {
//     const completed = tasks.filter(
//       (task) => task.completed
//     );

//     if (!completed.length) return;

//     completed.forEach((task) => {
//       deleteTask(task.id);
//     });

//     const ids = completed.map(
//       (task) => task.id
//     );

//     setFavoriteTasks((previous) =>
//       previous.filter(
//         (id) => !ids.includes(id)
//       )
//     );

//     setPinnedTasks((previous) =>
//       previous.filter(
//         (id) => !ids.includes(id)
//       )
//     );

//     setArchivedTasks((previous) =>
//       previous.filter(
//         (id) => !ids.includes(id)
//       )
//     );
//   }

//   /* =======================================================
//      ENRICH TASKS
//   ======================================================= */

//   const enrichedTasks = useMemo(() => {
//     return tasks.map((task) => {
//       const details =
//         taskDetails[task.id] || {};

//       return {
//         ...task,

//         title:
//           details.editedTitle ||
//           task.title,

//         category:
//           details.editedCategory ||
//           task.category ||
//           "Personal",

//         priority:
//           details.editedPriority ||
//           task.priority ||
//           "Medium",

//         dueDate:
//           details.editedDueDate ||
//           task.dueDate ||
//           "",

//         time:
//           details.time || "",

//         notes:
//           details.notes || "",

//         tags:
//           details.tags || [],

//         reminder:
//           details.reminder || "",

//         subtasks:
//           details.subtasks || [],

//         isFavorite:
//           favoriteTasks.includes(task.id),

//         isPinned:
//           pinnedTasks.includes(task.id),

//         isArchived:
//           archivedTasks.includes(task.id),
//       };
//     });
//   }, [
//     tasks,
//     taskDetails,
//     favoriteTasks,
//     pinnedTasks,
//     archivedTasks,
//   ]);

//   /* =======================================================
//      FILTER + SORT
//   ======================================================= */

//   const visibleTasks = useMemo(() => {
//     const result = enrichedTasks
//       .filter((task) => {
//         if (
//           task.isArchived &&
//           !showArchived
//         ) {
//           return false;
//         }

//         if (
//           !task.isArchived &&
//           showArchived
//         ) {
//           return false;
//         }

//         const query =
//           search.toLowerCase();

//         const tagMatch =
//           task.tags?.some((tag) =>
//             tag
//               .toLowerCase()
//               .includes(query)
//           );

//         const matchesSearch =
//           task.title
//             .toLowerCase()
//             .includes(query) ||
//           task.category
//             .toLowerCase()
//             .includes(query) ||
//           task.notes
//             .toLowerCase()
//             .includes(query) ||
//           tagMatch;

//         if (!matchesSearch) return false;

//         if (filter === "Today") {
//           return task.dueDate === today;
//         }

//         if (filter === "Tomorrow") {
//           return task.dueDate === tomorrow;
//         }

//         if (filter === "This Week") {
//           return isThisWeek(
//             task.dueDate
//           );
//         }

//         if (filter === "Pending") {
//           return !task.completed;
//         }

//         if (filter === "Completed") {
//           return task.completed;
//         }

//         if (filter === "Overdue") {
//           return (
//             !task.completed &&
//             task.dueDate &&
//             task.dueDate < today
//           );
//         }

//         if (filter === "High Priority") {
//           return (
//             task.priority.toLowerCase() ===
//             "high"
//           );
//         }

//         if (filter === "Favorites") {
//           return task.isFavorite;
//         }

//         if (filter === "Pinned") {
//           return task.isPinned;
//         }

//         return true;
//       });

//     const priorityValue = {
//       High: 1,
//       Medium: 2,
//       Low: 3,
//     };

//     result.sort((a, b) => {
//       /*
//         Pinned tasks always appear first.
//       */

//       if (a.isPinned && !b.isPinned)
//         return -1;

//       if (!a.isPinned && b.isPinned)
//         return 1;

//       if (sortBy === "Priority") {
//         return (
//           (priorityValue[a.priority] ||
//             2) -
//           (priorityValue[b.priority] ||
//             2)
//         );
//       }

//       if (sortBy === "Date") {
//         return (
//           new Date(
//             a.dueDate ||
//               "9999-12-31"
//           ) -
//           new Date(
//             b.dueDate ||
//               "9999-12-31"
//           )
//         );
//       }

//       if (sortBy === "Newest") {
//         return (
//           Number(b.id || 0) -
//           Number(a.id || 0)
//         );
//       }

//       if (sortBy === "Alphabetical") {
//         return a.title.localeCompare(
//           b.title
//         );
//       }

//       if (sortBy === "Custom") {
//         return (
//           taskOrder.indexOf(a.id) -
//           taskOrder.indexOf(b.id)
//         );
//       }

//       return 0;
//     });

//     return result;
//   }, [
//     enrichedTasks,
//     search,
//     filter,
//     showArchived,
//     today,
//     tomorrow,
//     sortBy,
//     taskOrder,
//   ]);

//   /* =======================================================
//      DRAG & DROP
//   ======================================================= */

//   const [draggedTask, setDraggedTask] =
//     useState(null);

//   function handleDragStart(id) {
//     setDraggedTask(id);
//   }

//   function handleDrop(targetId) {
//     if (!draggedTask) return;

//     if (draggedTask === targetId) {
//       setDraggedTask(null);
//       return;
//     }

//     setTaskOrder((previous) => {
//       const updated = [...previous];

//       const fromIndex =
//         updated.indexOf(
//           draggedTask
//         );

//       const toIndex =
//         updated.indexOf(targetId);

//       if (
//         fromIndex === -1 ||
//         toIndex === -1
//       ) {
//         return previous;
//       }

//       updated.splice(fromIndex, 1);

//       updated.splice(
//         toIndex,
//         0,
//         draggedTask
//       );

//       return updated;
//     });

//     setDraggedTask(null);
//   }

//   /* =======================================================
//      ANALYTICS
//   ======================================================= */

//   const analytics = useMemo(() => {
//     const weekTasks =
//       enrichedTasks.filter((task) =>
//         isThisWeek(task.dueDate)
//       );

//     const weekCompleted =
//       weekTasks.filter(
//         (task) => task.completed
//       ).length;

//     const daily = getWeekDates().map(
//       ({ value, date }) => {
//         const dayTasks =
//           enrichedTasks.filter(
//             (task) =>
//               task.dueDate === value
//           );

//         const completed =
//           dayTasks.filter(
//             (task) => task.completed
//           ).length;

//         return {
//           value,
//           date,
//           total: dayTasks.length,
//           completed,
//           percentage:
//             dayTasks.length > 0
//               ? Math.round(
//                   (completed /
//                     dayTasks.length) *
//                     100
//                 )
//               : 0,
//         };
//       }
//     );

//     return {
//       weekTasks,
//       weekCompleted,
//       daily,
//     };
//   }, [enrichedTasks]);

//   /* =======================================================
//      EXPORT JSON
//   ======================================================= */

//   function exportJSON() {
//     const data =
//       enrichedTasks.map((task) => ({
//         id: task.id,
//         title: task.title,
//         category: task.category,
//         priority: task.priority,
//         dueDate: task.dueDate,
//         completed: task.completed,
//         tags: task.tags,
//         notes: task.notes,
//         time: task.time,
//         reminder: task.reminder,
//         subtasks: task.subtasks,
//       }));

//     const blob = new Blob(
//       [JSON.stringify(data, null, 2)],
//       {
//         type: "application/json",
//       }
//     );

//     const url =
//       URL.createObjectURL(blob);

//     const anchor =
//       document.createElement("a");

//     anchor.href = url;
//     anchor.download =
//       "my-life-tasks.json";

//     anchor.click();

//     URL.revokeObjectURL(url);
//   }

//   /* =======================================================
//      EXPORT CSV
//   ======================================================= */

//   function exportCSV() {
//     const headers = [
//       "Title",
//       "Category",
//       "Priority",
//       "Due Date",
//       "Completed",
//       "Tags",
//       "Notes",
//       "Time",
//       "Reminder",
//     ];

//     const rows = enrichedTasks.map(
//       (task) => [
//         task.title,
//         task.category,
//         task.priority,
//         task.dueDate,
//         task.completed
//           ? "Yes"
//           : "No",
//         task.tags?.join(", ") || "",
//         task.notes,
//         task.time,
//         task.reminder,
//       ]
//     );

//     const csv = [
//       headers.map(escapeCsv).join(","),
//       ...rows.map((row) =>
//         row
//           .map(escapeCsv)
//           .join(",")
//       ),
//     ].join("\n");

//     const blob = new Blob([csv], {
//       type: "text/csv;charset=utf-8;",
//     });

//     const url =
//       URL.createObjectURL(blob);

//     const anchor =
//       document.createElement("a");

//     anchor.href = url;
//     anchor.download =
//       "my-life-tasks.csv";

//     anchor.click();

//     URL.revokeObjectURL(url);
//   }

//   /* =======================================================
//      CALENDAR MONTH
//   ======================================================= */

//   const calendarDays = useMemo(() => {
//     const year =
//       calendarDate.getFullYear();

//     const month =
//       calendarDate.getMonth();

//     const firstDay = new Date(
//       year,
//       month,
//       1
//     );

//     const lastDay = new Date(
//       year,
//       month + 1,
//       0
//     );

//     const startDay =
//       firstDay.getDay();

//     const days = [];

//     for (
//       let i = 0;
//       i < startDay;
//       i++
//     ) {
//       days.push(null);
//     }

//     for (
//       let day = 1;
//       day <= lastDay.getDate();
//       day++
//     ) {
//       const date = new Date(
//         year,
//         month,
//         day
//       );

//       const value = `${year}-${String(
//         month + 1
//       ).padStart(2, "0")}-${String(
//         day
//       ).padStart(2, "0")}`;

//       days.push({
//         day,
//         value,
//         date,
//       });
//     }

//     return days;
//   }, [calendarDate]);

//   function previousMonth() {
//     setCalendarDate(
//       (previous) =>
//         new Date(
//           previous.getFullYear(),
//           previous.getMonth() - 1,
//           1
//         )
//     );
//   }

//   function nextMonth() {
//     setCalendarDate(
//       (previous) =>
//         new Date(
//           previous.getFullYear(),
//           previous.getMonth() + 1,
//           1
//         )
//     );
//   }

//   /* =======================================================
//      RESET FILTERS
//   ======================================================= */

//   function resetFilters() {
//     setSearch("");
//     setFilter("All");
//     setSortBy("Priority");
//     setShowArchived(false);
//   }

//   /* =======================================================
//      EDIT SUBTASK
//   ======================================================= */

//   function addEditSubtask() {
//     if (
//       !subtaskInput.trim() ||
//       !editingTask
//     ) {
//       return;
//     }

//     setEditingTask((previous) => ({
//       ...previous,
//       subtasks: [
//         ...(previous.subtasks || []),
//         {
//           id: createId(),
//           title:
//             subtaskInput.trim(),
//           completed: false,
//         },
//       ],
//     }));

//     setSubtaskInput("");
//   }

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <main
//       className={`tasks-page ${
//         focusMode
//           ? "focus-mode-active"
//           : ""
//       }`}
//     >
//       {/* ==================================================
//           HERO
//       ================================================== */}

//       <section className="tasks-hero">
//         <div>
//           <div className="tasks-eyebrow">
//             <ListTodo size={15} />
//             MY PRODUCTIVITY
//           </div>

//           <h1>
//             Today's Tasks <span>✨</span>
//           </h1>

//           <p>
//             {formatToday()} — focus on
//             what matters most.
//           </p>
//         </div>

//         <div className="hero-actions">
//           <button
//             className="hero-tool-btn"
//             onClick={() =>
//               setFocusMode(
//                 (previous) => !previous
//               )
//             }
//           >
//             {focusMode ? (
//               <Minimize2 size={17} />
//             ) : (
//               <Maximize2 size={17} />
//             )}

//             {focusMode
//               ? "Exit Focus"
//               : "Focus Mode"}
//           </button>

//           <button
//             className="hero-tool-btn"
//             onClick={() =>
//               setShowAnalytics(
//                 (previous) =>
//                   !previous
//               )
//             }
//           >
//             <BarChart3 size={17} />
//             Analytics
//           </button>
//         </div>

//         <div className="hero-progress">
//           <div className="hero-progress-ring">
//             <strong>
//               {todayProgress}%
//             </strong>
//           </div>

//           <div>
//             <span>
//               Today's progress
//             </span>

//             <strong>
//               {todayCompleted} /{" "}
//               {todayTasks.length}
//             </strong>
//           </div>
//         </div>
//       </section>

//       {/* ==================================================
//           STATS
//       ================================================== */}

//       <section className="task-stats">
//         <div className="task-stat-card">
//           <div className="task-stat-icon">
//             <ListTodo size={20} />
//           </div>

//           <div>
//             <strong>
//               {totalTasks}
//             </strong>

//             <span>Total Tasks</span>
//           </div>
//         </div>

//         <div className="task-stat-card">
//           <div className="task-stat-icon completed-icon">
//             <CheckCircle2 size={20} />
//           </div>

//           <div>
//             <strong>
//               {completedTasks}
//             </strong>

//             <span>Completed</span>
//           </div>
//         </div>

//         <div className="task-stat-card">
//           <div className="task-stat-icon pending-icon">
//             <Clock3 size={20} />
//           </div>

//           <div>
//             <strong>
//               {pendingTasks}
//             </strong>

//             <span>Pending</span>
//           </div>
//         </div>

//         <div className="task-stat-card">
//           <div className="task-stat-icon overdue-icon">
//             <AlertCircle size={20} />
//           </div>

//           <div>
//             <strong>
//               {overdueTasks}
//             </strong>

//             <span>Overdue</span>
//           </div>
//         </div>

//         <div className="task-stat-card xp-card">
//           <div className="task-stat-icon">
//             <Zap size={20} />
//           </div>

//           <div>
//             <strong>
//               {totalXP} XP
//             </strong>

//             <span>
//               Level {currentLevel}
//             </span>
//           </div>
//         </div>

//         <div className="task-stat-card">
//           <div className="task-stat-icon">
//             <Flame size={20} />
//           </div>

//           <div>
//             <strong>
//               {streak}
//             </strong>

//             <span>Day Streak</span>
//           </div>
//         </div>
//       </section>

//       {/* ==================================================
//           PRODUCTIVITY SCORE
//       ================================================== */}

//       <section className="productivity-score-card">
//         <div className="score-icon">
//           <Target size={24} />
//         </div>

//         <div className="score-content">
//           <span>
//             PRODUCTIVITY SCORE
//           </span>

//           <h2>
//             {productivityScore}/100
//           </h2>

//           <div className="score-track">
//             <div
//               className="score-fill"
//               style={{
//                 width: `${productivityScore}%`,
//               }}
//             />
//           </div>
//         </div>

//         <div className="level-box">
//           <Trophy size={18} />
//           <strong>
//             Level {currentLevel}
//           </strong>

//           <small>
//             {levelProgress}/100 XP
//           </small>
//         </div>
//       </section>

//       {/* ==================================================
//           TODAY FOCUS
//       ================================================== */}

//       <section className="today-focus-card">
//         <div className="focus-left">
//           <div className="focus-icon">
//             <Flame size={21} />
//           </div>

//           <div>
//             <span className="focus-label">
//               TODAY'S FOCUS
//             </span>

//             <h2>
//               Get the important things
//               done.
//             </h2>

//             <p>
//               {todayTasks.length === 0
//                 ? "No tasks scheduled for today yet."
//                 : `${todayCompleted} of ${todayTasks.length} tasks completed today.`}
//             </p>
//           </div>
//         </div>

//         <div className="focus-progress">
//           <div className="focus-progress-top">
//             <span>
//               Daily progress
//             </span>

//             <strong>
//               {todayProgress}%
//             </strong>
//           </div>

//           <div className="progress-track">
//             <div
//               className="progress-fill"
//               style={{
//                 width: `${todayProgress}%`,
//               }}
//             />
//           </div>
//         </div>
//       </section>

//       {/* ==================================================
//           ANALYTICS
//       ================================================== */}

//       {showAnalytics && (
//         <section className="task-analytics-panel">
//           <div className="analytics-header">
//             <div>
//               <span className="section-kicker">
//                 PRODUCTIVITY
//               </span>

//               <h2>
//                 Weekly Analytics
//               </h2>
//             </div>

//             <BarChart3 size={28} />
//           </div>

//           <div className="analytics-summary">
//             <div>
//               <strong>
//                 {
//                   analytics.weekCompleted
//                 }
//               </strong>
//               <span>
//                 Completed this week
//               </span>
//             </div>

//             <div>
//               <strong>
//                 {
//                   analytics.weekTasks.length
//                 }
//               </strong>
//               <span>
//                 Tasks this week
//               </span>
//             </div>

//             <div>
//               <strong>
//                 {productivityScore}
//               </strong>
//               <span>
//                 Productivity score
//               </span>
//             </div>

//             <div>
//               <strong>
//                 {streak}
//               </strong>
//               <span>
//                 Current streak
//               </span>
//             </div>
//           </div>

//           <div className="weekly-chart">
//             {analytics.daily.map(
//               (day) => (
//                 <div
//                   className="chart-day"
//                   key={day.value}
//                 >
//                   <div className="chart-bar-wrapper">
//                     <div
//                       className="chart-bar"
//                       style={{
//                         height: `${
//                           Math.max(
//                             day.percentage,
//                             4
//                           )
//                         }%`,
//                       }}
//                       title={`${day.percentage}%`}
//                     />
//                   </div>

//                   <strong>
//                     {day.date.toLocaleDateString(
//                       "en-US",
//                       {
//                         weekday: "short",
//                       }
//                     )}
//                   </strong>

//                   <small>
//                     {day.completed}/
//                     {day.total}
//                   </small>
//                 </div>
//               )
//             )}
//           </div>
//         </section>
//       )}

//       {/* ==================================================
//           ADD TASK
//       ================================================== */}

//       {!focusMode && (
//         <section className="add-task-card">
//           <div className="section-heading">
//             <div>
//               <span className="section-kicker">
//                 CREATE
//               </span>

//               <h2>
//                 Add a new task
//               </h2>
//             </div>

//             <div className="heading-decoration">
//               ✦
//             </div>
//           </div>

//           <form
//             className="add-task-form"
//             onSubmit={handleSubmit}
//           >
//             <div className="task-input-main">
//               <label>
//                 Task
//               </label>

//               <input
//                 type="text"
//                 placeholder="What do you need to accomplish?"
//                 value={title}
//                 onChange={(event) =>
//                   setTitle(
//                     event.target.value
//                   )
//                 }
//               />
//             </div>

//             <div className="task-form-grid">
//               <div className="input-group">
//                 <label>
//                   Category
//                 </label>

//                 <select
//                   value={category}
//                   onChange={(event) =>
//                     setCategory(
//                       event.target.value
//                     )
//                   }
//                 >
//                   <option>
//                     Personal
//                   </option>
//                   <option>
//                     Study
//                   </option>
//                   <option>
//                     Coding
//                   </option>
//                   <option>
//                     Work
//                   </option>
//                   <option>
//                     YouTube
//                   </option>
//                   <option>
//                     Scripts
//                   </option>
//                   <option>
//                     Money
//                   </option>
//                   <option>
//                     Clients
//                   </option>
//                   <option>
//                     Health
//                   </option>
//                   <option>
//                     Content
//                   </option>
//                 </select>
//               </div>

//               <div className="input-group">
//                 <label>
//                   Priority
//                 </label>

//                 <select
//                   value={priority}
//                   onChange={(event) =>
//                     setPriority(
//                       event.target.value
//                     )
//                   }
//                 >
//                   <option>
//                     High
//                   </option>
//                   <option>
//                     Medium
//                   </option>
//                   <option>
//                     Low
//                   </option>
//                 </select>
//               </div>

//               <div className="input-group">
//                 <label>
//                   Due date
//                 </label>

//                 <input
//                   type="date"
//                   value={dueDate}
//                   onChange={(event) =>
//                     setDueDate(
//                       event.target.value
//                     )
//                   }
//                 />
//               </div>

//               <div className="input-group">
//                 <label>
//                   Time
//                 </label>

//                 <input
//                   type="time"
//                   value={time}
//                   onChange={(event) =>
//                     setTime(
//                       event.target.value
//                     )
//                   }
//                 />
//               </div>
//             </div>

//             <div className="task-extra-grid">
//               <div className="input-group">
//                 <label>
//                   <Tag size={14} />
//                   Tags
//                 </label>

//                 <input
//                   type="text"
//                   placeholder="client, urgent, coding"
//                   value={tagsInput}
//                   onChange={(event) =>
//                     setTagsInput(
//                       event.target.value
//                     )
//                   }
//                 />
//               </div>

//               <div className="input-group">
//                 <label>
//                   <Bell size={14} />
//                   Reminder
//                 </label>

//                 <input
//                   type="datetime-local"
//                   value={reminder}
//                   onChange={(event) =>
//                     setReminder(
//                       event.target.value
//                     )
//                   }
//                   onFocus={
//                     requestNotifications
//                   }
//                 />
//               </div>
//             </div>

//             <div className="task-notes-input">
//               <label>
//                 Notes
//               </label>

//               <textarea
//                 placeholder="Add a small note, reminder or detail..."
//                 value={notes}
//                 onChange={(event) =>
//                   setNotes(
//                     event.target.value
//                   )
//                 }
//                 rows="2"
//               />
//             </div>

//             <button
//               type="submit"
//               className="add-task-btn"
//             >
//               <Plus size={18} />
//               Add Task
//             </button>
//           </form>
//         </section>
//       )}

//       {/* ==================================================
//           TASK SECTION
//       ================================================== */}

//       <section className="tasks-section">
//         <div className="tasks-section-header">
//           <div>
//             <span className="section-kicker">
//               YOUR WORK
//             </span>

//             <h2>
//               {showArchived
//                 ? "Archived Tasks"
//                 : "All Tasks"}
//             </h2>
//           </div>

//           <div className="task-header-actions">
//             <button
//               className="secondary-task-btn"
//               onClick={() =>
//                 setShowCalendar(
//                   (previous) =>
//                     !previous
//                 )
//               }
//             >
//               <CalendarDays size={15} />
//               Calendar
//             </button>

//             <button
//               className="secondary-task-btn"
//               onClick={exportJSON}
//             >
//               <Download size={15} />
//               JSON
//             </button>

//             <button
//               className="secondary-task-btn"
//               onClick={exportCSV}
//             >
//               <Download size={15} />
//               CSV
//             </button>

//             <button
//               className="clear-completed-btn"
//               onClick={clearCompleted}
//             >
//               <Trash2 size={15} />
//               Clear completed
//             </button>
//           </div>
//         </div>

//         {/* ==================================================
//             CALENDAR
//         ================================================== */}

//         {showCalendar && (
//           <div className="calendar-panel">
//             <div className="calendar-header">
//               <button
//                 onClick={previousMonth}
//               >
//                 <ChevronLeft size={18} />
//               </button>

//               <h3>
//                 {calendarDate.toLocaleDateString(
//                   "en-US",
//                   {
//                     month: "long",
//                     year: "numeric",
//                   }
//                 )}
//               </h3>

//               <button
//                 onClick={nextMonth}
//               >
//                 <ChevronRight size={18} />
//               </button>
//             </div>

//             <div className="calendar-weekdays">
//               {[
//                 "Sun",
//                 "Mon",
//                 "Tue",
//                 "Wed",
//                 "Thu",
//                 "Fri",
//                 "Sat",
//               ].map((day) => (
//                 <span key={day}>
//                   {day}
//                 </span>
//               ))}
//             </div>

//             <div className="calendar-grid">
//               {calendarDays.map(
//                 (item, index) => {
//                   if (!item) {
//                     return (
//                       <div
//                         className="calendar-empty"
//                         key={`empty-${index}`}
//                       />
//                     );
//                   }

//                   const dayTasks =
//                     enrichedTasks.filter(
//                       (task) =>
//                         task.dueDate ===
//                         item.value
//                     );

//                   const isToday =
//                     item.value ===
//                     today;

//                   return (
//                     <button
//                       className={`calendar-day-cell ${
//                         isToday
//                           ? "today"
//                           : ""
//                       } ${
//                         dayTasks.length
//                           ? "has-tasks"
//                           : ""
//                       }`}
//                       key={item.value}
//                       onClick={() =>
//                         setFilter(
//                           item.value ===
//                             today
//                             ? "Today"
//                             : "All"
//                         )
//                       }
//                     >
//                       <strong>
//                         {item.day}
//                       </strong>

//                       {dayTasks.length >
//                         0 && (
//                         <span>
//                           {
//                             dayTasks.length
//                           }
//                         </span>
//                       )}
//                     </button>
//                   );
//                 }
//               )}
//             </div>
//           </div>
//         )}

//         {/* ==================================================
//             CONTROLS
//         ================================================== */}

//         <div className="task-controls">
//           <div className="task-search">
//             <Search size={17} />

//             <input
//               type="text"
//               placeholder="Search tasks, tags..."
//               value={search}
//               onChange={(event) =>
//                 setSearch(
//                   event.target.value
//                 )
//               }
//             />

//             {search && (
//               <button
//                 onClick={() =>
//                   setSearch("")
//                 }
//               >
//                 <X size={15} />
//               </button>
//             )}
//           </div>

//           <div className="sort-control">
//             <span>
//               Sort:
//             </span>

//             <select
//               value={sortBy}
//               onChange={(event) =>
//                 setSortBy(
//                   event.target.value
//                 )
//               }
//             >
//               <option>
//                 Priority
//               </option>
//               <option>
//                 Date
//               </option>
//               <option>
//                 Newest
//               </option>
//               <option>
//                 Alphabetical
//               </option>
//               <option>
//                 Custom
//               </option>
//             </select>

//             <ChevronDown size={15} />
//           </div>
//         </div>

//         {/* ==================================================
//             FILTERS
//         ================================================== */}

//         <div className="task-filters">
//           {[
//             "All",
//             "Today",
//             "Tomorrow",
//             "This Week",
//             "Pending",
//             "Completed",
//             "Overdue",
//             "High Priority",
//             "Favorites",
//             "Pinned",
//           ].map((item) => (
//             <button
//               key={item}
//               className={
//                 filter === item
//                   ? "task-filter active"
//                   : "task-filter"
//               }
//               onClick={() =>
//                 setFilter(item)
//               }
//             >
//               {item}

//               {item === "Today" &&
//                 todayTasks.length >
//                   0 && (
//                   <span>
//                     {
//                       todayTasks.length
//                     }
//                   </span>
//                 )}

//               {item === "Pending" &&
//                 pendingTasks > 0 && (
//                   <span>
//                     {pendingTasks}
//                   </span>
//                 )}

//               {item === "Overdue" &&
//                 overdueTasks > 0 && (
//                   <span>
//                     {overdueTasks}
//                   </span>
//                 )}
//             </button>
//           ))}

//           <button
//             className={
//               showArchived
//                 ? "task-filter active"
//                 : "task-filter"
//             }
//             onClick={() =>
//               setShowArchived(
//                 (previous) =>
//                   !previous
//               )
//             }
//           >
//             <Archive size={14} />
//             Archived
//           </button>
//         </div>

//         {/* ==================================================
//             ARCHIVE INFO
//         ================================================== */}

//         {!showArchived && (
//           <button
//             className="archive-toggle-btn"
//             onClick={() =>
//               setShowArchived(true)
//             }
//           >
//             <Archive size={15} />
//             View archived tasks
//           </button>
//         )}

//         {showArchived && (
//           <button
//             className="archive-toggle-btn"
//             onClick={() =>
//               setShowArchived(false)
//             }
//           >
//             <ListTodo size={15} />
//             Back to active tasks
//           </button>
//         )}

//         {/* ==================================================
//             EMPTY STATE
//         ================================================== */}

//         {visibleTasks.length === 0 ? (
//           <div className="empty-tasks">
//             <div className="empty-task-icon">
//               <CheckCircle2 size={34} />
//             </div>

//             <h3>
//               {tasks.length === 0
//                 ? "Your task list is empty"
//                 : "No tasks found"}
//             </h3>

//             <p>
//               {tasks.length === 0
//                 ? "Add your first task and start building momentum."
//                 : "Try changing your search or filters."}
//             </p>

//             {tasks.length > 0 && (
//               <button
//                 className="reset-filter-btn"
//                 onClick={
//                   resetFilters
//                 }
//               >
//                 <RotateCcw
//                   size={15}
//                 />
//                 Reset filters
//               </button>
//             )}
//           </div>
//         ) : (
//           /* ==================================================
//              TASK LIST
//           ================================================== */

//           <div className="task-list">
//             {visibleTasks.map(
//               (task) => {
//                 const isFavorite =
//                   task.isFavorite;

//                 const isPinned =
//                   task.isPinned;

//                 const isOverdue =
//                   !task.completed &&
//                   task.dueDate &&
//                   task.dueDate < today;

//                 const subtaskTotal =
//                   task.subtasks?.length ||
//                   0;

//                 const subtaskCompleted =
//                   task.subtasks?.filter(
//                     (subtask) =>
//                       subtask.completed
//                   ).length || 0;

//                 const subtaskProgress =
//                   subtaskTotal > 0
//                     ? Math.round(
//                         (subtaskCompleted /
//                           subtaskTotal) *
//                           100
//                       )
//                     : 0;

//                 return (
//                   <article
//                     key={task.id}
//                     draggable
//                     onDragStart={() =>
//                       handleDragStart(
//                         task.id
//                       )
//                     }
//                     onDragOver={(event) =>
//                       event.preventDefault()
//                     }
//                     onDrop={() =>
//                       handleDrop(
//                         task.id
//                       )
//                     }
//                     className={`task-item ${
//                       task.completed
//                         ? "completed"
//                         : ""
//                     } ${
//                       isOverdue
//                         ? "task-overdue"
//                         : ""
//                     } ${
//                       isPinned
//                         ? "task-pinned"
//                         : ""
//                     }`}
//                   >
//                     {/* DRAG */}
//                     <div className="drag-handle">
//                       <GripVertical
//                         size={17}
//                       />
//                     </div>

//                     {/* CHECK */}
//                     <button
//                       className="complete-btn"
//                       onClick={() =>
//                         toggleTask(
//                           task.id
//                         )
//                       }
//                       aria-label="Complete task"
//                     >
//                       {task.completed ? (
//                         <Check size={18} />
//                       ) : (
//                         <Circle
//                           size={20}
//                         />
//                       )}
//                     </button>

//                     {/* MAIN */}
//                     <div className="task-info">
//                       <div className="task-title-row">
//                         <h3>
//                           {task.title}
//                         </h3>

//                         {isPinned && (
//                           <Pin
//                             size={14}
//                             className="pin-indicator"
//                             fill="currentColor"
//                           />
//                         )}

//                         {isFavorite && (
//                           <Star
//                             className="small-star"
//                             size={14}
//                             fill="currentColor"
//                           />
//                         )}
//                       </div>

//                       {task.notes && (
//                         <p className="task-note-preview">
//                           {task.notes}
//                         </p>
//                       )}

//                       {/* TAGS */}
//                       {task.tags?.length >
//                         0 && (
//                         <div className="task-tags">
//                           {task.tags.map(
//                             (tag) => (
//                               <span
//                                 key={tag}
//                               >
//                                 <Tag
//                                   size={11}
//                                 />
//                                 {tag}
//                               </span>
//                             )
//                           )}
//                         </div>
//                       )}

//                       {/* SUBTASKS */}
//                       {subtaskTotal >
//                         0 && (
//                         <div className="subtask-progress">
//                           <div className="subtask-progress-top">
//                             <span>
//                               <Layers
//                                 size={13}
//                               />
//                               Subtasks
//                             </span>

//                             <strong>
//                               {
//                                 subtaskCompleted
//                               }
//                               /
//                               {
//                                 subtaskTotal
//                               }
//                             </strong>
//                           </div>

//                           <div className="progress-track">
//                             <div
//                               className="progress-fill"
//                               style={{
//                                 width: `${subtaskProgress}%`,
//                               }}
//                             />
//                           </div>
//                         </div>
//                       )}

//                       {/* META */}
//                       <div className="task-meta">
//                         <span className="category-badge">
//                           {
//                             task.category
//                           }
//                         </span>

//                         <span
//                           className={`priority ${task.priority.toLowerCase()}`}
//                         >
//                           {
//                             task.priority
//                           }
//                         </span>

//                         {task.dueDate && (
//                           <span
//                             className={
//                               isOverdue
//                                 ? "date-meta overdue"
//                                 : "date-meta"
//                             }
//                           >
//                             <CalendarDays
//                               size={13}
//                             />

//                             {isOverdue
//                               ? `Overdue · ${formatDate(
//                                   task.dueDate
//                                 )}`
//                               : formatDate(
//                                   task.dueDate
//                                 )}
//                           </span>
//                         )}

//                         {task.time && (
//                           <span className="date-meta">
//                             <Clock3
//                               size={13}
//                             />
//                             {task.time}
//                           </span>
//                         )}

//                         {task.reminder && (
//                           <span className="date-meta">
//                             <Bell
//                               size={13}
//                             />
//                             Reminder
//                           </span>
//                         )}
//                       </div>

//                       {/* SUBTASK QUICK ADD */}
//                       {!task.completed && (
//                         <div className="quick-subtask">
//                           <input
//                             type="text"
//                             placeholder="Add mini task..."
//                             value={
//                               subtaskInput
//                             }
//                             onChange={(
//                               event
//                             ) =>
//                               setSubtaskInput(
//                                 event.target
//                                   .value
//                               )
//                             }
//                             onKeyDown={(
//                               event
//                             ) => {
//                               if (
//                                 event.key ===
//                                 "Enter"
//                               ) {
//                                 event.preventDefault();

//                                 addSubtask(
//                                   task.id,
//                                   subtaskInput
//                                 );

//                                 setSubtaskInput(
//                                   ""
//                                 );
//                               }
//                             }}
//                           />

//                           <button
//                             onClick={() => {
//                               addSubtask(
//                                 task.id,
//                                 subtaskInput
//                               );

//                               setSubtaskInput(
//                                 ""
//                               );
//                             }}
//                           >
//                             <Plus
//                               size={14}
//                             />
//                           </button>
//                         </div>
//                       )}

//                       {/* SUBTASK LIST */}
//                       {task.subtasks?.length >
//                         0 && (
//                         <div className="subtask-list">
//                           {task.subtasks.map(
//                             (
//                               subtask
//                             ) => (
//                               <div
//                                 className={`subtask-row ${
//                                   subtask.completed
//                                     ? "done"
//                                     : ""
//                                 }`}
//                                 key={
//                                   subtask.id
//                                 }
//                               >
//                                 <button
//                                   onClick={() =>
//                                     toggleSubtask(
//                                       task.id,
//                                       subtask.id
//                                     )
//                                   }
//                                 >
//                                   {subtask.completed ? (
//                                     <Check
//                                       size={
//                                         12
//                                       }
//                                     />
//                                   ) : (
//                                     <Circle
//                                       size={
//                                         13
//                                       }
//                                     />
//                                   )}
//                                 </button>

//                                 <span>
//                                   {
//                                     subtask.title
//                                   }
//                                 </span>

//                                 <button
//                                   className="subtask-delete"
//                                   onClick={() =>
//                                     deleteSubtask(
//                                       task.id,
//                                       subtask.id
//                                     )
//                                   }
//                                 >
//                                   <X
//                                     size={
//                                       12
//                                     }
//                                   />
//                                 </button>
//                               </div>
//                             )
//                           )}
//                         </div>
//                       )}
//                     </div>

//                     {/* ACTIONS */}
//                     <div className="task-actions">
//                       <button
//                         className={
//                           isPinned
//                             ? "icon-action pinned active"
//                             : "icon-action pinned"
//                         }
//                         onClick={() =>
//                           togglePin(
//                             task.id
//                           )
//                         }
//                         title="Pin"
//                       >
//                         <Pin
//                           size={16}
//                           fill={
//                             isPinned
//                               ? "currentColor"
//                               : "none"
//                           }
//                         />
//                       </button>

//                       <button
//                         className={
//                           isFavorite
//                             ? "icon-action favorite active"
//                             : "icon-action favorite"
//                         }
//                         onClick={() =>
//                           toggleFavorite(
//                             task.id
//                           )
//                         }
//                         title="Favorite"
//                       >
//                         <Star
//                           size={17}
//                           fill={
//                             isFavorite
//                               ? "currentColor"
//                               : "none"
//                           }
//                         />
//                       </button>

//                       <button
//                         className="icon-action timer-action"
//                         onClick={() =>
//                           startTimer(
//                             task
//                           )
//                         }
//                         title="Start Pomodoro"
//                       >
//                         <Timer
//                           size={16}
//                         />
//                       </button>

//                       <button
//                         className="icon-action"
//                         onClick={() =>
//                           openEdit(task)
//                         }
//                         title="Edit"
//                       >
//                         <Pencil
//                           size={16}
//                         />
//                       </button>

//                       {!task.completed && (
//                         <button
//                           className="icon-action archive-action"
//                           onClick={() =>
//                             archiveTask(
//                               task.id
//                             )
//                           }
//                           title="Archive"
//                         >
//                           <Archive
//                             size={16}
//                           />
//                         </button>
//                       )}

//                       {task.isArchived && (
//                         <button
//                           className="icon-action"
//                           onClick={() =>
//                             restoreArchived(
//                               task.id
//                             )
//                           }
//                           title="Restore"
//                         >
//                           <RotateCcw
//                             size={16}
//                           />
//                         </button>
//                       )}

//                       <button
//                         className="icon-action delete"
//                         onClick={() =>
//                           handleDelete(
//                             task.id
//                           )
//                         }
//                         title="Delete"
//                       >
//                         <Trash2
//                           size={16}
//                         />
//                       </button>
//                     </div>
//                   </article>
//                 );
//               }
//             )}
//           </div>
//         )}

//         {/* ==================================================
//             RESULTS
//         ================================================== */}

//         {visibleTasks.length > 0 && (
//           <div className="task-results">
//             <span>
//               Showing{" "}
//               {visibleTasks.length}{" "}
//               of {totalTasks} tasks
//             </span>
//           </div>
//         )}
//       </section>

//       {/* ==================================================
//           POMODORO FLOATING PANEL
//       ================================================== */}

//       {timerTaskId && (
//         <div className="pomodoro-panel">
//           <div className="pomodoro-header">
//             <div>
//               <span>
//                 FOCUS SESSION
//               </span>

//               <h3>
//                 {enrichedTasks.find(
//                   (task) =>
//                     task.id ===
//                     timerTaskId
//                 )?.title ||
//                   "Focus"}
//               </h3>
//             </div>

//             <button
//               onClick={() => {
//                 setTimerTaskId(
//                   null
//                 );
//                 setTimerRunning(
//                   false
//                 );
//               }}
//             >
//               <X size={17} />
//             </button>
//           </div>

//           <div className="pomodoro-time">
//             {formatTimer(
//               timerSeconds
//             )}
//           </div>

//           <div className="pomodoro-actions">
//             {!timerRunning ? (
//               <button
//                 onClick={() =>
//                   setTimerRunning(
//                     true
//                   )
//                 }
//               >
//                 <Play size={16} />
//                 Start
//               </button>
//             ) : (
//               <button
//                 onClick={
//                   pauseTimer
//                 }
//               >
//                 <Pause size={16} />
//                 Pause
//               </button>
//             )}

//             <button
//               onClick={
//                 resetTimer
//               }
//             >
//               <ResetIcon
//                 size={16}
//               />
//               Reset
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ==================================================
//           UNDO DELETE
//       ================================================== */}

//       {deletedTask && (
//         <div className="undo-toast">
//           <span>
//             Task deleted
//           </span>

//           <button
//             onClick={
//               undoDelete
//             }
//           >
//             <Undo2 size={15} />
//             Undo
//           </button>

//           <button
//             onClick={() =>
//               setDeletedTask(null)
//             }
//           >
//             <X size={15} />
//           </button>
//         </div>
//       )}

//       {/* ==================================================
//           EDIT MODAL
//       ================================================== */}

//       {editingTask && (
//         <div className="task-modal-backdrop">
//           <div className="task-edit-modal">
//             <div className="edit-modal-header">
//               <div>
//                 <span className="section-kicker">
//                   EDIT TASK
//                 </span>

//                 <h2>
//                   Update your task
//                 </h2>
//               </div>

//               <button
//                 className="modal-close"
//                 onClick={() =>
//                   setEditingTask(
//                     null
//                   )
//                 }
//               >
//                 <X size={19} />
//               </button>
//             </div>

//             <div className="edit-form">
//               <div className="input-group full">
//                 <label>
//                   Task
//                 </label>

//                 <input
//                   value={
//                     editingTask.title
//                   }
//                   onChange={(event) =>
//                     setEditingTask(
//                       {
//                         ...editingTask,
//                         title:
//                           event.target
//                             .value,
//                       }
//                     )
//                   }
//                 />
//               </div>

//               <div className="edit-grid">
//                 <div className="input-group">
//                   <label>
//                     Category
//                   </label>

//                   <select
//                     value={
//                       editingTask.category
//                     }
//                     onChange={(
//                       event
//                     ) =>
//                       setEditingTask(
//                         {
//                           ...editingTask,
//                           category:
//                             event.target
//                               .value,
//                         }
//                       )
//                     }
//                   >
//                     <option>
//                       Personal
//                     </option>
//                     <option>
//                       Study
//                     </option>
//                     <option>
//                       Coding
//                     </option>
//                     <option>
//                       Work
//                     </option>
//                     <option>
//                       YouTube
//                     </option>
//                     <option>
//                       Scripts
//                     </option>
//                     <option>
//                       Money
//                     </option>
//                     <option>
//                       Clients
//                     </option>
//                     <option>
//                       Health
//                     </option>
//                     <option>
//                       Content
//                     </option>
//                   </select>
//                 </div>

//                 <div className="input-group">
//                   <label>
//                     Priority
//                   </label>

//                   <select
//                     value={
//                       editingTask.priority
//                     }
//                     onChange={(
//                       event
//                     ) =>
//                       setEditingTask(
//                         {
//                           ...editingTask,
//                           priority:
//                             event.target
//                               .value,
//                         }
//                       )
//                     }
//                   >
//                     <option>
//                       High
//                     </option>
//                     <option>
//                       Medium
//                     </option>
//                     <option>
//                       Low
//                     </option>
//                   </select>
//                 </div>

//                 <div className="input-group">
//                   <label>
//                     Due date
//                   </label>

//                   <input
//                     type="date"
//                     value={
//                       editingTask.dueDate ||
//                       ""
//                     }
//                     onChange={(
//                       event
//                     ) =>
//                       setEditingTask(
//                         {
//                           ...editingTask,
//                           dueDate:
//                             event.target
//                               .value,
//                         }
//                       )
//                     }
//                   />
//                 </div>

//                 <div className="input-group">
//                   <label>
//                     Time
//                   </label>

//                   <input
//                     type="time"
//                     value={
//                       editingTask.time ||
//                       ""
//                     }
//                     onChange={(
//                       event
//                     ) =>
//                       setEditingTask(
//                         {
//                           ...editingTask,
//                           time:
//                             event.target
//                               .value,
//                         }
//                       )
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="input-group full">
//                 <label>
//                   <Tag size={14} />
//                   Tags
//                 </label>

//                 <input
//                   value={(
//                     editingTask.tags ||
//                     []
//                   ).join(", ")}
//                   onChange={(event) =>
//                     setEditingTask(
//                       {
//                         ...editingTask,
//                         tags: event.target
//                           .value
//                           .split(",")
//                           .map(
//                             (tag) =>
//                               tag.trim()
//                           )
//                           .filter(
//                             Boolean
//                           ),
//                       }
//                     )
//                   }
//                 />
//               </div>

//               <div className="input-group full">
//                 <label>
//                   <Bell size={14} />
//                   Reminder
//                 </label>

//                 <input
//                   type="datetime-local"
//                   value={
//                     editingTask.reminder ||
//                     ""
//                   }
//                   onChange={(event) =>
//                     setEditingTask(
//                       {
//                         ...editingTask,
//                         reminder:
//                           event.target
//                             .value,
//                       }
//                     )
//                   }
//                 />
//               </div>

//               <div className="input-group full">
//                 <label>
//                   Notes
//                 </label>

//                 <textarea
//                   rows="4"
//                   value={
//                     editingTask.notes ||
//                     ""
//                   }
//                   onChange={(event) =>
//                     setEditingTask(
//                       {
//                         ...editingTask,
//                         notes:
//                           event.target
//                             .value,
//                       }
//                     )
//                   }
//                 />
//               </div>

//               {/* EDIT SUBTASKS */}

//               <div className="edit-subtasks">
//                 <div className="edit-subtask-header">
//                   <label>
//                     <Layers
//                       size={14}
//                     />
//                     Subtasks
//                   </label>
//                 </div>

//                 <div className="edit-subtask-add">
//                   <input
//                     type="text"
//                     placeholder="Add mini task..."
//                     value={
//                       subtaskInput
//                     }
//                     onChange={(event) =>
//                       setSubtaskInput(
//                         event.target
//                           .value
//                       )
//                     }
//                     onKeyDown={(event) => {
//                       if (
//                         event.key ===
//                         "Enter"
//                       ) {
//                         event.preventDefault();
//                         addEditSubtask();
//                       }
//                     }}
//                   />

//                   <button
//                     onClick={
//                       addEditSubtask
//                     }
//                   >
//                     <Plus size={15} />
//                   </button>
//                 </div>

//                 <div className="edit-subtask-list">
//                   {(
//                     editingTask.subtasks ||
//                     []
//                   ).map(
//                     (subtask) => (
//                       <div
//                         className="edit-subtask-row"
//                         key={
//                           subtask.id
//                         }
//                       >
//                         <button
//                           onClick={() =>
//                             setEditingTask(
//                               (
//                                 previous
//                               ) => ({
//                                 ...previous,
//                                 subtasks:
//                                   (
//                                     previous.subtasks ||
//                                     []
//                                   ).map(
//                                     (
//                                       item
//                                     ) =>
//                                       item.id ===
//                                       subtask.id
//                                         ? {
//                                             ...item,
//                                             completed:
//                                               !item.completed,
//                                           }
//                                         : item
//                                   ),
//                               })
//                             )
//                           }
//                         >
//                           {subtask.completed ? (
//                             <Check
//                               size={
//                                 13
//                               }
//                             />
//                           ) : (
//                             <Circle
//                               size={
//                                 13
//                               }
//                             />
//                           )}
//                         </button>

//                         <span>
//                           {
//                             subtask.title
//                           }
//                         </span>

//                         <button
//                           onClick={() =>
//                             setEditingTask(
//                               (
//                                 previous
//                               ) => ({
//                                 ...previous,
//                                 subtasks:
//                                   (
//                                     previous.subtasks ||
//                                     []
//                                   ).filter(
//                                     (
//                                       item
//                                     ) =>
//                                       item.id !==
//                                       subtask.id
//                                   ),
//                               })
//                             )
//                           }
//                         >
//                           <Trash2
//                             size={
//                               13
//                             }
//                           />
//                         </button>
//                       </div>
//                     )
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="edit-modal-footer">
//               <button
//                 className="cancel-edit-btn"
//                 onClick={() =>
//                   setEditingTask(
//                     null
//                   )
//                 }
//               >
//                 Cancel
//               </button>

//               <button
//                 className="save-edit-btn"
//                 onClick={
//                   saveEdit
//                 }
//               >
//                 <Check size={16} />
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </main>
//   );
// }

// export default Tasks;

import React, { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Check,
  Circle,
  Search,
  CalendarDays,
  Clock3,
  Star,
  Pencil,
  X,
  ListTodo,
  CheckCircle2,
  AlertCircle,
  Flame,
  MoreHorizontal,
  ChevronDown,
  RotateCcw,
  Pin,
  PinOff,
  Timer,
  Pause,
  Play,
  RotateCcw as ResetIcon,
  Tag,
  Bell,
  Archive,
  Download,
  Trophy,
  Target,
  Zap,
  BarChart3,
  GripVertical,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  Trash,
  CheckSquare,
} from "lucide-react";

import { useLife } from "../context/LifeContext";
import "./Tasks.css";

/* =========================================================
   HELPERS
========================================================= */

function getToday() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatToday() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function createId() {
  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

function getDateOffset(days) {
  const date = new Date();

  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    "0"
  );
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getWeekDates() {
  const today = new Date();
  const day = today.getDay();

  const mondayOffset = day === 0 ? -6 : 1 - day;

  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);

    date.setDate(monday.getDate() + index);

    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");
    const dayNumber = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${dayNumber}`;
  });
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function Tasks() {
  const {
    tasks = [],
    addTask,
    toggleTask,
    deleteTask,
    editTask,
  } = useLife();

  /* =======================================================
     BASIC FORM
  ======================================================= */

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Personal");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [reminder, setReminder] = useState("");

  /* =======================================================
     SEARCH / FILTER
  ======================================================= */

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Priority");

  /* =======================================================
     EXTRA TASK DATA
  ======================================================= */

  const [favoriteTasks, setFavoriteTasks] = useState([]);
  const [pinnedTasks, setPinnedTasks] = useState([]);
  const [taskDetails, setTaskDetails] = useState({});
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [taskOrder, setTaskOrder] = useState([]);
  const [xp, setXp] = useState(0);
  const [completionHistory, setCompletionHistory] =
    useState([]);

  /* =======================================================
     EDIT
  ======================================================= */

  const [editingTask, setEditingTask] = useState(null);

  /* =======================================================
     UNDO DELETE
  ======================================================= */

  const [deletedTask, setDeletedTask] = useState(null);

  /* =======================================================
     FOCUS MODE
  ======================================================= */

  const [focusMode, setFocusMode] = useState(false);
  const [focusTask, setFocusTask] = useState(null);

  /* =======================================================
     POMODORO
  ======================================================= */

  const [pomodoroSeconds, setPomodoroSeconds] =
    useState(25 * 60);

  const [pomodoroRunning, setPomodoroRunning] =
    useState(false);

  const [pomodoroMode, setPomodoroMode] =
    useState("focus");

  /* =======================================================
     CALENDAR
  ======================================================= */

  const [calendarDate, setCalendarDate] =
    useState(new Date());

  /* =======================================================
     TODAY
  ======================================================= */

  const today = getToday();

  /* =======================================================
     LOAD LOCAL DATA
  ======================================================= */

  useEffect(() => {
    try {
      const favorites = localStorage.getItem(
        "myLifeFavoriteTasks"
      );

      const pinned = localStorage.getItem(
        "myLifePinnedTasks"
      );

      const details = localStorage.getItem(
        "myLifeTaskDetails"
      );

      const archived = localStorage.getItem(
        "myLifeArchivedTasks"
      );

      const order = localStorage.getItem(
        "myLifeTaskOrder"
      );

      const savedXp = localStorage.getItem(
        "myLifeTaskXP"
      );

      const history = localStorage.getItem(
        "myLifeCompletionHistory"
      );

      if (favorites) {
        setFavoriteTasks(JSON.parse(favorites));
      }

      if (pinned) {
        setPinnedTasks(JSON.parse(pinned));
      }

      if (details) {
        setTaskDetails(JSON.parse(details));
      }

      if (archived) {
        setArchivedTasks(JSON.parse(archived));
      }

      if (order) {
        setTaskOrder(JSON.parse(order));
      }

      if (savedXp) {
        setXp(Number(savedXp));
      }

      if (history) {
        setCompletionHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error(
        "Task extra data loading error:",
        error
      );
    }
  }, []);

  /* =======================================================
     SAVE LOCAL DATA
  ======================================================= */

  useEffect(() => {
    localStorage.setItem(
      "myLifeFavoriteTasks",
      JSON.stringify(favoriteTasks)
    );
  }, [favoriteTasks]);

  useEffect(() => {
    localStorage.setItem(
      "myLifePinnedTasks",
      JSON.stringify(pinnedTasks)
    );
  }, [pinnedTasks]);

  useEffect(() => {
    localStorage.setItem(
      "myLifeTaskDetails",
      JSON.stringify(taskDetails)
    );
  }, [taskDetails]);

  useEffect(() => {
    localStorage.setItem(
      "myLifeArchivedTasks",
      JSON.stringify(archivedTasks)
    );
  }, [archivedTasks]);

  useEffect(() => {
    localStorage.setItem(
      "myLifeTaskOrder",
      JSON.stringify(taskOrder)
    );
  }, [taskOrder]);

  useEffect(() => {
    localStorage.setItem(
      "myLifeTaskXP",
      String(xp)
    );
  }, [xp]);

  useEffect(() => {
    localStorage.setItem(
      "myLifeCompletionHistory",
      JSON.stringify(completionHistory)
    );
  }, [completionHistory]);

  /* =======================================================
     KEEP ORDER UPDATED
  ======================================================= */

  useEffect(() => {
    if (!tasks.length) return;

    setTaskOrder((previous) => {
      const existingIds = new Set(
        previous.map(String)
      );

      const newIds = tasks
        .map((task) => String(task.id))
        .filter((id) => !existingIds.has(id));

      if (!newIds.length) {
        return previous.filter((id) =>
          tasks.some(
            (task) => String(task.id) === String(id)
          )
        );
      }

      return [
        ...previous.filter((id) =>
          tasks.some(
            (task) => String(task.id) === String(id)
          )
        ),
        ...newIds,
      ];
    });
  }, [tasks]);

  /* =======================================================
     POMODORO TIMER
  ======================================================= */

  useEffect(() => {
    if (!pomodoroRunning) return;

    const timer = setInterval(() => {
      setPomodoroSeconds((previous) => {
        if (previous <= 1) {
          clearInterval(timer);

          setPomodoroRunning(false);

          if (pomodoroMode === "focus") {
            setXp((previousXp) => previousXp + 10);
          }

          return pomodoroMode === "focus"
            ? 5 * 60
            : 25 * 60;
        }

        return previous - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [pomodoroRunning, pomodoroMode]);

  /* =======================================================
     FORMAT TIMER
  ======================================================= */

  function formatTimer(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(
      2,
      "0"
    )}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  /* =======================================================
     RESET POMODORO
  ======================================================= */

  function resetPomodoro() {
    setPomodoroRunning(false);

    setPomodoroSeconds(
      pomodoroMode === "focus"
        ? 25 * 60
        : 5 * 60
    );
  }

  /* =======================================================
     SWITCH POMODORO MODE
  ======================================================= */

  function switchPomodoroMode(mode) {
    setPomodoroRunning(false);

    setPomodoroMode(mode);

    setPomodoroSeconds(
      mode === "focus"
        ? 25 * 60
        : 5 * 60
    );
  }

  /* =======================================================
     TASK STATS
  ======================================================= */

  const activeTasks = tasks.filter(
    (task) => !archivedTasks.includes(task.id)
  );

  const totalTasks = activeTasks.length;

  const completedTasks = activeTasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = activeTasks.filter(
    (task) => !task.completed
  ).length;

  const overdueTasks = activeTasks.filter(
    (task) =>
      !task.completed &&
      task.dueDate &&
      task.dueDate < today
  ).length;

  const todayTasks = activeTasks.filter(
    (task) => task.dueDate === today
  );

  const todayCompleted = todayTasks.filter(
    (task) => task.completed
  ).length;

  const todayProgress =
    todayTasks.length > 0
      ? Math.round(
          (todayCompleted / todayTasks.length) * 100
        )
      : 0;

  /* =======================================================
     STREAK
  ======================================================= */

  const streak = useMemo(() => {
    let currentStreak = 0;
    let date = new Date();

    while (true) {
      const dateString = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;

      const completed = completionHistory.includes(
        dateString
      );

      if (!completed) break;

      currentStreak++;

      date.setDate(date.getDate() - 1);
    }

    return currentStreak;
  }, [completionHistory]);

  /* =======================================================
     PRODUCTIVITY SCORE
  ======================================================= */

  const productivityScore = useMemo(() => {
    if (!totalTasks) return 0;

    const completionScore =
      (completedTasks / totalTasks) * 60;

    const overduePenalty =
      Math.min(overdueTasks * 5, 20);

    const streakScore =
      Math.min(streak * 2, 20);

    return Math.max(
      0,
      Math.min(
        100,
        Math.round(
          completionScore +
            streakScore -
            overduePenalty
        )
      )
    );
  }, [
    totalTasks,
    completedTasks,
    overdueTasks,
    streak,
  ]);

  /* =======================================================
     COMPLETE TASK
  ======================================================= */

  function handleToggleTask(task) {
    const wasCompleted = task.completed;

    toggleTask(task.id);

    if (!wasCompleted) {
      const points =
        task.priority === "High"
          ? 30
          : task.priority === "Medium"
          ? 20
          : 10;

      setXp((previous) => previous + points);

      if (task.dueDate === today) {
        setCompletionHistory((previous) =>
          previous.includes(today)
            ? previous
            : [...previous, today]
        );
      }
    }
  }

  /* =======================================================
     ADD TASK
  ======================================================= */

  function handleSubmit(event) {
    event.preventDefault();

    if (!title.trim()) return;

    const tags = tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const taskDetailsData = {
      time,
      notes,
      tags,
      reminder,
      subtasks: [],
      pomodoroSessions: 0,
    };

    const task = {
      title: title.trim(),
      category,
      priority,
      dueDate,
    };

    addTask(task);

    setTimeout(() => {
      const generatedTask = tasks[0];

      if (generatedTask?.id) {
        setTaskDetails((previous) => ({
          ...previous,
          [generatedTask.id]: taskDetailsData,
        }));
      }
    }, 50);

    setTitle("");
    setCategory("Personal");
    setPriority("Medium");
    setDueDate("");
    setTime("");
    setNotes("");
    setTagsInput("");
    setReminder("");
  }

  /* =======================================================
     DETAILS HELPER
  ======================================================= */

  function getDetails(taskId) {
    return taskDetails[taskId] || {};
  }

  /* =======================================================
     FAVORITE
  ======================================================= */

  function toggleFavorite(id) {
    setFavoriteTasks((previous) =>
      previous.includes(id)
        ? previous.filter(
            (taskId) => taskId !== id
          )
        : [...previous, id]
    );
  }

  /* =======================================================
     PIN
  ======================================================= */

  function togglePin(id) {
    setPinnedTasks((previous) =>
      previous.includes(id)
        ? previous.filter(
            (taskId) => taskId !== id
          )
        : [id, ...previous]
    );
  }

  /* =======================================================
     DELETE
  ======================================================= */

  function handleDelete(id) {
    const confirmed = window.confirm(
      "Delete this task?"
    );

    if (!confirmed) return;

    const task = tasks.find(
      (item) => item.id === id
    );

    if (!task) return;

    setDeletedTask(task);

    deleteTask(id);

    setFavoriteTasks((previous) =>
      previous.filter(
        (taskId) => taskId !== id
      )
    );

    setPinnedTasks((previous) =>
      previous.filter(
        (taskId) => taskId !== id
      )
    );

    setTaskDetails((previous) => {
      const updated = { ...previous };

      delete updated[id];

      return updated;
    });
  }

  /* =======================================================
     UNDO DELETE
  ======================================================= */

  function undoDelete() {
    if (!deletedTask) return;

    addTask({
      title: deletedTask.title,
      category: deletedTask.category,
      priority: deletedTask.priority,
      dueDate: deletedTask.dueDate,
    });

    setDeletedTask(null);
  }

  /* =======================================================
     EDIT
  ======================================================= */

  function openEdit(task) {
    const details = getDetails(task.id);

    setEditingTask({
      ...task,
      time: details.time || "",
      notes: details.notes || "",
      tags: details.tags || [],
      reminder: details.reminder || "",
    });
  }

  function saveEdit() {
    if (!editingTask?.title?.trim()) return;

    if (editTask) {
      editTask(editingTask.id, {
        title: editingTask.title.trim(),
        category: editingTask.category,
        priority: editingTask.priority,
        dueDate: editingTask.dueDate,
      });
    }

    setTaskDetails((previous) => ({
      ...previous,
      [editingTask.id]: {
        ...(previous[editingTask.id] || {}),
        time: editingTask.time,
        notes: editingTask.notes,
        tags: editingTask.tags || [],
        reminder: editingTask.reminder,
      },
    }));

    setEditingTask(null);
  }

  /* =======================================================
     SUBTASK
  ======================================================= */

  function addSubtask(taskId) {
    const name = window.prompt(
      "Enter subtask:"
    );

    if (!name?.trim()) return;

    setTaskDetails((previous) => {
      const details = previous[taskId] || {};

      const subtasks = details.subtasks || [];

      return {
        ...previous,
        [taskId]: {
          ...details,
          subtasks: [
            ...subtasks,
            {
              id: createId(),
              title: name.trim(),
              completed: false,
            },
          ],
        },
      };
    });
  }

  function toggleSubtask(
    taskId,
    subtaskId
  ) {
    setTaskDetails((previous) => {
      const details = previous[taskId] || {};

      return {
        ...previous,
        [taskId]: {
          ...details,
          subtasks: (details.subtasks || []).map(
            (subtask) =>
              subtask.id === subtaskId
                ? {
                    ...subtask,
                    completed:
                      !subtask.completed,
                  }
                : subtask
          ),
        },
      };
    });
  }

  function deleteSubtask(
    taskId,
    subtaskId
  ) {
    setTaskDetails((previous) => {
      const details = previous[taskId] || {};

      return {
        ...previous,
        [taskId]: {
          ...details,
          subtasks: (
            details.subtasks || []
          ).filter(
            (subtask) =>
              subtask.id !== subtaskId
          ),
        },
      };
    });
  }

  /* =======================================================
     ARCHIVE
  ======================================================= */

  function archiveTask(id) {
    setArchivedTasks((previous) =>
      previous.includes(id)
        ? previous
        : [...previous, id]
    );
  }

  function restoreTask(id) {
    setArchivedTasks((previous) =>
      previous.filter(
        (taskId) => taskId !== id
      )
    );
  }

  /* =======================================================
     START FOCUS
  ======================================================= */

  function startFocus(task) {
    setFocusTask(task);

    setFocusMode(true);

    setPomodoroRunning(false);

    setPomodoroMode("focus");

    setPomodoroSeconds(25 * 60);
  }

  /* =======================================================
     DRAG & DROP
  ======================================================= */

  const [draggedTaskId, setDraggedTaskId] =
    useState(null);

  function handleDragStart(id) {
    setDraggedTaskId(id);
  }

  function handleDrop(targetId) {
    if (!draggedTaskId) return;

    setTaskOrder((previous) => {
      const order =
        previous.length > 0
          ? [...previous]
          : tasks.map((task) => task.id);

      const draggedIndex = order.findIndex(
        (id) =>
          String(id) === String(draggedTaskId)
      );

      const targetIndex = order.findIndex(
        (id) =>
          String(id) === String(targetId)
      );

      if (
        draggedIndex === -1 ||
        targetIndex === -1
      ) {
        return order;
      }

      const updated = [...order];

      const [removed] =
        updated.splice(draggedIndex, 1);

      updated.splice(targetIndex, 0, removed);

      return updated;
    });

    setDraggedTaskId(null);
  }

  /* =======================================================
     FILTER + SORT
  ======================================================= */

  const visibleTasks = useMemo(() => {
    const priorityValue = {
      High: 1,
      Medium: 2,
      Low: 3,
    };

    let result = activeTasks.map((task) => {
      const details = taskDetails[task.id] || {};

      return {
        ...task,

        title:
          details.editedTitle ||
          task.title,

        category:
          details.editedCategory ||
          task.category ||
          "Personal",

        priority:
          details.editedPriority ||
          task.priority ||
          "Medium",

        dueDate:
          details.editedDueDate ||
          task.dueDate ||
          "",

        time: details.time || "",

        notes: details.notes || "",

        tags: details.tags || [],

        reminder:
          details.reminder || "",

        subtasks:
          details.subtasks || [],
      };
    });

    result = result.filter((task) => {
      const query = search.toLowerCase();

      const matchesSearch =
        task.title
          .toLowerCase()
          .includes(query) ||
        task.category
          .toLowerCase()
          .includes(query) ||
        task.notes
          .toLowerCase()
          .includes(query) ||
        task.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        );

      if (!matchesSearch) return false;

      if (filter === "Today") {
        return task.dueDate === today;
      }

      if (filter === "Tomorrow") {
        return (
          task.dueDate ===
          getDateOffset(1)
        );
      }

      if (filter === "This Week") {
        return getWeekDates().includes(
          task.dueDate
        );
      }

      if (filter === "Pending") {
        return !task.completed;
      }

      if (filter === "Completed") {
        return task.completed;
      }

      if (filter === "Overdue") {
        return (
          !task.completed &&
          task.dueDate &&
          task.dueDate < today
        );
      }

      if (filter === "High Priority") {
        return (
          task.priority.toLowerCase() ===
          "high"
        );
      }

      if (filter === "Favorites") {
        return favoriteTasks.includes(
          task.id
        );
      }

      if (filter === "Pinned") {
        return pinnedTasks.includes(task.id);
      }

      if (filter === "Archived") {
        return archivedTasks.includes(
          task.id
        );
      }

      return true;
    });

    if (filter !== "Archived") {
      result = result.filter(
        (task) =>
          !archivedTasks.includes(task.id)
      );
    }

    result.sort((a, b) => {
      if (sortBy === "Priority") {
        return (
          (priorityValue[a.priority] || 2) -
          (priorityValue[b.priority] || 2)
        );
      }

      if (sortBy === "Date") {
        return (
          new Date(
            a.dueDate || "9999-12-31"
          ) -
          new Date(
            b.dueDate || "9999-12-31"
          )
        );
      }

      if (sortBy === "Newest") {
        return (
          Number(b.id || 0) -
          Number(a.id || 0)
        );
      }

      if (sortBy === "Alphabetical") {
        return a.title.localeCompare(
          b.title
        );
      }

      if (sortBy === "Manual") {
        const aIndex = taskOrder.findIndex(
          (id) =>
            String(id) === String(a.id)
        );

        const bIndex = taskOrder.findIndex(
          (id) =>
            String(id) === String(b.id)
        );

        return aIndex - bIndex;
      }

      return 0;
    });

    return result;
  }, [
    activeTasks,
    taskDetails,
    search,
    filter,
    sortBy,
    favoriteTasks,
    pinnedTasks,
    archivedTasks,
    taskOrder,
    today,
  ]);

  /* =======================================================
     EXPORT JSON
  ======================================================= */

  function exportJSON() {
    const data = activeTasks.map((task) => ({
      ...task,
      details: taskDetails[task.id] || {},
      favorite: favoriteTasks.includes(
        task.id
      ),
      pinned: pinnedTasks.includes(
        task.id
      ),
    }));

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = `tasks-${today}.json`;

    link.click();

    URL.revokeObjectURL(url);
  }

  /* =======================================================
     EXPORT CSV
  ======================================================= */

  function exportCSV() {
    const headers = [
      "Title",
      "Category",
      "Priority",
      "Due Date",
      "Completed",
      "Tags",
      "Notes",
    ];

    const rows = activeTasks.map((task) => {
      const details =
        taskDetails[task.id] || {};

      return [
        task.title,
        task.category,
        task.priority,
        task.dueDate,
        task.completed
          ? "Yes"
          : "No",
        (details.tags || []).join("|"),
        details.notes || "",
      ];
    });

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => {
            const safe =
              String(value ?? "")
                .replace(/"/g, '""');

            return `"${safe}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = `tasks-${today}.csv`;

    link.click();

    URL.revokeObjectURL(url);
  }

  /* =======================================================
     CLEAR COMPLETED
  ======================================================= */

  function clearCompleted() {
    const completed = tasks.filter(
      (task) => task.completed
    );

    if (!completed.length) return;

    const confirmed = window.confirm(
      `Remove ${completed.length} completed task${
        completed.length > 1 ? "s" : ""
      }?`
    );

    if (!confirmed) return;

    completed.forEach((task) => {
      deleteTask(task.id);
    });
  }

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  function resetFilters() {
    setSearch("");
    setFilter("All");
    setSortBy("Priority");
  }

  /* =======================================================
     CALENDAR
  ======================================================= */

  function getCalendarDays() {
    const year =
      calendarDate.getFullYear();

    const month =
      calendarDate.getMonth();

    const firstDay = new Date(
      year,
      month,
      1
    ).getDay();

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const adjustedFirstDay =
      firstDay === 0
        ? 6
        : firstDay - 1;

    const cells = [];

    for (
      let i = 0;
      i < adjustedFirstDay;
      i++
    ) {
      cells.push(null);
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      const date = new Date(
        year,
        month,
        day
      );

      const dateString = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}-${String(
        date.getDate()
      ).padStart(2, "0")}`;

      cells.push(dateString);
    }

    return cells;
  }

  const calendarDays =
    getCalendarDays();

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <main
      className={`tasks-page ${
        focusMode ? "focus-active" : ""
      }`}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <section className="tasks-hero">
        <div>
          <div className="tasks-eyebrow">
            <ListTodo size={15} />
            MY PRODUCTIVITY
          </div>

          <h1>
            Today's Tasks <span>✨</span>
          </h1>

          <p>
            {formatToday()} — focus on what
            matters most.
          </p>
        </div>

        <div className="hero-progress">
          <div className="hero-progress-ring">
            <strong>
              {todayProgress}%
            </strong>
          </div>

          <div>
            <span>
              Today's progress
            </span>

            <strong>
              {todayCompleted} /{" "}
              {todayTasks.length}
            </strong>
          </div>
        </div>
      </section>

      {/* =================================================
          STATS
      ================================================= */}

      <section className="task-stats">
        <div className="task-stat-card">
          <div className="task-stat-icon">
            <ListTodo size={20} />
          </div>

          <div>
            <strong>{totalTasks}</strong>
            <span>Total Tasks</span>
          </div>
        </div>

        <div className="task-stat-card">
          <div className="task-stat-icon completed-icon">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <strong>
              {completedTasks}
            </strong>
            <span>Completed</span>
          </div>
        </div>

        <div className="task-stat-card">
          <div className="task-stat-icon pending-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <strong>
              {pendingTasks}
            </strong>
            <span>Pending</span>
          </div>
        </div>

        <div className="task-stat-card">
          <div className="task-stat-icon overdue-icon">
            <AlertCircle size={20} />
          </div>

          <div>
            <strong>
              {overdueTasks}
            </strong>
            <span>Overdue</span>
          </div>
        </div>

        <div className="task-stat-card">
          <div className="task-stat-icon">
            <Flame size={20} />
          </div>

          <div>
            <strong>{streak}</strong>
            <span>Day Streak</span>
          </div>
        </div>

        <div className="task-stat-card">
          <div className="task-stat-icon">
            <Trophy size={20} />
          </div>

          <div>
            <strong>{xp}</strong>
            <span>XP Points</span>
          </div>
        </div>
      </section>

      {/* =================================================
          PRODUCTIVITY SCORE
      ================================================= */}

      <section className="productivity-dashboard">
        <div className="productivity-score">
          <div className="score-icon">
            <Target size={22} />
          </div>

          <div>
            <span>
              PRODUCTIVITY SCORE
            </span>

            <strong>
              {productivityScore}/100
            </strong>
          </div>
        </div>

        <div className="score-progress">
          <div
            className="score-fill"
            style={{
              width: `${productivityScore}%`,
            }}
          />
        </div>

        <div className="score-items">
          <span>
            <Zap size={14} />
            {xp} XP
          </span>

          <span>
            <Flame size={14} />
            {streak} day streak
          </span>

          <span>
            <BarChart3 size={14} />
            {completedTasks} completed
          </span>
        </div>
      </section>

      {/* =================================================
          TODAY FOCUS
      ================================================= */}

      <section className="today-focus-card">
        <div className="focus-left">
          <div className="focus-icon">
            <Flame size={21} />
          </div>

          <div>
            <span className="focus-label">
              TODAY'S FOCUS
            </span>

            <h2>
              Get the important things
              done.
            </h2>

            <p>
              {todayTasks.length === 0
                ? "No tasks scheduled for today yet."
                : `${todayCompleted} of ${todayTasks.length} tasks completed today.`}
            </p>
          </div>
        </div>

        <div className="focus-progress">
          <div className="focus-progress-top">
            <span>
              Daily progress
            </span>

            <strong>
              {todayProgress}%
            </strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${todayProgress}%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* =================================================
          POMODORO
      ================================================= */}

      <section className="pomodoro-card">
        <div className="pomodoro-header">
          <div>
            <span className="section-kicker">
              FOCUS TIMER
            </span>

            <h2>
              {focusTask
                ? focusTask.title
                : "Pomodoro"}
            </h2>
          </div>

          <Timer size={24} />
        </div>

        <div className="pomodoro-tabs">
          <button
            className={
              pomodoroMode === "focus"
                ? "active"
                : ""
            }
            onClick={() =>
              switchPomodoroMode(
                "focus"
              )
            }
          >
            Focus 25m
          </button>

          <button
            className={
              pomodoroMode === "break"
                ? "active"
                : ""
            }
            onClick={() =>
              switchPomodoroMode(
                "break"
              )
            }
          >
            Break 5m
          </button>
        </div>

        <div className="pomodoro-time">
          {formatTimer(
            pomodoroSeconds
          )}
        </div>

        <div className="pomodoro-actions">
          <button
            onClick={() =>
              setPomodoroRunning(
                (previous) =>
                  !previous
              )
            }
          >
            {pomodoroRunning ? (
              <>
                <Pause size={17} />
                Pause
              </>
            ) : (
              <>
                <Play size={17} />
                Start
              </>
            )}
          </button>

          <button
            onClick={resetPomodoro}
            className="secondary"
          >
            <ResetIcon size={16} />
            Reset
          </button>
        </div>
      </section>

      {/* =================================================
          ADD TASK
      ================================================= */}

      <section className="add-task-card">
        <div className="section-heading">
          <div>
            <span className="section-kicker">
              CREATE
            </span>

            <h2>
              Add a new task
            </h2>
          </div>

          <div className="heading-decoration">
            ✦
          </div>
        </div>

        <form
          className="add-task-form"
          onSubmit={handleSubmit}
        >
          <div className="task-input-main">
            <label>Task</label>

            <input
              type="text"
              placeholder="What do you need to accomplish?"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
            />
          </div>

          <div className="task-form-grid">
            <div className="input-group">
              <label>Category</label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
              >
                <option>Personal</option>
                <option>Study</option>
                <option>Coding</option>
                <option>Work</option>
                <option>YouTube</option>
                <option>Scripts</option>
                <option>Money</option>
                <option>Clients</option>
                <option>Health</option>
                <option>Content</option>
              </select>
            </div>

            <div className="input-group">
              <label>Priority</label>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target.value
                  )
                }
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="input-group">
              <label>Due date</label>

              <input
                type="date"
                value={dueDate}
                onChange={(event) =>
                  setDueDate(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="input-group">
              <label>Time</label>

              <input
                type="time"
                value={time}
                onChange={(event) =>
                  setTime(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="input-group">
              <label>Reminder</label>

              <input
                type="datetime-local"
                value={reminder}
                onChange={(event) =>
                  setReminder(
                    event.target.value
                  )
                }
              />
            </div>

            <div className="input-group">
              <label>Tags</label>

              <input
                type="text"
                placeholder="coding, urgent, client"
                value={tagsInput}
                onChange={(event) =>
                  setTagsInput(
                    event.target.value
                  )
                }
              />
            </div>
          </div>

          <div className="task-notes-input">
            <label>Notes</label>

            <textarea
              placeholder="Add a small note, reminder or detail..."
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
              rows="2"
            />
          </div>

          <button
            type="submit"
            className="add-task-btn"
          >
            <Plus size={18} />
            Add Task
          </button>
        </form>
      </section>

      {/* =================================================
          CALENDAR
      ================================================= */}

      <section className="calendar-card">
        <div className="calendar-header">
          <div>
            <span className="section-kicker">
              SCHEDULE
            </span>

            <h2>
              Calendar View
            </h2>
          </div>

          <div className="calendar-navigation">
            <button
              onClick={() =>
                setCalendarDate(
                  (previous) =>
                    new Date(
                      previous.getFullYear(),
                      previous.getMonth() -
                        1,
                      1
                    )
                )
              }
            >
              <ChevronLeft size={18} />
            </button>

            <strong>
              {calendarDate.toLocaleDateString(
                "en-US",
                {
                  month: "long",
                  year: "numeric",
                }
              )}
            </strong>

            <button
              onClick={() =>
                setCalendarDate(
                  (previous) =>
                    new Date(
                      previous.getFullYear(),
                      previous.getMonth() +
                        1,
                      1
                    )
                )
              }
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="calendar-weekdays">
          {[
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
          ].map((day) => (
            <span key={day}>
              {day}
            </span>
          ))}
        </div>

        <div className="calendar-grid">
          {calendarDays.map(
            (date, index) => {
              if (!date) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="calendar-day empty"
                  />
                );
              }

              const dateTasks =
                activeTasks.filter(
                  (task) =>
                    task.dueDate === date
                );

              const dateNumber =
                Number(
                  date.split("-")[2]
                );

              return (
                <button
                  key={date}
                  className={`calendar-day ${
                    date === today
                      ? "today"
                      : ""
                  }`}
                  onClick={() => {
                    setDueDate(date);
                    setFilter("Today");
                  }}
                >
                  <strong>
                    {dateNumber}
                  </strong>

                  {dateTasks.length >
                    0 && (
                    <span className="calendar-task-count">
                      {dateTasks.length}
                    </span>
                  )}
                </button>
              );
            }
          )}
        </div>
      </section>

      {/* =================================================
          TASK SECTION
      ================================================= */}

      <section className="tasks-section">
        <div className="tasks-section-header">
          <div>
            <span className="section-kicker">
              YOUR WORK
            </span>

            <h2>All Tasks</h2>
          </div>

          <div className="header-actions">
            <button
              className="export-btn"
              onClick={exportJSON}
              title="Export JSON"
            >
              <Download size={15} />
              JSON
            </button>

            <button
              className="export-btn"
              onClick={exportCSV}
              title="Export CSV"
            >
              <Download size={15} />
              CSV
            </button>

            <button
              className="clear-completed-btn"
              onClick={clearCompleted}
            >
              <Trash2 size={15} />
              Clear completed
            </button>
          </div>
        </div>

        {/* SEARCH + SORT */}

        <div className="task-controls">
          <div className="task-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
            />

            {search && (
              <button
                onClick={() =>
                  setSearch("")
                }
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="sort-control">
            <span>Sort:</span>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value
                )
              }
            >
              <option>Priority</option>
              <option>Date</option>
              <option>Newest</option>
              <option>Alphabetical</option>
              <option>Manual</option>
            </select>

            <ChevronDown size={15} />
          </div>
        </div>

        {/* FILTERS */}

        <div className="task-filters">
          {[
            "All",
            "Today",
            "Tomorrow",
            "This Week",
            "Pending",
            "Completed",
            "Overdue",
            "High Priority",
            "Favorites",
            "Pinned",
          ].map((item) => (
            <button
              key={item}
              className={
                filter === item
                  ? "task-filter active"
                  : "task-filter"
              }
              onClick={() =>
                setFilter(item)
              }
            >
              {item}

              {item === "Today" &&
                todayTasks.length >
                  0 && (
                  <span>
                    {todayTasks.length}
                  </span>
                )}

              {item === "Pending" &&
                pendingTasks > 0 && (
                  <span>
                    {pendingTasks}
                  </span>
                )}

              {item === "Overdue" &&
                overdueTasks > 0 && (
                  <span>
                    {overdueTasks}
                  </span>
                )}
            </button>
          ))}
        </div>

        {/* =================================================
            TASK LIST
        ================================================= */}

        {visibleTasks.length === 0 ? (
          <div className="empty-tasks">
            <div className="empty-task-icon">
              <CheckCircle2 size={34} />
            </div>

            <h3>
              {tasks.length === 0
                ? "Your task list is empty"
                : "No tasks found"}
            </h3>

            <p>
              {tasks.length === 0
                ? "Add your first task and start building momentum."
                : "Try changing your search or filters."}
            </p>

            {tasks.length > 0 && (
              <button
                className="reset-filter-btn"
                onClick={resetFilters}
              >
                <RotateCcw size={15} />
                Reset filters
              </button>
            )}
          </div>
        ) : (
          <div className="task-list">
            {visibleTasks.map(
              (task) => {
                const details =
                  getDetails(
                    task.id
                  );

                const isFavorite =
                  favoriteTasks.includes(
                    task.id
                  );

                const isPinned =
                  pinnedTasks.includes(
                    task.id
                  );

                const isOverdue =
                  !task.completed &&
                  task.dueDate &&
                  task.dueDate < today;

                const subtasks =
                  task.subtasks || [];

                const completedSubtasks =
                  subtasks.filter(
                    (subtask) =>
                      subtask.completed
                  ).length;

                return (
                  <article
                    key={task.id}
                    className={`task-item ${
                      task.completed
                        ? "completed"
                        : ""
                    } ${
                      isOverdue
                        ? "task-overdue"
                        : ""
                    } ${
                      isPinned
                        ? "task-pinned"
                        : ""
                    }`}
                    draggable
                    onDragStart={() =>
                      handleDragStart(
                        task.id
                      )
                    }
                    onDragOver={(event) =>
                      event.preventDefault()
                    }
                    onDrop={() =>
                      handleDrop(
                        task.id
                      )
                    }
                  >
                    {/* DRAG */}

                    <div className="drag-handle">
                      <GripVertical
                        size={17}
                      />
                    </div>

                    {/* CHECK */}

                    <button
                      className="complete-btn"
                      onClick={() =>
                        handleToggleTask(
                          task
                        )
                      }
                      aria-label="Complete task"
                    >
                      {task.completed ? (
                        <Check
                          size={18}
                        />
                      ) : (
                        <Circle
                          size={20}
                        />
                      )}
                    </button>

                    {/* MAIN */}

                    <div className="task-info">
                      <div className="task-title-row">
                        <h3>
                          {task.title}
                        </h3>

                        {isPinned && (
                          <Pin
                            size={14}
                            className="small-pin"
                          />
                        )}

                        {isFavorite && (
                          <Star
                            className="small-star"
                            size={14}
                            fill="currentColor"
                          />
                        )}
                      </div>

                      {task.notes && (
                        <p className="task-note-preview">
                          {task.notes}
                        </p>
                      )}

                      {/* TAGS */}

                      {task.tags?.length >
                        0 && (
                        <div className="task-tags">
                          {task.tags.map(
                            (tag) => (
                              <span
                                key={tag}
                              >
                                <Tag
                                  size={11}
                                />
                                {tag}
                              </span>
                            )
                          )}
                        </div>
                      )}

                      {/* SUBTASKS */}

                      {subtasks.length >
                        0 && (
                        <div className="subtasks-preview">
                          <div className="subtasks-heading">
                            <CheckSquare
                              size={13}
                            />

                            <span>
                              {
                                completedSubtasks
                              }{" "}
                              /{" "}
                              {
                                subtasks.length
                              }{" "}
                              subtasks
                            </span>
                          </div>

                          {subtasks.map(
                            (
                              subtask
                            ) => (
                              <div
                                className="subtask-row"
                                key={
                                  subtask.id
                                }
                              >
                                <button
                                  onClick={() =>
                                    toggleSubtask(
                                      task.id,
                                      subtask.id
                                    )
                                  }
                                >
                                  {subtask.completed ? (
                                    <CheckCircle2
                                      size={
                                        14
                                      }
                                    />
                                  ) : (
                                    <Circle
                                      size={
                                        14
                                      }
                                    />
                                  )}
                                </button>

                                <span
                                  className={
                                    subtask.completed
                                      ? "subtask-completed"
                                      : ""
                                  }
                                >
                                  {
                                    subtask.title
                                  }
                                </span>

                                <button
                                  className="subtask-delete"
                                  onClick={() =>
                                    deleteSubtask(
                                      task.id,
                                      subtask.id
                                    )
                                  }
                                >
                                  <X
                                    size={
                                      12
                                    }
                                  />
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      <div className="task-meta">
                        <span className="category-badge">
                          {task.category}
                        </span>

                        <span
                          className={`priority ${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>

                        {task.dueDate && (
                          <span
                            className={
                              isOverdue
                                ? "date-meta overdue"
                                : "date-meta"
                            }
                          >
                            <CalendarDays
                              size={13}
                            />

                            {isOverdue
                              ? `Overdue · ${formatDate(
                                  task.dueDate
                                )}`
                              : formatDate(
                                  task.dueDate
                                )}
                          </span>
                        )}

                        {task.time && (
                          <span className="date-meta">
                            <Clock3
                              size={13}
                            />
                            {task.time}
                          </span>
                        )}

                        {task.reminder && (
                          <span className="date-meta">
                            <Bell
                              size={13}
                            />
                            Reminder
                          </span>
                        )}
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="task-actions">
                      <button
                        className={
                          isPinned
                            ? "icon-action pinned active"
                            : "icon-action"
                        }
                        onClick={() =>
                          togglePin(
                            task.id
                          )
                        }
                        title={
                          isPinned
                            ? "Unpin"
                            : "Pin"
                        }
                      >
                        {isPinned ? (
                          <PinOff
                            size={16}
                          />
                        ) : (
                          <Pin
                            size={16}
                          />
                        )}
                      </button>

                      <button
                        className={
                          isFavorite
                            ? "icon-action favorite active"
                            : "icon-action favorite"
                        }
                        onClick={() =>
                          toggleFavorite(
                            task.id
                          )
                        }
                        title="Favorite"
                      >
                        <Star
                          size={17}
                          fill={
                            isFavorite
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>

                      <button
                        className="icon-action"
                        onClick={() =>
                          addSubtask(
                            task.id
                          )
                        }
                        title="Add subtask"
                      >
                        <PlusCircle
                          size={16}
                        />
                      </button>

                      <button
                        className="icon-action focus-task-btn"
                        onClick={() =>
                          startFocus(
                            task
                          )
                        }
                        title="Focus mode"
                      >
                        <Timer
                          size={16}
                        />
                      </button>

                      <button
                        className="icon-action"
                        onClick={() =>
                          openEdit(
                            task
                          )
                        }
                        title="Edit"
                      >
                        <Pencil
                          size={16}
                        />
                      </button>

                      <button
                        className="icon-action"
                        onClick={() =>
                          archiveTask(
                            task.id
                          )
                        }
                        title="Archive"
                      >
                        <Archive
                          size={16}
                        />
                      </button>

                      <button
                        className="icon-action delete"
                        onClick={() =>
                          handleDelete(
                            task.id
                          )
                        }
                        title="Delete"
                      >
                        <Trash2
                          size={16}
                        />
                      </button>
                    </div>
                  </article>
                );
              }
            )}
          </div>
        )}

        {/* RESULTS */}

        {visibleTasks.length > 0 && (
          <div className="task-results">
            <span>
              Showing{" "}
              {visibleTasks.length}{" "}
              of {totalTasks} tasks
            </span>

            <MoreHorizontal
              size={17}
            />
          </div>
        )}
      </section>

      {/* =================================================
          UNDO DELETE
      ================================================= */}

      {deletedTask && (
        <div className="undo-toast">
          <span>
            Task deleted
          </span>

          <button
            onClick={undoDelete}
          >
            <RotateCcw
              size={14}
            />
            Undo
          </button>

          <button
            onClick={() =>
              setDeletedTask(null)
            }
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* =================================================
          FOCUS MODE
      ================================================= */}

      {focusMode && (
        <div className="focus-modal-backdrop">
          <div className="focus-modal">
            <button
              className="focus-close"
              onClick={() =>
                setFocusMode(false)
              }
            >
              <X size={19} />
            </button>

            <div className="focus-mode-icon">
              <Zap size={30} />
            </div>

            <span>
              FOCUS MODE
            </span>

            <h2>
              {focusTask?.title ||
                "Deep Work"}
            </h2>

            <div className="focus-timer">
              {formatTimer(
                pomodoroSeconds
              )}
            </div>

            <p>
              Remove distractions.
              Focus on one thing.
            </p>

            <div className="focus-controls">
              <button
                onClick={() =>
                  setPomodoroRunning(
                    (previous) =>
                      !previous
                  )
                }
              >
                {pomodoroRunning ? (
                  <>
                    <Pause
                      size={17}
                    />
                    Pause
                  </>
                ) : (
                  <>
                    <Play
                      size={17}
                    />
                    Start Focus
                  </>
                )}
              </button>

              <button
                className="secondary"
                onClick={
                  resetPomodoro
                }
              >
                <ResetIcon
                  size={16}
                />
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editingTask && (
        <div className="task-modal-backdrop">
          <div className="task-edit-modal">
            <div className="edit-modal-header">
              <div>
                <span className="section-kicker">
                  EDIT TASK
                </span>

                <h2>
                  Update your task
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setEditingTask(null)
                }
              >
                <X size={19} />
              </button>
            </div>

            <div className="edit-form">
              <div className="input-group full">
                <label>Task</label>

                <input
                  value={
                    editingTask.title
                  }
                  onChange={(event) =>
                    setEditingTask({
                      ...editingTask,
                      title:
                        event.target
                          .value,
                    })
                  }
                />
              </div>

              <div className="edit-grid">
                <div className="input-group">
                  <label>
                    Category
                  </label>

                  <select
                    value={
                      editingTask.category
                    }
                    onChange={(event) =>
                      setEditingTask({
                        ...editingTask,
                        category:
                          event.target
                            .value,
                      })
                    }
                  >
                    <option>
                      Personal
                    </option>
                    <option>
                      Study
                    </option>
                    <option>
                      Coding
                    </option>
                    <option>
                      Work
                    </option>
                    <option>
                      YouTube
                    </option>
                    <option>
                      Scripts
                    </option>
                    <option>
                      Money
                    </option>
                    <option>
                      Clients
                    </option>
                    <option>
                      Health
                    </option>
                    <option>
                      Content
                    </option>
                  </select>
                </div>

                <div className="input-group">
                  <label>
                    Priority
                  </label>

                  <select
                    value={
                      editingTask.priority
                    }
                    onChange={(event) =>
                      setEditingTask({
                        ...editingTask,
                        priority:
                          event.target
                            .value,
                      })
                    }
                  >
                    <option>
                      High
                    </option>
                    <option>
                      Medium
                    </option>
                    <option>
                      Low
                    </option>
                  </select>
                </div>

                <div className="input-group">
                  <label>
                    Due date
                  </label>

                  <input
                    type="date"
                    value={
                      editingTask.dueDate ||
                      ""
                    }
                    onChange={(event) =>
                      setEditingTask({
                        ...editingTask,
                        dueDate:
                          event.target
                            .value,
                      })
                    }
                  />
                </div>

                <div className="input-group">
                  <label>Time</label>

                  <input
                    type="time"
                    value={
                      editingTask.time ||
                      ""
                    }
                    onChange={(event) =>
                      setEditingTask({
                        ...editingTask,
                        time:
                          event.target
                            .value,
                      })
                    }
                  />
                </div>

                <div className="input-group">
                  <label>
                    Reminder
                  </label>

                  <input
                    type="datetime-local"
                    value={
                      editingTask.reminder ||
                      ""
                    }
                    onChange={(event) =>
                      setEditingTask({
                        ...editingTask,
                        reminder:
                          event.target
                            .value,
                      })
                    }
                  />
                </div>

                <div className="input-group">
                  <label>
                    Tags
                  </label>

                  <input
                    value={(
                      editingTask.tags ||
                      []
                    ).join(", ")}
                    onChange={(event) =>
                      setEditingTask({
                        ...editingTask,
                        tags:
                          event.target.value
                            .split(",")
                            .map(
                              (tag) =>
                                tag.trim()
                            )
                            .filter(
                              Boolean
                            ),
                      })
                    }
                  />
                </div>
              </div>

              <div className="input-group full">
                <label>Notes</label>

                <textarea
                  rows="4"
                  value={
                    editingTask.notes ||
                    ""
                  }
                  onChange={(event) =>
                    setEditingTask({
                      ...editingTask,
                      notes:
                        event.target
                          .value,
                    })
                  }
                />
              </div>
            </div>

            <div className="edit-modal-footer">
              <button
                className="cancel-edit-btn"
                onClick={() =>
                  setEditingTask(null)
                }
              >
                Cancel
              </button>

              <button
                className="save-edit-btn"
                onClick={saveEdit}
              >
                <Check size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Tasks;
