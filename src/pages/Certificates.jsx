import { useState, useEffect } from 'react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { db } from '../config/firebase'; 
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Award, Calendar, BadgeCheck, ShieldAlert, Loader2, MousePointerClick } from 'lucide-react';
import { translations } from '../data/content';
import { CertificateModal } from '../components/CertificateModal';

export const CertificatesPage = ({ isDarkMode, lang }) => {
  const t = translations[lang]?.certificates;
  
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // --- FIRESTORE LISTENER ---
  useEffect(() => {
    const q = query(collection(db, 'certificates_data'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCertificates(data);
      setLoading(false); 
    }, (error) => {
      console.error("Error fetching certificates:", error);
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);

  if (!t) return null;

  return (
    <div className="space-y-12 min-h-screen">
      
      <Helmet>
        <title>{t.page_title} | Refaldo Portofolio</title>
        <meta name="description" content="Bukti kompetensi dan sertifikasi profesional." />
      </Helmet>

      {/* --- HEADER SECTION --- */}
      <div className="text-center max-w-3xl mx-auto space-y-4 relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-500/20 blur-[100px] -z-10 rounded-full" />
         
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase border ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}
         >
           <Award size={14} />
           {lang === 'id' ? 'Prestasi & Sertifikasi' : 'Achievements & Certifications'}
         </motion.div>
         
         <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-4xl md:text-6xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
         >
           {t.page_title}
         </motion.h2>
         
         <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}
         >
           {t.page_desc}
         </motion.p>
      </div>

      {/* --- CERTIFICATES GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2">
        <AnimatePresence mode="popLayout">
          {loading ? (
             <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="col-span-full flex flex-col items-center justify-center py-20 opacity-50"
             >
                <Loader2 size={40} className="animate-spin mb-4 text-blue-500"/>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Syncing with Firebase...</p>
            </motion.div>
          ) : certificates.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="col-span-full text-center py-20 opacity-70"
            >
              <ShieldAlert size={48} className={`mx-auto mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Belum ada sertifikat yang ditambahkan.</p>
            </motion.div>
          ) : (
            certificates.map((cert, index) => (
              <motion.div 
                key={cert.id}
                layoutId={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedCertificate(cert)} 
                className={`group relative rounded-3xl overflow-hidden border transition-all duration-500 cursor-pointer ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/5 hover:border-blue-500/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]' 
                    : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-2xl'
                }`}
              >
                {/* Image Container */}
                <div className="h-56 overflow-hidden relative bg-gray-900">
                  <img 
                    src={cert.imageUrl} 
                    alt={cert.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    // [FIX] Link placeholder yang benar
                    onError={(e) => {e.target.src = 'https://placehold.co/600x400/1e293b/ffffff?text=No+Image'}}
                  />
                  
                  <div className={`absolute inset-0 transition-opacity duration-300 ${isDarkMode ? 'bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80' : 'bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60'}`} />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-[1px]">
                    <span className="px-4 py-2 bg-white/90 text-black rounded-full font-bold text-xs flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                      <MousePointerClick size={14} /> Lihat Detail
                    </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-6 relative">
                  <div className="mb-4">
                    <h3 className={`font-bold text-lg leading-snug mb-2 line-clamp-2 group-hover:text-blue-500 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {cert.title}
                    </h3>
                    <div className={`text-xs font-medium flex items-center gap-1.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      <BadgeCheck size={14} fill="currentColor" className={isDarkMode ? 'text-blue-500/20' : 'text-blue-100'} /> 
                      <span>{cert.issuer}</span>
                    </div>
                  </div>
                  
                  <div className={`pt-4 border-t flex items-center justify-between text-xs ${isDarkMode ? 'border-white/10 text-gray-500' : 'border-gray-100 text-gray-500'}`}>
                    <span className="flex items-center gap-1.5">
                       <Calendar size={12} />
                       {cert.date}
                    </span>
                    <span className={`group-hover:translate-x-1 transition-transform duration-300 ${isDarkMode ? 'text-gray-600 group-hover:text-white' : 'text-gray-400 group-hover:text-black'}`}>
                      &rarr;
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {selectedCertificate && (
        <CertificateModal 
          certificate={selectedCertificate} 
          onClose={() => setSelectedCertificate(null)} 
          isDarkMode={isDarkMode} 
          lang={lang} 
        />
      )}
    </div>
  );
};