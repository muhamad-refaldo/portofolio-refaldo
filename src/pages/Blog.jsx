import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
// [FIX] Hapus AnimatePresence & Loader2
import { BookOpen, ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { db } from '../config/firebase'; 
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

// --- SKELETON LOADING ---
const BlogSkeleton = ({ isDarkMode }) => (
  <div className={`rounded-3xl overflow-hidden border h-[400px] ${isDarkMode ? 'border-white/5 bg-white/5' : 'border-gray-200 bg-gray-50'}`}>
    <div className="h-48 w-full bg-gray-400/10 animate-pulse" />
    <div className="p-6 space-y-3">
      <div className="h-6 w-3/4 bg-gray-400/20 rounded animate-pulse" />
      <div className="h-4 w-full bg-gray-400/10 rounded animate-pulse" />
      <div className="h-4 w-1/2 bg-gray-400/10 rounded animate-pulse" />
    </div>
  </div>
);

export const BlogPage = ({ isDarkMode, lang }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Helper Bahasa
  const getLang = (data) => {
    if (!data) return "";
    return typeof data === 'object' ? (data[lang] || data.id || "") : data;
  };

  // Fetch Data
  useEffect(() => {
    const q = query(collection(db, 'articles_data'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setArticles(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- TAMPILAN BACA ARTIKEL (DETAIL) ---
  if (selectedArticle) {
    return (
      <div className="max-w-4xl mx-auto pb-20 pt-5 min-h-screen animate-fade-up">
        {/* Tombol Kembali */}
        <button 
          onClick={() => setSelectedArticle(null)} 
          className={`group flex items-center gap-2 mb-8 px-5 py-2.5 rounded-xl font-bold transition-all ${isDarkMode ? 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black'}`}
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform"/> 
          {lang === 'id' ? 'Kembali ke Daftar' : 'Back to List'}
        </button>

        <article className={`p-8 md:p-12 rounded-[2.5rem] border shadow-2xl ${isDarkMode ? 'bg-[#0f1115] border-white/10' : 'bg-white border-gray-200'}`}>
           {/* Meta Header */}
           <div className="text-center space-y-4 mb-8">
             <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wide border border-blue-500/20">
               <Tag size={12}/> {selectedArticle.category || 'Technology'}
             </span>
             
             <h1 className={`text-3xl md:text-5xl font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
               {selectedArticle.title}
             </h1>
             
             <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5"><User size={14}/> Admin</span>
                <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14}/> 
                  {selectedArticle.createdAt ? new Date(selectedArticle.createdAt.seconds * 1000).toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                </span>
             </div>
           </div>
           
           {/* Gambar Utama */}
           <div className="rounded-3xl overflow-hidden shadow-lg mb-10 border border-gray-500/10">
             <img 
               src={selectedArticle.imageUrl} 
               alt={selectedArticle.title} 
               className="w-full h-64 md:h-[450px] object-cover bg-gray-800" 
               // [FIX] Link placeholder yang benar
               onError={(e) => {e.target.src = 'https://placehold.co/800x400/1e293b/ffffff?text=Image+Error'}}
             />
           </div>
           
           {/* Konten Artikel (HTML Rendered) */}
           <div 
             className={`prose prose-lg max-w-none leading-relaxed ${isDarkMode ? 'prose-invert text-gray-300' : 'text-gray-800'}`}
             dangerouslySetInnerHTML={{__html: getLang(selectedArticle.content)}}
           />
        </article>
      </div>
    );
  }

  // --- TAMPILAN DAFTAR ARTIKEL (LIST) ---
  return (
    <div className="max-w-6xl mx-auto space-y-12 min-h-screen pb-20">
      <Helmet>
        <title>Blog | Refaldo Portofolio</title>
        <meta name="description" content="Tulisan dan pemikiran seputar teknologi dan bisnis." />
      </Helmet>

      {/* Header List */}
      <div className="text-center space-y-4">
         <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
           <BookOpen size={14} /> Blog
         </div>
         <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
           {lang === 'id' ? 'Tulisan & Wawasan' : 'Writings & Insights'}
         </h2>
         <p className={`max-w-lg mx-auto text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
           {lang === 'id' 
             ? 'Berbagi pengalaman tentang coding, bisnis, dan perjalanan karir.' 
             : 'Sharing experiences about coding, business, and career journey.'}
         </p>
      </div>

      {/* Grid Artikel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          [1,2,3,4].map(i => <BlogSkeleton key={i} isDarkMode={isDarkMode}/>)
        ) : articles.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 opacity-50 border-2 border-dashed rounded-3xl border-gray-700">
            <BookOpen size={48} className="mb-4 opacity-50"/>
            <p>{lang === 'id' ? 'Belum ada artikel yang diterbitkan.' : 'No articles published yet.'}</p>
          </div>
        ) : (
          articles.map((item) => (
            <motion.div 
              key={item.id}
              layoutId={item.id}
              onClick={() => setSelectedArticle(item)}
              whileHover={{ y: -5 }}
              className={`group cursor-pointer rounded-3xl overflow-hidden border transition-all hover:shadow-2xl ${isDarkMode ? 'bg-white/5 border-white/5 hover:border-blue-500/50' : 'bg-white border-gray-200 hover:border-blue-400'}`}
            >
               {/* Image Card */}
               <div className="h-64 overflow-hidden relative">
                 <img 
                   src={item.imageUrl} 
                   alt={item.title} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                   // [FIX] Link placeholder yang benar
                   onError={(e) => {e.target.src = 'https://placehold.co/600x400/1e293b/ffffff?text=Thumbnail'}}
                 />
                 <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-[#0a0a0f] via-transparent to-transparent' : 'from-black/60 via-transparent to-transparent'} opacity-80`} />
                 
                 <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-lg bg-black/50 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/10">
                      {item.category}
                    </span>
                 </div>
               </div>
               
               {/* Content Card */}
               <div className="p-6 md:p-8">
                 <div className="flex items-center gap-2 text-xs text-gray-500 mb-3 font-medium">
                   <Calendar size={12} />
                   {item.createdAt ? new Date(item.createdAt.seconds * 1000).toLocaleDateString() : '-'}
                 </div>
                 
                 <h3 className={`text-2xl font-bold mb-3 line-clamp-2 leading-tight group-hover:text-blue-500 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                   {item.title}
                 </h3>
                 
                 {/* Preview Text */}
                 <p className={`text-sm line-clamp-3 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                   {getLang(item.content).replace(/<[^>]*>?/gm, '').substring(0, 120)}...
                 </p>
                 
                 <div className={`mt-6 pt-6 border-t flex items-center gap-2 text-sm font-bold transition-colors ${isDarkMode ? 'border-white/10 text-blue-400 group-hover:text-blue-300' : 'border-gray-100 text-blue-600 group-hover:text-blue-500'}`}>
                   {lang === 'id' ? 'Baca Selengkapnya' : 'Read Article'} 
                   <ArrowLeft size={16} className="rotate-180 group-hover:translate-x-1 transition-transform"/>
                 </div>
               </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};