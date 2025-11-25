import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
// [FIX] Hapus Loader2
import { Sparkles, Download, Code, FileText, Briefcase, MapPin, Star, GraduationCap, Calendar } from 'lucide-react';
import { db } from '../config/firebase'; 
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { translations } from '../data/content';

// --- HELPER: Loading Skeleton ---
const AboutSkeleton = ({ isDarkMode }) => (
  <div className="max-w-4xl mx-auto space-y-12 pb-12 animate-pulse">
    <div className={`h-96 rounded-3xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`} />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1,2,3].map(i => <div key={i} className={`h-32 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`} />)}
    </div>
    <div className={`h-64 rounded-2xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`} />
  </div>
);

export const AboutPage = ({ isDarkMode, lang }) => {
  const t = translations[lang]; 
  
  const [profile, setProfile] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  // Loading default true
  const [loading, setLoading] = useState(true);

  // --- HELPER: Ambil Bahasa (ID/EN) ---
  const getLang = (data) => {
    if (!data) return "";
    return typeof data === 'object' ? (data[lang] || data.id || "") : data;
  };

  // --- FETCH DATA FIREBASE ---
  useEffect(() => {
    // [FIX] JANGAN SET LOADING TRUE DI SINI (Penyebab Loop)
    
    // 1. Profile Data
    const unsubProfile = onSnapshot(doc(db, 'config', 'profile_data'), (doc) => {
      if(doc.exists()) setProfile(doc.data());
    });

    // 2. Experiences
    const qExp = query(collection(db, 'experiences'), orderBy('createdAt', 'desc')); 
    const unsubExp = onSnapshot(qExp, (snapshot) => {
      setExperiences(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // 3. Testimonials
    const qTesti = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'));
    const unsubTesti = onSnapshot(qTesti, (snapshot) => {
      setTestimonials(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      // Matikan loading setelah data terakhir diambil
      setLoading(false); 
    });

    return () => { unsubProfile(); unsubExp(); unsubTesti(); };
  }, []);

  if (loading) return <AboutSkeleton isDarkMode={isDarkMode} />;

  return (
  <div className="max-w-4xl mx-auto space-y-20 pb-12">
    
    <Helmet>
      <title>{t.nav.about} | Muhamad Refaldo</title>
      <meta name="description" content="Profil lengkap Muhamad Refaldo." />
    </Helmet>
    
    {/* --- HERO SECTION --- */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-3xl p-10 md:p-14 text-center relative overflow-hidden group"
    >
       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-600/20 blur-[80px] rounded-full group-hover:bg-blue-600/30 transition-colors" />
       
       <div className="relative z-10 flex flex-col items-center">
         <motion.div whileHover={{ scale: 1.05 }} className="relative mb-8 cursor-pointer">
            {/* [FIX] Gunakan bg-linear-to-r (Tailwind v4 syntax recommendation) */}
            <div className="absolute inset-0 bg-linear-to-r from-blue-600 to-cyan-500 rounded-full blur-lg opacity-50 group-hover:opacity-80 transition-opacity animate-pulse"></div>
            <img 
              src={profile?.photoUrl || "https://placehold.co/400x400/1e293b/ffffff?text=Profile"} 
              alt="Muhamad Refaldo" 
              className="relative w-40 h-40 rounded-full object-cover border-4 border-[#0a0a0f] shadow-2xl"
              onError={(e) => {e.target.src = 'https://placehold.co/400x400/1e293b/ffffff?text=Error'}}
            />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-1 right-1 w-10 h-10 bg-[#0a0a0f] rounded-full flex items-center justify-center border border-white/10 text-blue-500"
            >
              <Sparkles size={18} />
            </motion.div>
         </motion.div>

         <h2 className={`text-4xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.about.title}</h2>
         
         {/* DYNAMIC BIO */}
         <div 
            className={`text-xl leading-relaxed text-justify md:text-center max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`} 
            dangerouslySetInnerHTML={{__html: getLang(profile?.bio)}} 
         />

         {profile?.cvLink && (
           <motion.a 
             href={profile.cvLink} 
             target="_blank" 
             rel="noopener noreferrer"
             whileHover={{ scale: 1.05 }}
             whileTap={{ scale: 0.95 }}
             className={`mt-8 px-8 py-3 border rounded-xl font-semibold transition-all flex items-center gap-2 group hover:shadow-lg cursor-pointer ${isDarkMode ? 'bg-white/5 hover:bg-blue-600 border-white/10 hover:shadow-blue-600/20 text-white' : 'bg-blue-50 hover:bg-blue-600 border-blue-200 hover:text-white text-blue-600'}`}
           >
             <Download size={18} className="group-hover:animate-bounce" /> {t.about.download}
           </motion.a>
         )}
       </div>
    </motion.div>

    {/* --- STATS CARDS --- */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {t.about.props.map((item, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className={`glass-card p-6 rounded-2xl border-t-4 ${i===0?'border-blue-500':i===1?'border-purple-500':'border-green-500'} hover:-translate-y-1 transition-transform ${isDarkMode ? '' : 'bg-white'}`}
        >
          <h4 className={`text-lg font-bold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {i===0?<Code size={20} className="text-blue-500"/>:i===1?<FileText size={20} className="text-purple-500"/>:<Briefcase size={20} className="text-green-500"/>}
            {item.title}
          </h4>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
        </motion.div>
      ))}
    </div>

    {/* --- TIMELINE EXPERIENCE (DYNAMIC) --- */}
    {experiences.length > 0 && (
      <div>
        <motion.h3 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`text-2xl font-bold mb-8 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
        >
          <Briefcase className="text-blue-500" /> {t.about.exp_title}
        </motion.h3>
        
        <div className="relative space-y-8 pl-2 md:pl-4">
          <div className={`absolute left-2 md:left-4 top-2 bottom-2 w-0.5 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

          {experiences.map((item, i) => (
            <motion.div 
              key={item.id} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative pl-8 md:pl-12 group"
            >
              <div className={`absolute left-0 md:left-2 top-0 w-4 h-4 rounded-full border-4 transition-colors duration-300 z-10 ${isDarkMode ? 'bg-[#0a0a0f] border-blue-500 group-hover:bg-blue-500' : 'bg-white border-blue-500 group-hover:bg-blue-500'}`}></div>
              
              <div className={`glass-card p-6 rounded-2xl hover:border-blue-500/50 transition-all duration-300 relative ${isDarkMode ? 'bg-white/5' : 'bg-white shadow-sm'}`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                  <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.role}</h4>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    <Calendar size={12} /> {item.year}
                  </span>
                </div>
                
                <div className="text-base text-blue-500 mb-3 font-medium flex items-center gap-2">
                   {item.company} 
                   <span className={`text-xs px-2 py-0.5 rounded border ${isDarkMode ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-500'}`}>
                     <MapPin size={10} className="inline mr-1"/>{item.location}
                   </span>
                </div>
                
                <p className={`text-sm leading-relaxed whitespace-pre-line ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {getLang(item.desc)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )}

    {/* --- TESTIMONIALS (DYNAMIC) --- */}
    {testimonials.length > 0 && (
      <div>
        <motion.h3 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className={`text-2xl font-bold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
        >
          <Star className="text-yellow-400" /> Testimonials
        </motion.h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {testimonials.map((testi, i) => (
            <motion.div 
              key={testi.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`glass-card p-6 rounded-2xl transition-colors relative ${isDarkMode ? 'hover:border-white/20' : 'hover:border-blue-300 bg-white/50'}`}
            >
              <div className={`absolute -top-3 -left-3 w-10 h-10 rounded-full bg-${testi.color || 'blue'}-500/20 border border-${testi.color || 'blue'}-500/50 flex items-center justify-center text-${testi.color || 'blue'}-500`}>
                <Star size={18} fill="currentColor" />
              </div>
              <p className={`text-sm mb-4 italic leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>&ldquo;{getLang(testi.text)}&rdquo;</p>
              <div>
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{testi.name}</h4>
                <span className="text-xs text-gray-500">{testi.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    )}

    {/* --- EDUCATION (DYNAMIC) --- */}
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass-card p-8 rounded-3xl border mt-8 flex items-center gap-6 ${isDarkMode ? 'border-white/5' : 'border-gray-200 bg-white'}`}
    >
       <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 border border-purple-500/20 shrink-0">
         <GraduationCap size={32} />
       </div>
       <div>
         <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{profile?.eduName || t.about.edu_name}</h4>
         <p className="text-gray-500 mb-2">{profile?.eduYear || t.about.edu_year}</p>
         <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {getLang(profile?.eduDesc) || t.about.edu_desc}
         </p>
       </div>
    </motion.div>
  </div>
  );
};