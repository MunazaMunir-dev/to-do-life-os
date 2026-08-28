
import React, { useEffect, useMemo, useState } from "react";
import {
  BookHeart,
  CalendarDays,
  Heart,
  Search,
  Plus,
  Trash2,
  Star,
  Sparkles,
  Moon,
  Sun,
  Brain,
  Smile,
  Wallet,
  GraduationCap,
  Briefcase,
  Send,
  X,
  ChevronRight,
  Camera,
  MapPin,
  Music,
  Shirt,
  Download,
  FileText,
  Flame,
  Award,
  Lock,
  Unlock,
  Palette,
  ImagePlus,
} from "lucide-react";
import jsPDF from "jspdf";
import "./Journal.css";

// =====================================================
// TEMPLATES
// =====================================================

const TEMPLATES = [
  {
    id: "daily",
    title: "Daily Journal",
    icon: "🌷",
    category: "Daily",
    color: "#fce7f3",
    questions: [
      "How was my day?",
      "What happened today?",
      "What was the best moment?",
      "What was difficult?",
      "What did I learn?",
      "What do I want to do tomorrow?",
    ],
  },
  {
    id: "gratitude",
    title: "Gratitude Journal",
    icon: "💗",
    category: "Gratitude",
    color: "#fef3c7",
    questions: [
      "3 things I am grateful for...",
      "Someone I appreciate...",
      "Something beautiful I noticed today...",
      "A small thing that made me happy...",
    ],
  },
  {
    id: "brain-dump",
    title: "Brain Dump",
    icon: "🧠",
    category: "Mind",
    color: "#ede9fe",
    questions: [
      "What's on my mind?",
      "What am I worried about?",
      "Things I need to remember...",
      "Things I need to do...",
      "Random thoughts...",
    ],
  },
  {
    id: "self-love",
    title: "Self Love",
    icon: "🎀",
    category: "Self",
    color: "#fce7f3",
    questions: [
      "Things I love about myself...",
      "Something I did well...",
      "My recent wins...",
      "What makes me unique?",
      "What do I need to hear today?",
    ],
  },
  {
    id: "future-self",
    title: "Future Me",
    icon: "✨",
    category: "Dreams",
    color: "#e0f2fe",
    questions: [
      "Dear future me...",
      "Where do I want to be?",
      "What kind of girl am I becoming?",
      "What am I building?",
      "What does my dream life look like?",
    ],
  },
  {
    id: "morning",
    title: "Morning Journal",
    icon: "☀️",
    category: "Routine",
    color: "#fef3c7",
    questions: [
      "How do I feel this morning?",
      "Today's intention...",
      "Today's top priorities...",
      "How do I want to feel today?",
      "One thing I am excited about...",
    ],
  },
  {
    id: "night",
    title: "Night Reflection",
    icon: "🌙",
    category: "Reflection",
    color: "#e0e7ff",
    questions: [
      "How was today?",
      "What went well?",
      "What drained my energy?",
      "What am I proud of?",
      "What should I improve tomorrow?",
    ],
  },
  {
    id: "growth",
    title: "Personal Growth",
    icon: "🦋",
    category: "Growth",
    color: "#dcfce7",
    questions: [
      "What did I improve today?",
      "What mistake taught me something?",
      "What habit am I building?",
      "What am I proud of?",
      "What is my next step?",
    ],
  },
  {
    id: "money",
    title: "Money Journal",
    icon: "💸",
    category: "Money",
    color: "#dcfce7",
    questions: [
      "What did I spend today?",
      "Was it necessary?",
      "What did I earn?",
      "What is my current money goal?",
      "One financial lesson...",
    ],
  },
  {
    id: "study",
    title: "Study Journal",
    icon: "📚",
    category: "Study",
    color: "#dbeafe",
    questions: [
      "What did I study?",
      "What did I understand?",
      "What confused me?",
      "What should I revise?",
      "What will I study next?",
    ],
  },
  {
    id: "career",
    title: "Career Journal",
    icon: "💼",
    category: "Career",
    color: "#e0e7ff",
    questions: [
      "What career progress did I make?",
      "What skill am I building?",
      "What opportunity did I discover?",
      "What is my biggest career goal?",
      "My next career action...",
    ],
  },
  {
    id: "main-character",
    title: "Main Character",
    icon: "🎀",
    category: "Fun",
    color: "#fce7f3",
    questions: [
      "Today's main-character moment...",
      "Today's outfit...",
      "Song of the day...",
      "Current obsession...",
      "Today's little win...",
      "What made me smile?",
    ],
  },
  {
    id: "letter-future",
    title: "Letter To Future Me",
    icon: "💌",
    category: "Letters",
    color: "#fef2f2",
    questions: [
      "Dear future me...",
      "I hope you remember...",
      "Right now I am...",
      "I hope you have achieved...",
      "Never forget...",
    ],
  },
  {
    id: "younger-self",
    title: "Letter To Younger Me",
    icon: "🧸",
    category: "Letters",
    color: "#fef3c7",
    questions: [
      "Dear younger me...",
      "I want you to know...",
      "You were never...",
      "You should always remember...",
      "I am proud of you because...",
    ],
  },
  {
    id: "self-care",
    title: "Self-Care Day",
    icon: "🛁",
    category: "Self Care",
    color: "#fce7f3",
    questions: [
      "How did I take care of myself?",
      "What made me feel peaceful?",
      "What does my body need?",
      "What does my mind need?",
      "One kind thing I can do for myself...",
    ],
  },
  {
    id: "glow-up",
    title: "Glow Up Journal",
    icon: "✨",
    category: "Glow Up",
    color: "#fef3c7",
    questions: [
      "How did I take care of my appearance?",
      "What healthy habit did I follow?",
      "How did I feel about myself?",
      "What am I improving?",
      "How do I want to show up tomorrow?",
    ],
  },
  {
    id: "dream-life",
    title: "Dream Life",
    icon: "🏡",
    category: "Dreams",
    color: "#dbeafe",
    questions: [
      "What does my dream life look like?",
      "Where do I live?",
      "What work do I do?",
      "Who am I surrounded by?",
      "What does an ordinary day look like?",
    ],
  },
  {
    id: "bad-day",
    title: "Bad Day Journal",
    icon: "🌧️",
    category: "Mind",
    color: "#e0e7ff",
    questions: [
      "What happened?",
      "What am I feeling?",
      "What do I need right now?",
      "What is actually in my control?",
      "What will help me feel a little better?",
    ],
  },
  {
    id: "sunday-reset",
    title: "Sunday Reset",
    icon: "☕",
    category: "Routine",
    color: "#fef3c7",
    questions: [
      "What happened this week?",
      "What am I proud of?",
      "What do I want to leave behind?",
      "What are next week's priorities?",
      "How can I make next week beautiful?",
    ],
  },
  {
    id: "travel",
    title: "Travel Diary",
    icon: "✈️",
    category: "Memories",
    color: "#dbeafe",
    questions: [
      "Where did I go?",
      "What did I see?",
      "My favorite moment...",
      "What did I eat?",
      "Who was with me?",
      "What do I want to remember forever?",
    ],
  },
];

