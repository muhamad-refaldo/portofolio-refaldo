import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Helmet } from 'react-helmet-async'; 
import { db } from '../config/firebase'; 
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ArrowUpRight, Briefcase, Globe, Smartphone, Database, Layers, Loader2, Search } from 'lucide-react';
import { translations, techStackData } from '../data/content';

export const ProjectsPage = ({ setSelectedProject, isDarkMode, lang }) => {
  const t = translations[lang];
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  const getLang = (data) => {
    if (!data) return "";
    return typeof data === 'object' ? (data[lang] || data.id || "") : data;
  };

  useEffect(() => {
    const q = query(collection(db, 'projects_data'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        tech: doc.data().tech || [], 
      }));
      setProjects(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching projects:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const categories = useMemo(() => ([
    { id: 'All', label: t?.projects?.cat_all || 'All', icon: Layers },
    { id: 'Web Developer', label: t?.projects?.cat_web || 'Web Dev', icon: Globe },
    { id: 'Apps Developer', label: t?.projects?.cat_apps || 'Apps Dev', icon: Smartphone },
    { id: 'Data Analyst', label: t?.projects?.cat_data || 'Data', icon: Database },
  ]), [t]);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') return projects;
    return projects.filter(p => p.category === activeCategory);
  }, [activeCategory, projects]);

  const getTechIcon = (techName) => {
    const tech = techStackData.find(t => t.name.toLowerCase() === techName.toLowerCase());
    return tech ? tech.icon : null;
  };

  return (
    <div className="space-y-12 min-h-screen">
      
      <Helmet>
        <title>{t?.projects?.page_title || 'Karya Saya'} | Refaldo Portofolio</title>
        <meta name="description" content="Lihat semua daftar proyek yang dibangun Muhamad Refaldo." />
      </Helmet>
      
      <div className="text-center max-w-3xl mx-auto space-y-4 relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 blur-[100px] -z-10 rounded-full" />
         
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}
         >
           <Briefcase size={14} />
           {lang === 'id' ? 'Galeri Karya' : 'Project Gallery'}
         </motion.div>
         
         <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-4xl md:text-6xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
         >
           {t?.projects?.page_title || 'Projects'}
         </motion.h2>
         
         <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
         >
           {t?.projects?.page_desc || 'Kumpulan karya terbaik yang pernah saya kerjakan.'}
         </motion.p>
      </div>

      <div className="flex justify-center">
        <div className={`p-1.5 rounded-2xl border flex flex-wrap justify-center gap-1 ${isDarkMode ? 'bg-black/20 border-white/10 backdrop-blur-sm' : 'bg-white/50 border-gray-200'}`}>
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 z-10 ${
                  isActive 
                    ? 'text-white' 
                    : isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-black'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-600 rounded-xl -z-10 shadow-lg shadow-blue-600/30"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon size={14} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 px-2">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="col-span-full flex flex-col items-center justify-center py-20 opacity-50"
            >
                <Loader2 size={40} className="animate-spin mb-4 text-blue-500"/>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Syncing with Firebase...</p>
            </motion.div>
          ) : filteredProjects.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="col-span-full text-center py-20 opacity-70"
            >
              <Search size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>No projects found in <b>{activeCategory}</b>.</p>
            </motion.div>
          ) : (
            filteredProjects.map((project) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`group relative rounded-3xl overflow-hidden cursor-pointer border transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/5 hover:border-blue-500/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]' 
                    : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-2xl'
                }`}
              >
                <div className="h-72 overflow-hidden relative">
                  <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {e.target.src = 'https://placehold.co/600x400/1e293b/ffffff?text=Image+Error'}}
                  />
                  <div className={`absolute inset-0 transition-opacity duration-300 ${isDarkMode ? 'bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent opacity-90' : 'bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80'}`} />
                  
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg backdrop-blur-md border shadow-lg ${
                      project.category === 'Web Developer' ? 'bg-blue-500/20 border-blue-500/30 text-blue-200' :
                      project.category === 'Apps Developer' ? 'bg-purple-500/20 border-purple-500/30 text-purple-200' :
                      'bg-green-500/20 border-green-500/30 text-green-200'
                    }`}>
                      {project.category}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2 group-hover:text-blue-400 transition-colors">
                      {project.title}
                      <ArrowUpRight size={20} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-400" />
                    </h3>
                    <p className="text-gray-300 text-sm line-clamp-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {getLang(project.description)}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(project.tech) && project.tech.slice(0, 4).map((t, i) => {
                        const iconUrl = getTechIcon(t);
                        return (
                          <div key={i} className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center" title={t}>
                             {iconUrl ? <img src={iconUrl} className={`w-5 h-5 ${isDarkMode && (t === 'Next.js' || t === 'Express') ? 'invert' : ''}`} alt={t}/> : <span className="text-[8px] text-white">{t.slice(0,2)}</span>}
                          </div>
                        )
                      })}
                       {Array.isArray(project.tech) && project.tech.length > 4 && (
                        <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-300">
                          +{project.tech.length - 4}
                        </div>
                       )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};