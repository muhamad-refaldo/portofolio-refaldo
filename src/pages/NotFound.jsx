import { motion } from "framer-motion";
import { Home, AlertTriangle } from "lucide-react";

export const NotFound = ({ isDarkMode, setPage }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 blur-[150px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`glass-card p-10 rounded-3xl border max-w-md w-full flex flex-col items-center ${
          isDarkMode
            ? "bg-[#0f1115]/50 border-white/10"
            : "bg-white/50 border-gray-200"
        }`}
      >
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <AlertTriangle size={40} />
        </div>

        <h1
          className={`text-6xl font-bold mb-2 ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          404
        </h1>
        <h2
          className={`text-xl font-semibold mb-4 ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Halaman Tidak Ditemukan
        </h2>
        <p
          className={`text-sm mb-8 ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}
        >
          Oops! Sepertinya kamu tersesat. Halaman yang kamu cari tidak ada atau
          sudah dipindahkan.
        </p>

        <button
          onClick={() => setPage("home")}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <Home size={18} /> Kembali ke Home
        </button>
      </motion.div>
    </div>
  );
};