// =====================================================
// MOODS
// =====================================================

const MOODS = [
  { id: "happy", emoji: "😊", label: "Happy" },
  { id: "calm", emoji: "😌", label: "Calm" },
  { id: "excited", emoji: "🤩", label: "Excited" },
  { id: "loved", emoji: "🥰", label: "Loved" },
  { id: "sad", emoji: "😭", label: "Sad" },
  { id: "angry", emoji: "😡", label: "Angry" },
  { id: "anxious", emoji: "😰", label: "Anxious" },
  { id: "tired", emoji: "😴", label: "Tired" },
];

// =====================================================
// THEMES
// =====================================================

const THEMES = [
  { id: "rose", name: "Rose", emoji: "🌸" },
  { id: "coquette", name: "Coquette", emoji: "🎀" },
  { id: "lavender", name: "Lavender", emoji: "🪻" },
  { id: "soft", name: "Soft Girl", emoji: "☁️" },
  { id: "strawberry", name: "Strawberry", emoji: "🍓" },
  { id: "ocean", name: "Ocean", emoji: "🌊" },
  { id: "dark", name: "Night", emoji: "🌙" },
];

// =====================================================
// HELPERS
// =====================================================

function getToday() {
  return new Date().toISOString().split("T")[0];
}

function formatDate(date) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getDateKey(date) {
  return new Date(date).toISOString().split("T")[0];
}

function daysBetween(a, b) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(
    Math.abs(new Date(a).getTime() - new Date(b).getTime()) / oneDay
  );
}

// =====================================================
// COMPONENT
// =====================================================

