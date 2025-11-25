import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Star,
  Terminal,
  Globe,
  Github,
  Calendar,
  Code2,
} from "lucide-react";
import { translations, techStackData } from "../data/content";

const getTechIcon = (techName) => {
  const tech = techStackData.find(
    (t) => t.name.toLowerCase() === techName.toLowerCase()
  );
  return tech ? tech.icon : null;
};

export const ProjectModal = ({ project, onClose, isDarkMode, lang }) => {
  const t = translations[lang];

  const getLang = (data) => {
    if (!data) return "";
    return typeof data === "object" ? data[lang] || data.id || "" : data;
  };

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 modal-overlay"
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md"></div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2rem] relative modal-content shadow-2xl border ${
            isDarkMode
              ? "bg-[#0f1115] border-white/10"
              : "bg-white border-gray-200"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full z-20 transition-colors duration-300 ${
              isDarkMode
                ? "bg-black/50 text-white hover:bg-red-500"
                : "bg-white/80 text-gray-900 hover:bg-red-500 hover:text-white"
            }`}
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* --- KIRI --- */}
            <div className="relative h-64 md:h-full min-h-[300px]">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${
                  isDarkMode
                    ? "from-[#0f1115] via-transparent to-transparent"
                    : "from-white via-transparent to-transparent"
                } md:bg-gradient-to-r md:from-transparent md:to-[#0f1115]/10`}
              ></div>

              <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                {project.isFeatured && (
                  <div className="px-3 py-1 rounded-lg bg-yellow-500 text-black text-xs font-bold flex items-center gap-1 shadow-lg">
                    <Star size={12} fill="currentColor" /> FEATURED
                  </div>
                )}
                <div className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold shadow-lg">
                  {project.category}
                </div>
              </div>
            </div>

            {/* --- KANAN --- */}
            <div className="p-8 space-y-8">
              <div>
                <h2
                  className={`text-3xl md:text-4xl font-bold mb-2 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {project.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {project.createdAt && (
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />{" "}
                      {new Date(
                        project.createdAt.seconds * 1000
                      ).toLocaleDateString()}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Code2 size={14} /> {project.tech ? project.tech.length : 0}{" "}
                    Technologies
                  </span>
                </div>
              </div>

              <div>
                <h3
                  className={`text-sm font-bold uppercase tracking-wider mb-3 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {lang === "id" ? "Tentang Project" : "About Project"}
                </h3>

                {/* [FIX] Gunakan getLang agar object deskripsi terbaca */}
                <p
                  className={`leading-relaxed text-sm md:text-base ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {getLang(project.description)}
                </p>
              </div>

              <div>
                <h3
                  className={`text-sm font-bold uppercase tracking-wider mb-3 ${
                    isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {t?.projects?.tech_title || "Technologies"}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tech &&
                    project.tech.map((t, i) => {
                      const iconUrl = getTechIcon(t);
                      return (
                        <div
                          key={i}
                          className={`px-3 py-2 rounded-xl border flex items-center gap-2 transition-transform hover:scale-105 ${
                            isDarkMode
                              ? "bg-white/5 border-white/10 text-gray-300"
                              : "bg-gray-50 border-gray-200 text-gray-700"
                          }`}
                        >
                          {iconUrl ? (
                            <img
                              src={iconUrl}
                              alt={t}
                              className={`w-4 h-4 ${
                                isDarkMode &&
                                (t === "Next.js" || t === "Express")
                                  ? "invert"
                                  : ""
                              }`}
                            />
                          ) : (
                            <Terminal size={14} className="text-blue-500" />
                          )}
                          <span className="text-xs font-medium">{t}</span>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white text-center transition-all hover:scale-[1.02] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                  >
                    <Globe size={18} /> {t?.projects?.demo || "Demo"}
                  </a>
                )}

                <a
                  href="#"
                  className={`flex-1 py-3.5 border rounded-xl font-bold text-center transition-all hover:scale-[1.02] flex items-center justify-center gap-2 ${
                    isDarkMode
                      ? "bg-white/5 hover:bg-white/10 border-white/10 text-white"
                      : "bg-gray-100 hover:bg-gray-200 border-gray-200 text-gray-900"
                  }`}
                >
                  <Github size={18} /> {t?.projects?.code || "Code"}
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
