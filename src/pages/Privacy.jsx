import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Shield, ArrowLeft } from 'lucide-react';

export const PrivacyPage = ({ setPage, isDarkMode, lang }) => {
  const content = {
    id: {
      title: "Kebijakan Privasi",
      lastUpdated: "Terakhir Diperbarui: 24 November 2025",
      intro: "Di Refaldo Portofolio, privasi pengunjung adalah prioritas utama. Dokumen Kebijakan Privasi ini berisi jenis informasi yang dikumpulkan dan dicatat oleh website ini dan bagaimana kami menggunakannya.",
      sections: [
        {
          h: "1. Informasi yang Kami Kumpulkan",
          p: "Kami mengumpulkan informasi yang Anda berikan secara sukarela melalui formulir kontak, buku tamu, atau saat berlangganan newsletter. Ini mungkin termasuk nama, alamat email, dan pesan Anda."
        },
        {
          h: "2. Penggunaan Informasi",
          p: "Informasi yang kami kumpulkan digunakan untuk membalas pertanyaan Anda, meningkatkan pengalaman pengguna di website, dan mengirimkan pembaruan terkait layanan (jika Anda berlangganan)."
        },
        {
          h: "3. Cookies dan Web Beacons",
          p: "Seperti website lainnya, kami menggunakan 'cookies'. Cookies ini digunakan untuk menyimpan informasi termasuk preferensi pengunjung dan halaman di website yang diakses pengunjung."
        },
        {
          h: "4. Keamanan Data",
          p: "Kami menerapkan langkah-langkah keamanan yang sesuai untuk melindungi dari akses, pengubahan, pengungkapan, atau penghancuran data pribadi Anda yang tidak sah."
        }
      ]
    },
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last Updated: November 24, 2025",
      intro: "At Refaldo Portfolio, the privacy of our visitors is a top priority. This Privacy Policy document contains types of information that is collected and recorded by this website and how we use it.",
      sections: [
        {
          h: "1. Information We Collect",
          p: "We collect information that you strictly provide voluntarily via contact forms, guestbooks, or newsletter subscriptions. This may include your name, email address, and messages."
        },
        {
          h: "2. How We Use Your Information",
          p: "The information we collect is used to respond to your inquiries, improve user experience, and send service-related updates (if subscribed)."
        },
        {
          h: "3. Cookies and Web Beacons",
          p: "Like any other website, we use 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited."
        },
        {
          h: "4. Data Security",
          p: "We implement appropriate security measures to protect against unauthorized access, alteration, disclosure, or destruction of your personal data."
        }
      ]
    }
  };

  const txt = content[lang];

  return (
    <div className="max-w-3xl mx-auto min-h-screen pb-20 pt-10 px-4">
      <Helmet>
        <title>{txt.title} | Refaldo Portofolio</title>
      </Helmet>

      <button 
        onClick={() => setPage('home')} 
        className={`flex items-center gap-2 mb-8 text-sm font-bold px-4 py-2 rounded-xl transition-all ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-black hover:bg-gray-100'}`}
      >
        <ArrowLeft size={18} /> {lang === 'id' ? 'Kembali' : 'Back'}
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-8 md:p-12 rounded-3xl border ${isDarkMode ? 'bg-[#0a0a0f] border-white/10' : 'bg-white border-gray-200 shadow-xl'}`}
      >
         <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <Shield size={32} />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{txt.title}</h1>
              <p className="text-xs text-gray-500 mt-1">{txt.lastUpdated}</p>
            </div>
         </div>

         <div className={`space-y-8 leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>{txt.intro}</p>
            
            {txt.sections.map((section, i) => (
              <div key={i}>
                <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{section.h}</h3>
                <p>{section.p}</p>
              </div>
            ))}

            <div className="pt-8 border-t border-dashed border-gray-500/30">
               <p className="text-sm">
                 {lang === 'id' ? 'Jika Anda memiliki pertanyaan tambahan, jangan ragu untuk menghubungi kami melalui email.' : 'If you have additional questions, do not hesitate to contact us via email.'}
               </p>
            </div>
         </div>
      </motion.div>
    </div>
  );
};