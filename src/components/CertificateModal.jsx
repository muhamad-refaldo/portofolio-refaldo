import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, BadgeCheck, ExternalLink, Award } from 'lucide-react';
import { translations } from '../data/content';

export const CertificateModal = ({ certificate, onClose, isDarkMode, lang }) => {
  const t = translations[lang]?.certificates || { view_cred: "Lihat Kredensial" }; 
  
  // Helper Bahasa
  const getLang = (data) => {
    if (!data) return "";
    return typeof data === 'object' ? (data[lang] || data.id || "") : data;
  };

  if (!certificate) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 modal-overlay" 
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          // [FIX] Max-height dan responsive
          className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl relative modal-content shadow-2xl border flex flex-col ${isDarkMode ? 'bg-[#0f1115] border-white/10' : 'bg-white border-gray-200'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`sticky top-0 right-0 z-50 flex justify-end p-4 pointer-events-none`}>
             <button 
              onClick={onClose} 
              className={`pointer-events-auto p-2 rounded-full transition-colors duration-300 shadow-lg ${isDarkMode ? 'bg-black/60 text-white hover:bg-red-500 backdrop-blur-md' : 'bg-white/80 text-gray-900 hover:bg-red-500 hover:text-white backdrop-blur-md'}`}
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="relative w-full bg-gray-900 -mt-16 shrink-0">
            <div className="h-64 md:h-80 w-full relative">
                <img 
                  src={certificate.imageUrl} 
                  alt={certificate.title} 
                  className="w-full h-full object-contain bg-gray-950" 
                  // [FIX] Link placeholder lengkap
                  onError={(e) => {e.target.src = 'https://placehold.co/600x400/1e293b/ffffff?text=No+Image'}}
                />
                <div className={`absolute inset-0 pointer-events-none bg-gradient-to-t ${isDarkMode ? 'from-[#0f1115] via-transparent to-transparent' : 'from-white via-transparent to-transparent'}`}></div>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-5 flex-1">
             <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-100 text-blue-600'}`}>
                    <Award size={12} /> 
                    {lang === 'id' ? 'Sertifikasi' : 'Certification'}
                  </span>
                  <span className={`flex items-center gap-1 text-[10px] font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Calendar size={12} /> {certificate.date}
                  </span>
                </div>
                
                <h2 className={`text-2xl font-bold mb-2 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {certificate.title}
                </h2>
                
                <div className={`flex items-center gap-2 text-sm font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                   <BadgeCheck size={16} fill="currentColor" className={isDarkMode ? 'text-blue-500/20' : 'text-blue-100'} />
                   {certificate.issuer}
                </div>
             </div>

             <div className={`h-px w-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-100'}`}></div>

             <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider mb-2 opacity-70 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {lang === 'id' ? 'Tentang Sertifikasi' : 'About Certification'}
                </h3>
                
                {/* [FIX] Menggunakan getLang */}
                <p className={`leading-relaxed text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {getLang(certificate.description) || (lang === 'id' ? 'Tidak ada deskripsi tersedia.' : 'No description available.')}
                </p>
             </div>

             <div className="pt-2 mt-auto">
                <a 
                  href={certificate.link || certificate.credentialLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white text-sm text-center transition-all hover:scale-[1.01] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <ExternalLink size={16} /> {t.view_cred}
                </a>
             </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};