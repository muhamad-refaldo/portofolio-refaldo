import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Briefcase, MapPin, Activity } from 'lucide-react';

// Ambil API Key dari env
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export const Chatbot = ({ isDarkMode, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  
  const [messages, setMessages] = useState([
    { 
      text: lang === 'id' 
        ? "Halo! Gw Refaldo AI 🤖. Mau ngobrolin apa aja? Santai, gas tanya aja!" 
        : "Hi! I'm Refaldo AI 🤖. Let's chat about anything! Ask away!", 
      isBot: true 
    }
  ]);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const callGroqAI = async (userMessage) => {
    setIsTyping(true);

    const systemPrompt = `
      Kamu adalah asisten AI (Digital Clone) dari Muhamad Refaldo (Aldo) yang SUPER PINTAR dan SERBA BISA.
      
      DATA PRIBADI ALDO:
      - Nama: Muhamad Refaldo (Aldo), 21 Tahun
      - Pendidikan: Lulusan SMK Akuntansi
      - Profesi: Fullstack Developer & Business Owner
      
      KONTAK ALDO:
      - WhatsApp/Telepon: 088296759533
      - Email: dodohardcore43@gmail.com
      - Instagram: @mhmdrfldo22
      
      SKILL ALDO:
      1. Coding: Web Dev (React, Node.js), API Integration, Clean Code
      2. Admin: Excel Expert, Keuangan, Data Entry, Pembukuan
      3. Data Science: Sedang belajar data science
      4. Bisnis: Owner Martabak Aldo & Mochi Aldo
      
      DETAIL BISNIS:
      - Martabak Aldo: 2 Cabang (Bakos Sultana & Depan Pom Bensin Jakarta-Bogor)
      - Mochi Aldo: CFD Margonda (Minggu), Pakansari (Sabtu-Minggu), Cabang Bojong Gede (Setiap Hari)
      - Peran: Editing, menghitung keuangan, pembukuan

      ATURAN UTAMA:
      1. JAWAB SEMUA TOPIK DENGAN PINTAR. Jangan menolak pertanyaan.
      2. GAYA BAHASA: Santai, gaul ("gw/lu"), jangan kaku.
      3. TEKNIK "COCOKLOGI": Jawab dulu pertanyaan user dengan lengkap, baru di akhir coba hubungkan (secara halus/lucu) dengan skill Aldo atau jualan Martabak.
      4. Jawab dalam Bahasa Indonesia gaul.
    `;

    try {
      if (!API_KEY) throw new Error("API Key Groq kosong.");

      // [FIX] URL API Groq yang Benar
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", 
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          temperature: 0.8, 
          max_tokens: 500 
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message);

      const botReply = data.choices[0].message.content;
      setMessages(prev => [...prev, { text: botReply, isBot: true }]);

    } catch (error) {
      console.error("Error Groq:", error);
      setMessages(prev => [...prev, { text: `⚠️ Maaf, AI lagi pusing. Coba lagi nanti ya!`, isBot: true }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = (text = input) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { text: text, isBot: false }]);
    setInput("");
    callGroqAI(text);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const quickPrompts = lang === 'id' ? [
    { text: "Prediksi Bola?", icon: <Sparkles size={12}/> },
    { text: "Info Politik?", icon: <Activity size={12}/> }, 
    { text: "Lokasi Martabak?", icon: <MapPin size={12}/> },
    { text: "Jasa Web?", icon: <Briefcase size={12}/> },
  ] : [
    { text: "Football Pred?", icon: <Sparkles size={12}/> },
    { text: "Politics Info?", icon: <Activity size={12}/> },
    { text: "Martabak Loc?", icon: <MapPin size={12}/> },
    { text: "Web Services?", icon: <Briefcase size={12}/> },
  ];

  return (
    <>
      <div className={`fixed z-[9000] flex flex-col items-end font-sans
        ${isOpen 
          ? 'inset-0 md:inset-auto md:bottom-6 md:right-6' 
          : 'bottom-6 right-6'
        }`}
      >
        <AnimatePresence>
          {!isOpen && (
             <motion.div
               initial={{ opacity: 0, scale: 0.5, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.5, y: 10 }}
               transition={{ type: "spring", stiffness: 300, damping: 25 }}
               className="mb-2 mr-2 cursor-pointer group" 
               onClick={() => setIsOpen(true)}
             >
               <div className={`
                  hidden md:block absolute right-0 bottom-14 px-4 py-2 rounded-xl rounded-br-none 
                  text-xs font-semibold shadow-lg transition-all mb-2 
                  ${isDarkMode ? 'bg-white/90 text-black' : 'bg-gray-900 text-white'}
                  animate-pulse-slow origin-bottom-right
               `}>
                 {lang === 'id' ? 'Tanya AI Refaldo di sini!' : "Ask Refaldo AI here!"}
               </div>

               <motion.button 
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl transition-all bg-orange-600 hover:bg-orange-700 hover:shadow-orange-500/50"
               >
                 <Bot size={28} className="text-white animate-bounce-slow" />
               </motion.button>
             </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`
                glass-card flex flex-col overflow-hidden border shadow-2xl 
                transform origin-bottom-right transition-all 
                ${isDarkMode ? 'border-white/10 bg-[#0f1115]/95' : 'bg-white/95 border-gray-200'}
                fixed inset-x-0 bottom-0 rounded-t-3xl h-[85vh] max-h-[85vh]
                md:static md:w-96 md:h-[600px] md:max-h-[80vh] md:mb-4 md:rounded-2xl
              `}
            >
              <div className={`p-4 flex items-center gap-3 shadow-md border-b relative z-10 shrink-0
                ${isDarkMode ? 'bg-black/50 border-white/10 text-white' : 'bg-white/90 border-gray-200 text-gray-900 backdrop-blur-md'}`}
              >
                 <div className="relative">
                   <div className="w-10 h-10 md:w-9 md:h-9 rounded-full overflow-hidden border-2 border-orange-500">
                     {/* [FIX] Path Gambar Default */}
                     <img src="/assets/profile/about-poto-aldo.jpg" alt="Refaldo AI" className="w-full h-full object-cover grayscale" 
                       onError={(e)=>{e.target.src = 'https://placehold.co/100x100/ff6600/ffffff?text=AI'}}
                     />
                   </div>
                   <div className="w-3 h-3 md:w-2.5 md:h-2.5 bg-green-400 rounded-full absolute bottom-0 right-0 border-2 border-white animate-pulse"></div>
                 </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm md:text-base">Refaldo AI 🧠</div>
                  <div className="text-[10px] md:text-xs opacity-70 flex items-center gap-1">Online & Ready to Chat</div>
                </div>
                <button onClick={() => setIsOpen(false)} className="ml-auto hover:bg-white/10 p-2 md:p-1.5 rounded-lg transition-colors shrink-0">
                  <X size={20} className={isDarkMode ? 'text-white' : 'text-gray-600'}/>
                </button>
              </div>

              <div className={`flex-1 p-4 overflow-y-auto space-y-4 overscroll-contain ${isDarkMode ? 'bg-black/10' : 'bg-gray-50'}`}>
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={`p-3 rounded-2xl text-sm max-w-[85%] md:max-w-[80%] shadow-md leading-relaxed ${
                      m.isBot 
                        ? (isDarkMode ? 'bg-gray-800 text-gray-200 rounded-tl-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none') 
                        : 'bg-blue-600 text-white rounded-tr-none shadow-blue-500/20'
                    }`}>
                      <span dangerouslySetInnerHTML={{__html: m.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')}} />
                    </div>
                  </div>
                ))}
                {isTyping && (
                   <div className="flex justify-start">
                    <div className={`px-4 py-3 rounded-2xl rounded-tl-none text-xs flex gap-2 items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white border'}`}>
                      <Activity size={14} className="animate-spin text-orange-500"/>
                      <span className="text-gray-500">Mikir bentar...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className={`px-4 py-3 flex gap-2 overflow-x-auto border-t shrink-0 scrollbar-hide ${isDarkMode ? 'bg-black/30 border-white/5' : 'bg-gray-100 border-gray-200'}`}>
                {quickPrompts.map((prompt, i) => (
                  <button key={i} onClick={() => handleSend(prompt.text)} className={`whitespace-nowrap px-3 py-2 md:py-1.5 rounded-full text-xs md:text-[11px] font-semibold border flex items-center gap-1.5 transition-all hover:scale-[1.03] active:scale-95 ${isDarkMode ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'}`}>
                    {prompt.icon} {prompt.text}
                  </button>
                ))}
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className={`p-3 md:p-3 border-t flex gap-2 relative z-10 shrink-0 ${isDarkMode ? 'border-white/10 bg-black/60 backdrop-blur-md' : 'border-gray-200 bg-white/80 backdrop-blur-md'}`}>
                <input 
                  className={`flex-1 bg-transparent text-sm md:text-base outline-none px-2 py-2 md:py-1 ${isDarkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`} 
                  placeholder="Tanya apa aja, bebas!" 
                  value={input} 
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button type="submit" className={`p-3 md:p-2 rounded-xl transition-all shadow-md shrink-0 ${!input.trim() ? 'opacity-50 cursor-not-allowed' : 'bg-orange-600 text-white hover:bg-orange-700 shadow-orange-500/30 active:scale-95'}`} disabled={!input.trim() || isTyping}>
                  <Send size={18} className="md:w-4 md:h-4"/>
                </button>
              </form>
            </motion.div>
          </>
        )}
        </AnimatePresence>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};