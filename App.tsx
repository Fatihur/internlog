import React, { useState, useEffect } from 'react';
import { generateInternReport } from './services/geminiService';
import { GenerationState, ReportSection } from './types';
import { Button } from './components/Button';
import { ResultCard } from './components/ResultCard';
import { WelcomeModal } from './components/WelcomeModal';
import { Sparkles, PenTool, LayoutTemplate, Briefcase } from 'lucide-react';

const App: React.FC = () => {
  const [keywords, setKeywords] = useState('');
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    data: null,
  });
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome modal
    const hasSeenModal = localStorage.getItem('internlog_has_seen_welcome');
    if (!hasSeenModal) {
      setShowWelcomeModal(true);
    }
  }, []);

  const handleCloseModal = () => {
    setShowWelcomeModal(false);
    localStorage.setItem('internlog_has_seen_welcome', 'true');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywords.trim()) return;

    setState({ isLoading: true, error: null, data: null });

    try {
      const result = await generateInternReport(keywords);
      setState({ isLoading: false, error: null, data: result });
    } catch (err: any) {
      setState({ 
        isLoading: false, 
        error: err.message || "Terjadi kesalahan. Silakan coba lagi.", 
        data: null 
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <WelcomeModal isOpen={showWelcomeModal} onClose={handleCloseModal} />

      {/* Header / Hero Section */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary-600">
            <div className="bg-primary-50 p-2 rounded-lg">
               <Briefcase size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">InternLog AI</h1>
          </div>
          <div className="text-xs font-medium px-3 py-1 bg-slate-100 rounded-full text-slate-600 hidden sm:block">
            Asisten Laporan Harian
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-12">
        
        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-6 md:p-8 border border-white mb-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400"></div>
          
          <div className="relative z-10 mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Buat Laporan Baru</h2>
            <p className="text-slate-500">Masukkan aktivitas utama Anda hari ini.</p>
          </div>

          <form onSubmit={handleGenerate} className="relative z-10">
            <div className="relative">
              <div className="absolute top-3 left-3 text-slate-400">
                <PenTool size={20} />
              </div>
              <input
                id="keywords"
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder='Contoh: Belajar BKD "Bimbingan Klien Dewasa"'
                className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-slate-900 placeholder:text-slate-400 shadow-inner"
              />
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                type="submit" 
                isLoading={state.isLoading} 
                disabled={!keywords.trim()}
                className="w-full sm:w-auto"
              >
                {!state.isLoading && <Sparkles className="w-4 h-4 mr-2" />}
                {state.isLoading ? 'Sedang Menyusun...' : 'Buat Laporan'}
              </Button>
            </div>
          </form>

          {/* Decorative background elements */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        </div>

        {/* Error State */}
        {state.error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm font-medium">{state.error}</p>
          </div>
        )}

        {/* Results Section */}
        {state.data && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-2 mb-2 text-slate-500 text-sm font-medium uppercase tracking-wider px-1">
              <LayoutTemplate size={14} />
              Hasil Laporan
            </div>
            
            <ResultCard 
              title="Uraian Aktivitas" 
              content={state.data.activity} 
              type={ReportSection.ACTIVITY} 
              delayIndex={0}
            />
            
            <ResultCard 
              title="Ilmu / Pembelajaran" 
              content={state.data.learning} 
              type={ReportSection.LEARNING} 
              delayIndex={1}
            />
            
            <ResultCard 
              title="Kendala / Hambatan" 
              content={state.data.challenges} 
              type={ReportSection.CHALLENGES} 
              delayIndex={2}
            />

            <div className="mt-8 text-center text-slate-400 text-xs">
              <p>Konten dihasilkan oleh AI (Gemini). Selalu periksa kembali sebelum menyalin ke laporan resmi Anda.</p>
            </div>
          </div>
        )}

        {/* Empty State / Placeholder */}
        {!state.data && !state.isLoading && !state.error && (
          <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-4">
              <LayoutTemplate size={24} />
            </div>
            <h3 className="text-slate-900 font-medium mb-1">Belum ada laporan</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Masukkan kata kunci aktivitas Anda di atas untuk mulai membuat konten laporan.
            </p>
          </div>
        )}

      </main>
      
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} InternLog AI. Dibuat oleh Fatih.
        </div>
      </footer>
    </div>
  );
};

export default App;