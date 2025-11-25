import React, { useState, useEffect, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import { MessageCircle, Loader2, Sparkles } from "lucide-react";
import { auth } from "./config/firebase";
import { onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { useSiteStats } from "./hooks/useSiteStats";
import { socialMedia } from "./data/content";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Chatbot } from "./components/Chatbot";
import { ProjectModal } from "./components/ProjectModal";
import { LoadingScreen, GridBackground } from "./components/UI";
import ErrorBoundary from "./components/ErrorBoundary";

const HomePage = React.lazy(() =>
  import("./pages/Home").then((module) => ({ default: module.HomePage }))
);
const AboutPage = React.lazy(() =>
  import("./pages/About").then((module) => ({ default: module.AboutPage }))
);
const ProjectsPage = React.lazy(() =>
  import("./pages/Projects").then((module) => ({
    default: module.ProjectsPage,
  }))
);
const ServicesPage = React.lazy(() =>
  import("./pages/Services").then((module) => ({
    default: module.ServicesPage,
  }))
);
const CertificatesPage = React.lazy(() =>
  import("./pages/Certificates").then((module) => ({
    default: module.CertificatesPage,
  }))
);
const BlogPage = React.lazy(() =>
  import("./pages/Blog").then((module) => ({ default: module.BlogPage }))
);
const ContactPage = React.lazy(() =>
  import("./pages/Contact").then((module) => ({ default: module.ContactPage }))
);
const GuestbookPage = React.lazy(() =>
  import("./pages/Guestbook").then((module) => ({
    default: module.GuestbookPage,
  }))
);
const PrivacyPage = React.lazy(() =>
  import("./pages/Privacy").then((module) => ({ default: module.PrivacyPage }))
);
const NotFoundPage = React.lazy(() =>
  import("./pages/NotFound").then((module) => ({ default: module.NotFound }))
);

const LoginPage = React.lazy(() =>
  import("./pages/Login").then((module) => ({ default: module.LoginPage }))
);
const AdminPage = React.lazy(() =>
  import("./pages/Admin").then((module) => ({ default: module.AdminPage }))
);

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const TransitionOverlay = ({ isDarkMode }) => (
  <div
    className={`fixed inset-0 z-[100] flex flex-col items-center justify-center transition-all duration-300 ${
      isDarkMode ? "bg-[#050505]" : "bg-gray-50"
    }`}
  >
    <div className="relative">
      <div
        className={`absolute inset-0 rounded-full animate-ping opacity-20 ${
          isDarkMode ? "bg-blue-500" : "bg-blue-600"
        }`}
      ></div>
      <Loader2
        size={48}
        className={`animate-spin relative z-10 ${
          isDarkMode ? "text-blue-400" : "text-blue-600"
        }`}
      />
    </div>
    <p
      className={`mt-4 text-sm font-medium tracking-widest animate-pulse ${
        isDarkMode ? "text-gray-400" : "text-gray-600"
      }`}
    >
      LOADING...
    </p>
  </div>
);

export default function App() {
  const { visitorCount, onlineCount } = useSiteStats();

  const getInitialPage = () => {
    const hash = window.location.hash.replace("#", "");
    if (!hash) return "home";

    const validPages = [
      "home",
      "about",
      "projects",
      "services",
      "certificates",
      "blog",
      "guestbook",
      "contact",
      "privacy",
      "login",
      "admin",
    ];
    return validPages.includes(hash) ? hash : "404";
  };

  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme ? savedTheme === "dark" : true;
  };

  const [page, setPage] = useState(getInitialPage);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(getInitialTheme);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [, setKonamiCode] = useState([]);
  const [lang, setLang] = useState("id");

  const [user, setUser] = useState(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    if (page === "404") return;
    window.location.hash = page;

    const titles = {
      home: "Portfolio | Refaldo",
      about: "About Me | Refaldo",
      projects: "My Projects | Refaldo",
      services: "Services | Refaldo",
      certificates: "Certificates | Refaldo",
      blog: "Blog | Refaldo",
      guestbook: "Guestbook | Refaldo",
      contact: "Get in Touch | Refaldo",
      privacy: "Privacy Policy | Refaldo",
      login: "Admin Login | Refaldo",
      admin: "Dashboard | Refaldo",
      404: "Page Not Found | Refaldo",
    };
    document.title = titles[page] || "Portfolio | Refaldo";
  }, [page]);

  useEffect(() => {
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");

      const validPages = [
        "home",
        "about",
        "projects",
        "services",
        "certificates",
        "blog",
        "guestbook",
        "contact",
        "privacy",
        "login",
        "admin",
      ];

      if (validPages.includes(hash)) {
        if (hash !== page) setPage(hash);
      } else if (hash !== "") {
        setPage("404");
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [page]);

  const handlePageChange = (newPage) => {
    if (newPage === page) return;
    if (isTransitioning) return;

    setIsTransitioning(true);
    setIsMenuOpen(false);

    setTimeout(() => {
      setPage(newPage);
      window.scrollTo(0, 0);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 300);
  };

  useEffect(() => {
    if (!auth) return;
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthChecking(false);
      if (!currentUser) {
        signInAnonymously(auth).catch((err) =>
          console.error("Anon Auth:", err)
        );
      }
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    const handleScroll = () => {
      const total = document.documentElement.scrollTop;
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setScrollProgress(total / height);
    };
    const handleKeyDown = (e) => {
      setKonamiCode((prev) => {
        const newCode = [...prev, e.key].slice(-10);
        if (newCode.join(",") === KONAMI_SEQUENCE.join(",")) {
          setShowEasterEgg(true);
          setTimeout(() => setShowEasterEgg(false), 5000);
        }
        return newCode;
      });
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleLang = () => setLang((prev) => (prev === "id" ? "en" : "id"));

  const renderPage = () => {
    const props = {
      setPage: handlePageChange,
      setSelectedProject,
      isDarkMode,
      lang,
    };

    if (page === "login") {
      return (
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen isDarkMode={isDarkMode} />}>
            <LoginPage setPage={handlePageChange} />
          </Suspense>
        </ErrorBoundary>
      );
    }

    if (page === "admin") {
      if (isAuthChecking) return <LoadingScreen isDarkMode={isDarkMode} />;
      if (!user || user.isAnonymous) {
        setTimeout(() => handlePageChange("login"), 0);
        return null;
      }
      return (
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen isDarkMode={isDarkMode} />}>
            <AdminPage
              setPage={handlePageChange}
              isDarkMode={isDarkMode}
              user={user}
            />
          </Suspense>
        </ErrorBoundary>
      );
    }

    if (page === "404") {
      return (
        <ErrorBoundary>
          <Suspense fallback={<LoadingScreen isDarkMode={isDarkMode} />}>
            <NotFoundPage isDarkMode={isDarkMode} setPage={handlePageChange} />
          </Suspense>
        </ErrorBoundary>
      );
    }

    return (
      <>
        <Navbar
          page={page}
          setPage={handlePageChange}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          lang={lang}
          toggleLang={toggleLang}
          visitorCount={visitorCount}
          onlineCount={onlineCount}
        />

        <main className="relative z-10 container mx-auto px-6 pt-28 pb-20 min-h-screen">
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="py-20 flex justify-center">
                  <Loader2 className="animate-spin text-blue-500" />
                </div>
              }
            >
              <div key={page} className="animate-fade-up">
                {page === "home" && <HomePage {...props} />}
                {page === "about" && <AboutPage {...props} />}
                {page === "projects" && <ProjectsPage {...props} />}
                {page === "services" && <ServicesPage {...props} />}
                {page === "certificates" && <CertificatesPage {...props} />}
                {page === "blog" && <BlogPage {...props} />}
                {page === "guestbook" && <GuestbookPage {...props} />}
                {page === "contact" && <ContactPage {...props} />}
                {page === "privacy" && <PrivacyPage {...props} />}{" "}
                {/* [BARU] Render Privacy */}
              </div>
            </Suspense>
          </ErrorBoundary>
        </main>

        <Footer
          setPage={handlePageChange}
          isDarkMode={isDarkMode}
          lang={lang}
        />
      </>
    );
  };

  if (isLoading) return <LoadingScreen isDarkMode={isDarkMode} />;

  return (
    <HelmetProvider>
      <div
        className={`min-h-screen w-full ${
          isDarkMode
            ? "dark bg-[#050505] text-white"
            : "bg-gray-50 text-gray-900"
        } font-sans relative overflow-x-hidden transition-colors duration-500 selection:bg-blue-500/30 selection:text-blue-200`}
      >
        {isTransitioning && <TransitionOverlay isDarkMode={isDarkMode} />}

        <div
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-400 z-50"
          style={{ width: `${scrollProgress * 100}%` }}
        />

        {showEasterEgg && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[70] animate-fade-up">
            <div
              className={`px-6 py-4 rounded-2xl ${
                isDarkMode
                  ? "bg-gradient-to-r from-purple-600 to-pink-600"
                  : "bg-gradient-to-r from-purple-500 to-pink-500"
              } text-white shadow-2xl flex items-center gap-3`}
            >
              <Sparkles size={24} className="animate-spin" />
              <div>
                <div className="font-bold">🎉 Easter Egg Unlocked!</div>
                <div className="text-sm opacity-90">
                  Konami Code Detected. You are a true geek!
                </div>
              </div>
            </div>
          </div>
        )}

        <GridBackground isDarkMode={isDarkMode} />

        {renderPage()}

        {selectedProject && (
          <ProjectModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
            isDarkMode={isDarkMode}
            lang={lang}
          />
        )}

        <a
          href={socialMedia.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:scale-110 transition-transform hover:bg-green-400 group"
          aria-label="Chat via WhatsApp"
        >
          <div
            className={`absolute -top-10 left-0 ${
              isDarkMode ? "bg-white text-black" : "bg-gray-900 text-white"
            } text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none`}
          >
            WhatsApp
          </div>
          <MessageCircle size={28} className="text-white" />
        </a>

        {page !== "login" && page !== "admin" && page !== "404" && (
          <Chatbot isDarkMode={isDarkMode} lang={lang} />
        )}
      </div>
    </HelmetProvider>
  );
}
