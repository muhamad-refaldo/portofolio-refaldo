import { useState, useEffect, useCallback } from "react";
import { auth, db } from "../config/firebase";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import {
  LogOut,
  Layers,
  Award,
  Plus,
  Trash2,
  ExternalLink,
  X,
  Save,
  ArrowLeft,
  Loader2,
  Pencil,
  Cpu,
  Settings,
  Star,
  Briefcase,
  MessageSquare,
  Globe,
  User,
  Mail,
  Reply,
  BookOpen,
} from "lucide-react";

const DualInput = ({
  label,
  valueId,
  valueEn,
  onChangeId,
  onChangeEn,
  rows = 3,
  isDarkMode,
}) => (
  <div
    className={`md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl border border-dashed ${
      isDarkMode
        ? "bg-white/5 border-gray-700"
        : "bg-gray-50/50 border-gray-300"
    }`}
  >
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
        🇮🇩 {label} (ID)
      </label>
      <textarea
        className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none ${
          isDarkMode
            ? "bg-black/40 border-gray-600"
            : "bg-white border-gray-300"
        }`}
        rows={rows}
        value={valueId}
        onChange={onChangeId}
      />
    </div>
    <div className="space-y-1">
      <label className="text-xs font-bold text-gray-500 flex items-center gap-1">
        🇺🇸 {label} (EN)
      </label>
      <textarea
        className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none ${
          isDarkMode
            ? "bg-black/40 border-gray-600"
            : "bg-white border-gray-300"
        }`}
        rows={rows}
        value={valueEn}
        onChange={onChangeEn}
      />
    </div>
  </div>
);

