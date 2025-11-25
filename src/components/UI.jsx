import { useState, useEffect, useRef } from "react";
import { Activity, Lock, Laptop, Tablet, Smartphone } from "lucide-react";
import { db } from "../config/firebase";
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
} from "firebase/firestore";

const __app_id = import.meta.env.VITE_APP_ID || "portfolio-refaldo";

export const LoadingScreen = ({ isDarkMode }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const interval = setInterval(
      () => setProgress((p) => (p < 100 ? p + 2 : 100)),
      30
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed inset-0 ${
        isDarkMode ? "bg-[#050505]" : "bg-white"
      } flex flex-col items-center justify-center z-100`}
    >
      <div className="w-64 mb-4 font-mono text-xs text-blue-400 flex justify-between">
        <span>{">"} REFALDO PORTOFOLIO</span>
        <span>{progress}%</span>
      </div>
      <div
        className={`w-64 h-1 ${
          isDarkMode ? "bg-gray-900" : "bg-gray-200"
        } rounded-full overflow-hidden`}
      >
        <div
          className="h-full bg-linear-to-r from-blue-600 to-cyan-400 transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-4 text-gray-500 text-xs animate-pulse">
        Memuat Data Refaldo...
      </p>
    </div>
  );
};

export const GridBackground = ({ isDarkMode }) => (
  <div
    className="fixed inset-0 z-0 opacity-[0.15]"
    style={{
      backgroundImage: `linear-gradient(${
        isDarkMode ? "#3b82f6" : "#9ca3af"
      } 1px, transparent 1px), linear-gradient(90deg, ${
        isDarkMode ? "#3b82f6" : "#9ca3af"
      } 1px, transparent 1px)`,
      backgroundSize: "50px 50px",
    }}
  />
);

export const MouseGlow = () => null;

export const TechMarquee = ({ isDarkMode }) => {
  const scrollRef = useRef(null);
  const animationRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "skills"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const skillsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSkills(skillsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || skills.length === 0) return;

    const animate = () => {
      if (!isDragging && !isPaused) {
        const isMobile = window.innerWidth < 768;
        const speed = isMobile ? 1.5 : 0.6;

        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += speed;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [isDragging, isPaused, skills]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    scrollRef.current.style.cursor = "grabbing";
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };
  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };
  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsPaused(false);
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  };
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  const handleTouchMove = (e) => {
    const x = e.touches[0].pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  if (loading)
    return (
      <div className="py-6 text-center text-xs opacity-50">
        Loading Skills...
      </div>
    );
  if (skills.length === 0) return null;

  const marqueeData = [...skills, ...skills, ...skills, ...skills];

  return (
    <div
      className="relative w-full overflow-hidden py-6 group"
      onMouseEnter={() => setIsPaused(true)}
    >
      <div
        className={`absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-linear-to-r ${
          isDarkMode ? "from-[#050505]" : "from-gray-50"
        } to-transparent z-10 pointer-events-none`}
      />
      <div
        className={`absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-linear-to-l ${
          isDarkMode ? "from-[#050505]" : "from-gray-50"
        } to-transparent z-10 pointer-events-none`}
      />

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="flex gap-8 md:gap-12 items-center overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing select-none px-8"
        style={{ scrollBehavior: "auto", WebkitOverflowScrolling: "touch" }}
      >
        {marqueeData.map((tech, index) => (
          <div
            key={`${tech.id}-${index}`}
            className="flex flex-col items-center gap-2 min-w-20 group/icon transition-all duration-300 hover:scale-110"
          >
            <div
              className={`
              w-16 h-16 p-4 glass-card rounded-2xl flex items-center justify-center transition-all duration-300 border
              ${
                isDarkMode
                  ? "bg-[#0a0a0f] border-white/5 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-xl"
              }
            `}
            >
              {tech.icon ? (
                <img
                  src={tech.icon}
                  alt={tech.name}
                  draggable="false"
                  className="w-full h-full object-contain transition-all duration-300 group-hover/icon:scale-110"
                  style={{
                    filter: tech.invert && isDarkMode ? "invert(1)" : "none",
                  }}
                />
              ) : (
                <span className="text-[10px] text-gray-500">{tech.name}</span>
              )}
            </div>
            <span
              className={`text-xs font-medium transition-colors duration-300 ${
                tech.color || (isDarkMode ? "text-gray-300" : "text-gray-600")
              }`}
            >
              {tech.name}
            </span>
          </div>
        ))}
      </div>
      <div
        className={`absolute bottom-1 left-0 right-0 text-center text-[10px] pointer-events-none opacity-30 ${
          isDarkMode ? "text-gray-500" : "text-gray-400"
        }`}
      >
        ← Drag or scroll →
      </div>
    </div>
  );
};

export const ServerStatus = ({ isDarkMode, setPage }) => {
  const [latency, setLatency] = useState(24);
  const [status, setStatus] = useState("Checking");
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.max(15, Math.min(80, 25 + (Math.random() * 30 - 15))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const appId = __app_id;
    const safeAppId = appId.replace(/[^a-zA-Z0-9_-]/g, "_");
    const docRef = doc(
      db,
      "artifacts",
      safeAppId,
      "public",
      "data",
      "visitors",
      "stats"
    );
    const unsubscribe = onSnapshot(
      docRef,
      () => setStatus("Online"),
      () => setStatus("Down")
    );
    return () => unsubscribe();
  }, []);
  return (
    <div
      className={`flex items-center gap-4 text-xs px-4 py-2 rounded-full border ${
        isDarkMode
          ? "text-gray-500 bg-black/30 border-white/5"
          : "text-gray-600 bg-gray-100 border-gray-200"
      }`}
    >
      <div className="flex items-center gap-2">
        <div className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
              status === "Down" ? "bg-red-400" : "bg-green-400"
            } opacity-75`}
          ></span>
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              status === "Down" ? "bg-red-500" : "bg-green-500"
            }`}
          ></span>
        </div>
        <span>API: {status}</span>
      </div>
      <span
        className={`w-px h-3 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}
      ></span>
      <div className="flex items-center gap-1">
        <Activity size={12} />
        <span>{Math.round(latency)}ms</span>
      </div>
      <span
        className={`w-px h-3 ${isDarkMode ? "bg-gray-700" : "bg-gray-300"}`}
      ></span>
      <button
        onClick={() => setPage("login")}
        className="flex items-center gap-1 hover:text-blue-500 cursor-pointer transition-colors group focus:outline-none"
      >
        <Lock size={12} />
        <span>Admin</span>
      </button>
    </div>
  );
};

export const DeviceIndicator = () => {
  const [device, setDevice] = useState("LG");
  const Icon = device === "SM" ? Smartphone : device === "MD" ? Tablet : Laptop;
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setDevice("SM");
      else if (window.innerWidth < 1024) setDevice("MD");
      else setDevice("LG");
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="hidden lg:flex fixed bottom-20 right-6 z-50">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white shadow-lg text-xs font-mono">
        <Icon size={12} className="text-blue-400" /> {device}
      </div>
    </div>
  );
};

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`;
  document.head.appendChild(style);
}