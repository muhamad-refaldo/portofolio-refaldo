import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import {
  Mail,
  Phone,
  Check,
  Send,
  ArrowRight,
  Linkedin,
  Github,
  MapPin,
  Copy,
  MessageCircle,
  Instagram,
  Loader2,
} from "lucide-react";
import { db } from "../config/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { translations, socialMedia } from "../data/content";

export const ContactPage = ({ isDarkMode, lang }) => {
  const t = translations[lang].contact;

  const [status, setStatus] = useState("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [copied, setCopied] = useState(null);

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("sending");

    try {
      await addDoc(collection(db, "contact_messages"), {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        createdAt: serverTimestamp(),
        read: false,
      });

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Gagal mengirim pesan. Cek koneksi internet Anda.");
      setStatus("idle");
    }
  };

  const contactCards = [
    {
      id: "email",
      icon: Mail,
      label: "Email",
      value: socialMedia.email,
      action: () => (window.location.href = `mailto:${socialMedia.email}`),
      color: "blue",
    },
    {
      id: "whatsapp",
      icon: Phone,
      label: "WhatsApp",
      value: "+62 882-9675-9533",
      action: () => window.open(socialMedia.whatsappUrl, "_blank"),
      color: "green",
    },
    {
      id: "instagram",
      icon: Instagram,
      label: "Instagram",
      value: "@mhmdrfldo22",
      action: () => window.open(socialMedia.instagram, "_blank"),
      color: "pink",
    },
    {
      id: "linkedin",
      icon: Linkedin,
      label: "LinkedIn",
      value: "Muhamad Refaldo",
      action: () => window.open(socialMedia.linkedin, "_blank"),
      color: "blue",
    },
    {
      id: "github",
      icon: Github,
      label: "GitHub",
      value: "muhamad-refaldo",
      action: () => window.open(socialMedia.github, "_blank"),
      color: "purple",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto min-h-screen space-y-12 pb-20">
      <Helmet>
        <title>{t.title} | Refaldo Portofolio</title>
        <meta
          name="description"
          content="Hubungi Muhamad Refaldo untuk kerjasama project."
        />
      </Helmet>

      {/* --- HEADER SECTION --- */}
      <div className="text-center max-w-3xl mx-auto space-y-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 blur-[100px] -z-10 rounded-full" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border ${
            isDarkMode
              ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
              : "bg-blue-50 border-blue-200 text-blue-600"
          }`}
        >
          <MessageCircle size={14} />
          {t.badge}
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`text-4xl md:text-6xl font-bold leading-tight ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {t.title}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            {t.title_accent}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`text-lg ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {t.desc}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
        {/* --- LEFT COLUMN: SOCIAL GRID --- */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
          {contactCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`group relative p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 ${
                isDarkMode
                  ? "bg-white/5 border-white/5 hover:border-blue-500/30"
                  : "bg-white border-gray-200 hover:border-blue-400 hover:shadow-lg"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-${
                    card.color
                  }-500 ${
                    isDarkMode
                      ? `bg-${card.color}-500/10`
                      : `bg-${card.color}-50`
                  }`}
                >
                  <card.icon size={24} />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {card.label}
                  </p>
                  <h4
                    className={`text-sm font-semibold truncate cursor-pointer hover:underline ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                    onClick={card.action}
                  >
                    {card.value}
                  </h4>
                </div>
                {/* Copy Button */}
                <button
                  onClick={() =>
                    handleCopy(
                      card.value === "+62 882-9675-9533"
                        ? socialMedia.whatsapp
                        : card.value,
                      card.id
                    )
                  }
                  className={`p-2 rounded-lg transition-colors relative ${
                    isDarkMode
                      ? "hover:bg-white/10 text-gray-500 hover:text-white"
                      : "hover:bg-gray-100 text-gray-400 hover:text-black"
                  }`}
                  title="Copy"
                >
                  {copied === card.id ? (
                    <Check size={18} className="text-green-500" />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
              </div>
            </motion.div>
          ))}

          {/* Location Card (Static) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className={`p-5 rounded-2xl border flex items-center gap-4 ${
              isDarkMode
                ? "bg-white/5 border-white/5"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-red-500 bg-red-500/10">
              <MapPin size={24} />
            </div>
            <div>
              <p
                className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${
                  isDarkMode ? "text-gray-500" : "text-gray-400"
                }`}
              >
                Location
              </p>
              <h4
                className={`text-sm font-semibold ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Bogor, Indonesia
              </h4>
            </div>
          </motion.div>
        </div>

        {/* --- RIGHT COLUMN: GLASS FORM --- */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3"
        >
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`h-full flex flex-col items-center justify-center text-center p-12 rounded-3xl border ${
                  isDarkMode
                    ? "bg-green-500/5 border-green-500/20"
                    : "bg-green-50 border-green-200"
                }`}
              >
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/30">
                  <Check size={48} className="text-white" />
                </div>
                <h2
                  className={`text-3xl font-bold mb-4 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  {t.form.success_title}
                </h2>
                <p
                  className={`text-lg mb-8 max-w-md mx-auto ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t.form.success_desc}
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="px-8 py-3 rounded-xl font-bold text-blue-500 hover:bg-blue-500/10 transition-colors flex items-center gap-2"
                >
                  <ArrowRight size={20} /> {t.form.send_again}
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`p-8 md:p-10 rounded-3xl border shadow-2xl relative overflow-hidden ${
                  isDarkMode
                    ? "bg-[#0f1115]/80 border-white/10 backdrop-blur-xl"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Dekorasi Form */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none"></div>

                <div className="space-y-6 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label
                        className={`text-sm font-bold ml-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {t.form.name}
                      </label>
                      <input
                        required
                        type="text"
                        className={`w-full px-5 py-4 rounded-xl outline-none border transition-all ${
                          isDarkMode
                            ? "bg-black/40 border-white/10 text-white focus:border-blue-500 focus:bg-blue-500/5"
                            : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:bg-white"
                        }`}
                        placeholder="Muhamad Refaldo"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        className={`text-sm font-bold ml-1 ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {t.form.email}
                      </label>
                      <input
                        required
                        type="email"
                        className={`w-full px-5 py-4 rounded-xl outline-none border transition-all ${
                          isDarkMode
                            ? "bg-black/40 border-white/10 text-white focus:border-blue-500 focus:bg-blue-500/5"
                            : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:bg-white"
                        }`}
                        placeholder="muhamadRefaldo@gmail.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`text-sm font-bold ml-1 ${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {t.form.msg}
                    </label>
                    <textarea
                      required
                      rows="5"
                      className={`w-full px-5 py-4 rounded-xl outline-none border transition-all resize-none ${
                        isDarkMode
                          ? "bg-black/40 border-white/10 text-white focus:border-blue-500 focus:bg-blue-500/5"
                          : "bg-gray-50 border-gray-200 text-gray-900 focus:border-blue-500 focus:bg-white"
                      }`}
                      placeholder={
                        lang === "id"
                          ? "Ceritakan detail project Anda..."
                          : "Tell me about your project details..."
                      }
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 ${
                      status === "sending"
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-500 hover:shadow-blue-500/30"
                    }`}
                  >
                    {status === "sending" ? (
                      <>
                        <Loader2 size={24} className="animate-spin" />{" "}
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} /> {t.form.btn}
                      </>
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};
