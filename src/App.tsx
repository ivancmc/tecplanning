import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Moon, Sun, Globe, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import Home from "./pages/Home";
import Room from "./pages/Room";

function AppContent({ isDarkMode, toggleTheme, toggleLanguage }: { isDarkMode: boolean; toggleTheme: () => void; toggleLanguage: () => void }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [showExitModal, setShowExitModal] = useState(false);

  const handleLogoClick = () => {
    if (location.pathname.startsWith("/room/")) {
      setShowExitModal(true);
    } else {
      navigate("/");
    }
  };

  const confirmExit = () => {
    setShowExitModal(false);

    // Clean all accumulated poker_room_* keys to avoid stale room data
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith("poker_room_name_") || key.startsWith("poker_room_creator_"))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));

    localStorage.removeItem("poker_user_id");
    localStorage.removeItem("poker_user_name");
    localStorage.removeItem("poker_is_spectator");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Exit Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl max-w-sm w-full border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{t("confirm_leave_title")}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {t("confirm_leave_desc")}
                </p>
              </div>
              <div className="flex flex-col w-full gap-2 mt-4 pt-4">
                <button
                  onClick={confirmExit}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors"
                >
                  {t("confirm_leave_btn")}
                </button>
                <button
                  onClick={() => setShowExitModal(false)}
                  className="w-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 font-semibold py-2.5 px-4 rounded-xl transition-colors"
                >
                  {t("cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-4 px-6 flex items-center justify-between transition-colors duration-200">
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xl hover:opacity-80 transition-opacity cursor-pointer"
        >
          <svg
            viewBox="0 0 32 32"
            className="w-8 h-8 fill-indigo-600 dark:fill-indigo-400"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="4" y="2" width="24" height="28" rx="4" />
            <rect x="7" y="5" width="18" height="22" rx="2" fill="white" fillOpacity="0.2" />
            <circle cx="16" cy="16" r="4" fill="white" />
            <path d="M14 13L19 16L14 19V13Z" className="fill-indigo-600 dark:fill-indigo-400" />
            <circle cx="8" cy="6" r="1.5" fill="white" />
            <circle cx="24" cy="26" r="1.5" fill="white" />
          </svg>
          {t("app_title")}
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium text-sm"
            title={t("toggle_language")}
          >
            <Globe size={20} />
            {i18n.language === "en" ? "EN" : "PT"}
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title={t("toggle_theme")}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<Room />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("poker_theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("poker_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("poker_theme", "light");
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const { i18n } = useTranslation();
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "pt" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <BrowserRouter>
      <AppContent isDarkMode={isDarkMode} toggleTheme={toggleTheme} toggleLanguage={toggleLanguage} />
    </BrowserRouter>
  );
}
