import { useState } from 'react'; 
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'; 
import { auth, googleProvider } from '../config/firebase';
import { ShieldCheck, AlertCircle, ArrowLeft, Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';

export const LoginPage = ({ setPage }) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 

  // Ganti dengan email admin kamu yang sebenarnya jika berbeda
  const ADMIN_EMAIL = "dodohardcore43@gmail.com";

  const checkAdmin = async (user) => {
    if (user.email === ADMIN_EMAIL) {
      setPage('admin'); 
    } else {
      await auth.signOut(); 
      setError(`Email ${user.email} bukan admin. Akses ditolak.`);
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      checkAdmin(result.user);
    } catch (err) {
      console.error(err);
      setError("Gagal login Google. Coba cek koneksi internet atau popup blocker.");
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Email dan Password harus diisi!");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      checkAdmin(result.user);
    } catch (err) {
      console.error("Login Error:", err);
      let msg = "Email atau Password salah!";
      if (err.code === 'auth/user-not-found') msg = "Akun tidak ditemukan.";
      if (err.code === 'auth/wrong-password') msg = "Password salah.";
      if (err.code === 'auth/too-many-requests') msg = "Terlalu banyak percobaan. Coba lagi nanti.";
      setError(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white px-4 relative overflow-hidden z-50">
      
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative z-10">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/20 transform rotate-3">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Admin Portal</h2>
          <p className="text-gray-400 text-sm">Masuk untuk mengelola konten portofolio.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm mb-6 flex items-start gap-2 animate-pulse">
            <AlertCircle size={16} className="mt-0.5 shrink-0" /> 
            <span>{error}</span>
          </div>
        )}

        {/* --- FORM LOGIN MANUAL --- */}
        <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-500" size={18} />
            <input 
              type="email" 
              placeholder="Email Admin" 
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-blue-500 transition-all text-white placeholder-gray-500 focus:bg-black/40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* INPUT PASSWORD DENGAN TOGGLE MATA */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-500" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Password" 
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-10 text-sm outline-none focus:border-blue-500 transition-all text-white placeholder-gray-500 focus:bg-black/40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            {/* TOMBOL MATA */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-500 hover:text-white transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-[1.02] active:scale-95 shadow-lg shadow-blue-600/20"
          >
            {isLoading ? "Memproses..." : <><LogIn size={18}/> Login Masuk</>}
          </button>
        </form>

        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-white/10 w-full"></div>
          <span className="bg-[#050505] px-3 text-xs text-gray-500 absolute uppercase tracking-wider">Atau</span>
        </div>

        {/* --- TOMBOL GOOGLE --- */}
        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-200 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-lg disabled:opacity-70 group"
        >
          {/* [FIX] Link gambar Google yang benar */}
          <img 
            src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" 
            alt="Google" 
            className="w-5 h-5"
          />
          <span>Masuk dengan Google</span>
        </button>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setPage('home')}
            className="text-sm text-gray-500 hover:text-white flex items-center justify-center gap-2 mx-auto transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Website
          </button>
        </div>
      </div>
    </div>
  );
};