function Journal() {
  const [entries, setEntries] = useState([]);

  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [selectedMood, setSelectedMood] = useState("happy");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [favoriteOnly, setFavoriteOnly] = useState(false);

  const [photo, setPhoto] = useState("");
  const [location, setLocation] = useState("");
  const [song, setSong] = useState("");
  const [outfit, setOutfit] = useState("");

  const [theme, setTheme] = useState("rose");
  const [showThemes, setShowThemes] = useState(false);

  const [pinEnabled, setPinEnabled] = useState(false);
  const [pin, setPin] = useState("");
  const [enteredPin, setEnteredPin] = useState("");
  const [isLocked, setIsLocked] = useState(false);

  // ===================================================
  // LOAD
  // ===================================================

  useEffect(() => {
    try {
      const savedEntries = localStorage.getItem("myLifeJournal");

      if (savedEntries) {
        setEntries(JSON.parse(savedEntries));
      }

      const savedTheme = localStorage.getItem("myLifeJournalTheme");

      if (savedTheme) {
        setTheme(savedTheme);
      }

      const savedPin = localStorage.getItem("myLifeJournalPin");

      if (savedPin) {
        setPin(savedPin);
        setPinEnabled(true);
        setIsLocked(true);
      }
    } catch (error) {
      console.error("Journal loading error:", error);
    }
  }, []);

  // ===================================================
  // SAVE
  // ===================================================

  useEffect(() => {
    localStorage.setItem("myLifeJournal", JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem("myLifeJournalTheme", theme);
  }, [theme]);

  // ===================================================
  // IMAGE
  // ===================================================

  function handlePhoto(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert("Please choose an image smaller than 3MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setPhoto(reader.result);
    };

    reader.readAsDataURL(file);
  }

  // ===================================================
  // EDITOR
  // ===================================================

  function openTemplate(template) {
    setSelectedTemplate(template);
    setSelectedMood("happy");
    setTitle(template.title);
    setContent("");
    setPhoto("");
    setLocation("");
    setSong("");
    setOutfit("");
    setEditingId(null);
    setShowEditor(true);
  }

  function newEntry() {
    setSelectedTemplate(TEMPLATES[0]);
    setSelectedMood("happy");
    setTitle("My Journal");
    setContent("");
    setPhoto("");
    setLocation("");
    setSong("");
    setOutfit("");
    setEditingId(null);
    setShowEditor(true);
  }

  function insertQuestions() {
    const text = selectedTemplate.questions
      .map((question) => `${question}\n\n`)
      .join("");

    setContent((previous) =>
      previous ? `${previous}\n\n${text}` : text
    );
  }

  // ===================================================
  // SAVE ENTRY
  // ===================================================

  function saveEntry() {
    if (!title.trim() && !content.trim()) {
      alert("Write something before saving 💗");
      return;
    }

    const mood =
      MOODS.find((item) => item.id === selectedMood) || MOODS[0];

    if (editingId) {
      setEntries((previous) =>
        previous.map((entry) =>
          entry.id === editingId
            ? {
                ...entry,
                title: title.trim() || "Untitled Journal",
                content,
                templateId: selectedTemplate.id,
                templateTitle: selectedTemplate.title,
                templateIcon: selectedTemplate.icon,
                category: selectedTemplate.category,
                mood: mood.id,
                moodEmoji: mood.emoji,
                moodLabel: mood.label,
                photo,
                location,
                song,
                outfit,
                updatedAt: new Date().toISOString(),
              }
            : entry
        )
      );
    } else {
      const newJournalEntry = {
        id: createId(),
        title: title.trim() || "Untitled Journal",
        content,
        templateId: selectedTemplate.id,
        templateTitle: selectedTemplate.title,
        templateIcon: selectedTemplate.icon,
        category: selectedTemplate.category,
        mood: mood.id,
        moodEmoji: mood.emoji,
        moodLabel: mood.label,
        photo,
        location,
        song,
        outfit,
        date: getToday(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        favorite: false,
      };

      setEntries((previous) => [newJournalEntry, ...previous]);
    }

    setShowEditor(false);
    setEditingId(null);
  }

  // ===================================================
  // EDIT
  // ===================================================

  function editEntry(entry) {
    const template =
      TEMPLATES.find((item) => item.id === entry.templateId) ||
      TEMPLATES[0];

    setSelectedTemplate(template);
    setSelectedMood(entry.mood || "happy");

    setTitle(entry.title);
    setContent(entry.content);

    setPhoto(entry.photo || "");
    setLocation(entry.location || "");
    setSong(entry.song || "");
    setOutfit(entry.outfit || "");

    setEditingId(entry.id);
    setShowEditor(true);
  }

  // ===================================================
  // DELETE
  // ===================================================

  function deleteEntry(id) {
    const confirmed = window.confirm(
      "Delete this journal entry?"
    );

    if (!confirmed) return;

    setEntries((previous) =>
      previous.filter((entry) => entry.id !== id)
    );
  }

  // ===================================================
  // FAVORITE
  // ===================================================

  function toggleFavorite(id) {
    setEntries((previous) =>
      previous.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              favorite: !entry.favorite,
            }
          : entry
      )
    );
  }

  // ===================================================
  // FILTERS
  // ===================================================

  const categories = useMemo(() => {
    const unique = [
      ...new Set(entries.map((entry) => entry.category)),
    ];

    return ["All", ...unique];
  }, [entries]);

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        entry.title.toLowerCase().includes(searchText) ||
        entry.content.toLowerCase().includes(searchText);

      const matchesCategory =
        category === "All" || entry.category === category;

      const matchesFavorite =
        !favoriteOnly || entry.favorite;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesFavorite
      );
    });
  }, [entries, search, category, favoriteOnly]);

  // ===================================================
  // STATS
  // ===================================================

  const totalEntries = entries.length;

  const favoriteEntries = entries.filter(
    (entry) => entry.favorite
  ).length;

  const thisMonth = entries.filter((entry) => {
    const date = new Date(entry.date);
    const now = new Date();

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }).length;

  const totalWords = entries.reduce((total, entry) => {
    return total + entry.content.trim().split(/\s+/).filter(Boolean).length;
  }, 0);

  // ===================================================
  // STREAK
  // ===================================================

  const streak = useMemo(() => {
    if (!entries.length) return 0;

    const uniqueDates = [
      ...new Set(entries.map((entry) => entry.date)),
    ].sort((a, b) => new Date(b) - new Date(a));

    let currentStreak = 0;

    let currentDate = getToday();

    for (const date of uniqueDates) {
      if (date === currentDate) {
        currentStreak++;
        const previous = new Date(currentDate);
        previous.setDate(previous.getDate() - 1);
        currentDate = previous.toISOString().split("T")[0];
      } else {
        break;
      }
    }

    return currentStreak;
  }, [entries]);

  // ===================================================
  // ON THIS DAY
  // ===================================================

  const todayMemory = useMemo(() => {
    const today = new Date();

    return entries.filter((entry) => {
      const date = new Date(entry.date);

      return (
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate() &&
        date.getFullYear() !== today.getFullYear()
      );
    });
  }, [entries]);

  // ===================================================
  // ACHIEVEMENTS
  // ===================================================

  const achievements = [
    {
      title: "First Memory",
      description: "Write your first journal entry",
      icon: "🌱",
      unlocked: entries.length >= 1,
    },
    {
      title: "7 Memories",
      description: "Create 7 journal entries",
      icon: "🌷",
      unlocked: entries.length >= 7,
    },
    {
      title: "30 Memories",
      description: "Create 30 journal entries",
      icon: "🦋",
      unlocked: entries.length >= 30,
    },
    {
      title: "Favorite Collector",
      description: "Save 5 favorite memories",
      icon: "⭐",
      unlocked: favoriteEntries >= 5,
    },
    {
      title: "7 Day Writer",
      description: "Journal for 7 days in a row",
      icon: "🔥",
      unlocked: streak >= 7,
    },
    {
      title: "1000 Words",
      description: "Write 1000 total words",
      icon: "📖",
      unlocked: totalWords >= 1000,
    },
  ];

  // ===================================================
  // DOWNLOAD TXT
  // ===================================================

  function downloadEntry(entry) {
    const text = `
MY LIFE JOURNAL
==============================

${entry.title}

Date: ${formatDate(entry.date)}
Template: ${entry.templateIcon} ${entry.templateTitle}
Mood: ${entry.moodEmoji} ${entry.moodLabel}

Location: ${entry.location || "Not added"}
Song: ${entry.song || "Not added"}
Outfit: ${entry.outfit || "Not added"}

------------------------------

${entry.content}

------------------------------

Created with My Life Journal ✨
`;

    const blob = new Blob([text], {
      type: "text/plain",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download =
      `${entry.title
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase()}-journal.txt`;

    link.click();

    URL.revokeObjectURL(url);
  }

  // ===================================================
  // PDF
  // ===================================================

  function downloadPDF(entry) {
    const pdf = new jsPDF();

    let y = 25;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(22);
    pdf.text("MY LIFE JOURNAL", 20, y);

    y += 15;

    pdf.setFontSize(18);
    pdf.text(entry.title || "My Journal", 20, y);

    y += 12;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    pdf.text(`Date: ${formatDate(entry.date)}`, 20, y);
    y += 7;

    pdf.text(
      `Mood: ${entry.moodEmoji || ""} ${entry.moodLabel || ""}`,
      20,
      y
    );

    y += 7;

    pdf.text(
      `Template: ${entry.templateTitle || ""}`,
      20,
      y
    );

    y += 10;

    if (entry.location) {
      pdf.text(`Location: ${entry.location}`, 20, y);
      y += 7;
    }

    if (entry.song) {
      pdf.text(`Song: ${entry.song}`, 20, y);
      y += 7;
    }

    if (entry.outfit) {
      pdf.text(`Outfit: ${entry.outfit}`, 20, y);
      y += 10;
    }

    pdf.line(20, y, 190, y);

    y += 10;

    const lines = pdf.splitTextToSize(
      entry.content || "",
      170
    );

    lines.forEach((line) => {
      if (y > 275) {
        pdf.addPage();
        y = 20;
      }

      pdf.text(line, 20, y);
      y += 6;
    });

    if (entry.photo) {
      if (y > 210) {
        pdf.addPage();
        y = 20;
      }

      try {
        pdf.addImage(
          entry.photo,
          "JPEG",
          20,
          y,
          80,
          60
        );

        y += 70;
      } catch (error) {
        console.log("Image could not be added to PDF.");
      }
    }

    pdf.setFontSize(9);
    pdf.text(
      "Created with My Life Journal ✨",
      20,
      285
    );

    pdf.save(
      `${entry.title
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase()}-journal.pdf`
    );
  }

  // ===================================================
  // PDF ALL
  // ===================================================

  function downloadAllPDF() {
    if (!entries.length) {
      alert("You don't have any journal entries yet.");
      return;
    }

    const pdf = new jsPDF();

    entries.forEach((entry, index) => {
      if (index !== 0) {
        pdf.addPage();
      }

      let y = 25;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.text("MY LIFE JOURNAL", 20, y);

      y += 15;

      pdf.setFontSize(18);
      pdf.text(entry.title || "My Journal", 20, y);

      y += 12;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);

      pdf.text(`Date: ${formatDate(entry.date)}`, 20, y);
      y += 7;

      pdf.text(
        `Mood: ${entry.moodEmoji || ""} ${entry.moodLabel || ""}`,
        20,
        y
      );

      y += 7;

      pdf.text(
        `Template: ${entry.templateTitle || ""}`,
        20,
        y
      );

      y += 12;

      pdf.line(20, y, 190, y);

      y += 10;

      const lines = pdf.splitTextToSize(
        entry.content || "",
        170
      );

      lines.forEach((line) => {
        if (y > 275) {
          pdf.addPage();
          y = 20;
        }

        pdf.text(line, 20, y);
        y += 6;
      });

      pdf.setFontSize(9);
      pdf.text(
        "Created with My Life Journal ✨",
        20,
        285
      );
    });

    pdf.save("my-life-journal.pdf");
  }

  // ===================================================
  // PIN
  // ===================================================

  function savePIN() {
    if (pin.length !== 4) {
      alert("PIN must contain exactly 4 digits.");
      return;
    }

    if (!/^\d{4}$/.test(pin)) {
      alert("Use numbers only.");
      return;
    }

    localStorage.setItem("myLifeJournalPin", pin);

    setPinEnabled(true);
    setIsLocked(true);
    setEnteredPin("");
  }

  function unlockJournal() {
    if (enteredPin === pin) {
      setIsLocked(false);
      setEnteredPin("");
    } else {
      alert("Wrong PIN 💗");
    }
  }

  function removePIN() {
    const confirmation = window.confirm(
      "Remove your journal PIN?"
    );

    if (!confirmation) return;

    localStorage.removeItem("myLifeJournalPin");
    setPin("");
    setPinEnabled(false);
    setIsLocked(false);
  }

  // ===================================================
  // LOCK SCREEN
  // ===================================================

  if (isLocked) {
    return (
      <div className={`journal-page theme-${theme}`}>
        <div className="journal-lock-screen">
          <div className="lock-card">
            <div className="lock-icon">
              🔐
            </div>

            <h1>My Private Journal</h1>

            <p>
              Your little private corner is locked.
            </p>

            <input
              type="password"
              maxLength="4"
              inputMode="numeric"
              placeholder="Enter 4-digit PIN"
              value={enteredPin}
              onChange={(e) =>
                setEnteredPin(
                  e.target.value.replace(/\D/g, "")
                )
              }
            />

            <button
              className="journal-primary-btn"
              onClick={unlockJournal}
            >
              <Unlock size={17} />
              Unlock Journal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className={`journal-page theme-${theme}`}>
      {/* HEADER */}

      <header className="journal-header">
        <div className="journal-heading">
          <div className="journal-kicker">
            <BookHeart size={15} />
            MY PERSONAL JOURNAL
          </div>

          <h1>
            My Journal <span>🌸</span>
          </h1>

          <p>
            Your little corner to think, reflect,
            dream, heal and remember.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="journal-secondary-btn"
            onClick={() =>
              setShowThemes((previous) => !previous)
            }
          >
            <Palette size={17} />
            Theme
          </button>

          <button
            className="journal-primary-btn"
            onClick={newEntry}
          >
            <Plus size={18} />
            New Journal
          </button>
        </div>
      </header>

      {/* THEMES */}

      {showThemes && (
        <section className="theme-panel">
          <div className="theme-panel-title">
            <Sparkles size={16} />
            Choose your journal vibe
          </div>

          <div className="theme-list">
            {THEMES.map((item) => (
              <button
                key={item.id}
                className={
                  theme === item.id
                    ? "theme-option active"
                    : "theme-option"
                }
                onClick={() => {
                  setTheme(item.id);
                  setShowThemes(false);
                }}
              >
                <span>{item.emoji}</span>
                {item.name}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* STATS */}

      <section className="journal-stats">
        <div className="journal-stat-card">
          <div className="stat-icon">📖</div>
          <div>
            <strong>{totalEntries}</strong>
            <span>Total Entries</span>
          </div>
        </div>

        <div className="journal-stat-card">
          <div className="stat-icon">🌷</div>
          <div>
            <strong>{thisMonth}</strong>
            <span>This Month</span>
          </div>
        </div>

        <div className="journal-stat-card">
          <div className="stat-icon">⭐</div>
          <div>
            <strong>{favoriteEntries}</strong>
            <span>Favorites</span>
          </div>
        </div>

        <div className="journal-stat-card">
          <div className="stat-icon">🔥</div>
          <div>
            <strong>{streak}</strong>
            <span>Day Streak</span>
          </div>
        </div>
      </section>

      {/* ON THIS DAY */}

      {todayMemory.length > 0 && (
        <section className="memory-banner">
          <div className="memory-banner-icon">
            💌
          </div>

          <div>
            <div className="section-kicker">
              ON THIS DAY
            </div>

            <h3>
              You have old memories from this date ✨
            </h3>

            {todayMemory.slice(0, 2).map((entry) => (
              <p key={entry.id}>
                {entry.templateIcon}{" "}
                <strong>{entry.title}</strong> —{" "}
                {formatDate(entry.date)}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* QUICK FEATURES */}

      <section className="journal-feature-row">
        <div className="feature-card">
          <div className="feature-icon">🔥</div>
          <div>
            <strong>{streak} day streak</strong>
            <span>
              Keep writing a little every day.
            </span>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📚</div>
          <div>
            <strong>{totalWords} words</strong>
            <span>
              Your thoughts are becoming memories.
            </span>
          </div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🏆</div>
          <div>
            <strong>
              {
                achievements.filter(
                  (item) => item.unlocked
                ).length
              } achievements
            </strong>
            <span>
              Keep going, girl.
            </span>
          </div>
        </div>
      </section>

      {/* TEMPLATES */}

      <section className="journal-section">
        <div className="section-title-row">
          <div>
            <div className="section-kicker">
              <Sparkles size={14} />
              CHOOSE YOUR VIBE
            </div>

            <h2>
              What do you want to write about?
            </h2>
          </div>
        </div>

        <div className="template-grid">
          {TEMPLATES.map((template) => (
            <button
              key={template.id}
              className="journal-template-card"
              onClick={() =>
                openTemplate(template)
              }
              style={{
                "--template-color":
                  template.color,
              }}
            >
              <div className="template-emoji">
                {template.icon}
              </div>

              <div className="template-info">
                <strong>
                  {template.title}
                </strong>

                <span>
                  {template.category}
                </span>
              </div>

              <ChevronRight size={17} />
            </button>
          ))}
        </div>
      </section>

      {/* ACHIEVEMENTS */}

      <section className="achievements-section">
        <div className="section-title-row">
          <div>
            <div className="section-kicker">
              <Award size={14} />
              YOUR JOURNEY
            </div>

            <h2>Journal Achievements</h2>
          </div>
        </div>

        <div className="achievement-grid">
          {achievements.map((item) => (
            <div
              key={item.title}
              className={
                item.unlocked
                  ? "achievement-card unlocked"
                  : "achievement-card"
              }
            >
              <div className="achievement-icon">
                {item.icon}
              </div>

              <div>
                <strong>{item.title}</strong>
                <span>{item.description}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HISTORY */}

      <section className="journal-history">
        <div className="history-header">
          <div>
            <div className="section-kicker">
              <BookHeart size={14} />
              YOUR MEMORIES
            </div>

            <h2>Journal History</h2>
          </div>

          <div className="history-actions">
            <button
              className={
                favoriteOnly
                  ? "favorite-filter active"
                  : "favorite-filter"
              }
              onClick={() =>
                setFavoriteOnly(
                  (previous) => !previous
                )
              }
            >
              <Star size={16} />
              Favorites
            </button>

            {entries.length > 0 && (
              <button
                className="export-all-btn"
                onClick={downloadAllPDF}
              >
                <Download size={16} />
                Export All PDF
              </button>
            )}
          </div>
        </div>

        {/* SEARCH */}

        <div className="journal-filters">
          <div className="journal-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search your memories..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            {search && (
              <button
                onClick={() => setSearch("")}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="category-filters">
            {categories.map((item) => (
              <button
                key={item}
                className={
                  category === item
                    ? "category-btn active"
                    : "category-btn"
                }
                onClick={() =>
                  setCategory(item)
                }
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* EMPTY */}

        {filteredEntries.length === 0 ? (
          <div className="journal-empty">
            <div className="empty-icon">
              🌸
            </div>

            <h3>
              Your journal is waiting
            </h3>

            <p>
              Start writing your first little
              memory today.
            </p>

            <button
              className="journal-primary-btn"
              onClick={newEntry}
            >
              <Plus size={17} />
              Write My First Entry
            </button>
          </div>
        ) : (
          <div className="entries-grid">
            {filteredEntries.map((entry) => (
              <article
                key={entry.id}
                className="journal-entry-card"
              >
                <div className="entry-top">
                  <div className="entry-template">
                    <span className="entry-icon">
                      {entry.templateIcon}
                    </span>

                    <div>
                      <strong>
                        {entry.templateTitle}
                      </strong>

                      <span>
                        {entry.category}
                      </span>
                    </div>
                  </div>

                  <button
                    className={
                      entry.favorite
                        ? "favorite-btn active"
                        : "favorite-btn"
                    }
                    onClick={() =>
                      toggleFavorite(entry.id)
                    }
                  >
                    <Star
                      size={17}
                      fill={
                        entry.favorite
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>

                <div className="entry-date">
                  <CalendarDays size={14} />
                  {formatDate(entry.date)}
                  <span>•</span>
                  {entry.moodEmoji}{" "}
                  {entry.moodLabel}
                </div>

                {entry.photo && (
                  <img
                    src={entry.photo}
                    alt="Journal memory"
                    className="entry-photo"
                  />
                )}

                <h3>{entry.title}</h3>

                <p className="entry-preview">
                  {entry.content
                    .replace(/\n/g, " ")
                    .slice(0, 190)}
                  {entry.content.length > 190
                    ? "..."
                    : ""}
                </p>

                <div className="entry-meta">
                  {entry.location && (
                    <span>
                      <MapPin size={13} />
                      {entry.location}
                    </span>
                  )}

                  {entry.song && (
                    <span>
                      <Music size={13} />
                      {entry.song}
                    </span>
                  )}

                  {entry.outfit && (
                    <span>
                      <Shirt size={13} />
                      {entry.outfit}
                    </span>
                  )}
                </div>

                <div className="entry-actions">
                  <button
                    onClick={() =>
                      editEntry(entry)
                    }
                  >
                    Read & Edit
                  </button>

                  <button
                    onClick={() =>
                      downloadPDF(entry)
                    }
                  >
                    PDF
                  </button>

                  <button
                    onClick={() =>
                      downloadEntry(entry)
                    }
                  >
                    TXT
                  </button>

                  <button
                    className="delete-entry"
                    onClick={() =>
                      deleteEntry(entry.id)
                    }
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* SETTINGS */}

      <section className="journal-settings">
        <div className="settings-title">
          <Lock size={17} />
          Private Journal
        </div>

        {!pinEnabled ? (
          <div className="pin-row">
            <input
              type="password"
              maxLength="4"
              inputMode="numeric"
              placeholder="Create 4-digit PIN"
              value={pin}
              onChange={(e) =>
                setPin(
                  e.target.value.replace(/\D/g, "")
                )
              }
            />

            <button
              className="journal-secondary-btn"
              onClick={savePIN}
            >
              <Lock size={16} />
              Enable Lock
            </button>
          </div>
        ) : (
          <div className="pin-row">
            <span className="pin-enabled">
              🔐 Journal lock is enabled
            </span>

            <button
              className="journal-secondary-btn"
              onClick={removePIN}
            >
              <Unlock size={16} />
              Remove Lock
            </button>
          </div>
        )}
      </section>

      {/* EDITOR */}

      {showEditor && (
        <div className="journal-modal-backdrop">
          <div className="journal-editor-modal">
            <div className="editor-header">
              <div>
                <span className="editor-small-title">
                  {selectedTemplate.icon}{" "}
                  {selectedTemplate.category}
                </span>

                <h2>
                  {editingId
                    ? "Edit Journal"
                    : selectedTemplate.title}
                </h2>
              </div>

              <button
                className="editor-close"
                onClick={() =>
                  setShowEditor(false)
                }
              >
                <X size={19} />
              </button>
            </div>

            {/* MOOD */}

            <div className="editor-section">
              <label>
                How are you feeling today?
              </label>

              <div className="mood-list">
                {MOODS.map((mood) => (
                  <button
                    key={mood.id}
                    className={
                      selectedMood === mood.id
                        ? "mood-btn active"
                        : "mood-btn"
                    }
                    onClick={() =>
                      setSelectedMood(
                        mood.id
                      )
                    }
                  >
                    <span>
                      {mood.emoji}
                    </span>

                    <small>
                      {mood.label}
                    </small>
                  </button>
                ))}
              </div>
            </div>

            {/* TITLE */}

            <div className="editor-section">
              <label>Journal title</label>

              <input
                className="journal-title-input"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Give this memory a title..."
              />
            </div>

            {/* MEMORY DETAILS */}

            <div className="memory-fields">
              <div className="editor-field">
                <label>
                  <MapPin size={14} />
                  Location
                </label>

                <input
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  placeholder="Where were you?"
                />
              </div>

              <div className="editor-field">
                <label>
                  <Music size={14} />
                  Song of the day
                </label>

                <input
                  value={song}
                  onChange={(e) =>
                    setSong(e.target.value)
                  }
                  placeholder="What were you listening to?"
                />
              </div>

              <div className="editor-field">
                <label>
                  <Shirt size={14} />
                  Outfit
                </label>

                <input
                  value={outfit}
                  onChange={(e) =>
                    setOutfit(e.target.value)
                  }
                  placeholder="What were you wearing?"
                />
              </div>

              <div className="editor-field">
                <label>
                  <Camera size={14} />
                  Memory photo
                </label>

                <label className="photo-upload">
                  <ImagePlus size={17} />
                  {photo
                    ? "Change photo"
                    : "Add a photo"}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto}
                  />
                </label>
              </div>
            </div>

            {photo && (
              <div className="photo-preview-wrap">
                <img
                  src={photo}
                  alt="Memory preview"
                  className="photo-preview"
                />

                <button
                  className="remove-photo"
                  onClick={() =>
                    setPhoto("")
                  }
                >
                  <X size={15} />
                </button>
              </div>
            )}

            {/* PROMPTS */}

            <div className="question-helper">
              <div>
                <Sparkles size={16} />
                <strong>
                  Writing prompts
                </strong>
              </div>

              <button
                onClick={insertQuestions}
              >
                Add prompts
              </button>
            </div>

            {/* CONTENT */}

            <textarea
              className="journal-writing-area"
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder={`Start writing here...

This is your private space.

Write honestly.
Write freely.
Nobody is judging you. 🌸`}
            />

            {/* FOOTER */}

            <div className="editor-footer">
              <span>
                {content.length} characters
              </span>

              <div>
                <button
                  className="editor-cancel"
                  onClick={() =>
                    setShowEditor(false)
                  }
                >
                  Cancel
                </button>

                <button
                  className="journal-save-btn"
                  onClick={saveEntry}
                >
                  <Send size={16} />
                  Save Journal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Journal;
