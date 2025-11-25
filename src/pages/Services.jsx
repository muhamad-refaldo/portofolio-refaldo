import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Check, Zap, Layout, Database, MessageCircle } from 'lucide-react';
import { socialMedia } from '../data/content';

export const ServicesPage = ({ isDarkMode, lang }) => {
  const services = [
    {
      title: lang === 'id' ? 'Landing Page Kilat' : 'Express Landing Page',
      price: lang === 'id' ? 'Mulai Rp 1.5jt' : 'Start from $100',
      desc: lang === 'id' ? 'Cocok untuk UMKM, promosi produk, atau profil bisnis yang butuh online cepat.' : 'Perfect for SMBs, product promo, or business profiles needing quick launch.',
      icon: Layout,
      color: 'blue',
      features: lang === 'id' ? [
        'Desain Modern & Responsif',
        'Single Page (Scroll)',
        'Gratis Hosting 1 Tahun',
        'SEO Dasar (Google Friendly)',
        'Revisi 2x'
      ] : [
        'Modern & Responsive Design',
        'Single Page (Scroll)',
        'Free Hosting 1 Year',
        'Basic SEO',
        '2x Revisions'
      ]
    },
    {
      title: lang === 'id' ? 'Aplikasi Web Bisnis' : 'Business Web App',
      price: lang === 'id' ? 'Mulai Rp 5jt' : 'Start from $350',
      desc: lang === 'id' ? 'Sistem kompleks seperti Kasir (POS), Inventory, atau Dashboard Admin.' : 'Complex systems like POS, Inventory, or Admin Dashboards.',
      icon: Database,
      color: 'purple',
      recommended: true, 
      features: lang === 'id' ? [
        'Fullstack (React + Firebase/Laravel)',
        'Login & Database System',
        'Admin Dashboard Panel',
        'Export Laporan (PDF/Excel)',
        'Maintenance 3 Bulan',
        'Gratis Domain .com'
      ] : [
        'Fullstack (React + Firebase/Laravel)',
        'Login & Database System',
        'Admin Dashboard Panel',
        'Export Reports (PDF/Excel)',
        '3 Months Maintenance',
        'Free .com Domain'
      ]
    },
    {
      title: lang === 'id' ? 'Custom & Konsultasi' : 'Custom & Consult',
      price: lang === 'id' ? 'Diskusi Dulu' : 'Let\'s Talk',
      desc: lang === 'id' ? 'Punya ide unik? Mari diskusikan kebutuhan teknologi untuk bisnis Anda.' : 'Have a unique idea? Let\'s discuss tech needs for your business.',
      icon: Zap,
      color: 'green',
      features: lang === 'id' ? [
        'Analisa Kebutuhan Bisnis',
        'Perancangan Sistem',
        'UI/UX Design',
        'Integrasi API Pihak Ketiga',
        'Skalabilitas Tinggi'
      ] : [
        'Business Needs Analysis',
        'System Architecture',
        'UI/UX Design',
        '3rd Party API Integration',
        'High Scalability'
      ]
    }
  ];

  const handleOrder = (serviceTitle) => {
    const text = lang === 'id' 
      ? `Halo Refaldo, saya tertarik dengan layanan *${serviceTitle}*. Bisa diskusi lebih lanjut?`
      : `Hi Refaldo, I am interested in your *${serviceTitle}* service. Can we discuss?`;
    window.open(`https://wa.me/${socialMedia.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto min-h-screen pb-20 space-y-12 animate-fade-up">
      <Helmet>
        <title>{lang === 'id' ? 'Layanan' : 'Services'} | Refaldo Portofolio</title>
        <meta name="description" content="Jasa pembuatan website dan aplikasi bisnis." />
      </Helmet>

      <div className="text-center space-y-4">
         <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase border ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
           <Zap size={14} /> {lang === 'id' ? 'Layanan' : 'Services'}
         </div>
         <h2 className={`text-4xl md:text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
           {lang === 'id' ? 'Solusi Digital Bisnis' : 'Digital Business Solutions'}
         </h2>
         <p className={`max-w-xl mx-auto text-lg ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
           {lang === 'id' 
             ? 'Pilih paket yang sesuai dengan kebutuhan bisnis Anda. Transparan, cepat, dan profesional.' 
             : 'Choose a package that fits your business needs. Transparent, fast, and professional.'}
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
        {services.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className={`relative p-8 rounded-[2rem] border flex flex-col transition-all duration-300 group ${
              isDarkMode 
                ? 'bg-white/5 border-white/5 hover:border-blue-500/50' 
                : 'bg-white border-gray-200 hover:border-blue-400 hover:shadow-xl'
            } ${item.recommended ? (isDarkMode ? 'border-blue-500/50 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]' : 'border-blue-500 ring-4 ring-blue-500/10') : ''}`}
          >
            {item.recommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                Recommended
              </div>
            )}

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-${item.color}-500 ${isDarkMode ? `bg-${item.color}-500/10` : `bg-${item.color}-50`}`}>
               <item.icon size={28} />
            </div>

            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
            <p className={`text-sm mb-6 min-h-[40px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
            
            <div className="mb-8">
               <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.price}</span>
            </div>

            <div className={`space-y-3 mb-8 flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
               {item.features.map((feat, idx) => (
                 <div key={idx} className="flex items-start gap-3 text-sm">
                    <Check size={16} className={`mt-0.5 shrink-0 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <span>{feat}</span>
                 </div>
               ))}
            </div>

            <button 
              onClick={() => handleOrder(item.title)}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                item.recommended 
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/25' 
                  : (isDarkMode ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900')
              }`}
            >
              <MessageCircle size={18} /> {lang === 'id' ? 'Pesan Sekarang' : 'Order Now'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};