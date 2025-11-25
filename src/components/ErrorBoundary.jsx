/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { TriangleAlert, Redo } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error di komponen anak:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-card flex flex-col items-center justify-center p-10 rounded-3xl border border-red-500/30 my-10 min-h-[400px]">
          <TriangleAlert
            size={48}
            className="text-red-500 mb-4 animate-pulse"
          />
          <h2 className="text-xl font-bold text-red-500 mb-2">
            Oops! Terjadi Gangguan Teknis.
          </h2>
          <p className="text-center text-sm text-gray-500 max-w-sm mb-6">
            Komponen ini gagal dimuat karena masalah internal (kemungkinan
            koneksi, data hilang, atau error rendering).
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl flex items-center gap-2 hover:bg-blue-500 transition-colors"
          >
            <Redo size={16} /> Coba Muat Ulang Halaman
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
