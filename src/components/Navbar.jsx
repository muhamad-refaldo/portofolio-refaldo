import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, User, FolderKanban, Mail, Menu, X, Languages, Sun, Moon, Github, Linkedin, Award, Eye, MessageSquare, BookOpen, ChevronDown, Zap } from 'lucide-react'; 
import { translations } from '../data/content'; 

const NavLink = ({ pageName, icon: Icon, children, page, setPage, setIsMenuOpen, isDarkMode }) => {
  const isActive = page === pageName;
  return (
    <button
      onClick={() => { setPage(pageName); if(setIsMenuOpen) setIsMenuOpen(false); }}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 text-sm font-medium z-10 ${
        isActive 
          ? (isDarkMode ? 'text-white' : 'text-blue-600') 
          : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-blue-600')
      }`}
    >
      {isActive && (
        <motion.span
          layoutId="activeNav"
          className={`absolute inset-0 rounded-xl -z-10 ${
            isDarkMode ? 'bg-white/10 border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-blue-50 border border-blue-100'
          }`}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
      <Icon size={16} />
      <span>{children}</span>
    </button>
  );
};

export const Navbar = ({ page, setPage, isMenuOpen, setIsMenuOpen, isDarkMode, toggleTheme, lang, toggleLang, visitorCount, onlineCount }) => {
  const t = translations[lang];
  const navProps = { page, setPage, setIsMenuOpen, isDarkMode };
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false); // State untuk dropdown desktop
  const dropdownRef = useRef(null);

  // Tutup dropdown kalau klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerBaseClass = `fixed top-0 z-50 w-full transition-all duration-300 backdrop-blur-md h-16`;
  const headerScrollClass = isScrolled
    ? (isDarkMode ? 'bg-[#050505]/95 border-b border-white/5 shadow-lg shadow-blue-900/5' : 'bg-white/95 border-b border-gray-200 shadow-sm')
    : (isDarkMode ? 'bg-[#050505]/70 border-b border-transparent' : 'bg-white/70 border-b border-transparent');

  // --- GROUPING MENU ---
  // 1. Menu Utama (Tampil Langsung)
  const mainLinks = [
    { id: 'home', icon: Home, label: t.nav.home },
    { id: 'about', icon: User, label: t.nav.about },
    { id: 'projects', icon: FolderKanban, label: t.nav.works },
    { id: 'services', icon: Zap, label: t.nav.services },
  ];

  // 2. Menu Sekunder (Masuk Dropdown 'More')
  const moreLinks = [
    { id: 'blog', icon: BookOpen, label: t.nav.blog },
    { id: 'certificates', icon: Award, label: t.nav.certs },
    { id: 'guestbook', icon: MessageSquare, label: t.nav.guestbook },
  ];

  // Cek apakah salah satu menu 'More' sedang aktif (untuk highlight tombol More)
  const isMoreActive = moreLinks.some(link => link.id === page);

  return (
    <header className={`${headerBaseClass} ${headerScrollClass}`}>
      <div className="container mx-auto px-6 h-full flex justify-between items-center">
        
        {/* LOGO */}
        <div className="text-xl font-bold cursor-pointer flex items-center gap-2 group mr-auto md:mr-0" onClick={() => setPage('home')}>
          <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg shadow-blue-500/20 transition-transform group-hover:scale-105 group-hover:rotate-3">
             <div className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
             <span className="font-mono text-white font-bold text-lg relative z-10">M</span>
          </div>
          <span className={`tracking-tight font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Refaldo<span className="text-blue-500">.</span></span>
        </div>

        {/* --- DESKTOP MENU (WITH DROPDOWN) --- */}
        <nav className={`hidden md:flex items-center p-1 rounded-2xl border transition-all duration-300 ${
          isScrolled 
             ? (isDarkMode ? 'bg-white/5 border-white/5' : 'bg-gray-50/50 border-gray-200') 
             : (isDarkMode ? 'bg-black/20 border-white/10' : 'bg-white/50 border-gray-200')
        }`}>
          {/* Main Links Loop */}
          {mainLinks.map(link => (
            <NavLink key={link.id} pageName={link.id} icon={link.icon} {...navProps}>{link.label}</NavLink>
          ))}

          {/* DROPDOWN "MORE" */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                isMoreActive || isMoreOpen
                  ? (isDarkMode ? 'text-white bg-white/10' : 'text-blue-600 bg-blue-50') 
                  : (isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-blue-600')
              }`}
            >
              {t.nav.more} <ChevronDown size={14} className={`transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`}/>
            </button>

            <AnimatePresence>
              {isMoreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`absolute top-full right-0 mt-2 w-48 p-1.5 rounded-2xl border shadow-xl flex flex-col gap-1 ${isDarkMode ? 'bg-[#0f1115] border-white/10' : 'bg-white border-gray-200'}`}
                >
                  {moreLinks.map(link => (
                    <button
                      key={link.id}
                      onClick={() => { setPage(link.id); setIsMoreOpen(false); }}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors ${
                        page === link.id
                          ? (isDarkMode ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-600 font-bold')
                          : (isDarkMode ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-black')
                      }`}
                    >
                      <link.icon size={16} /> {link.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Contact Button (Dipisah biar stand out) */}
          <NavLink pageName="contact" icon={Mail} {...navProps}>{t.nav.contact}</NavLink>
        </nav>

        {/* RIGHT ACTIONS (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
           <div className={`flex items-center h-9 px-1 py-1 rounded-lg text-[10px] font-medium border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'}`}>
              <div className="flex items-center gap-2 px-3 border-r border-dashed border-gray-500/30">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}><span className="font-bold text-green-500 mr-1">{onlineCount || 1}</span> Online</span>
              </div>
              <div className="flex items-center gap-2 px-3"><Eye size={12} className={isDarkMode ? 'text-blue-400' : 'text-blue-500'}/><span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}><span className={`font-bold mr-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{visitorCount > 0 ? visitorCount.toLocaleString() : '...'}</span> Visits</span></div>
           </div>
          <div className={`h-6 w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
          <button onClick={toggleLang} className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-white/10 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600 hover:text-black'}`}><Languages size={18} /></button>
          <button onClick={toggleTheme} className={`p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-white/10 text-yellow-400' : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'}`}>{isDarkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>

        {/* MOBILE MENU BTN */}
        <div className="flex md:hidden items-center gap-3">
          <div className={`flex items-center gap-2 px-2 py-1.5 rounded-lg border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
            <div className="flex items-center gap-1.5"><span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span></span><span className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{onlineCount || 1}</span></div>
            <div className={`w-px h-3 ${isDarkMode ? 'bg-white/10' : 'bg-gray-300'}`}></div>
            <div className="flex items-center gap-1.5"><Eye size={10} className={isDarkMode ? 'text-blue-400' : 'text-blue-500'}/><span className={`text-[10px] font-bold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{visitorCount > 0 ? (visitorCount > 1000 ? (visitorCount/1000).toFixed(1) + 'k' : visitorCount) : '...'}</span></div>
          </div>
          <button className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-white hover:bg-white/10' : 'text-gray-900 hover:bg-gray-100'}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>{isMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
        </div>
      </div>

      {/* --- MOBILE MENU DROPDOWN (FLAT LIST) --- */}
      {/* Di mobile, kita tidak pakai dropdown 'More', tapi tampilkan semua list lurus ke bawah agar UX lebih enak */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`overflow-hidden border-b ${isDarkMode ? 'bg-[#050505] border-white/10' : 'bg-white border-gray-200'} md:hidden`}
          >
            <div className="p-4 flex flex-col space-y-2 max-h-[70vh] overflow-y-auto">
              {/* Gabungkan semua link untuk Mobile */}
              {[...mainLinks, ...moreLinks].map(link => (
                <NavLink key={link.id} pageName={link.id} icon={link.icon} {...navProps}>{link.label}</NavLink>
              ))}
              <NavLink pageName="contact" icon={Mail} {...navProps}>{t.nav.contact}</NavLink>

              <div className="flex items-center justify-between pt-4 mt-2 border-t border-dashed dark:border-white/10 border-gray-200">
                  <div className="flex gap-2">
                     <a href="https://github.com" target="_blank" rel="noreferrer" className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}><Github size={18}/></a>
                     <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}><Linkedin size={18}/></a>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={toggleLang} className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${isDarkMode ? 'border-white/10 text-white' : 'border-gray-200 text-gray-900'}`}>{lang.toUpperCase()}</button>
                    <button onClick={toggleTheme} className={`p-1.5 rounded-lg border ${isDarkMode ? 'border-white/10 text-yellow-400' : 'border-gray-200 text-gray-600'}`}>{isDarkMode ? <Sun size={16}/> : <Moon size={16}/>}</button>
                  </div>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};