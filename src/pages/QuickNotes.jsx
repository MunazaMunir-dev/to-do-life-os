import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StickyNote,
  Pencil,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Plus,
  Palette,
  Smile,
  LayoutTemplate,
  Save,
  MousePointer2,
  PenTool,
  Highlighter,
  Brush,
  Circle,
  Square,
  Minus,
  Type,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowUpRight,
  Move,
  Sparkles,
} from "lucide-react";
import "./QuickNotes.css";

/* =========================================================
   COLORS
========================================================= */

const COLORS = [
  "#111827",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#ffffff",
];

/* =========================================================
   STICKERS
========================================================= */

const STICKERS = [
  "⭐",
  "✨",
  "❤️",
  "🔥",
  "🚀",
  "🎯",
  "💡",
  "😊",
  "😂",
  "😎",
  "🥹",
  "📚",
  "💻",
  "💰",
  "📈",
  "☕",
  "🌸",
  "🌙",
  "☀️",
  "🦋",
  "✅",
  "❌",
  "⚡",
  "🎨",
  "🏆",
  "💎",
  "🧠",
  "🎵",
  "🎬",
  "🌈",
];

/* =========================================================
   NOTE COLORS
========================================================= */

const NOTE_COLORS = [
  "#fef08a",
  "#fecdd3",
  "#bfdbfe",
  "#bbf7d0",
  "#ddd6fe",
  "#fed7aa",
  "#bae6fd",
  "#fbcfe8",
];

/* =========================================================
   TEMPLATES
========================================================= */

