import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { Helmet } from 'react-helmet-async';
import { Rocket, User, Briefcase, Globe, Terminal, ArrowUpRight, Database, Award, Smartphone } from 'lucide-react';
import { db } from '../config/firebase'; 
import { collection, onSnapshot, query, orderBy, limit, doc, where } from 'firebase/firestore'; 

import { translations } from '../data/content';
import { TechMarquee } from '../components/UI';

// --- COMPONENT SKELETON ---
const ProjectSkeleton = ({ isDarkMode }) => (
  <div className={`glass-card rounded-2xl overflow-hidden border h-full ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
    <div className="h-48 w-full bg-gray-400/10 animate-pulse" />
    <div className="p-5 space-y-4">
      <div className="h-6 w-3/4 bg-gray-400/20 rounded animate-pulse" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-gray-400/10 rounded animate-pulse" />
        <div className="h-3 w-5/6 bg-gray-400/10 rounded animate-pulse" />
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-2 w-2 rounded-full bg-gray-400/30 animate-pulse" />
        <div className="h-2 w-2 rounded-full bg-gray-400/30 animate-pulse" />
        <div className="h-2 w-2 rounded-full bg-gray-400/30 animate-pulse" />
      </div>
    </div>
  </div>
);

export const HomePage = ({ setPage, setSelectedProject, isDarkMode, lang }) => {
  const t = translations[lang];
  
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [heroTexts, setHeroTexts] = useState(['Fullstack Developer', 'UI/UX Enthusiast', 'Tech Learner']);
  const [heroDescription, setHeroDescription] = useState(t.hero.desc); 
  
  const [stats, setStats] = useState({ web: 0, apps: 0, data: 0, totalProjects: 0, certificates: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  // [FIX] Gunakan useCallback untuk getLang agar stabil di useEffect
  const getLang = useCallback((data) => {
    if (!data) return "";
    return typeof data === 'object' ? (data[lang] || data.id || "") : data;
  }, [lang]);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } } };

  // --- 1. FETCH HERO ---
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'config', 'hero_text'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.texts) {
           const texts = Array.isArray(data.texts) ? data.texts : (data.texts[lang] || data.texts.id || []);
           setHeroTexts(texts);
        }
        if (data.description) {
           setHeroDescription(getLang(data.description));
        }
      }
    });
    return () => unsubscribe();
  }, [lang, getLang]); // Dependency aman

  // --- 2. FETCH PROJECTS (FEATURED) ---
  useEffect(() => {
    const q = query(collection(db, 'projects_data'), where('isFeatured', '==', true), orderBy('createdAt', 'desc'), limit(3));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), tech: doc.data().tech || [] }));
      setFeaturedProjects(data);
      setLoadingProjects(false);
    }, (error) => {
      console.error("Index Error (Check Console Link):", error);
      setLoadingProjects(false); 
    });
    return () => unsubscribe();
  }, []);

  // --- 3. FETCH STATS ---
  useEffect(() => {
    setLoadingStats(true);
    let counts = { web: 0, apps: 0, data: 0, totalProjects: 0, certificates: 0 };
    
    const unsubProjects = onSnapshot(collection(db, 'projects_data'), (snapshot) => {
      let webCount = 0, appsCount = 0, dataCount = 0;
      snapshot.docs.forEach(doc => {
        const cat = doc.data().category;
        if (cat === 'Web Developer') webCount++;
        else if (cat === 'Apps Developer') appsCount++;
        else if (cat === 'Data Analyst') dataCount++;
      });
      counts = { ...counts, web: webCount, apps: appsCount, data: dataCount, totalProjects: snapshot.size };
      setStats(counts);
    });

    const unsubCerts = onSnapshot(collection(db, 'certificates_data'), (snapshot) => {
      setStats(s => ({...s, certificates: snapshot.size}));
      setLoadingStats(false); 
    });
    
    return () => { unsubProjects(); unsubCerts(); };
  }, []);

  const statItems = useMemo(() => ([
    { title: "Projects Web", count: stats.web, color: "blue", icon: Globe },
    { title: "Projects Apps", count: stats.apps, color: "purple", icon: Smartphone },
    { title: "Projects Data", count: stats.data, color: "green", icon: Database },
    { title: "Sertifikat", count: stats.certificates, color: "cyan", icon: Award },
  ]), [stats]);

  return (
    <>
      <Helmet>
        <title>Muhamad Refaldo | Fullstack & Business Owner</title>
        <meta name="description" content="Halo! Saya Muhamad Refaldo, Fullstack Developer." />
      </Helmet>

      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* HERO */}
          <motion.div variants={itemVariants} className="md:col-span-8 glass-card rounded-3xl p-8 md:p-12 flex flex-col justify-center relative overflow-hidden group shadow-2xl shadow-blue-900/5">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/20 to-purple-600/20 blur-[100px] rounded-full group-hover:bg-blue-600/30 transition-colors duration-1000 animate-pulse" />
            <div className="relative z-10">
              <h1 className={`text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                MUHAMAD REFALDO <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                  <TypeAnimation key={JSON.stringify(heroTexts)} sequence={heroTexts.flatMap(text => [text, 2000])} wrapper="span" speed={50} repeat={Infinity} />
                </span>
              </h1>
              
              <p className={`text-lg mb-8 max-w-xl leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} dangerouslySetInnerHTML={{__html: heroDescription}} />
              
              <div className="flex flex-wrap gap-4">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPage('projects')} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/25"><Rocket size={20} /> {t.hero.cta_primary}</motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setPage('about')} className={`px-6 py-3 glass-card font-semibold rounded-xl flex items-center gap-2 ${isDarkMode ? 'hover:bg-white/10 text-white' : 'hover:bg-gray-100 text-gray-900 border border-gray-200'}`}><User size={20} /> {t.hero.cta_secondary}</motion.button>
              </div>
            </div>
          </motion.div>

          {/* STATS */}
          <motion.div variants={itemVariants} className={`md:col-span-4 glass-card rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden group transition-all ${isDarkMode ? 'hover:border-blue-500/30 hover:bg-white/5' : 'hover:border-blue-300'}`}>
             <div className="absolute -right-4 -bottom-4 text-gray-500/5 group-hover:text-blue-500/10 transition-colors duration-500 transform group-hover:scale-110 group-hover:-rotate-12"><Briefcase size={140} /></div>
             {loadingStats ? <div className="animate-pulse flex h-full items-center justify-center text-xs text-gray-500">Loading Stats...</div> : (
               <div className="relative z-10 space-y-5">
                 <div className="pb-4 border-b border-dashed border-gray-700/30">
                   <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Contributions</p>
                   <div className="flex items-baseline gap-2"><span className={`text-5xl font-extrabold tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.totalProjects}</span><span className="text-blue-500 font-bold">+ Projects</span></div>
                </div>
                 <div className="space-y-3 pt-2">
                    {statItems.filter(s => s.title.startsWith('Projects')).map((stat, i) => (
                      <div key={i} className="flex justify-between items-center"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg bg-${stat.color}-500/10 text-${stat.color}-500`}><stat.icon size={16} /></div><span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{stat.title.replace('Projects ', '')}</span></div><span className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stat.count}</span></div>
                    ))}
                    <div className={`mt-4 pt-3 border-t ${isDarkMode ? 'border-white/10' : 'border-gray-200'} flex justify-between items-center`}><div className="flex items-center gap-3"><div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-500"><Award size={16} /></div><span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Certificates</span></div><span className="font-bold text-yellow-500">{stats.certificates}</span></div>
                 </div>
               </div>
             )}
          </motion.div>

          {/* MARQUEE */}
          <motion.div variants={itemVariants} className="md:col-span-12 glass-card rounded-2xl p-1 overflow-hidden shadow-lg">
            <div className={`${isDarkMode ? 'bg-black/40' : 'bg-gray-50'} rounded-xl`}><TechMarquee isDarkMode={isDarkMode} /></div>
          </motion.div>

          {/* SKILLS */}
          {[{ icon: Globe, color: "blue", ...t.skills.web }, { icon: Terminal, color: "purple", ...t.skills.backend }, { icon: Briefcase, color: "green", ...t.skills.biz }].map((skill, i) => (
            <motion.div key={i} variants={itemVariants} whileHover={{ y: -10, transition: { duration: 0.2 } }} className={`md:col-span-4 glass-card rounded-3xl p-8 cursor-default border ${isDarkMode ? 'hover:bg-white/5 border-white/5 hover:border-blue-500/30' : 'hover:bg-white border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-xl'} transition-colors`}>
              <div className={`w-14 h-14 rounded-2xl bg-${skill.color}-500/10 flex items-center justify-center text-${skill.color}-500 mb-6 border border-${skill.color}-500/20`}><skill.icon size={28} /></div>
              <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{skill.title}</h3>
              <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{skill.desc}</p>
            </motion.div>
          ))}
        </div>
        
        {/* PROJECTS */}
        <motion.div variants={containerVariants} className="pt-8">
          <div className="flex justify-between items-end mb-8 px-2">
            <div>
              <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{t.projects.title}</h2>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{t.projects.subtitle}</p>
            </div>
            <button onClick={() => setPage('projects')} className="group flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors"><span className="text-sm font-medium">{t.projects.view_all}</span><ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"/></button>
          </div>
          
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingProjects ? (
               <><ProjectSkeleton isDarkMode={isDarkMode} /><ProjectSkeleton isDarkMode={isDarkMode} /><ProjectSkeleton isDarkMode={isDarkMode} /></>
            ) : featuredProjects.length === 0 ? (
               <div className="col-span-3 text-center py-10 text-gray-500">Belum ada featured project.</div>
            ) : (
               featuredProjects.map((project) => (
                  <motion.div key={project.id} variants={itemVariants} onClick={() => setSelectedProject(project)} className={`glass-card rounded-2xl overflow-hidden group cursor-pointer border transition-all duration-300 ${isDarkMode ? 'border-white/5 hover:border-blue-500/50' : 'border-gray-200 hover:border-blue-400 hover:shadow-xl'}`}>
                      <div className="h-48 overflow-hidden relative">
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => {e.target.src = 'https://placehold.co/600x400/1e293b/ffffff?text=Image+Error'}} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                        <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10 text-xs font-medium text-white">{project.category}</div>
                      </div>
                      <div className="p-5 relative">
                        <h3 className={`font-bold text-lg mb-1 group-hover:text-blue-500 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{project.title}</h3>
                        <p className={`text-xs line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {getLang(project.description)}
                        </p>
                        <div className="flex gap-2 mt-3">{project.tech && project.tech.slice(0,3).map((t, i) => (<span key={i} className="w-2 h-2 rounded-full bg-blue-500/50"></span>))}</div>
                      </div>
                    </motion.div>
               ))
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
};