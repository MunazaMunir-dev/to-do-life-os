import { useState } from "react";

import { useLife } from "../context/LifeContext";

import {
  BookOpen,
  Code2,
  Brain,
  Globe,
  MessageCircle,
  TrendingUp,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
} from "lucide-react";

function Learning() {
  const {
    learningTracks = [],
    toggleLearningTopic,
  } = useLife();

  const [openTrack, setOpenTrack] = useState(null);

  const toggleTrack = (id) => {
    setOpenTrack(openTrack === id ? null : id);
  };

  const totalHours = learningTracks.reduce(
    (total, track) => total + Number(track.hours || 0),
    0
  );

  const averageProgress =
    learningTracks.length > 0
      ? Math.round(
          learningTracks.reduce(
            (total, track) =>
              total + Number(track.progress || 0),
            0
          ) / learningTracks.length
        )
      : 0;

  const totalTopics = learningTracks.reduce(
    (total, track) => total + track.topics.length,
    0
  );

  const completedTopics = learningTracks.reduce(
    (total, track) =>
      total +
      track.topics.filter(
        (topic) => topic.completed
      ).length,
    0
  );

  const iconMap = {
    dsa: Code2,
    ml: Brain,
    web: Globe,
    python: BookOpen,
    english: MessageCircle,
    trading: TrendingUp,
  };

  return (
    <main className="learning-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="page-header">
        <div>
          <p className="eyebrow">
            LEARNING SYSTEM
          </p>

          <h1>
            My Learning
          </h1>

          <p className="subtitle">
            Build skills. Solve problems. Become better every day.
          </p>
        </div>

        <div className="learning-summary-icon">
          <BookOpen size={24} />
        </div>
      </div>

      {/* =========================
          OVERVIEW
      ========================= */}

      <div className="learning-overview">

        <div className="learning-overview-card">
          <div className="learning-overview-icon">
            <Target size={20} />
          </div>

          <div>
            <span>
              Overall Progress
            </span>

            <strong>
              {averageProgress}%
            </strong>
          </div>
        </div>

        <div className="learning-overview-card">
          <div className="learning-overview-icon">
            <Clock size={20} />
          </div>

          <div>
            <span>
              Total Study Hours
            </span>

            <strong>
              {totalHours}h
            </strong>
          </div>
        </div>

        <div className="learning-overview-card">
          <div className="learning-overview-icon">
            <BookOpen size={20} />
          </div>

          <div>
            <span>
              Topics Completed
            </span>

            <strong>
              {completedTopics}/{totalTopics}
            </strong>
          </div>
        </div>

        <div className="learning-overview-card">
          <div className="learning-overview-icon">
            <TrendingUp size={20} />
          </div>

          <div>
            <span>
              Learning Tracks
            </span>

            <strong>
              {learningTracks.length}
            </strong>
          </div>
        </div>

      </div>

      {/* =========================
          LEARNING TRACKS
      ========================= */}

      <div className="learning-container">

        <div className="learning-header">
          <div>
            <h2>
              Learning Tracks
            </h2>

            <p>
              Track your progress across every important skill.
            </p>
          </div>
        </div>

        {learningTracks.length === 0 ? (

          <div className="learning-empty">
            <BookOpen size={45} />

            <h3>
              No learning tracks yet
            </h3>

            <p>
              Add your first learning track.
            </p>
          </div>

        ) : (

          <div className="learning-grid">

            {learningTracks.map((track) => {

              const Icon =
                iconMap[track.id] || BookOpen;

              const isOpen =
                openTrack === track.id;

              const completedCount =
                track.topics.filter(
                  (topic) => topic.completed
                ).length;

              return (

                <div
                  className={`learning-card ${
                    isOpen
                      ? "learning-card-open"
                      : ""
                  }`}
                  key={track.id}
                >

                  {/* CARD HEADER */}

                  <div className="learning-card-top">

                    <div className="learning-card-title">

                      <div className="learning-icon">
                        <Icon size={21} />
                      </div>

                      <div>
                        <h3>
                          {track.title}
                        </h3>

                        <span>
                          {track.description}
                        </span>
                      </div>

                    </div>

                  </div>

                  {/* PROGRESS */}

                  <div className="learning-progress-section">

                    <div className="learning-progress-top">

                      <span>
                        Progress
                      </span>

                      <strong>
                        {track.progress}%
                      </strong>

                    </div>

                    <div className="learning-progress-bar">

                      <div
                        className="learning-progress-fill"
                        style={{
                          width: `${track.progress}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* STATS */}

                  <div className="learning-card-stats">

                    <div>
                      <strong>
                        {track.stat}
                      </strong>

                      <span>
                        Completed
                      </span>
                    </div>

                    <div>
                      <strong>
                        {track.hours}h
                      </strong>

                      <span>
                        Study Hours
                      </span>
                    </div>

                  </div>

                  {/* OPEN BUTTON */}

                  <button
                    type="button"
                    className="learning-open-btn"
                    onClick={() =>
                      toggleTrack(track.id)
                    }
                  >

                    {isOpen ? (
                      <>
                        Close Topics
                        <ChevronUp size={17} />
                      </>
                    ) : (
                      <>
                        Open Topics
                        <ChevronDown size={17} />
                      </>
                    )}

                  </button>

                  {/* TOPICS */}

                  {isOpen && (

                    <div className="learning-topics">

                      <div className="learning-topics-header">

                        <strong>
                          {track.title} Topics
                        </strong>

                        <span>
                          {completedCount}/
                          {track.topics.length}
                        </span>

                      </div>

                      <div className="topic-list">

                        {track.topics.map(
                          (topic) => (

                            <button
                              type="button"
                              className={`learning-topic ${
                                topic.completed
                                  ? "completed"
                                  : ""
                              }`}
                              key={topic.id || topic.name}
                              onClick={() =>
                                toggleLearningTopic(
                                  track.id,
                                  topic.id || topic.name
                                )
                              }
                            >

                              <div
                                className={`topic-check ${
                                  topic.completed
                                    ? "checked"
                                    : ""
                                }`}
                              >
                                {topic.completed && (
                                  <Check size={13} />
                                )}
                              </div>

                              <span>
                                {topic.name}
                              </span>

                            </button>

                          )
                        )}

                      </div>

                    </div>

                  )}

                </div>

              );

            })}

          </div>

        )}

      </div>

      {/* =========================
          DAILY MESSAGE
      ========================= */}

      <div className="learning-focus">

        <div className="learning-focus-icon">
          ✦
        </div>

        <div>

          <p className="eyebrow">
            TODAY'S LEARNING FOCUS
          </p>

          <h2>
            Learn something.
            <br />
            Practice it. Build with it.
          </h2>

          <p>
            Consistency beats intensity. One focused
            session every day compounds into real skill.
          </p>

        </div>

      </div>

    </main>
  );
}

export default Learning;