const TEMPLATES = [
  {
    id: "blank",
    name: "Blank Paper",
    title: "My Blank Board",
    text: "Start creating anything you want.",
  },
  {
    id: "daily",
    name: "Daily Plan",
    title: "TODAY",
    text: "Top priorities\n\n1.\n2.\n3.",
  },
  {
    id: "goals",
    name: "Goal Board",
    title: "MY GOALS 🎯",
    text: "Big goal:\n\nWhy it matters:\n\nNext step:",
  },
  {
    id: "study",
    name: "Study Board",
    title: "STUDY 📚",
    text: "Topic:\n\nImportant concepts:\n\nQuestions:",
  },
  {
    id: "ideas",
    name: "Brain Dump",
    title: "IDEAS 💡",
    text: "Everything on my mind...\n\n•\n•\n•",
  },
  {
    id: "money",
    name: "Money Plan",
    title: "MONEY 💰",
    text: "Income:\n\nExpenses:\n\nSavings:\n\nInvest:",
  },
  {
    id: "content",
    name: "Content",
    title: "CONTENT 🎬",
    text: "Video idea:\n\nHook:\n\nValue:\n\nCTA:",
  },
  {
    id: "project",
    name: "Project",
    title: "PROJECT 💻",
    text: "Project:\n\nFeatures:\n\nTasks:\n\nDeadline:",
  },
  {
    id: "journal",
    name: "Journal",
    title: "TODAY'S JOURNAL 🌸",
    text: "Today I feel...\n\nI learned...\n\nTomorrow:",
  },
  {
    id: "vision",
    name: "Vision Board",
    title: "MY VISION ✨",
    text: "Who I want to become:\n\nWhat I want to build:\n\nMy dream life:",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function distance(a, b) {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

function pointLineDistance(point, start, end) {
  const A = point.x - start.x;
  const B = point.y - start.y;
  const C = end.x - start.x;
  const D = end.y - start.y;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;

  let param = -1;

  if (lenSq !== 0) {
    param = dot / lenSq;
  }

  let xx;
  let yy;

  if (param < 0) {
    xx = start.x;
    yy = start.y;
  } else if (param > 1) {
    xx = end.x;
    yy = end.y;
  } else {
    xx = start.x + param * C;
    yy = start.y + param * D;
  }

  return Math.hypot(point.x - xx, point.y - yy);
}

/* =========================================================
   MAIN
========================================================= */

function QuickNotes() {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  const [tool, setTool] = useState("pointer");
  const [color, setColor] = useState("#111827");
  const [brushSize, setBrushSize] = useState(4);

  const [notes, setNotes] = useState([]);
  const [stickers, setStickers] = useState([]);
  const [texts, setTexts] = useState([]);

  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const [showStickers, setShowStickers] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const [zoom, setZoom] = useState(1);
  const [background, setBackground] = useState("grid");

  const [smartShape, setSmartShape] = useState(true);

  const drawing = useRef(false);
  const shapeStart = useRef(null);
  const shapeSnapshot = useRef(null);
  const currentStroke = useRef([]);
  const dragData = useRef(null);

  const canvasSize = useRef({
    width: 0,
    height: 0,
    dpr: 1,
  });

  /* =========================================================
     TOOLS
  ========================================================= */

  const drawingTools = [
    "pencil",
    "pen",
    "brush",
    "marker",
    "highlighter",
    "eraser",
  ];

  const shapeTools = [
    "circle",
    "square",
    "line",
    "arrow",
  ];

  /* =========================================================
     LOAD STORAGE
  ========================================================= */

  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem("myLifeQuickNotes");
      const savedStickers = localStorage.getItem("myLifeQuickStickers");
      const savedTexts = localStorage.getItem("myLifeQuickTexts");

      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }

      if (savedStickers) {
        setStickers(JSON.parse(savedStickers));
      }

      if (savedTexts) {
        setTexts(JSON.parse(savedTexts));
      }
    } catch (error) {
      console.error("QuickNotes loading error:", error);
    }
  }, []);

  /* =========================================================
     SAVE STORAGE
  ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      "myLifeQuickNotes",
      JSON.stringify(notes)
    );
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(
      "myLifeQuickStickers",
      JSON.stringify(stickers)
    );
  }, [stickers]);

  useEffect(() => {
    localStorage.setItem(
      "myLifeQuickTexts",
      JSON.stringify(texts)
    );
  }, [texts]);

  /* =========================================================
     CANVAS INITIALIZATION
  ========================================================= */

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;

    if (!canvas || !wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const width = Math.max(1, Math.round(rect.width));
    const height = Math.max(1, Math.round(rect.height));

    const previous = canvasSize.current;

    const oldData =
      previous.width > 0 && previous.height > 0
        ? canvas.toDataURL("image/png")
        : null;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    canvasSize.current = {
      width,
      height,
      dpr,
    };

    const ctx = canvas.getContext("2d");

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (oldData) {
      const image = new Image();

      image.onload = () => {
        ctx.save();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(image, 0, 0, width, height);
        ctx.restore();
      };

      image.src = oldData;
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setupCanvas();
    }, 50);

    window.addEventListener("resize", setupCanvas);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", setupCanvas);
    };
  }, [setupCanvas]);

  /* =========================================================
     GET POINT
  ========================================================= */

  function getPoint(event) {
    const canvas = canvasRef.current;

    if (!canvas) {
      return {
        x: 0,
        y: 0,
      };
    }

    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  /* =========================================================
     CANVAS CONTEXT
  ========================================================= */

  function resetContext(ctx) {
    const { dpr } = canvasSize.current;

    ctx.setTransform(
      dpr || 1,
      0,
      0,
      dpr || 1,
      0,
      0
    );

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }

  /* =========================================================
     SNAPSHOT
  ========================================================= */

  function getCanvasSnapshot() {
    const canvas = canvasRef.current;

    if (!canvas) return null;

    return canvas.toDataURL("image/png");
  }

  function pushHistory(snapshot = null) {
    const image = snapshot || getCanvasSnapshot();

    if (!image) return;

    setHistory((prev) => {
      const base =
        historyIndex >= 0
          ? prev.slice(0, historyIndex + 1)
          : [];

      const updated = [...base, image].slice(-50);

      setHistoryIndex(updated.length - 1);

      return updated;
    });
  }

  /* =========================================================
     RESTORE SNAPSHOT
  ========================================================= */

  function restoreSnapshot(imageData) {
    const canvas = canvasRef.current;

    if (!canvas || !imageData) return;

    const ctx = canvas.getContext("2d");

    const image = new Image();

    image.onload = () => {
      const width = canvasSize.current.width;
      const height = canvasSize.current.height;
      const dpr = canvasSize.current.dpr || 1;

      ctx.save();

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      ctx.drawImage(
        image,
        0,
        0,
        width,
        height
      );

      ctx.restore();
    };

    image.src = imageData;
  }

  /* =========================================================
     UNDO
  ========================================================= */

  function undo() {
    if (historyIndex < 0) return;

    if (historyIndex === 0) {
      clearCanvas(false);
      setHistoryIndex(-1);
      return;
    }

    const newIndex = historyIndex - 1;

    setHistoryIndex(newIndex);

    restoreSnapshot(history[newIndex]);
  }

  /* =========================================================
     REDO
  ========================================================= */

  function redo() {
    if (
      historyIndex >=
      history.length - 1
    ) {
      return;
    }

    const newIndex = historyIndex + 1;

    setHistoryIndex(newIndex);

    restoreSnapshot(history[newIndex]);
  }

  /* =========================================================
     CLEAR
  ========================================================= */

  function clearCanvas(addHistory = true) {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const width = canvasSize.current.width;
    const height = canvasSize.current.height;
    const dpr = canvasSize.current.dpr || 1;

    ctx.save();

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(
      0,
      0,
      width,
      height
    );

    ctx.restore();

    if (addHistory) {
      pushHistory(
        canvas.toDataURL("image/png")
      );
    }
  }

  /* =========================================================
     BRUSH SETUP
  ========================================================= */

  function setupBrush(ctx) {
    resetContext(ctx);

    if (tool === "eraser") {
      ctx.globalCompositeOperation =
        "destination-out";

      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = Math.max(
        8,
        brushSize * 4
      );

      return;
    }

    ctx.globalCompositeOperation =
      "source-over";

    ctx.strokeStyle = color;

    if (tool === "pencil") {
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = 1;
    }

    if (tool === "pen") {
      ctx.lineWidth = Math.max(
        1.5,
        brushSize / 2
      );
      ctx.globalAlpha = 1;
    }

    if (tool === "brush") {
      ctx.lineWidth = brushSize * 1.7;
      ctx.globalAlpha = 0.9;
    }

    if (tool === "marker") {
      ctx.lineWidth = brushSize * 2.5;
      ctx.globalAlpha = 0.55;
    }

    if (tool === "highlighter") {
      ctx.lineWidth = brushSize * 4;
      ctx.globalAlpha = 0.22;
    }
  }

  /* =========================================================
     DRAW SHAPE
  ========================================================= */

  function drawShape(
    ctx,
    start,
    end,
    type
  ) {
    if (!start || !end) return;

    ctx.save();

    resetContext(ctx);

    ctx.globalCompositeOperation =
      "source-over";

    ctx.globalAlpha = 1;

    ctx.strokeStyle = color;

    ctx.lineWidth = Math.max(
      2,
      brushSize
    );

    ctx.beginPath();

    /* LINE */

    if (type === "line") {
      ctx.moveTo(
        start.x,
        start.y
      );

      ctx.lineTo(
        end.x,
        end.y
      );

      ctx.stroke();
    }

    /* CIRCLE */

    if (type === "circle") {
      const width =
        end.x - start.x;

      const height =
        end.y - start.y;

      const centerX =
        start.x + width / 2;

      const centerY =
        start.y + height / 2;

      const radiusX =
        Math.abs(width / 2);

      const radiusY =
        Math.abs(height / 2);

      ctx.ellipse(
        centerX,
        centerY,
        radiusX,
        radiusY,
        0,
        0,
        Math.PI * 2
      );

      ctx.stroke();
    }

    /* RECTANGLE */

    if (type === "square") {
      const width =
        end.x - start.x;

      const height =
        end.y - start.y;

      ctx.rect(
        start.x,
        start.y,
        width,
        height
      );

      ctx.stroke();
    }

    /* ARROW */

    if (type === "arrow") {
      const angle = Math.atan2(
        end.y - start.y,
        end.x - start.x
      );

      const arrowLength = Math.max(
        14,
        brushSize * 4
      );

      ctx.moveTo(
        start.x,
        start.y
      );

      ctx.lineTo(
        end.x,
        end.y
      );

      ctx.stroke();

      ctx.beginPath();

      ctx.moveTo(
        end.x,
        end.y
      );

      ctx.lineTo(
        end.x -
          arrowLength *
            Math.cos(
              angle - Math.PI / 6
            ),
        end.y -
          arrowLength *
            Math.sin(
              angle - Math.PI / 6
            )
      );

      ctx.moveTo(
        end.x,
        end.y
      );

      ctx.lineTo(
        end.x -
          arrowLength *
            Math.cos(
              angle + Math.PI / 6
            ),
        end.y -
          arrowLength *
            Math.sin(
              angle + Math.PI / 6
            )
      );

      ctx.stroke();
    }

    ctx.restore();
  }

  /* =========================================================
     SMART SHAPE DETECTION
  ========================================================= */

  function detectShape(points) {
    if (!points || points.length < 8) {
      return null;
    }

    const first = points[0];

    const last =
      points[points.length - 1];

    const totalLength =
      points.reduce(
        (sum, point, index) => {
          if (index === 0) {
            return sum;
          }

          return (
            sum +
            distance(
              points[index - 1],
              point
            )
          );
        },
        0
      );

    const directDistance =
      distance(first, last);

    if (totalLength < 35) {
      return null;
    }

    /* BOUNDING BOX */

    const xs = points.map(
      (point) => point.x
    );

    const ys = points.map(
      (point) => point.y
    );

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);

    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = maxX - minX;
    const height = maxY - minY;

    if (
      width < 20 ||
      height < 20
    ) {
      /* LINE / ARROW MAY STILL WORK */
    }

    /* CLOSED */

    const closed =
      directDistance <
      Math.max(
        35,
        Math.min(
          width,
          height
        ) * 0.4
      );

    /* =====================================================
       CIRCLE
    ===================================================== */

    if (
      closed &&
      width > 35 &&
      height > 35
    ) {
      const centerX =
        (minX + maxX) / 2;

      const centerY =
        (minY + maxY) / 2;

      const radius =
        Math.max(
          1,
          Math.min(
            width,
            height
          ) / 2
        );

      const ratios = points.map(
        (point) => {
          const d = Math.hypot(
            point.x - centerX,
            point.y - centerY
          );

          return d / radius;
        }
      );

      const average =
        ratios.reduce(
          (sum, value) =>
            sum + value,
          0
        ) / ratios.length;

      const error =
        ratios.reduce(
          (sum, value) =>
            sum +
            Math.abs(
              value - average
            ),
          0
        ) / ratios.length;

      if (error < 0.22) {
        const radiusX =
          width / 2;

        const radiusY =
          height / 2;

        return {
          type: "circle",
          start: {
            x: centerX - radiusX,
            y: centerY - radiusY,
          },
          end: {
            x: centerX + radiusX,
            y: centerY + radiusY,
          },
        };
      }

      /* RECTANGLE */

      if (
        width > 45 &&
        height > 35
      ) {
        return {
          type: "square",
          start: {
            x: minX,
            y: minY,
          },
          end: {
            x: maxX,
            y: maxY,
          },
        };
      }
    }

    /* =====================================================
       LINE
    ===================================================== */

    const lineError =
      points.reduce(
        (sum, point) => {
          return (
            sum +
            pointLineDistance(
              point,
              first,
              last
            )
          );
        },
        0
      ) / points.length;

    if (
      directDistance > 60 &&
      lineError < 10
    ) {
      return {
        type: "line",
        start: first,
        end: last,
      };
    }

    /* =====================================================
       ARROW
    ===================================================== */

    if (
      directDistance > 60 &&
      lineError < 18
    ) {
      return {
        type: "arrow",
        start: first,
        end: last,
      };
    }

    return null;
  }

  /* =========================================================
     FREE STROKE
  ========================================================= */

  function drawFreeStroke(
    ctx,
    points
  ) {
    if (!points || points.length < 2) {
      return;
    }

    setupBrush(ctx);

    ctx.beginPath();

    ctx.moveTo(
      points[0].x,
      points[0].y
    );

    for (
      let i = 1;
      i < points.length;
      i++
    ) {
      ctx.lineTo(
        points[i].x,
        points[i].y
      );
    }

    ctx.stroke();

    ctx.globalAlpha = 1;

    ctx.globalCompositeOperation =
      "source-over";
  }

  /* =========================================================
     START DRAWING
  ========================================================= */

  function startDrawing(event) {
    if (
      !drawingTools.includes(tool) &&
      !shapeTools.includes(tool) &&
      !smartShape
    ) {
      return;
    }

    event.preventDefault();

    const canvas = canvasRef.current;

    if (!canvas) return;

    const point = getPoint(event);

    try {
      canvas.setPointerCapture(event.pointerId);
    } catch {
      /* Browser may already own pointer */
    }

    drawing.current = true;

    shapeStart.current = point;

    currentStroke.current = [point];

    /*
      IMPORTANT FIX:
      Store ImageData synchronously instead of
      repeatedly restoring an async image.
    */

    if (
      shapeTools.includes(tool) ||
      smartShape
    ) {
      const ctx =
        canvas.getContext("2d");

      const width =
        canvasSize.current.width;

      const height =
        canvasSize.current.height;

      shapeSnapshot.current =
        ctx.getImageData(
          0,
          0,
          Math.max(1, Math.floor(width)),
          Math.max(1, Math.floor(height))
        );

      return;
    }

    const ctx =
      canvas.getContext("2d");

    setupBrush(ctx);

    ctx.beginPath();

    ctx.moveTo(
      point.x,
      point.y
    );
  }

  /* =========================================================
     RESTORE IMAGE DATA
  ========================================================= */

  function restoreImageData(imageData) {
    const canvas = canvasRef.current;

    if (!canvas || !imageData) return;

    const ctx =
      canvas.getContext("2d");

    const dpr =
      canvasSize.current.dpr || 1;

    ctx.save();

    ctx.setTransform(
      dpr,
      0,
      0,
      dpr,
      0,
      0
    );

    ctx.putImageData(
      imageData,
      0,
      0
    );

    ctx.restore();
  }

  /* =========================================================
     DRAW
  ========================================================= */

  function draw(event) {
    if (!drawing.current) {
      return;
    }

    event.preventDefault();

    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx =
      canvas.getContext("2d");

    const point = getPoint(event);

    currentStroke.current.push(point);

    /* =====================================================
       SHAPE MODE
    ===================================================== */

    if (
      shapeTools.includes(tool) ||
      smartShape
    ) {
      const start =
        shapeStart.current;

      if (!start) return;

      /*
        Restore previous synchronous snapshot.
        No async Image loading.
      */

      restoreImageData(
        shapeSnapshot.current
      );

      if (shapeTools.includes(tool)) {
        drawShape(
          ctx,
          start,
          point,
          tool
        );
      } else {
        const detected =
          detectShape(
            currentStroke.current
          );

        /*
          While drawing:
          only show preview if shape is recognized.
          Otherwise preserve the original canvas.
        */

        if (detected) {
          drawShape(
            ctx,
            detected.start,
            detected.end,
            detected.type
          );
        }
      }

      return;
    }

    /* =====================================================
       FREE DRAW
    ===================================================== */

    setupBrush(ctx);

    ctx.lineTo(
      point.x,
      point.y
    );

    ctx.stroke();
  }

  /* =========================================================
     STOP DRAWING
  ========================================================= */

  function stopDrawing(event) {
    if (!drawing.current) {
      return;
    }

    drawing.current = false;

    const canvas = canvasRef.current;

    if (!canvas) return;

    try {
      if (
        event?.pointerId !== undefined &&
        canvas.hasPointerCapture(
          event.pointerId
        )
      ) {
        canvas.releasePointerCapture(
          event.pointerId
        );
      }
    } catch {
      /* Ignore pointer release errors */
    }

    const ctx =
      canvas.getContext("2d");

    const points =
      currentStroke.current;

    const start =
      shapeStart.current;

    const lastPoint =
      points[points.length - 1];

    /* =====================================================
       SHAPE FINALIZATION
    ===================================================== */

    if (
      points.length > 5 &&
      (
        smartShape ||
        shapeTools.includes(tool)
      )
    ) {
      restoreImageData(
        shapeSnapshot.current
      );

      let detected = null;

      if (shapeTools.includes(tool)) {
        detected = {
          type: tool,
          start,
          end: lastPoint,
        };
      } else {
        detected =
          detectShape(points);
      }

      if (detected) {
        drawShape(
          ctx,
          detected.start,
          detected.end,
          detected.type
        );
      } else if (
        smartShape &&
        !shapeTools.includes(tool)
      ) {
        /*
          No shape recognized:
          keep the user's actual rough drawing.
        */

        restoreImageData(
          shapeSnapshot.current
        );

        drawFreeStroke(
          ctx,
          points
        );
      }
    }

    ctx.globalAlpha = 1;

    ctx.globalCompositeOperation =
      "source-over";

    shapeStart.current = null;
    shapeSnapshot.current = null;
    currentStroke.current = [];

    /*
      Save final state.
    */

    const finalSnapshot =
      canvas.toDataURL("image/png");

    pushHistory(finalSnapshot);
  }

  /* =========================================================
     NOTES
  ========================================================= */

  function addNote(template = null) {
    const newNote = {
      id: createId(),
      x: 80 + Math.random() * 250,
      y: 70 + Math.random() * 180,
      color: "#fef08a",
      title:
        template?.title ||
        "New Note",
      content:
        template?.text ||
        "Write something important here...",
    };

    setNotes((prev) => [
      ...prev,
      newNote,
    ]);
  }

  function updateNote(
    id,
    field,
    value
  ) {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              [field]: value,
            }
          : note
      )
    );
  }

  function deleteNote(id) {
    setNotes((prev) =>
      prev.filter(
        (note) => note.id !== id
      )
    );
  }

  function changeNoteColor(
    id,
    newColor
  ) {
    updateNote(
      id,
      "color",
      newColor
    );
  }

  /* =========================================================
     STICKERS
  ========================================================= */

  function addSticker(sticker) {
    const newSticker = {
      id: createId(),
      sticker,
      x: 100 + Math.random() * 400,
      y: 100 + Math.random() * 250,
      size: 42,
    };

    setStickers((prev) => [
      ...prev,
      newSticker,
    ]);
  }

  function deleteSticker(id) {
    setStickers((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  }

  /* =========================================================
     TEXT
  ========================================================= */

  function addText() {
    const newText = {
      id: createId(),
      x: 180,
      y: 150,
      text: "Double click and edit me ✨",
      size: 22,
      color,
    };

    setTexts((prev) => [
      ...prev,
      newText,
    ]);
  }

  function updateText(
    id,
    value
  ) {
    setTexts((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              text: value,
            }
          : item
      )
    );
  }

  function deleteText(id) {
    setTexts((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );
  }

  /* =========================================================
     DRAG
  ========================================================= */

  function startDrag(
    event,
    type,
    id
  ) {
    event.stopPropagation();
    event.preventDefault();

    const point =
      getPoint(event);

    dragData.current = {
      type,
      id,
      startX: point.x,
      startY: point.y,
    };

    try {
      event.currentTarget.setPointerCapture(
        event.pointerId
      );
    } catch {
      /* Ignore */
    }

    window.addEventListener(
      "pointermove",
      handleDrag
    );

    window.addEventListener(
      "pointerup",
      stopDrag
    );
  }

  function handleDrag(event) {
    if (!dragData.current) {
      return;
    }

    const point =
      getPoint(event);

    const {
      type,
      id,
      startX,
      startY,
    } = dragData.current;

    const dx =
      point.x - startX;

    const dy =
      point.y - startY;

    dragData.current.startX =
      point.x;

    dragData.current.startY =
      point.y;

    if (type === "note") {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? {
                ...note,
                x: note.x + dx,
                y: note.y + dy,
              }
            : note
        )
      );
    }

    if (type === "sticker") {
      setStickers((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                x: item.x + dx,
                y: item.y + dy,
              }
            : item
        )
      );
    }

    if (type === "text") {
      setTexts((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                x: item.x + dx,
                y: item.y + dy,
              }
            : item
        )
      );
    }
  }

  function stopDrag() {
    dragData.current = null;

    window.removeEventListener(
      "pointermove",
      handleDrag
    );

    window.removeEventListener(
      "pointerup",
      stopDrag
    );
  }

  /* =========================================================
     TEMPLATE
  ========================================================= */

  function applyTemplate(
    template
  ) {
    clearCanvas(false);

    setNotes([]);
    setStickers([]);
    setTexts([]);

    setTimeout(() => {
      addNote(template);
    }, 50);

    setShowTemplates(false);
  }

  /* =========================================================
     SAVE
  ========================================================= */

  function saveBoard() {
    localStorage.setItem(
      "myLifeQuickNotes",
      JSON.stringify(notes)
    );

    localStorage.setItem(
      "myLifeQuickStickers",
      JSON.stringify(stickers)
    );

    localStorage.setItem(
      "myLifeQuickTexts",
      JSON.stringify(texts)
    );

    alert(
      "Board saved successfully! ✨"
    );
  }

  /* =========================================================
     DOWNLOAD
  ========================================================= */

  function wrapText(
    ctx,
    text,
    x,
    y,
    maxWidth,
    lineHeight
  ) {
    const words =
      text.split(/\s+/);

    let line = "";
    let currentY = y;

    words.forEach((word) => {
      const testLine =
        line.length > 0
          ? `${line} ${word}`
          : word;

      const width =
        ctx.measureText(
          testLine
        ).width;

      if (
        width > maxWidth &&
        line
      ) {
        ctx.fillText(
          line,
          x,
          currentY
        );

        line = word;
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    });

    if (line) {
      ctx.fillText(
        line,
        x,
        currentY
      );
    }
  }

  function downloadBoard() {
    const canvas =
      canvasRef.current;

    const wrapper =
      wrapperRef.current;

    if (!canvas || !wrapper) {
      return;
    }

    const width =
      canvasSize.current.width ||
      wrapper.clientWidth;

    const height =
      canvasSize.current.height ||
      wrapper.clientHeight;

    const scale = 2;

    const output =
      document.createElement(
        "canvas"
      );

    output.width =
      width * scale;

    output.height =
      height * scale;

    const ctx =
      output.getContext("2d");

    ctx.scale(
      scale,
      scale
    );

    /* BACKGROUND */

    ctx.fillStyle =
      "#ffffff";

    ctx.fillRect(
      0,
      0,
      width,
      height
    );

    /* DRAWING */

    ctx.drawImage(
      canvas,
      0,
      0,
      width,
      height
    );

    /* NOTES */

    notes.forEach((note) => {
      ctx.save();

      ctx.fillStyle =
        note.color;

      ctx.shadowColor =
        "rgba(0,0,0,0.15)";

      ctx.shadowBlur = 12;

      ctx.fillRect(
        note.x,
        note.y,
        220,
        180
      );

      ctx.shadowBlur = 0;

      ctx.fillStyle =
        "#111827";

      ctx.font =
        "bold 14px Arial";

      ctx.fillText(
        note.title,
        note.x + 12,
        note.y + 27
      );

      ctx.font =
        "12px Arial";

      const lines =
        note.content.split("\n");

      let textY =
        note.y + 53;

      lines
        .slice(0, 8)
        .forEach((line) => {
          wrapText(
            ctx,
            line,
            note.x + 12,
            textY,
            195,
            16
          );

          textY += 17;
        });

      ctx.restore();
    });

    /* STICKERS */

    stickers.forEach((item) => {
      ctx.save();

      ctx.font =
        `${item.size}px Arial`;

      ctx.fillText(
        item.sticker,
        item.x,
        item.y
      );

      ctx.restore();
    });

    /* TEXT */

    texts.forEach((item) => {
      ctx.save();

      ctx.fillStyle =
        item.color;

      ctx.font =
        `bold ${item.size}px Arial`;

      ctx.fillText(
        item.text,
        item.x,
        item.y
      );

      ctx.restore();
    });

    const link =
      document.createElement(
        "a"
      );

    link.download =
      `my-life-creative-board-${Date.now()}.png`;

    link.href =
      output.toDataURL(
        "image/png"
      );

    link.click();
  }

  /* =========================================================
     ZOOM
  ========================================================= */

  function zoomIn() {
    setZoom((prev) =>
      Math.min(
        1.5,
        Number(
          (prev + 0.1).toFixed(1)
        )
      )
    );
  }

  function zoomOut() {
    setZoom((prev) =>
      Math.max(
        0.6,
        Number(
          (prev - 0.1).toFixed(1)
        )
      )
    );
  }

  function resetZoom() {
    setZoom(1);
  }

  /* =========================================================
     TOOL ICON
  ========================================================= */

  function ToolIcon({ type }) {
    if (type === "pointer")
      return (
        <MousePointer2
          size={18}
        />
      );

    if (type === "pencil")
      return (
        <Pencil size={18} />
      );

    if (type === "pen")
      return (
        <PenTool size={18} />
      );

    if (type === "brush")
      return (
        <Brush size={18} />
      );

    if (type === "marker")
      return (
        <Palette size={18} />
      );

    if (type === "highlighter")
      return (
        <Highlighter
          size={18}
        />
      );

    if (type === "eraser")
      return (
        <Eraser size={18} />
      );

    if (type === "circle")
      return (
        <Circle size={18} />
      );

    if (type === "square")
      return (
        <Square size={18} />
      );

    if (type === "line")
      return (
        <Minus size={18} />
      );

    if (type === "arrow")
      return (
        <ArrowUpRight
          size={18}
        />
      );

    if (type === "text")
      return (
        <Type size={18} />
      );

    return null;
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="quick-notes-page">

      {/* HEADER */}

      <header className="quick-notes-header">
        <div>
          <div className="page-kicker">
            <PenTool size={14} />
            CREATIVE SPACE
          </div>

          <h1>
            My Creative Board
          </h1>

          <p>
            Draw, write, plan and
            create anything you want.
          </p>
        </div>

        <div className="header-actions">
          <button
            className="secondary-btn"
            onClick={saveBoard}
          >
            <Save size={16} />
            Save
          </button>

          <button
            className="primary-btn"
            onClick={downloadBoard}
          >
            <Download size={16} />
            Download PNG
          </button>
        </div>
      </header>

      {/* TOOLBAR */}

      <div className="creative-toolbar">

        <div className="tool-group">

          <button
            className={
              tool === "pointer"
                ? "tool-btn active"
                : "tool-btn"
            }
            onClick={() =>
              setTool("pointer")
            }
            title="Pointer"
          >
            <ToolIcon type="pointer" />
          </button>

          <button
            className={
              tool === "pencil"
                ? "tool-btn active"
                : "tool-btn"
            }
            onClick={() => {
              setSmartShape(false);
              setTool("pencil");
            }}
            title="Pencil"
          >
            <ToolIcon type="pencil" />
          </button>

          <button
            className={
              tool === "pen"
                ? "tool-btn active"
                : "tool-btn"
            }
            onClick={() => {
              setSmartShape(false);
              setTool("pen");
            }}
            title="Fine Pen"
          >
            <ToolIcon type="pen" />
          </button>

          <button
            className={
              tool === "brush"
                ? "tool-btn active"
                : "tool-btn"
            }
            onClick={() => {
              setSmartShape(false);
              setTool("brush");
            }}
            title="Brush"
          >
            <ToolIcon type="brush" />
          </button>

          <button
            className={
              tool === "marker"
                ? "tool-btn active"
                : "tool-btn"
            }
            onClick={() => {
              setSmartShape(false);
              setTool("marker");
            }}
            title="Marker"
          >
            <ToolIcon type="marker" />
          </button>

          <button
            className={
              tool === "highlighter"
                ? "tool-btn active"
                : "tool-btn"
            }
            onClick={() => {
              setSmartShape(false);
              setTool(
                "highlighter"
              );
            }}
            title="Highlighter"
          >
            <ToolIcon
              type="highlighter"
            />
          </button>

          <button
            className={
              tool === "eraser"
                ? "tool-btn active"
                : "tool-btn"
            }
            onClick={() => {
              setSmartShape(false);
              setTool("eraser");
            }}
            title="Eraser"
          >
            <ToolIcon type="eraser" />
          </button>

          <div className="toolbar-divider" />

          {/* AUTO SET */}

          <button
            className={
              smartShape
                ? "tool-btn smart active"
                : "tool-btn smart"
            }
            onClick={() =>
              setSmartShape(
                (prev) => !prev
              )
            }
            title="Auto Set / Smart Shape"
          >
            <Sparkles size={18} />
            <span>
              Auto Set
            </span>
          </button>

          <button
            className={
              tool === "circle"
                ? "tool-btn active"
                : "tool-btn"
            }
            onClick={() => {
              setSmartShape(false);
              setTool("circle");
            }}
            title="Circle"
          >
            <ToolIcon type="circle" />
          </button>

          <button
            className={
              tool === "square"
                ? "tool-btn active"
                : "tool-btn"
            }
            onClick={() => {
              setSmartShape(false);
              setTool("square");
            }}
            title="Rectangle"
          >
            <ToolIcon type="square" />
          </button>

          <button
            className={
              tool === "line"
                ? "tool-btn active"
                : "tool-btn"
            }
            onClick={() => {
              setSmartShape(false);
              setTool("line");
            }}
            title="Straight Line"
          >
            <ToolIcon type="line" />
          </button>

          <button
            className={
              tool === "arrow"
                ? "tool-btn active"
                : "tool-btn"
            }
            onClick={() => {
              setSmartShape(false);
              setTool("arrow");
            }}
            title="Arrow"
          >
            <ToolIcon type="arrow" />
          </button>

          <button
            className={
              tool === "text"
                ? "tool-btn active"
                : "tool-btn"
            }
            onClick={() => {
              setTool("text");
              addText();
            }}
            title="Add Text"
          >
            <ToolIcon type="text" />
          </button>

          <div className="toolbar-divider" />

          <button
            className="tool-btn"
            onClick={undo}
            disabled={
              historyIndex < 0
            }
            title="Undo"
          >
            <Undo2 size={18} />
          </button>

          <button
            className="tool-btn"
            onClick={redo}
            disabled={
              historyIndex >=
              history.length - 1
            }
            title="Redo"
          >
            <Redo2 size={18} />
          </button>

          <button
            className="tool-btn danger"
            onClick={() =>
              clearCanvas()
            }
            title="Clear drawing"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="tool-group">

          <button
            className="tool-btn"
            onClick={() =>
              addNote()
            }
          >
            <StickyNote size={17} />
            Note
          </button>

          <button
            className="tool-btn"
            onClick={() =>
              setShowStickers(
                (prev) => !prev
              )
            }
          >
            <Smile size={17} />
            Stickers
          </button>

          <button
            className="tool-btn"
            onClick={() =>
              setShowTemplates(
                (prev) => !prev
              )
            }
          >
            <LayoutTemplate
              size={17}
            />
            Templates
          </button>
        </div>
      </div>

      {/* CONTROLS */}

      <div className="controls-row">

        <div className="color-section">
          <span className="control-label">
            <Palette size={14} />
            Color
          </span>

          <div className="color-list">
            {COLORS.map((item) => (
              <button
                key={item}
                className={
                  color === item
                    ? "color-dot selected"
                    : "color-dot"
                }
                style={{
                  background:
                    item,
                }}
                onClick={() =>
                  setColor(item)
                }
                title={item}
              />
            ))}
          </div>
        </div>

        <div className="size-section">
          <span className="control-label">
            Brush Size
          </span>

          <input
            type="range"
            min="1"
            max="30"
            value={brushSize}
            onChange={(e) =>
              setBrushSize(
                Number(
                  e.target.value
                )
              )
            }
          />

          <span className="size-value">
            {brushSize}px
          </span>
        </div>

        <div className="zoom-controls">
          <button
            className="small-tool"
            onClick={zoomOut}
            title="Zoom out"
          >
            <ZoomOut size={15} />
          </button>

          <span>
            {Math.round(
              zoom * 100
            )}
            %
          </span>

          <button
            className="small-tool"
            onClick={zoomIn}
            title="Zoom in"
          >
            <ZoomIn size={15} />
          </button>

          <button
            className="small-tool"
            onClick={resetZoom}
            title="Reset zoom"
          >
            <RotateCcw
              size={14}
            />
          </button>
        </div>
      </div>

      {/* STICKERS PANEL */}

      {showStickers && (
        <div className="floating-panel">

          <div className="panel-heading">
            <div>
              <strong>
                Stickers
              </strong>

              <span>
                Click a sticker to
                add it to your board
              </span>
            </div>

            <button
              className="close-btn"
              onClick={() =>
                setShowStickers(false)
              }
            >
              ×
            </button>
          </div>

          <div className="sticker-picker">
            {STICKERS.map(
              (sticker, index) => (
                <button
                  key={`${sticker}-${index}`}
                  className="sticker-btn"
                  onClick={() =>
                    addSticker(
                      sticker
                    )
                  }
                >
                  {sticker}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* TEMPLATES PANEL */}

      {showTemplates && (
        <div className="floating-panel">

          <div className="panel-heading">
            <div>
              <strong>
                Ready-made Templates
              </strong>

              <span>
                Start your board faster
              </span>
            </div>

            <button
              className="close-btn"
              onClick={() =>
                setShowTemplates(false)
              }
            >
              ×
            </button>
          </div>

          <div className="template-grid">
            {TEMPLATES.map(
              (template) => (
                <button
                  key={template.id}
                  className="template-card"
                  onClick={() =>
                    applyTemplate(
                      template
                    )
                  }
                >
                  <div className="template-icon">
                    {template.id ===
                    "study"
                      ? "📚"
                      : template.id ===
                        "money"
                      ? "💰"
                      : template.id ===
                        "content"
                      ? "🎬"
                      : template.id ===
                        "goals"
                      ? "🎯"
                      : template.id ===
                        "journal"
                      ? "🌸"
                      : "✨"}
                  </div>

                  <strong>
                    {template.name}
                  </strong>

                  <span>
                    {template.title}
                  </span>
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* BOARD */}

      <div className="board-card">

        <div className="board-topbar">

          <div>
            <strong>
              My Board
            </strong>

            <span>
              {notes.length} notes ·{" "}
              {stickers.length} stickers ·{" "}
              {texts.length} text
            </span>
          </div>

          <div className="background-controls">
            <span>
              Paper:
            </span>

            <button
              className={
                background === "grid"
                  ? "bg-btn active"
                  : "bg-btn"
              }
              onClick={() =>
                setBackground("grid")
              }
            >
              Grid
            </button>

            <button
              className={
                background === "dots"
                  ? "bg-btn active"
                  : "bg-btn"
              }
              onClick={() =>
                setBackground("dots")
              }
            >
              Dots
            </button>

            <button
              className={
                background === "plain"
                  ? "bg-btn active"
                  : "bg-btn"
              }
              onClick={() =>
                setBackground("plain")
              }
            >
              Plain
            </button>
          </div>
        </div>

        {/* BOARD VIEWPORT */}

        <div className="board-viewport">

          <div
            className="board-scale"
            style={{
              transform: `scale(${zoom})`,
            }}
          >

            <div
              ref={wrapperRef}
              className={`drawing-board ${background}`}
              onPointerDown={(event) => {
                if (
                  tool === "text" ||
                  tool === "pointer"
                ) {
                  return;
                }

                startDrawing(event);
              }}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerCancel={
                stopDrawing
              }
            >

              {/* CANVAS */}

              <canvas
                ref={canvasRef}
                className="drawing-canvas"
              />

              {/* NOTES */}

              {notes.map((note) => (
                <div
                  key={note.id}
                  className="sticky-note"
                  style={{
                    left: note.x,
                    top: note.y,
                    background:
                      note.color,
                  }}
                  onPointerDown={(
                    event
                  ) =>
                    startDrag(
                      event,
                      "note",
                      note.id
                    )
                  }
                >
                  <div className="sticky-header">

                    <Move size={13} />

                    <StickyNote
                      size={15}
                    />

                    <input
                      value={
                        note.title
                      }
                      onChange={(e) =>
                        updateNote(
                          note.id,
                          "title",
                          e.target.value
                        )
                      }
                      onPointerDown={(e) =>
                        e.stopPropagation()
                      }
                    />

                    <button
                      onPointerDown={(e) =>
                        e.stopPropagation()
                      }
                      onClick={() =>
                        deleteNote(
                          note.id
                        )
                      }
                    >
                      ×
                    </button>
                  </div>

                  <textarea
                    value={
                      note.content
                    }
                    onChange={(e) =>
                      updateNote(
                        note.id,
                        "content",
                        e.target.value
                      )
                    }
                    onPointerDown={(e) =>
                      e.stopPropagation()
                    }
                  />

                  <div className="sticky-footer">
                    {NOTE_COLORS.map(
                      (noteColor) => (
                        <button
                          key={noteColor}
                          style={{
                            background:
                              noteColor,
                          }}
                          onPointerDown={(e) =>
                            e.stopPropagation()
                          }
                          onClick={() =>
                            changeNoteColor(
                              note.id,
                              noteColor
                            )
                          }
                        />
                      )
                    )}
                  </div>
                </div>
              ))}

              {/* STICKERS */}

              {stickers.map(
                (item) => (
                  <div
                    key={item.id}
                    className="board-sticker"
                    style={{
                      left: item.x,
                      top: item.y,
                      fontSize:
                        item.size,
                    }}
                    onPointerDown={(
                      event
                    ) =>
                      startDrag(
                        event,
                        "sticker",
                        item.id
                      )
                    }
                  >
                    <span>
                      {item.sticker}
                    </span>

                    <button
                      onPointerDown={(e) =>
                        e.stopPropagation()
                      }
                      onClick={(event) => {
                        event.stopPropagation();

                        deleteSticker(
                          item.id
                        );
                      }}
                    >
                      ×
                    </button>
                  </div>
                )
              )}

              {/* TEXT */}

              {texts.map((item) => (
                <div
                  key={item.id}
                  className="board-text"
                  style={{
                    left: item.x,
                    top: item.y,
                    color:
                      item.color,
                    fontSize:
                      item.size,
                  }}
                  onPointerDown={(
                    event
                  ) =>
                    startDrag(
                      event,
                      "text",
                      item.id
                    )
                  }
                  onDoubleClick={() => {
                    const value =
                      window.prompt(
                        "Edit text:",
                        item.text
                      );

                    if (
                      value !== null
                    ) {
                      updateText(
                        item.id,
                        value
                      );
                    }
                  }}
                >
                  {item.text}

                  <button
                    className="board-text-delete"
                    onPointerDown={(e) =>
                      e.stopPropagation()
                    }
                    onClick={(event) => {
                      event.stopPropagation();

                      deleteText(
                        item.id
                      );
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}

              {/* EMPTY */}

              {notes.length === 0 &&
                stickers.length === 0 &&
                texts.length === 0 && (
                  <div className="board-empty">
                    <PenTool size={34} />

                    <h3>
                      Start creating
                    </h3>

                    <p>
                      Turn on Auto Set
                      and draw a rough
                      circle, rectangle,
                      line or arrow.
                    </p>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS */}

      <div className="quick-actions">

        <button
          onClick={() => {
            setSmartShape(false);
            setTool("pencil");
          }}
        >
          <Pencil size={16} />
          Draw
        </button>

        <button
          onClick={() =>
            addNote()
          }
        >
          <Plus size={16} />
          New Note
        </button>

        <button
          onClick={() =>
            setShowStickers(true)
          }
        >
          <Smile size={16} />
          Add Sticker
        </button>

        <button
          onClick={() =>
            addText()
          }
        >
          <Type size={16} />
          Add Text
        </button>

        <button
          onClick={() =>
            setSmartShape(
              (prev) => !prev
            )
          }
        >
          <Sparkles size={16} />

          {smartShape
            ? "Auto Set ON"
            : "Auto Set OFF"}
        </button>

        <button
          onClick={() => {
            setSmartShape(false);
            setTool("circle");
          }}
        >
          <Circle size={16} />
          Circle
        </button>

        <button
          onClick={
            downloadBoard
          }
        >
          <Download size={16} />
          Export PNG
        </button>
      </div>
    </div>
  );
}

export default QuickNotes;