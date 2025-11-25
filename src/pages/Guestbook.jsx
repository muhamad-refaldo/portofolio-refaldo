import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Send, MessageSquare, Clock, User, Loader2 } from "lucide-react";
import { db, auth } from "../config/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  limit,
} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { translations } from "../data/content";

export const GuestbookPage = ({ isDarkMode, lang }) => {
  const t = translations[lang]?.guestbook;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [name, setName] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const signInAnon = async () => {
      if (!auth.currentUser) {
        try {
          await signInAnonymously(auth);
        } catch (error) {
          console.error("Anon Auth Error:", error);
        }
      }
    };
    signInAnon();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "guestbook_messages"),
      orderBy("createdAt", "desc"),
      limit(30)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !name.trim()) return;

    setIsSending(true);

    try {
      if (!auth.currentUser) await signInAnonymously(auth);

      await addDoc(collection(db, "guestbook_messages"), {
        text: newMessage,
        name: name,
        createdAt: serverTimestamp(),
        uid: auth.currentUser.uid,
        lang: lang,
      });

      setNewMessage("");
    } catch (error) {
      console.error("Error sending:", error);
      alert("Gagal mengirim pesan. Pastikan koneksi aman.");
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return lang === "id" ? "Baru saja" : "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return date.toLocaleDateString();
  };

  if (!t) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-10 min-h-screen pb-20">
      <Helmet>
        <title>{t.title} | Refaldo Portofolio</title>
        <meta name="description" content="Tinggalkan pesan di buku tamu." />
      </Helmet>

      {/* HEADER */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border ${
            isDarkMode
              ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
              : "bg-blue-50 border-blue-200 text-blue-600"
          }`}
        >
          <MessageSquare size={14} />
          {t.title}
        </motion.div>
        <h2
          className={`text-3xl md:text-5xl font-bold ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          {t.title}
        </h2>
        <p
          className={`max-w-lg mx-auto ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {t.desc}
        </p>
      </div>

      {/* INPUT FORM */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-1 rounded-3xl bg-gradient-to-b ${
          isDarkMode
            ? "from-white/10 to-transparent"
            : "from-blue-200 to-transparent"
        }`}
      >
        <div
          className={`p-6 rounded-[1.4rem] ${
            isDarkMode ? "bg-[#0a0a0f]" : "bg-white shadow-xl"
          }`}
        >
          <form onSubmit={handleSend} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-bold ml-1 mb-1 block text-gray-500">
                {t.name_label}
              </label>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                  isDarkMode
                    ? "bg-white/5 border-white/10 focus-within:border-blue-500"
                    : "bg-gray-50 border-gray-200 focus-within:border-blue-500"
                }`}
              >
                <User size={18} className="text-gray-400" />
                <input
                  type="text"
                  required
                  maxLength={20}
                  placeholder="Alex / Anon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-transparent outline-none font-medium ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold ml-1 mb-1 block text-gray-500">
                {t.msg_label}
              </label>
              <div
                className={`relative px-4 py-4 rounded-xl border transition-all ${
                  isDarkMode
                    ? "bg-white/5 border-white/10 focus-within:border-blue-500"
                    : "bg-gray-50 border-gray-200 focus-within:border-blue-500"
                }`}
              >
                <input
                  type="text"
                  required
                  maxLength={150}
                  placeholder={t.input_placeholder}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className={`w-full bg-transparent outline-none pr-12 ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}
                />
                <button
                  type="submit"
                  disabled={isSending || !newMessage.trim() || !name.trim()}
                  className={`absolute right-2 top-2 bottom-2 px-3 rounded-lg flex items-center justify-center transition-all ${
                    isSending || !newMessage.trim()
                      ? "bg-gray-500/10 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg"
                  }`}
                >
                  {isSending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>

      {/* MESSAGE LIST */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center py-10 opacity-50">
            <Loader2 className="animate-spin" />
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-4 rounded-2xl border flex gap-4 ${
                  isDarkMode
                    ? "bg-white/5 border-white/5"
                    : "bg-white border-gray-200 shadow-sm"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    isDarkMode
                      ? "bg-blue-500/20 text-blue-400"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {msg.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span
                      className={`font-bold text-sm truncate ${
                        isDarkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 shrink-0">
                      <Clock size={10} /> {formatTime(msg.createdAt)}
                    </span>
                  </div>
                  <p
                    className={`text-sm leading-relaxed break-words ${
                      isDarkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {msg.text}
                  </p>

                  {/* --- FITUR BALASAN ADMIN --- */}
                  {msg.reply && (
                    <div
                      className={`mt-3 pl-3 border-l-2 ${
                        isDarkMode
                          ? "border-blue-500/30 bg-blue-500/5"
                          : "border-blue-200 bg-blue-50"
                      } p-2 rounded-r-lg`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-blue-500 px-1.5 py-0.5 bg-blue-500/10 rounded">
                          Admin
                        </span>
                        {msg.replyDate && (
                          <span className="text-[10px] text-gray-400">
                            {formatTime(msg.replyDate)}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {msg.reply}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center py-10 opacity-50 border-2 border-dashed rounded-3xl border-gray-700">
            <p>{t.empty_state}</p>
          </div>
        )}
      </div>
    </div>
  );
};
