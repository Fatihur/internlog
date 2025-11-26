import React from 'react';
import { X, User, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="absolute top-0 right-0 p-4">
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mb-6 text-primary-600 border border-primary-100 shadow-sm">
            <Sparkles size={32} />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            InternLog AI
          </h2>
          
          <p className="text-slate-600 mb-6 leading-relaxed">
            Aplikasi asisten cerdas yang membantu Anda menyusun laporan magang harian. 
            Cukup masukkan kata kunci aktivitas, dan dapatkan uraian aktivitas, pembelajaran, serta kendala secara otomatis.
          </p>

          <div className="bg-slate-50 rounded-xl p-3 w-full mb-6 flex items-center justify-center gap-2 border border-slate-100 text-slate-600">
            <User size={16} />
            <span className="font-medium">Created by Fatih</span>
          </div>

          <Button onClick={onClose} className="w-full">
            Mulai Gunakan
          </Button>
        </div>
      </div>
    </div>
  );
};