export const AdminPage = ({ setPage, isDarkMode, user }) => {
  const [activeTab, setActiveTab] = useState("projects");
  const [isAdding, setIsAdding] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editId, setEditId] = useState(null);

  const [replyText, setReplyText] = useState("");
  const [replyingId, setReplyingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Technology",
    imageUrl: "",
    tech: "",
    link: "",
    issuer: "",
    date: "",
    isFeatured: false,
    skillName: "",
    skillIcon: "",
    skillColor: "text-gray-500",
    role: "",
    company: "",
    year: "",
    location: "",
    clientName: "",
    clientRole: "",
    clientColor: "blue",

    desc_id: "",
    desc_en: "",
    clientText_id: "",
    clientText_en: "",
    heroTextRaw_id: "",
    heroTextRaw_en: "",
    heroDesc_id: "",
    heroDesc_en: "",
    profileBio_id: "",
    profileBio_en: "",
    eduDesc_id: "",
    eduDesc_en: "",

    articleContent_id: "",
    articleContent_en: "",

    profilePhoto: "",
    cvLink: "",
    eduName: "",
    eduYear: "",
  });

  const resetForm = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      title: "",
      category: "Technology",
      imageUrl: "",
      tech: "",
      link: "",
      issuer: "",
      date: "",
      isFeatured: false,
      skillName: "",
      skillIcon: "",
      skillColor: "text-gray-500",
      role: "",
      company: "",
      year: "",
      location: "",
      clientName: "",
      clientRole: "",
      clientColor: "blue",
      desc_id: "",
      desc_en: "",
      clientText_id: "",
      clientText_en: "",
      articleContent_id: "",
      articleContent_en: "",
    }));
    setEditId(null);
    setReplyingId(null);
    setReplyText("");
  }, []);

  useEffect(() => {
    let unsubscribe = () => {};

    if (activeTab === "settings") {
      const unsubHero = onSnapshot(
        doc(db, "config", "hero_text"),
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData((prev) => ({
              ...prev,
              heroTextRaw_id: data.texts?.id
                ? data.texts.id.join("\n")
                : Array.isArray(data.texts)
                ? data.texts.join("\n")
                : "",
              heroTextRaw_en: data.texts?.en ? data.texts.en.join("\n") : "",
              heroDesc_id:
                typeof data.description === "object"
                  ? data.description.id
                  : data.description || "",
              heroDesc_en:
                typeof data.description === "object" ? data.description.en : "",
            }));
          }
        }
      );

      const unsubProfile = onSnapshot(
        doc(db, "config", "profile_data"),
        (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData((prev) => ({
              ...prev,
              profilePhoto: data.photoUrl || "",
              cvLink: data.cvLink || "",
              eduName: data.eduName || "",
              eduYear: data.eduYear || "",
              profileBio_id:
                typeof data.bio === "object" ? data.bio.id : data.bio || "",
              profileBio_en: typeof data.bio === "object" ? data.bio.en : "",
              eduDesc_id:
                typeof data.eduDesc === "object"
                  ? data.eduDesc.id
                  : data.eduDesc || "",
              eduDesc_en:
                typeof data.eduDesc === "object" ? data.eduDesc.en : "",
            }));
          }
          setItems([]);
          setLoading(false);
        }
      );
      unsubscribe = () => {
        unsubHero();
        unsubProfile();
      };
    } else {
      let collectionName = "projects_data";
      if (activeTab === "certificates") collectionName = "certificates_data";
      if (activeTab === "skills") collectionName = "skills";
      if (activeTab === "experience") collectionName = "experiences";
      if (activeTab === "testimonials") collectionName = "testimonials";
      if (activeTab === "guestbook") collectionName = "guestbook_messages";
      if (activeTab === "blog") collectionName = "articles_data";

      const q = query(
        collection(db, collectionName),
        orderBy("createdAt", "desc")
      );

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          setItems(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
          setLoading(false);
        },
        (error) => {
          console.error(error);
          setLoading(false);
        }
      );
    }

    return () => unsubscribe();
  }, [activeTab]);

  const handleTabChange = (tabName) => {
    if (tabName === activeTab) return;
    setLoading(true);
    setActiveTab(tabName);
    setIsAdding(false);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === "settings") {
        const textsId = formData.heroTextRaw_id
          .split("\n")
          .filter((t) => t.trim() !== "");
        const textsEn = formData.heroTextRaw_en
          .split("\n")
          .filter((t) => t.trim() !== "");

        await setDoc(
          doc(db, "config", "hero_text"),
          {
            texts: { id: textsId, en: textsEn.length > 0 ? textsEn : textsId },
            description: {
              id: formData.heroDesc_id,
              en: formData.heroDesc_en || formData.heroDesc_id,
            },
          },
          { merge: true }
        );

        await setDoc(
          doc(db, "config", "profile_data"),
          {
            photoUrl: formData.profilePhoto,
            cvLink: formData.cvLink,
            eduName: formData.eduName,
            eduYear: formData.eduYear,
            bio: {
              id: formData.profileBio_id,
              en: formData.profileBio_en || formData.profileBio_id,
            },
            eduDesc: {
              id: formData.eduDesc_id,
              en: formData.eduDesc_en || formData.eduDesc_id,
            },
          },
          { merge: true }
        );

        alert("Settings disimpan!");
        return;
      }

      let collectionName = "projects_data";
      let dataToSave = { createdAt: new Date() };

      if (activeTab === "skills") {
        collectionName = "skills";
        if (!formData.skillName) return alert("Nama Skill wajib!");
        dataToSave = {
          ...dataToSave,
          name: formData.skillName,
          icon: formData.skillIcon,
          color: formData.skillColor,
        };
      } else if (activeTab === "experience") {
        collectionName = "experiences";
        if (!formData.role || !formData.company) return alert("Wajib diisi!");
        dataToSave = {
          ...dataToSave,
          role: formData.role,
          company: formData.company,
          year: formData.year,
          location: formData.location,
          desc: {
            id: formData.desc_id,
            en: formData.desc_en || formData.desc_id,
          },
        };
      } else if (activeTab === "testimonials") {
        collectionName = "testimonials";
        if (!formData.clientName) return alert("Nama wajib!");
        dataToSave = {
          ...dataToSave,
          name: formData.clientName,
          role: formData.clientRole,
          color: formData.clientColor,
          text: {
            id: formData.clientText_id,
            en: formData.clientText_en || formData.clientText_id,
          },
        };
      } else if (activeTab === "blog") {
        collectionName = "articles_data";
        if (!formData.title) return alert("Judul artikel wajib!");
        dataToSave = {
          ...dataToSave,
          title: formData.title,
          imageUrl: formData.imageUrl,
          category: formData.category,
          content: {
            id: formData.articleContent_id,
            en: formData.articleContent_en || formData.articleContent_id,
          },
        };
      } else {
        if (activeTab === "certificates") collectionName = "certificates_data";
        if (!formData.title) return alert("Judul wajib!");

        dataToSave = {
          ...dataToSave,
          title: formData.title,
          imageUrl: formData.imageUrl,
          link: formData.link,
          description: {
            id: formData.desc_id,
            en: formData.desc_en || formData.desc_id,
          },
        };

        if (activeTab === "projects") {
          dataToSave.category = formData.category;
          dataToSave.tech = formData.tech
            ? formData.tech.split(",").map((t) => t.trim())
            : [];
          dataToSave.isFeatured = formData.isFeatured;
        } else {
          dataToSave.issuer = formData.issuer;
          dataToSave.date = formData.date;
          dataToSave.credentialLink = formData.link;
        }
      }

      if (editId) {
        delete dataToSave.createdAt;
        await updateDoc(doc(db, collectionName, editId), dataToSave);
        alert("Berhasil update!");
      } else {
        await addDoc(collection(db, collectionName), dataToSave);
        alert("Berhasil tambah!");
      }
      setIsAdding(false);
      resetForm();
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    }
  };

  const handleGuestbookReply = async (msgId) => {
    if (!replyText.trim()) return;
    try {
      await updateDoc(doc(db, "guestbook_messages", msgId), {
        reply: replyText,
        replyDate: new Date(),
      });
      alert("Balasan terkirim!");
      setReplyingId(null);
      setReplyText("");
    } catch (error) {
      console.error(error);
      alert("Gagal membalas.");
    }
  };

  const handleEdit = (item) => {
    setIsAdding(true);
    setEditId(item.id);

    const getLang = (field, type) =>
      typeof field === "object" ? field[type] : type === "id" ? field : "";

    if (activeTab === "skills") {
      setFormData((p) => ({
        ...p,
        skillName: item.name,
        skillIcon: item.icon,
        skillColor: item.color,
      }));
    } else if (activeTab === "experience") {
      setFormData((p) => ({
        ...p,
        role: item.role,
        company: item.company,
        year: item.year,
        location: item.location,
        desc_id: getLang(item.desc, "id"),
        desc_en: getLang(item.desc, "en"),
      }));
    } else if (activeTab === "testimonials") {
      setFormData((p) => ({
        ...p,
        clientName: item.name,
        clientRole: item.role,
        clientColor: item.color,
        clientText_id: getLang(item.text, "id"),
        clientText_en: getLang(item.text, "en"),
      }));
    } else if (activeTab === "blog") {
      setFormData((p) => ({
        ...p,
        title: item.title,
        imageUrl: item.imageUrl,
        category: item.category,
        articleContent_id: getLang(item.content, "id"),
        articleContent_en: getLang(item.content, "en"),
      }));
    } else {
      setFormData((p) => ({
        ...p,
        title: item.title || "",
        category: item.category || "Web Developer",
        imageUrl: item.imageUrl || "",
        tech: Array.isArray(item.tech) ? item.tech.join(", ") : item.tech || "",
        link: item.link || item.credentialLink || "",
        issuer: item.issuer || "",
        date: item.date || "",
        isFeatured: item.isFeatured || false,
        desc_id: getLang(item.description, "id"),
        desc_en: getLang(item.description, "en"),
      }));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Hapus data ini?`)) return;
    try {
      let collectionName = "projects_data";
      if (activeTab === "certificates") collectionName = "certificates_data";
      if (activeTab === "skills") collectionName = "skills";
      if (activeTab === "experience") collectionName = "experiences";
      if (activeTab === "testimonials") collectionName = "testimonials";
      if (activeTab === "guestbook") collectionName = "guestbook_messages";
      if (activeTab === "blog") collectionName = "articles_data";

      await deleteDoc(doc(db, collectionName, item.id));
      alert("Dihapus!");
    } catch (error) {
      console.error(error);
      alert("Gagal.");
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    setPage("login");
  };

  return (
    <div
      className={`min-h-screen pt-28 px-6 pb-12 relative z-50 ${
        isDarkMode ? "text-white" : "text-gray-900"
      }`}
    >
      <div className="max-w-6xl mx-auto relative z-50">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Admin Dashboard{" "}
              <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                ONLINE
              </span>
            </h1>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage("home")}
              className={`px-4 py-2 border rounded-xl text-sm font-medium flex items-center gap-2 hover:scale-105 cursor-pointer ${
                isDarkMode
                  ? "border-white/20 hover:bg-white/10"
                  : "border-gray-300 hover:bg-gray-100"
              }`}
            >
              <ArrowLeft size={16} /> Web
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 hover:scale-105 cursor-pointer flex items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "projects", icon: Layers, label: "Projects" },
            { id: "experience", icon: Briefcase, label: "Experience" },
            { id: "skills", icon: Cpu, label: "Skills" },
            { id: "certificates", icon: Award, label: "Certificates" },
            { id: "blog", icon: BookOpen, label: "Blog" },
            { id: "testimonials", icon: MessageSquare, label: "Testi" },
            { id: "guestbook", icon: Mail, label: "Inbox" },
            { id: "settings", icon: Settings, label: "Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`px-5 py-3 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* FORM */}
        {(isAdding || activeTab === "settings") &&
          activeTab !== "guestbook" && (
            <div
              className={`p-6 rounded-2xl border mb-8 animate-fade-up ${
                isDarkMode
                  ? "bg-gray-900 border-gray-700"
                  : "bg-white border-gray-200 shadow-xl"
              }`}
            >
              <div className="flex justify-between mb-4 border-b pb-4 border-gray-700">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  {activeTab === "settings" ? (
                    <Globe className="text-blue-500" />
                  ) : editId ? (
                    <Pencil className="text-yellow-500" />
                  ) : (
                    <Plus className="text-green-500" />
                  )}
                  {activeTab === "settings"
                    ? "Settings (Dual Language)"
                    : editId
                    ? "Edit Data"
                    : `Tambah ${activeTab} Baru`}
                </h3>
                {activeTab !== "settings" && (
                  <button
                    onClick={() => {
                      setIsAdding(false);
                      resetForm();
                    }}
                    className="p-2 hover:bg-red-500/20 rounded-full text-red-500 transition-colors cursor-pointer"
                  >
                    <X size={24} />
                  </button>
                )}
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-5"
              >
                {/* [BARU] FORM BLOG */}
                {activeTab === "blog" && (
                  <>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Link Gambar Sampul
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Judul Artikel
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Kategori
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-white border-gray-300"
                        }`}
                        placeholder="Tech / Business"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                      />
                    </div>
                    <DualInput
                      label="Isi Artikel (Bisa HTML <br/> <b>bold</b> dll)"
                      rows={10}
                      valueId={formData.articleContent_id}
                      onChangeId={(e) =>
                        setFormData({
                          ...formData,
                          articleContent_id: e.target.value,
                        })
                      }
                      valueEn={formData.articleContent_en}
                      onChangeEn={(e) =>
                        setFormData({
                          ...formData,
                          articleContent_en: e.target.value,
                        })
                      }
                      isDarkMode={isDarkMode}
                    />
                  </>
                )}

                {/* SETTINGS */}
                {activeTab === "settings" && (
                  <>
                    <div className="md:col-span-2">
                      <h4 className="text-blue-500 font-bold mb-2 border-b border-gray-700 pb-2">
                        A. Hero Section
                      </h4>
                    </div>
                    <DualInput
                      label="Animasi Teks (Per baris)"
                      rows={3}
                      valueId={formData.heroTextRaw_id}
                      onChangeId={(e) =>
                        setFormData({
                          ...formData,
                          heroTextRaw_id: e.target.value,
                        })
                      }
                      valueEn={formData.heroTextRaw_en}
                      onChangeEn={(e) =>
                        setFormData({
                          ...formData,
                          heroTextRaw_en: e.target.value,
                        })
                      }
                      isDarkMode={isDarkMode}
                    />
                    <DualInput
                      label="Deskripsi Hero"
                      rows={3}
                      valueId={formData.heroDesc_id}
                      onChangeId={(e) =>
                        setFormData({
                          ...formData,
                          heroDesc_id: e.target.value,
                        })
                      }
                      valueEn={formData.heroDesc_en}
                      onChangeEn={(e) =>
                        setFormData({
                          ...formData,
                          heroDesc_en: e.target.value,
                        })
                      }
                      isDarkMode={isDarkMode}
                    />

                    <div className="md:col-span-2 mt-4">
                      <h4 className="text-blue-500 font-bold mb-2 border-b border-gray-700 pb-2 flex items-center gap-2">
                        <User size={16} /> B. Profile & About
                      </h4>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        URL Foto Profil
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        value={formData.profilePhoto}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            profilePhoto: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Link CV (G-Drive)
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        value={formData.cvLink}
                        onChange={(e) =>
                          setFormData({ ...formData, cvLink: e.target.value })
                        }
                      />
                    </div>
                    <DualInput
                      label="Bio / Tentang Saya"
                      rows={5}
                      valueId={formData.profileBio_id}
                      onChangeId={(e) =>
                        setFormData({
                          ...formData,
                          profileBio_id: e.target.value,
                        })
                      }
                      valueEn={formData.profileBio_en}
                      onChangeEn={(e) =>
                        setFormData({
                          ...formData,
                          profileBio_en: e.target.value,
                        })
                      }
                      isDarkMode={isDarkMode}
                    />

                    <div className="md:col-span-2 mt-4">
                      <h4 className="text-blue-500 font-bold mb-2 border-b border-gray-700 pb-2 flex items-center gap-2">
                        <Award size={16} /> C. Pendidikan Utama
                      </h4>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Nama Sekolah
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        value={formData.eduName}
                        onChange={(e) =>
                          setFormData({ ...formData, eduName: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Tahun
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        value={formData.eduYear}
                        onChange={(e) =>
                          setFormData({ ...formData, eduYear: e.target.value })
                        }
                      />
                    </div>
                    <DualInput
                      label="Deskripsi Jurusan"
                      rows={2}
                      valueId={formData.eduDesc_id}
                      onChangeId={(e) =>
                        setFormData({ ...formData, eduDesc_id: e.target.value })
                      }
                      valueEn={formData.eduDesc_en}
                      onChangeEn={(e) =>
                        setFormData({ ...formData, eduDesc_en: e.target.value })
                      }
                      isDarkMode={isDarkMode}
                    />
                  </>
                )}

                {/* EXPERIENCE */}
                {activeTab === "experience" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Posisi
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Perusahaan
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Tahun
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        value={formData.year}
                        onChange={(e) =>
                          setFormData({ ...formData, year: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Lokasi
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                      />
                    </div>
                    <DualInput
                      label="Deskripsi Pekerjaan"
                      rows={3}
                      valueId={formData.desc_id}
                      onChangeId={(e) =>
                        setFormData({ ...formData, desc_id: e.target.value })
                      }
                      valueEn={formData.desc_en}
                      onChangeEn={(e) =>
                        setFormData({ ...formData, desc_en: e.target.value })
                      }
                      isDarkMode={isDarkMode}
                    />
                  </>
                )}

                {/* TESTIMONIALS */}
                {activeTab === "testimonials" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Klien
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        value={formData.clientName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Role
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        value={formData.clientRole}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientRole: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Warna
                      </label>
                      <select
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        value={formData.clientColor}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            clientColor: e.target.value,
                          })
                        }
                      >
                        <option value="blue">Blue</option>
                        <option value="purple">Purple</option>
                        <option value="green">Green</option>
                      </select>
                    </div>
                    <DualInput
                      label="Isi Testimoni"
                      rows={3}
                      valueId={formData.clientText_id}
                      onChangeId={(e) =>
                        setFormData({
                          ...formData,
                          clientText_id: e.target.value,
                        })
                      }
                      valueEn={formData.clientText_en}
                      onChangeEn={(e) =>
                        setFormData({
                          ...formData,
                          clientText_en: e.target.value,
                        })
                      }
                      isDarkMode={isDarkMode}
                    />
                  </>
                )}

                {/* SKILLS */}
                {activeTab === "skills" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Skill
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        value={formData.skillName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            skillName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Warna Text
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        value={formData.skillColor}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            skillColor: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        URL Icon
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        value={formData.skillIcon}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            skillIcon: e.target.value,
                          })
                        }
                      />
                    </div>
                  </>
                )}

                {/* PROJECTS & CERTS */}
                {(activeTab === "projects" || activeTab === "certificates") && (
                  <>
                    {activeTab === "projects" && (
                      <div
                        className={`md:col-span-2 p-3 rounded-xl border flex items-center gap-3 cursor-pointer ${
                          formData.isFeatured
                            ? "bg-blue-500/20 border-blue-500"
                            : isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            isFeatured: !formData.isFeatured,
                          })
                        }
                      >
                        <Star
                          size={20}
                          fill={formData.isFeatured ? "currentColor" : "none"}
                          className={
                            formData.isFeatured
                              ? "text-blue-500"
                              : "text-gray-500"
                          }
                        />
                        <span className="text-sm font-bold">
                          Featured (Home)
                        </span>
                      </div>
                    )}
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Gambar
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        value={formData.imageUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Judul
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                    </div>

                    {activeTab === "projects" ? (
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">
                          Kategori
                        </label>
                        <select
                          className={`w-full p-3 rounded-xl border ${
                            isDarkMode
                              ? "bg-black/40 border-gray-600"
                              : "bg-gray-50 border-gray-300"
                          }`}
                          value={formData.category}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              category: e.target.value,
                            })
                          }
                        >
                          <option>Web Developer</option>
                          <option>Apps Developer</option>
                          <option>Data Analyst</option>
                        </select>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-500">
                          Penerbit
                        </label>
                        <input
                          className={`w-full p-3 rounded-xl border ${
                            isDarkMode
                              ? "bg-black/40 border-gray-600"
                              : "bg-gray-50 border-gray-300"
                          }`}
                          value={formData.issuer}
                          onChange={(e) =>
                            setFormData({ ...formData, issuer: e.target.value })
                          }
                        />
                      </div>
                    )}
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        {activeTab === "projects" ? "Teknologi" : "Tanggal"}
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        value={
                          activeTab === "projects"
                            ? formData.tech
                            : formData.date
                        }
                        onChange={(e) =>
                          activeTab === "projects"
                            ? setFormData({ ...formData, tech: e.target.value })
                            : setFormData({ ...formData, date: e.target.value })
                        }
                      />
                    </div>
                    <DualInput
                      label="Deskripsi"
                      rows={3}
                      valueId={formData.desc_id}
                      onChangeId={(e) =>
                        setFormData({ ...formData, desc_id: e.target.value })
                      }
                      valueEn={formData.desc_en}
                      onChangeEn={(e) =>
                        setFormData({ ...formData, desc_en: e.target.value })
                      }
                      isDarkMode={isDarkMode}
                    />
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-gray-500">
                        Link URL
                      </label>
                      <input
                        className={`w-full p-3 rounded-xl border ${
                          isDarkMode
                            ? "bg-black/40 border-gray-600"
                            : "bg-gray-50 border-gray-300"
                        }`}
                        value={formData.link}
                        onChange={(e) =>
                          setFormData({ ...formData, link: e.target.value })
                        }
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="md:col-span-2 py-4 bg-green-600 text-white font-bold rounded-xl flex justify-center gap-2 hover:bg-green-500 cursor-pointer shadow-lg"
                >
                  <Save size={20} /> Simpan Data
                </button>
              </form>
            </div>
          )}

        {/* LIST RENDERER */}
        {!isAdding && activeTab !== "settings" && activeTab !== "guestbook" && (
          <button
            onClick={() => {
              setIsAdding(true);
              resetForm();
            }}
            className={`w-full py-5 border-2 border-dashed rounded-3xl text-gray-500 mb-8 flex justify-center items-center gap-2 font-bold cursor-pointer ${
              isDarkMode
                ? "border-gray-700 hover:border-blue-500 hover:bg-blue-500/10"
                : "border-gray-300 hover:border-blue-500 hover:bg-blue-50"
            }`}
          >
            <Plus size={24} /> Tambah Baru
          </button>
        )}

        {activeTab !== "settings" && (
          <div
            className={`grid gap-4 ${
              activeTab === "skills"
                ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-6"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {loading ? (
              <div className="col-span-full flex justify-center py-20">
                <Loader2 size={40} className="animate-spin text-blue-500" />
              </div>
            ) : items.length === 0 ? (
              <div className="col-span-full text-center py-20 opacity-50">
                <p>Belum ada data.</p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border relative group hover:-translate-y-1 transition-all ${
                    isDarkMode
                      ? "bg-gray-800/50 border-white/10"
                      : "bg-white border-gray-200 shadow-sm"
                  }`}
                >
                  {/* BLOG LIST */}
                  {activeTab === "blog" && (
                    <div>
                      <img
                        src={item.imageUrl}
                        className="h-32 w-full object-cover rounded-lg mb-2 bg-gray-700"
                      />
                      <h4 className="font-bold">{item.title}</h4>
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                    </div>
                  )}

                  {/* GUESTBOOK CARD */}
                  {activeTab === "guestbook" && (
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-bold">{item.name}</span>
                        <span className="text-xs text-gray-500">
                          {item.createdAt
                            ? new Date(
                                item.createdAt.seconds * 1000
                              ).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>
                      <p className="text-sm mb-3 italic">
                        &quot;{item.text}&quot;
                      </p>
                      {item.reply && (
                        <div className="mt-2 p-2 bg-blue-500/10 border border-blue-500/20 rounded text-xs text-blue-400">
                          <b>Admin:</b> {item.reply}
                        </div>
                      )}

                      {replyingId === item.id ? (
                        <div className="mt-3 flex gap-2">
                          <input
                            className={`flex-1 p-2 rounded text-sm ${
                              isDarkMode ? "bg-black/20" : "bg-gray-100"
                            }`}
                            placeholder="Balasan..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                          />
                          <button
                            onClick={() => handleGuestbookReply(item.id)}
                            className="p-2 bg-blue-600 rounded text-white"
                          >
                            <Reply size={14} />
                          </button>
                          <button
                            onClick={() => setReplyingId(null)}
                            className="p-2 bg-gray-700 rounded text-white"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2 mt-3 border-t border-gray-700/20 pt-2">
                          <button
                            onClick={() => setReplyingId(item.id)}
                            className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300"
                          >
                            <Reply size={14} /> Balas
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="text-xs flex items-center gap-1 text-red-400 hover:text-red-300"
                          >
                            <Trash2 size={14} /> Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* OTHERS */}
                  {activeTab !== "blog" && activeTab !== "guestbook" && (
                    <>
                      {activeTab === "skills" && (
                        <div className="text-center">
                          <img
                            src={item.icon}
                            className="w-8 h-8 mx-auto mb-2"
                          />
                          <p className="font-bold text-sm">{item.name}</p>
                        </div>
                      )}
                      {activeTab === "experience" && (
                        <div>
                          <h4 className="font-bold">{item.role}</h4>
                          <p className="text-xs text-blue-500">
                            {item.company}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {item.year}
                          </p>
                        </div>
                      )}
                      {activeTab === "testimonials" && (
                        <div>
                          <h4 className="font-bold">{item.name}</h4>
                          <p className="text-xs text-gray-500">{item.role}</p>
                          <p className="text-xs italic mt-2 line-clamp-2">
                            &quot;
                            {typeof item.text === "object"
                              ? item.text.id
                              : item.text}
                            &quot;
                          </p>
                        </div>
                      )}
                      {(activeTab === "projects" ||
                        activeTab === "certificates") && (
                        <div>
                          {item.isFeatured && (
                            <Star
                              size={12}
                              className="absolute top-2 left-2 text-yellow-500 fill-current"
                            />
                          )}
                          <img
                            src={item.imageUrl}
                            className="h-32 w-full object-cover rounded-lg mb-2 bg-gray-700"
                          />
                          <h4 className="font-bold line-clamp-1">
                            {item.title}
                          </h4>
                        </div>
                      )}

                      <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-700/20 items-center">
                        {(activeTab === "projects" ||
                          activeTab === "certificates") &&
                          item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mr-auto text-blue-500 hover:text-blue-400"
                            >
                              <ExternalLink size={16} />
                            </a>
                          )}
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 bg-yellow-500/10 text-yellow-500 rounded hover:bg-yellow-500 hover:text-white"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 bg-red-500/10 text-red-500 rounded hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
