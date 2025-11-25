import { useState } from 'react';
import { Github, Linkedin, Instagram, Mail, ArrowUp, Send, MapPin, Phone, Lock } from 'lucide-react';
import { translations, socialMedia } from '../data/content';
import { ServerStatus } from './UI';

export const Footer = ({ setPage, isDarkMode, lang }) => {
  const t = translations[lang].footer;
  const nav = translations[lang].nav;
  const [emailInput, setEmailInput] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    window.open(`mailto:${socialMedia.email}?subject=Subscribe Newsletter&body=Halo Refaldo, saya ${emailInput} ingin berlangganan info terbaru!`, '_blank');
    setEmailInput("");
  };

  return (
    <footer className={`relative pt-24 pb-10 overflow-hidden border-t mt-20 ${isDarkMode ? 'bg-[#050505] border-white/5' : 'bg-gray-50 border-gray-200'}`}>
      
      {/* Decoration Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none">
         <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-[100px]"></div>
         <div className="absolute bottom-0 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px]"></div>
         <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent ${isDarkMode ? 'via-blue-500/50' : 'via-blue-300/50'} to-transparent`}></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* BRAND & STATUS */}
          <div className="md:col-span-5 space-y-6">
            <div className="text-2xl font-bold cursor-pointer flex items-center gap-2 group w-fit" onClick={() => setPage('home')}>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-300">
                <span className="font-mono text-white font-bold text-xl">M</span>
              </div>
              <span className={`tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Refaldo<span className="text-blue-500">.</span>
              </span>
            </div>
            <p className={`leading-relaxed max-w-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t.desc}</p>
            <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border w-fit ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
               <div className="p-1.5 bg-blue-500/20 rounded-full text-blue-500"><MapPin size={16} /></div>
               <div className="text-xs">
                 <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.location}</div>
                 <div className="text-gray-500">Cibinong, Kab. Bogor</div>
               </div>
            </div>
            <div className="pt-2"><ServerStatus isDarkMode={isDarkMode} setPage={setPage} /></div>
          </div>

          {/* NAVIGATION */}
          <div className="md:col-span-2 md:col-start-7">
            <h4 className={`font-bold mb-6 text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.menuTitle}</h4>
            <ul className="space-y-4">
              {[
                { id: 'home', label: nav.home },
                { id: 'about', label: nav.about },
                { id: 'projects', label: nav.works },
                { id: 'certificates', label: nav.certs },
                { id: 'blog', label: nav.blog }, 
                { id: 'guestbook', label: nav.guestbook },
                { id: 'contact', label: nav.contact }
              ].map((item) => (
                <li key={item.id}>
                  <button onClick={() => { setPage(item.id); scrollToTop(); }} className={`text-sm flex items-center gap-2 group transition-colors ${isDarkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* SOCIALS & NEWSLETTER */}
          <div className="md:col-span-4">
            <h4 className={`font-bold mb-6 text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.connectTitle}</h4>
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { icon: Github, href: socialMedia.github, color: "hover:bg-gray-800 hover:text-white hover:border-gray-700" },
                { icon: Linkedin, href: socialMedia.linkedin, color: "hover:bg-blue-600 hover:text-white hover:border-blue-600" },
                { icon: Instagram, href: socialMedia.instagram, color: "hover:bg-pink-600 hover:text-white hover:border-pink-600" },
                { icon: Mail, href: `mailto:${socialMedia.email}`, color: "hover:bg-red-500 hover:text-white hover:border-red-500" },
                { icon: Phone, href: socialMedia.whatsappUrl, color: "hover:bg-green-500 hover:text-white hover:border-green-500" }
              ].map((social, i) => (
                <a key={i} href={social.href} target="_blank" rel="noreferrer" className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 group ${isDarkMode ? 'bg-white/5 border-white/10 text-gray-400' : 'bg-white border-gray-200 text-gray-600'} ${social.color}`}>
                  <social.icon size={18} className="transition-transform group-hover:scale-110" />
                </a>
              ))}
            </div>
            <div>
              <h4 className={`font-bold mb-4 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.newsletterTitle}</h4>
              <form onSubmit={handleSubscribe} className={`p-1.5 rounded-xl border flex items-center relative group ${isDarkMode ? 'bg-white/5 border-white/10 focus-within:border-blue-500/50' : 'bg-white border-gray-200 focus-within:border-blue-400'}`}>
                <input type="email" placeholder="Enter email..." value={emailInput} onChange={(e) => setEmailInput(e.target.value)} className={`w-full bg-transparent px-3 py-2 text-sm outline-none ${isDarkMode ? 'text-white placeholder-gray-600' : 'text-gray-900 placeholder-gray-400'}`} />
                <button type="submit" className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg shadow-blue-600/20"><Send size={16} /></button>
              </form>
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">{t.newsletterDesc}</p>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className={`border-t pt-8 pb-8 flex flex-col md:flex-row justify-between items-center gap-4 ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
          <p className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>© {new Date().getFullYear()} {t.rights}</p>
          <div className="flex items-center gap-6">
            {/* Link Privacy Policy Aktif */}
            <button 
              onClick={() => { setPage('privacy'); scrollToTop(); }}
              className={`text-xs hover:text-blue-500 transition-colors ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}
            >
              Privacy Policy
            </button>
            <button onClick={() => setPage('login')} className={`text-xs flex items-center gap-1 hover:text-blue-500 transition-colors ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}><Lock size={12} /> Admin</button>
            <button onClick={scrollToTop} className={`p-2 rounded-lg border transition-all hover:-translate-y-1 ${isDarkMode ? 'bg-white/5 border-white/10 text-white hover:bg-blue-600 hover:border-blue-600' : 'bg-white border-gray-200 text-gray-900 hover:bg-blue-600 hover:text-white hover:border-blue-600'}`}><ArrowUp size={16} /></button>
          </div>
        </div>
      </div>
    </footer>
  );
};