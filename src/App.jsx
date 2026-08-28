import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Goals from "./pages/Goals";
import Planner from "./pages/Planner";
import Habits from "./pages/Habits";
import YouTube from "./pages/YouTube";
import Scripts from "./pages/Scripts";
import Money from "./pages/Money";
import Clients from "./pages/Clients";
import Learning from "./pages/Learning";
import Study from "./pages/Study";
import Trading from "./pages/Trading";
import QuickNotes from "./pages/QuickNotes";
import Progress from "./pages/Progress";
import StudyNotes from "./pages/StudyNotes";
import Journal from "./pages/Journal";
function App() {
  return (
    <BrowserRouter>
      <div className="app">

        {/* ==========================================
            SIDEBAR
        ========================================== */}
        <Sidebar />

        {/* ==========================================
            MAIN CONTENT
        ========================================== */}
        <div className="main-content">

          <Routes>

            {/* Dashboard */}
            <Route
              path="/"
              element={<Dashboard />}
            />

            {/* Tasks */}
            <Route
              path="/tasks"
              element={<Tasks />}
            />

            {/* Goals */}
            <Route
              path="/goals"
              element={<Goals />}
            />

            {/* Planner */}
            <Route
              path="/planner"
              element={<Planner />}
            />

            {/* Habits */}
            <Route
              path="/habits"
              element={<Habits />}
            />

            {/* YouTube */}
            <Route
              path="/youtube"
              element={<YouTube />}
            />

            {/* Scripts */}
            <Route
              path="/scripts"
              element={<Scripts />}
            />

            {/* Money */}
            <Route
              path="/money"
              element={<Money />}
            />

            {/* Clients */}
            <Route
              path="/clients"
              element={<Clients />}
            />

            {/* Learning */}
            <Route
              path="/learning"
              element={<Learning />}
            />

            {/* Study */}
            <Route
              path="/study"
              element={<Study />}
            />

            {/* Trading */}
            <Route
              path="/trading"
              element={<Trading />}
            />

            {/* Progress */}
            <Route
              path="/progress"
              element={<Progress />}
            />

            {/* Quick Notes */}
            <Route
              path="/quick-notes"
              element={<QuickNotes />}
            />

            {/* Study Notes */}
            <Route
              path="/study-notes"
              element={<StudyNotes />}
            />
                  <Route
                 path="/journal"
                        element={<Journal />}
                        />
          </Routes>

        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;