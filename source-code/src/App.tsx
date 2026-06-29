import React, { useState, useEffect, useMemo } from 'react';
import { 
  BookOpen, Sparkles, CheckCircle, XCircle, AlertCircle, 
  ArrowRight, ChevronRight, ChevronLeft, Volume2, RotateCcw, 
  HelpCircle, Search, Trophy, Keyboard, Home, Flame, BookCheck, Info, CornerDownLeft
} from 'lucide-react';

// Import datasets
import { HSK1, HSK1_ALL, Word, Lesson, DictWord } from './data/hsk1';
import { HSK2, HSK2_ALL } from './data/hsk2';
import { HSK3, HSK3_ALL } from './data/hsk3';
import { 
  HSK4_ALL, HSK5_ALL, HSK6_ALL, HSK79_ALL, 
  GRAMMAR_HSK4, GRAMMAR_HSK5, GRAMMAR_HSK6, GRAMMAR_HSK79G,
  AdvWord, AdvGrammar 
} from './data/hskAdvanced';

import { WordStrokes } from './components/WordStrokes';

// Type definitions for internal state mapping
type ActiveTab = 'home' | 'hsk1' | 'hsk2' | 'hsk3' | 'hsk4' | 'hsk5' | 'hsk6' | 'hsk79';
type SubTab = 'words' | 'cards' | 'quiz' | 'type';

// Normalize AdvWord to matching Word format for reusable modules
function normalizeAdvWord(adv: AdvWord): Word {
  return {
    hanzi: adv.h,
    pinyin: adv.p,
    vi: `${adv.hv ? `[${adv.hv}] ` : ''}${adv.vi}`,
    en: adv.ex, // Use examples as subtext / detail
    pos: adv.ps
  };
}

export default function App() {
  // Navigation & Level Selection State
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number | null>(null);
  const [subTab, setSubTab] = useState<SubTab>('words');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active Word Selection (for stroke display)
  const [activeWordForStrokes, setActiveWordForStrokes] = useState<string>('');

  // 1. FLASHCARD STATES
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // 2. QUIZ STATES
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizOptions, setQuizOptions] = useState<string[]>([]);

  // 3. TYPING STATES
  const [typeIndex, setTypeIndex] = useState(0);
  const [typeInput, setTypeInput] = useState('');
  const [typeStatus, setTypeStatus] = useState<'pending' | 'correct' | 'incorrect'>('pending');
  const [typeStreak, setTypeStreak] = useState(0);
  const [typeCorrectCount, setTypeCorrectCount] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Load levels vocabularies dynamically based on tab selection
  const levelData = useMemo(() => {
    switch (activeTab) {
      case 'hsk1':
        return { lessons: HSK1, dictionary: HSK1_ALL, title: "HSK 1", grammar: [] };
      case 'hsk2':
        return { lessons: HSK2, dictionary: HSK2_ALL, title: "HSK 2", grammar: [] };
      case 'hsk3':
        return { lessons: HSK3, dictionary: HSK3_ALL, title: "HSK 3", grammar: [] };
      case 'hsk4':
        return { lessons: [] as Lesson[], dictionary: [] as DictWord[], title: "HSK 4", wordsAll: HSK4_ALL, grammar: GRAMMAR_HSK4 };
      case 'hsk5':
        return { lessons: [] as Lesson[], dictionary: [] as DictWord[], title: "HSK 5", wordsAll: HSK5_ALL, grammar: GRAMMAR_HSK5 };
      case 'hsk6':
        return { lessons: [] as Lesson[], dictionary: [] as DictWord[], title: "HSK 6", wordsAll: HSK6_ALL, grammar: GRAMMAR_HSK6 };
      case 'hsk79':
        return { lessons: [] as Lesson[], dictionary: [] as DictWord[], title: "HSK 7-9", wordsAll: HSK79_ALL, grammar: GRAMMAR_HSK79G };
      default:
        return { lessons: [], dictionary: [], title: "Home", grammar: [] };
    }
  }, [activeTab]);

  // Compute sliced sections of 20 words for HSK 4, 5, 6, 7-9
  const levelSections = useMemo(() => {
    if (activeTab === 'home' || activeTab === 'hsk1' || activeTab === 'hsk2' || activeTab === 'hsk3') {
      return [];
    }
    const allWords = (levelData as any).wordsAll || [];
    const sections: Word[][] = [];
    for (let i = 0; i < allWords.length; i += 20) {
      const slice = allWords.slice(i, i + 20).map((w: AdvWord) => normalizeAdvWord(w));
      sections.push(slice);
    }
    return sections;
  }, [activeTab, levelData]);

  // Active list of words we are currently practicing in subTab (Flashcards, Quiz, Typing)
  const currentWordsList = useMemo<Word[]>(() => {
    if (selectedLesson) {
      return selectedLesson.words;
    }
    if (selectedSectionIndex !== null && levelSections[selectedSectionIndex]) {
      return levelSections[selectedSectionIndex];
    }
    return [];
  }, [selectedLesson, selectedSectionIndex, levelSections]);

  // Handle active strokes word auto-select
  useEffect(() => {
    if (currentWordsList.length > 0) {
      setActiveWordForStrokes(currentWordsList[0].hanzi);
    } else {
      setActiveWordForStrokes('');
    }
  }, [currentWordsList]);

  // Chinese speech synthesis helper
  const speakChinese = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel previous speaking to prevent overlapping
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.85; // slightly slower for optimal comprehension
      window.speechSynthesis.speak(utterance);
    }
  };

  // GENERATE MULTIPLE-CHOICE QUIZ OPTIONS
  const currentQuestionWord = currentWordsList[quizIndex];
  
  const generateQuizOptions = (correctWord: Word) => {
    if (!correctWord) return;
    
    // Pick distractors from current word list or other levels
    let potentialDistractors = currentWordsList
      .filter(w => w.hanzi !== correctWord.hanzi)
      .map(w => w.vi);
      
    if (potentialDistractors.length < 3) {
      // Backfill distractors from standard dictionary
      const backfill = ["hiểu", "cho", "thì", "đừng", "xa", "bến xe", "nhưng", "vạn", "giới thiệu", "ngày mai"];
      potentialDistractors = [...potentialDistractors, ...backfill];
    }

    // Shuffle and pick 3 unique distractors
    const shuffledDistractors = potentialDistractors
      .filter((v, i, self) => self.indexOf(v) === i) // unique
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);

    // Merge correct and shuffle
    const merged = [correctWord.vi, ...shuffledDistractors]
      .sort(() => 0.5 - Math.random());
      
    setQuizOptions(merged);
  };

  // Generate quiz options on quizIndex change
  useEffect(() => {
    if (currentQuestionWord) {
      generateQuizOptions(currentQuestionWord);
      setSelectedAnswer(null);
      setIsQuizSubmitted(false);
    }
  }, [quizIndex, currentWordsList]);

  // RESET EXERCISES ON SUB-TAB CHANGE
  useEffect(() => {
    setCardIndex(0);
    setIsFlipped(false);
    
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedAnswer(null);
    setIsQuizSubmitted(false);

    setTypeIndex(0);
    setTypeInput('');
    setTypeStatus('pending');
    setTypeStreak(0);
    setTypeCorrectCount(0);
    setShowAnswer(false);
  }, [subTab, selectedLesson, selectedSectionIndex]);

  // TYPING SUBMIT CHECK
  const handleCheckType = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentWordsList[typeIndex]) return;

    const targetHanzi = currentWordsList[typeIndex].hanzi.trim();
    const userClean = typeInput.trim();

    if (userClean === targetHanzi) {
      setTypeStatus('correct');
      setTypeCorrectCount(prev => prev + 1);
      setTypeStreak(prev => prev + 1);
      speakChinese(targetHanzi);
    } else {
      setTypeStatus('incorrect');
      setTypeStreak(0);
    }
  };

  const handleNextType = () => {
    setTypeInput('');
    setTypeStatus('pending');
    setShowAnswer(false);
    if (typeIndex < currentWordsList.length - 1) {
      setTypeIndex(prev => prev + 1);
    } else {
      // finished lesson
    }
  };

  // Filter dictionary results
  const filteredDict = useMemo(() => {
    if (!searchQuery) return levelData.dictionary || [];
    return (levelData.dictionary || []).filter(item => 
      (item.hanzi && item.hanzi.includes(searchQuery)) ||
      (item.pinyin && item.pinyin.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.vi && item.vi.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, levelData.dictionary]);

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 font-sans flex flex-col selection:bg-cyan-500/25 selection:text-cyan-200" id="main-app">
      
      {/* 1. TOP HEADER BRANDING WITH GLASSMORPHISM AND GLOW */}
      <header className="border-b border-[#1e2e61] bg-[#0c132c]/85 backdrop-blur-md sticky top-0 z-50 shadow-lg shadow-black/20 transition-all" id="app-header">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setActiveTab('home'); setSelectedLesson(null); setSelectedSectionIndex(null); }} id="brand-logo">
            <div className="w-11 h-11 group-hover:scale-110 transition-all duration-300 flex-shrink-0" id="mia-header-logo">
              <img
                src="/tieng-trung-mia/mia-logo.png"
                alt="Logo Tiếng Trung MIA"
                className="w-full h-full object-contain select-none"
                draggable={false}
              />
            </div>
            <div>
              <h1 className="text-lg font-bold font-serif tracking-tight text-white flex items-center gap-1.5">
                TIẾNG TRUNG MIA <span className="text-[10px] px-1.5 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded font-sans font-semibold">v3.0</span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Hệ Thống Luyện Gõ &amp; Ôn Tập Từ Vựng HSK Mới</p>
            </div>
          </div>

          {/* Quick Stats Banner with Navy accents */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-300 bg-[#121c3a] px-3.5 py-1.5 rounded-lg border border-[#1e2e61] self-start md:self-auto shadow-inner" id="header-stats">
            <span className="flex items-center gap-1"><Trophy size={13} className="header-trophy-icon animate-pulse" /> 9 Cấp Độ</span>
            <span className="w-[1px] h-3 bg-[#1e2e61]"></span>
            <span className="flex items-center gap-1"><Keyboard size={13} className="text-cyan-400" /> Luyện Gõ IME</span>
            <span className="w-[1px] h-3 bg-[#1e2e61]"></span>
            <span className="flex items-center gap-1"><Flame size={13} className="header-flame-icon animate-bounce" /> Chuỗi: {typeStreak}</span>
          </div>

        </div>
      </header>

      {/* 2. TABBED LEVEL NAV BAR IN STUNNING NAVY BLUE */}
      <nav className="bg-[#e8f5e9] border-b border-[#c8e6c9] shadow-md sticky top-[65px] md:top-[61px] z-40 overflow-x-auto" id="level-nav">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 md:gap-2 py-2">
          
          <button
            onClick={() => { setActiveTab('home'); setSelectedLesson(null); setSelectedSectionIndex(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'home' 
                ? 'bg-[#1b4d2c] text-white shadow-inner' 
                : 'text-emerald-800 hover:text-emerald-950 hover:bg-[#c8e6c9]/40'
            }`}
            id="nav-home"
          >
            <Home size={14} />
            <span>Trang Chủ</span>
          </button>

          {(['hsk1', 'hsk2', 'hsk3', 'hsk4', 'hsk5', 'hsk6', 'hsk79'] as ActiveTab[]).map((tab) => {
            const label = tab === 'hsk79' ? 'HSK 7-9' : tab.toUpperCase();
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedLesson(null);
                  setSelectedSectionIndex(null);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-700 to-teal-600 text-white shadow-md shadow-emerald-700/20 scale-105' 
                    : 'text-emerald-800 hover:text-emerald-950 hover:bg-[#c8e6c9]/40 border border-transparent'
                }`}
                id={`nav-${tab}`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 3. MAIN WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 animate-fade-in-scale" id="app-workspace">
        
        {/* TAB 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div className="space-y-8" id="home-view">
            
            {/* Elegant Hero Board - Navy Cosmic Theme */}
            <div className="bg-gradient-to-br from-[#0c132c] via-[#111a3b] to-[#070b19] text-slate-100 rounded-2xl p-6 md:p-10 shadow-2xl relative overflow-hidden border border-[#1e2e61] navy-card-glow" id="hero-board">
              <div className="hero-content-grid relative z-10 grid grid-cols-1 lg:grid-cols-[1.08fr_0.92fr] items-center gap-8">
                <div className="max-w-2xl space-y-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 text-cyan-300 rounded-full text-xs font-bold border border-cyan-500/20">
                    <Sparkles size={12} className="animate-spin" />
                    Học thông minh hơn mỗi ngày
                  </span>

                  <h2 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-gradient-shimmer leading-tight">
                    Chinh phục chữ Hán với Phương Pháp <span className="hero-accent">Đa Tương Tác</span>
                  </h2>

                  <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                    Hệ thống hỗ trợ toàn diện 9 cấp độ HSK 3.0 mới nhất. Thực hành học từ vựng trực quan, lật thẻ flashcard 3D, luyện thi trắc nghiệm thông minh và đặc biệt là hệ thống <strong>Luyện gõ chữ Hán (Type Text)</strong> giúp ghi nhớ tự nhiên cấu trúc chữ.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('hsk1')}
                      className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-cyan-500/15 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-1.5"
                      id="btn-start-now"
                    >
                      <span>Học HSK 1 ngay</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>

                <div className="hero-illustration hidden lg:flex items-center justify-center" aria-hidden="true">
                  <svg viewBox="0 0 560 390" className="w-full max-w-[560px] h-auto" role="img" aria-label="Minh họa học chữ Hán trên máy tính">
                    <defs>
                      <filter id="hero-soft-shadow" x="-30%" y="-30%" width="160%" height="180%">
                        <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#78998f" floodOpacity="0.16" />
                      </filter>
                      <linearGradient id="hero-laptop" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#c5eadc" />
                        <stop offset="100%" stopColor="#8fcdb9" />
                      </linearGradient>
                    </defs>

                    <circle cx="376" cy="176" r="132" fill="#ffdfe5" opacity="0.78" />
                    <ellipse cx="314" cy="342" rx="220" ry="27" fill="#dceee7" opacity="0.8" />
                    <path d="M372 47c17-25 51-14 50 12 23-7 38 11 28 29h-91c-11-15-2-32 13-41Z" fill="#fff4e7" />

                    <g filter="url(#hero-soft-shadow)">
                      <rect x="185" y="88" width="290" height="214" rx="18" fill="url(#hero-laptop)" stroke="#7ab9a6" strokeWidth="5" />
                      <rect x="205" y="108" width="250" height="168" rx="10" fill="#fffdf9" />
                      <circle cx="220" cy="121" r="4" fill="#ffb7c5" />
                      <circle cx="234" cy="121" r="4" fill="#ffd6a5" />
                      <circle cx="248" cy="121" r="4" fill="#a7d7c5" />
                      <rect x="283" y="135" width="99" height="117" rx="10" fill="#f7f3e8" stroke="#ecdfcf" strokeWidth="2" />
                      <text x="332" y="203" textAnchor="middle" fontSize="63" fontFamily="'Noto Serif SC', serif" fill="#6cae9a">学</text>
                      <text x="332" y="234" textAnchor="middle" fontSize="22" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" fill="#6cae9a">xué</text>
                      <path d="M157 302h346l-38 42H198Z" fill="#9bd2c1" stroke="#79b5a2" strokeWidth="3" />
                      <path d="M233 313h194l-11 13H244Z" fill="#c9eadf" />
                      <path d="M298 332h66" stroke="#72ab9a" strokeWidth="4" strokeLinecap="round" />
                    </g>

                    <g transform="rotate(-5 130 198)" filter="url(#hero-soft-shadow)">
                      <rect x="86" y="141" width="91" height="98" rx="11" fill="#fff1e9" stroke="#efd7ca" strokeWidth="3" />
                      <text x="131" y="190" textAnchor="middle" fontSize="38" fontFamily="'Plus Jakarta Sans', sans-serif" fill="#6cae9a">A</text>
                      <path d="M146 171h18M146 184h13" stroke="#f0b8ad" strokeWidth="4" strokeLinecap="round" />
                    </g>

                    <g transform="rotate(-7 138 279)" filter="url(#hero-soft-shadow)">
                      <rect x="92" y="233" width="93" height="99" rx="11" fill="#fff7ee" stroke="#efdcc7" strokeWidth="3" />
                      <text x="139" y="296" textAnchor="middle" fontSize="52" fontFamily="'Noto Serif SC', serif" fill="#5f6f68">汉</text>
                    </g>

                    <g filter="url(#hero-soft-shadow)">
                      <path d="M477 117h49c11 0 20 9 20 20v37c0 11-9 20-20 20h-12l-11 14-4-14h-22c-11 0-20-9-20-20v-37c0-11 9-20 20-20Z" fill="#fff5f3" stroke="#f2dcd7" strokeWidth="3" />
                      <path d="M501 151c8-14 27-4 20 9-5 8-13 14-20 20-7-6-15-12-20-20-7-13 12-23 20-9Z" fill="#ff9fb2" />
                    </g>

                    <g filter="url(#hero-soft-shadow)">
                      <rect x="462" y="278" width="70" height="52" rx="7" fill="#f7d8cb" />
                      <path d="M497 278c-3-31-30-38-39-18 19 2 31 8 39 18Z" fill="#8bc8a8" />
                      <path d="M497 278c4-37 36-49 48-26-23 4-38 12-48 26Z" fill="#77b998" />
                      <path d="M497 278c-1-44 10-65 25-66 4 26-3 49-25 66Z" fill="#a8d7b8" />
                      <path d="M497 278v-54" stroke="#649f84" strokeWidth="4" strokeLinecap="round" />
                      <rect x="438" y="330" width="109" height="16" rx="4" fill="#cdb4db" />
                      <rect x="450" y="346" width="100" height="15" rx="4" fill="#ffd6a5" />
                    </g>

                    <text x="57" y="278" fontSize="52" fontWeight="700" fontFamily="'Plus Jakarta Sans', sans-serif" fill="#7bc4ad">C</text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Features Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="features-grid">
              
              <div className="bg-[#131b32]/90 p-5 rounded-xl border border-[#1e2e61] shadow-md space-y-2 navy-card-hover transition-all duration-300">
                <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Keyboard size={18} />
                </div>
                <h3 className="font-bold text-white text-sm">Luyện gõ chữ Hán</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Nhập chữ Hán tương ứng theo gợi ý Pinyin, ý nghĩa và ví dụ thực tế. Tự động kiểm tra đúng/sai chuẩn xác.
                </p>
              </div>

              <div className="bg-[#131b32]/90 p-5 rounded-xl border border-[#1e2e61] shadow-md space-y-2 navy-card-hover transition-all duration-300">
                <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <BookOpen size={18} />
                </div>
                <h3 className="font-bold text-white text-sm">Nét vẽ Stroke Sinh Động</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Quan sát trực quan và tương tác viết thử nét từng chữ Hán bằng HanziWriter giúp học thuộc nét nhanh chóng.
                </p>
              </div>

              <div className="bg-[#131b32]/90 p-5 rounded-xl border border-[#1e2e61] shadow-md space-y-2 navy-card-hover transition-all duration-300">
                <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <BookCheck size={18} />
                </div>
                <h3 className="font-bold text-white text-sm">Trắc nghiệm thông minh</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Bộ câu hỏi trắc nghiệm tự động xáo trộn ngẫu nhiên với các phương án dịch nghĩa tinh tế để kiểm tra kiến thức nhanh.
                </p>
              </div>

              <div className="bg-[#131b32]/90 p-5 rounded-xl border border-[#1e2e61] shadow-md space-y-2 navy-card-hover transition-all duration-300">
                <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Flame size={18} />
                </div>
                <h3 className="font-bold text-white text-sm">Thống kê &amp; Streak</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tự động lưu chuỗi gõ đúng liên tiếp (streak) và chấm điểm trực tiếp trong quá trình làm bài tập.
                </p>
              </div>

            </div>

            {/* Level Selector Cards list */}
            <div className="space-y-4" id="level-selection-panel">
              <h3 className="font-serif text-lg font-bold text-white border-l-4 border-cyan-500 pl-2">Chọn cấp độ để bắt đầu</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {[
                  { id: 'hsk1', title: 'Cấp độ HSK 1', desc: '15 bài học căn bản phù hợp cho người mới bắt đầu.', badge: 'Sơ cấp' },
                  { id: 'hsk2', title: 'Cấp độ HSK 2', desc: '15 bài học nâng cao, mở rộng từ vựng giao tiếp.', badge: 'Sơ cấp' },
                  { id: 'hsk3', title: 'Cấp độ HSK 3', desc: 'Tập trung các cấu trúc ngữ pháp và từ vựng thông dụng.', badge: 'Trung cấp' },
                  { id: 'hsk4', title: 'Cấp độ HSK 4', desc: 'Đầy đủ vốn từ nâng cao và cấu trúc ngữ pháp học thuật.', badge: 'Trung cấp' },
                  { id: 'hsk5', title: 'Cấp độ HSK 5', desc: 'Đọc hiểu báo chí và tin tức xã hội phức tạp.', badge: 'Cao cấp' },
                  { id: 'hsk6', title: 'Cấp độ HSK 6', desc: 'Tận hưởng văn học và hội thoại chuyên ngành sâu.', badge: 'Cao cấp' },
                  { id: 'hsk79', title: 'Cấp độ HSK 7-9', desc: 'Mức độ cao nhất giúp thành thạo tiếng Trung như người bản xứ.', badge: 'Thượng thừa' },
                ].map((lvl) => (
                  <div 
                    key={lvl.id}
                    onClick={() => {
                      setActiveTab(lvl.id as ActiveTab);
                      setSelectedLesson(null);
                      setSelectedSectionIndex(null);
                    }}
                    className="bg-[#131b32]/90 p-5 rounded-xl border border-[#1e2e61] cursor-pointer transition-all hover:scale-[1.03] group hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/5 duration-300"
                    id={`card-${lvl.id}`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-[10px] px-2 py-0.5 bg-cyan-950/60 text-cyan-400 border border-cyan-500/20 rounded font-semibold">{lvl.badge}</span>
                      <ChevronRight size={16} className="text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <h4 className="font-serif font-bold text-white mt-3 group-hover:text-cyan-300">{lvl.title}</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{lvl.desc}</p>
                  </div>
                ))}

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: LEVEL DETAILED VIEW (HSK 1 - HSK 7-9) */}
        {activeTab !== 'home' && !selectedLesson && selectedSectionIndex === null && (
          <div className="space-y-6" id="level-dashboard">
            
            {/* Level Title Header */}
            <div className="bg-[#131b32]/90 p-6 rounded-xl border border-[#1e2e61] shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4" id="level-info-header">
              <div className="space-y-1">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Chương trình học tập</span>
                <h2 className="text-2xl font-serif font-bold text-white">Mục lục từ vựng {levelData.title}</h2>
                <p className="text-xs text-slate-400">Hãy chọn một bài học hoặc phân mục dưới đây để bắt đầu ôn luyện từ vựng chi tiết.</p>
              </div>

              {/* Advanced levels search inside level vocabulary */}
              <div className="relative w-full md:w-72">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/60" />
                <input
                  type="text"
                  placeholder={`Tìm từ trong từ điển ${levelData.title}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-[#1e2e61] focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 bg-[#0b0f19] text-white"
                  id="level-search-input"
                />
              </div>
            </div>

            {/* DICTIONARY SEARCH RESULTS (If search query entered) */}
            {searchQuery && (
              <div className="bg-[#131b32]/95 p-6 rounded-xl border border-[#1e2e61] shadow-2xl space-y-4" id="search-results-panel">
                <div className="flex items-center justify-between border-b border-[#1e2e61] pb-2">
                  <h3 className="font-serif font-bold text-white text-sm">Kết quả tìm kiếm ({filteredDict.length})</h3>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-cyan-400 hover:underline cursor-pointer font-bold"
                  >
                    Xóa tìm kiếm
                  </button>
                </div>
                {filteredDict.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">Không tìm thấy từ nào phù hợp với từ khóa &quot;{searchQuery}&quot;.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredDict.map((word, i) => (
                      <div key={i} className="p-3 bg-[#0c132c]/80 border border-[#1e2e61] rounded-lg space-y-1 flex justify-between items-start transition-all hover:border-cyan-500/30">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-lg font-serif font-bold text-white">{word.hanzi || word.h}</span>
                            <span className="text-xs text-cyan-400 font-mono">({word.pinyin || word.p})</span>
                          </div>
                          {word.hv && <span className="text-[10px] text-cyan-300 font-bold bg-cyan-950/60 border border-cyan-500/20 px-1 rounded">Hán Việt: {word.hv}</span>}
                          <p className="text-xs text-slate-300 mt-1 font-medium">{word.vi}</p>
                          {word.ex && <p className="text-[10px] text-slate-400 italic font-mono mt-1 leading-relaxed">Ví dụ: {word.ex}</p>}
                        </div>
                        <button 
                          onClick={() => speakChinese(word.hanzi || word.h || '')}
                          className="p-1 rounded-full hover:bg-[#121c3a] text-slate-400 hover:text-cyan-400 transition-all cursor-pointer"
                        >
                          <Volume2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* LESSONS LIST FOR HSK 1, 2, 3 */}
            {(activeTab === 'hsk1' || activeTab === 'hsk2' || activeTab === 'hsk3') && !searchQuery && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="lessons-grid">
                {levelData.lessons.map((lesson) => (
                  <div 
                    key={lesson.id}
                    onClick={() => {
                      setSelectedLesson(lesson);
                      setSubTab('words');
                    }}
                    className="lesson-card bg-[#131b32]/90 p-5 rounded-xl border border-[#1e2e61] hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/5 cursor-pointer transition-all hover:scale-[1.03] group relative overflow-hidden duration-300 animate-slide-up"
                    id={`lesson-card-${activeTab}-${lesson.id}`}
                  >
                    <div className="lesson-card-number absolute right-0 top-0 w-12 h-12 bg-[#1b264f] text-cyan-400 font-serif text-sm font-bold flex items-center justify-center rounded-bl-xl border-l border-b border-[#1e2e61]">
                      #{lesson.id}
                    </div>

                    <div className="pr-12">
                      <h4 className="lesson-card-label text-xs text-cyan-400 font-bold">Bài Học {lesson.id}</h4>
                      <h3 className="lesson-card-title font-serif font-bold text-white text-base mt-1 group-hover:text-cyan-300 leading-snug">{lesson.title}</h3>
                      <p className="lesson-card-description text-xs text-slate-400 font-medium mt-1">{lesson.titleVi}</p>
                      
                      <div className="lesson-card-footer mt-4 flex items-center justify-between border-t border-[#1e2e61] pt-3">
                        <span className="lesson-card-count text-xs text-slate-500 font-medium">{lesson.words.length} Từ vựng</span>
                        <span className="lesson-card-action text-xs font-semibold text-cyan-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-all">
                          Học ngay <ChevronRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SECTIONS LIST ("Mục") FOR HSK 4, 5, 6, 7-9 */}
            {(activeTab === 'hsk4' || activeTab === 'hsk5' || activeTab === 'hsk6' || activeTab === 'hsk79') && !searchQuery && (
              <div className="space-y-6" id="sections-panel">
                
                <div className="bg-cyan-950/40 p-4 rounded-xl border border-cyan-500/20 flex items-start gap-3">
                  <Info size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-cyan-300 leading-relaxed font-medium">
                    Do số lượng từ vựng HSK Cao cấp rất nhiều, hệ thống đã tự động chia nhỏ toàn bộ danh sách thành các <strong>Mục (Section)</strong> gồm 20 từ để bạn dễ dàng tập trung hoàn thành bài tập trọn vẹn. Mỗi mục đều có đầy đủ bộ công cụ ôn tập và gõ chữ.
                  </p>
                </div>
 
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {levelSections.map((sectionWords, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedSectionIndex(idx);
                        setSubTab('words');
                      }}
                      className="bg-[#131b32]/90 p-5 rounded-xl border border-[#1e2e61] hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-400/5 cursor-pointer transition-all group relative overflow-hidden duration-300 animate-slide-up"
                      id={`section-card-${idx}`}
                    >
                      <div className="absolute right-0 top-0 w-12 h-12 bg-[#1b264f] text-cyan-400 font-serif text-sm font-bold flex items-center justify-center rounded-bl-xl border-l border-b border-[#1e2e61]">
                        #{idx + 1}
                      </div>
 
                      <div className="pr-12">
                        <h4 className="text-xs text-cyan-400 font-bold">Phân mục HSK</h4>
                        <h3 className="font-serif font-bold text-white text-base mt-1 group-hover:text-cyan-300 leading-snug">Mục Số {idx + 1}</h3>
                        <p className="text-xs text-slate-400 font-medium mt-1">Từ thứ {idx * 20 + 1} đến {idx * 20 + sectionWords.length}</p>
                        
                        <div className="mt-4 flex items-center justify-between border-t border-[#1e2e61] pt-3">
                          <span className="text-xs text-slate-500 font-medium">{sectionWords.length} Từ vựng</span>
                          <span className="text-xs font-semibold text-cyan-400 flex items-center gap-0.5 group-hover:translate-x-1 transition-all">
                            Học gõ chữ <ChevronRight size={12} />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
 
                {/* GRAMMAR MODULE SECTION FOR HIGHER LEVELS */}
                {levelData.grammar && levelData.grammar.length > 0 && (
                  <div className="space-y-4 pt-6" id="grammar-guide-panel">
                    <h3 className="font-serif text-lg font-bold text-white border-l-4 border-cyan-500 pl-2">Hướng dẫn Ngữ pháp Đặc trưng của {levelData.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {levelData.grammar.map((gram: any, idx: number) => (
                        <div key={idx} className="bg-[#131b32]/90 border border-[#1e2e61] rounded-xl p-5 space-y-3 shadow-md">
                          <div className="flex justify-between items-center border-b border-[#1e2e61] pb-2">
                            <span className="text-[10px] uppercase font-bold text-cyan-300 bg-cyan-950/45 border border-cyan-500/25 px-2 py-0.5 rounded">{gram.gr}</span>
                            <span className="text-xs font-semibold text-slate-400 font-mono">{gram.cat}</span>
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-lg font-serif font-bold text-white flex items-baseline gap-1.5">
                              {gram.cn}
                              <span className="text-xs font-normal text-cyan-400 font-mono">({gram.py})</span>
                            </h4>
                            <p className="text-xs text-slate-300 font-medium leading-relaxed">{gram.vi}</p>
                          </div>
                          <div className="bg-[#0c132c]/80 p-3 rounded-lg border border-[#1e2e61] space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-400 block">Ví dụ minh họa:</span>
                            {gram.eg.map((exStr: string, exIdx: number) => (
                              <p key={exIdx} className="text-xs text-slate-300 font-medium pl-2 border-l-2 border-cyan-500/40">{exStr}</p>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
 
              </div>
            )}

          </div>
        )}

        {/* TAB 3: STUDY WORKSPACE (Once Lesson or Section is Opened) */}
        {(selectedLesson || selectedSectionIndex !== null) && (
          <div className="space-y-6" id="active-study-workspace">
            
            {/* Nav Header breadcrumb */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#1e2e61] pb-4 gap-4" id="workspace-breadcrumb">
              <div className="space-y-1">
                <button 
                  onClick={() => { setSelectedLesson(null); setSelectedSectionIndex(null); }}
                  className="text-xs text-cyan-400 font-bold hover:text-cyan-300 hover:underline cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft size={14} /> Quay lại danh sách của {levelData.title}
                </button>
                <h2 className="text-xl font-serif font-bold text-white">
                  {selectedLesson 
                    ? `Bài ${selectedLesson.id}: ${selectedLesson.title}` 
                    : `Mục số ${selectedSectionIndex! + 1} của ${levelData.title}`
                  }
                </h2>
                <p className="text-xs text-slate-400">
                  {selectedLesson ? selectedLesson.titleVi : `Phân cụm 20 từ HSK cao cấp giúp ghi nhớ từ vựng hiệu quả`}
                </p>
              </div>

              {/* Sub-tab selection row */}
              <div className="flex bg-[#0c132c]/90 p-1 rounded-lg self-start md:self-auto border border-[#1e2e61]" id="subtab-selector">
                {[
                  { id: 'words', label: 'Từ vựng' },
                  { id: 'cards', label: 'Lật thẻ 3D' },
                  { id: 'quiz', label: 'Trắc nghiệm' },
                  { id: 'type', label: 'Luyện gõ chữ' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSubTab(item.id as SubTab)}
                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                      subTab === item.id 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/20' 
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* SUB-TAB 1: WORDS LIST */}
            {subTab === 'words' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-up" id="subtab-words-view">
                
                {/* Words list list */}
                <div className="lg:col-span-2 space-y-3" id="words-glossary-list">
                  <h3 className="word-list-heading text-xs uppercase tracking-wider text-slate-500 font-bold">Danh sách từ vựng ({currentWordsList.length} từ)</h3>
                  
                  <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-2">
                    {currentWordsList.map((word, index) => {
                      const isSelected = activeWordForStrokes === word.hanzi;
                      return (
                        <div 
                          key={index}
                          onClick={() => setActiveWordForStrokes(word.hanzi)}
                          className={`word-list-item p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center gap-4 duration-200 ${
                            isSelected 
                              ? 'word-list-item-selected bg-cyan-950/25 border-cyan-400/60 shadow-lg shadow-cyan-500/5' 
                              : 'bg-[#131b32]/90 border-[#1e2e61] hover:border-cyan-500/20 hover:bg-[#182343]'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                              <span className="word-list-hanzi text-2xl font-serif font-bold text-white tracking-wide">{word.hanzi}</span>
                              <span className="word-list-pinyin text-xs text-cyan-400 font-mono font-semibold">{word.pinyin}</span>
                              {word.pos && <span className="word-list-pos text-[10px] text-slate-400 italic px-1 bg-slate-800 rounded">({word.pos})</span>}
                            </div>
                            <p className="word-list-meaning text-xs text-slate-300 font-medium leading-relaxed">{word.vi}</p>
                            {word.en && <p className="word-list-example text-[10px] text-slate-400 italic font-mono leading-relaxed">{word.en}</p>}
                          </div>

                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button 
                              onClick={() => speakChinese(word.hanzi)}
                              className="word-list-audio p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-all cursor-pointer"
                              title="Nghe phát âm"
                            >
                              <Volume2 size={16} />
                            </button>
                            <button 
                              onClick={() => setActiveWordForStrokes(word.hanzi)}
                              className={`word-list-strokes px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                                isSelected 
                                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 border-transparent text-white shadow-md shadow-cyan-500/20' 
                                  : 'bg-[#0b0f19] border-[#1e2e61] text-slate-300 hover:bg-[#121c3a]'
                              }`}
                            >
                              Xem nét
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Strokes display board */}
                <div className="space-y-3" id="stroke-order-sidebar">
                  <h3 className="text-xs uppercase tracking-wider text-slate-500 font-bold">Hướng dẫn viết nét chữ Hán</h3>
                  
                  {activeWordForStrokes ? (
                    <div className="bg-[#131b32]/90 p-5 rounded-xl border border-[#1e2e61] shadow-2xl space-y-4 sticky top-[150px]">
                      <div className="flex justify-between items-center border-b border-[#1e2e61] pb-3">
                        <div>
                          <h4 className="font-serif font-bold text-white text-sm">Chữ đang chọn: {activeWordForStrokes}</h4>
                          <p className="text-[10px] text-slate-400">Xem và luyện viết chữ từng nét một</p>
                        </div>
                        <button 
                          onClick={() => speakChinese(activeWordForStrokes)}
                          className="p-2 rounded-full hover:bg-slate-800 text-cyan-400 transition-all"
                        >
                          <Volume2 size={16} />
                        </button>
                      </div>

                      <WordStrokes word={activeWordForStrokes} />
                    </div>
                  ) : (
                    <div className="bg-[#131b32]/90 p-6 rounded-xl border border-[#1e2e61] text-center text-slate-400 text-xs">
                      Hãy bấm chọn một từ trong danh sách để hiển thị nét vẽ động.
                    </div>
                  )}
                </div>
 
              </div>
            )}

            {/* SUB-TAB 2: FLASHCARDS (3D) */}
            {subTab === 'cards' && (
              <div className="max-w-md mx-auto space-y-6 py-6 animate-fade-in-scale" id="subtab-flashcard-view">
                
                {/* Stats indicators */}
                <div className="flex justify-between items-center text-xs text-slate-400 font-semibold">
                  <span>Học lật thẻ</span>
                  <span className="font-bold text-cyan-400">{cardIndex + 1} / {currentWordsList.length} từ</span>
                </div>

                {/* Flip card box with hover lift */}
                <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full h-80 perspective-1000 cursor-pointer group"
                  id="flashcard-box"
                >
                  <div className={`relative w-full h-full duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                    
                    {/* Front side (Hanzi) */}
                    <div className="absolute inset-0 w-full h-full bg-[#131b32] rounded-2xl border-2 border-[#1e2e61] group-hover:border-cyan-500/40 shadow-2xl shadow-black/40 flex flex-col items-center justify-center p-6 backface-hidden transition-all">
                      <div className="absolute top-4 left-4 text-[10px] font-bold text-cyan-400/70 tracking-widest">TRƯỚC (CHỮ HÁN)</div>
                      <div className="space-y-4 text-center">
                        <span className="text-6xl md:text-7xl font-serif font-bold text-white select-none block tracking-widest drop-shadow-[0_0_15px_rgba(34,211,238,0.35)]">{currentWordsList[cardIndex]?.hanzi}</span>
                        <span className="inline-block px-3 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full text-xs font-bold font-mono">Bấm để lật</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); speakChinese(currentWordsList[cardIndex]?.hanzi); }}
                        className="absolute bottom-4 right-4 p-2 bg-[#0b0f19] hover:bg-[#121c3a] text-slate-300 hover:text-cyan-400 rounded-full transition-all cursor-pointer border border-[#1e2e61]"
                        title="Phát âm"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>

                    {/* Back side (Pinyin + Meanings) */}
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#101730] to-[#1a254c] rounded-2xl border-2 border-cyan-500/40 shadow-2xl rotate-y-180 flex flex-col items-center justify-center p-6 backface-hidden">
                      <div className="absolute top-4 left-4 text-[10px] font-bold text-cyan-400 tracking-widest">SAU (ĐÁP ÁN)</div>
                      
                      <div className="space-y-3 text-center w-full px-4">
                        <h4 className="text-3xl font-serif font-bold text-white tracking-wider">{currentWordsList[cardIndex]?.hanzi}</h4>
                        <p className="text-lg font-mono font-bold text-cyan-400">{currentWordsList[cardIndex]?.pinyin}</p>
                        <div className="h-[2px] bg-[#1e2e61] w-12 mx-auto"></div>
                        <p className="text-sm font-semibold text-slate-200 leading-relaxed">{currentWordsList[cardIndex]?.vi}</p>
                        {currentWordsList[cardIndex]?.en && (
                          <p className="text-[11px] text-slate-400 italic leading-snug">{currentWordsList[cardIndex]?.en}</p>
                        )}
                      </div>

                      <button 
                        onClick={(e) => { e.stopPropagation(); speakChinese(currentWordsList[cardIndex]?.hanzi); }}
                        className="absolute bottom-4 right-4 p-2 bg-[#0b0f19] hover:bg-[#121c3a] text-cyan-400 rounded-full transition-all cursor-pointer border border-cyan-500/30"
                      >
                        <Volume2 size={16} />
                      </button>
                    </div>

                  </div>
                </div>

                {/* Progress bar with cyan glow */}
                <div className="w-full bg-[#0b0f19] h-2 rounded-full overflow-hidden border border-[#1e2e61]">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 transition-all duration-300 shadow-[0_0_10px_rgba(34,211,238,0.4)]" 
                    style={{ width: `${((cardIndex + 1) / currentWordsList.length) * 100}%` }}
                  />
                </div>

                {/* Navigation actions */}
                <div className="flex justify-between items-center gap-4">
                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setCardIndex(prev => Math.max(0, prev - 1));
                    }}
                    disabled={cardIndex === 0}
                    className="flex-1 py-2 px-4 rounded-xl border border-[#1e2e61] bg-[#131b32] hover:bg-[#1a2544] text-slate-300 font-bold text-xs disabled:opacity-30 transition-all cursor-pointer flex items-center justify-center gap-1"
                    id="btn-prev-card"
                  >
                    <ChevronLeft size={14} />
                    <span>Trước đó</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setCardIndex(prev => Math.min(currentWordsList.length - 1, prev + 1));
                    }}
                    disabled={cardIndex === currentWordsList.length - 1}
                    className="flex-1 py-2 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs disabled:opacity-30 transition-all cursor-pointer flex items-center justify-center gap-1 shadow-md shadow-cyan-500/10"
                    id="btn-next-card"
                  >
                    <span>Tiếp theo</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

              </div>
            )}

            {/* SUB-TAB 3: MULTIPLE CHOICE QUIZ */}
            {subTab === 'quiz' && (
              <div className="max-w-2xl mx-auto space-y-6 py-4 animate-fade-in-scale" id="subtab-quiz-view">
                
                {/* Score and indicators */}
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-400">Câu hỏi trắc nghiệm {quizIndex + 1} / {currentWordsList.length}</span>
                  <span className="font-bold text-cyan-300 bg-[#0c132c]/80 px-2.5 py-1 rounded-full border border-[#1e2e61] shadow-md">
                    Điểm số: <span className="text-emerald-400 font-extrabold font-mono">{quizScore}</span> / {currentWordsList.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-[#0b0f19] h-2 rounded-full overflow-hidden border border-[#1e2e61]">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 transition-all duration-300 shadow-[0_0_8px_rgba(52,211,153,0.3)]"
                    style={{ width: `${((quizIndex + 1) / currentWordsList.length) * 100}%` }}
                  />
                </div>

                {/* Question box card */}
                {currentQuestionWord ? (
                  <div className="bg-[#131b32]/90 p-6 md:p-8 rounded-2xl border border-[#1e2e61] shadow-2xl space-y-6">
                    
                    <div className="text-center space-y-2">
                      <span className="text-[10px] text-cyan-400/80 font-bold tracking-widest block">CHỮ HÁN NÀY NGHĨA LÀ GÌ?</span>
                      <h3 className="text-5xl md:text-6xl font-serif font-bold text-white tracking-wider select-none drop-shadow-[0_0_10px_rgba(255,255,255,0.15)]">{currentQuestionWord.hanzi}</h3>
                      <p className="text-sm text-cyan-400 font-mono font-medium">Pinyin: {currentQuestionWord.pinyin}</p>
                    </div>

                    {/* Options list */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {quizOptions.map((opt, optIdx) => {
                        const isCorrectOption = opt === currentQuestionWord.vi;
                        const isSelectedOption = selectedAnswer === optIdx;
                        
                        let btnStyle = "border-[#1e2e61] bg-[#0c132c]/80 text-slate-300 hover:border-cyan-500/50 hover:bg-[#1a2544]/60";
                        if (isQuizSubmitted) {
                          if (isCorrectOption) {
                            btnStyle = "bg-emerald-950/50 border-emerald-500 text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.15)]";
                          } else if (isSelectedOption) {
                            btnStyle = "bg-red-950/40 border-red-900 text-red-300 opacity-70";
                          } else {
                            btnStyle = "opacity-35 border-[#1e2e61] bg-[#0c132c]/40 text-slate-500";
                          }
                        } else if (isSelectedOption) {
                          btnStyle = "bg-cyan-950/40 border-cyan-400 text-white font-bold shadow-md shadow-cyan-500/5";
                        }

                        return (
                          <button
                            key={optIdx}
                            disabled={isQuizSubmitted}
                            onClick={() => setSelectedAnswer(optIdx)}
                            className={`p-4 text-left rounded-xl border text-xs font-semibold transition-all cursor-pointer flex justify-between items-center ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isQuizSubmitted && isCorrectOption && <CheckCircle size={15} className="text-emerald-400 shrink-0" />}
                            {isQuizSubmitted && isSelectedOption && !isCorrectOption && <XCircle size={15} className="text-red-400 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback explanations */}
                    {isQuizSubmitted && (
                      <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1 ${
                        quizOptions[selectedAnswer!] === currentQuestionWord.vi 
                          ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 shadow-sm' 
                          : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-300 shadow-sm'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          {quizOptions[selectedAnswer!] === currentQuestionWord.vi ? (
                            <>
                              <CheckCircle size={14} className="text-emerald-400" />
                              <span>Chính xác!</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle size={14} className="text-cyan-400" />
                              <span>Chưa chính xác!</span>
                            </>
                          )}
                        </div>
                        <p>Từ <strong className="text-white">{currentQuestionWord.hanzi} ({currentQuestionWord.pinyin})</strong> có nghĩa là: <strong className="text-white">{currentQuestionWord.vi}</strong>.</p>
                        {currentQuestionWord.en && <p className="text-[11px] text-slate-400 mt-1 font-mono italic">Ví dụ: {currentQuestionWord.en}</p>}
                      </div>
                    )}

                    {/* Control action button */}
                    <div className="flex justify-end pt-2">
                      {!isQuizSubmitted ? (
                        <button
                          disabled={selectedAnswer === null}
                          onClick={() => {
                            setIsQuizSubmitted(true);
                            if (quizOptions[selectedAnswer!] === currentQuestionWord.vi) {
                              setQuizScore(prev => prev + 1);
                              speakChinese(currentQuestionWord.hanzi);
                            }
                          }}
                          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl disabled:opacity-30 shadow-md shadow-cyan-500/10 transition-all cursor-pointer"
                        >
                          Kiểm tra phương án
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (quizIndex < currentWordsList.length - 1) {
                              setQuizIndex(prev => prev + 1);
                            } else {
                              // Reset or loop
                              setQuizIndex(0);
                              setQuizScore(0);
                            }
                          }}
                          className="px-6 py-2.5 bg-[#1b264f] hover:bg-[#25336d] text-cyan-400 border border-[#1e2e61] font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          {quizIndex === currentWordsList.length - 1 ? "Hoàn thành & Làm lại" : "Câu tiếp theo"}
                        </button>
                      )}
                    </div>

                  </div>
                ) : (
                  <div className="bg-[#131b32]/90 p-6 rounded-xl border border-[#1e2e61] text-center text-slate-400 text-xs">
                    Không có danh sách câu hỏi.
                  </div>
                )}

              </div>
            )}

            {/* SUB-TAB 4: TYPE TEXT - HANDS ON KEYBOARD INTERACTIVE PRACTICE */}
            {subTab === 'type' && (
              <div className="max-w-2xl mx-auto space-y-6 py-4 animate-fade-in-scale" id="subtab-typing-view">
                
                {/* Stats Header */}
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-slate-400">Bảng gõ chữ Hán {typeIndex + 1} / {currentWordsList.length}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded border border-orange-500/25 flex items-center gap-1 shadow-sm">
                      <Flame size={12} className="text-orange-400 animate-pulse" /> Streak: {typeStreak}
                    </span>
                    <span className="font-bold text-cyan-300 bg-[#0c132c]/80 px-2.5 py-1 rounded-full border border-[#1e2e61] shadow-md">
                      Đã gõ đúng: {typeCorrectCount} / {currentWordsList.length}
                    </span>
                  </div>
                </div>

                {/* Progress Indicator bar */}
                <div className="w-full bg-[#0b0f19] h-2 rounded-full overflow-hidden border border-[#1e2e61]">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 transition-all duration-300 shadow-[0_0_8px_rgba(34,211,238,0.3)]"
                    style={{ width: `${((typeIndex + 1) / currentWordsList.length) * 100}%` }}
                  />
                </div>

                {/* Main Interactive Typing Centerboard */}
                {currentWordsList[typeIndex] ? (
                  <div className="bg-[#131b32]/90 p-6 md:p-8 rounded-2xl border border-[#1e2e61] shadow-2xl space-y-6" id="typing-board">
                    
                    {/* Prompt Box with Masked/Revealed Target */}
                    <div className="bg-cyan-950/15 p-5 rounded-xl border border-cyan-500/20 space-y-4 text-center">
                      <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold block">Hãy gõ chữ Hán tương ứng dưới đây</span>
                      
                      <div className="space-y-1">
                        <h4 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-wider select-none drop-shadow-[0_0_12px_rgba(255,255,255,0.15)]">
                          {showAnswer ? currentWordsList[typeIndex].hanzi : (
                            <span className="text-slate-500/80 font-sans italic tracking-widest select-none">
                              {currentWordsList[typeIndex].hanzi.split('').map(() => '◯').join('')}
                            </span>
                          )}
                        </h4>
                        <p className="text-lg font-mono font-bold text-cyan-400 tracking-tight">{currentWordsList[typeIndex].pinyin}</p>
                      </div>

                      <div className="h-[1px] bg-[#1e2e61] max-w-xs mx-auto"></div>

                      <div className="space-y-1">
                        <p className="text-xs text-slate-200 font-semibold">{currentWordsList[typeIndex].vi}</p>
                        {currentWordsList[typeIndex].en && (
                          <p className="text-[11px] text-slate-400 italic leading-snug">{currentWordsList[typeIndex].en}</p>
                        )}
                      </div>
                    </div>

                    {/* Interactive Input Form */}
                    <form onSubmit={handleCheckType} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-400 font-medium flex justify-between items-center">
                          <span>Nhập chữ Hán của bạn (Sử dụng bộ gõ tiếng Trung của thiết bị):</span>
                          <button 
                            type="button"
                            onClick={() => speakChinese(currentWordsList[typeIndex].hanzi)}
                            className="text-[10px] text-cyan-400 hover:text-cyan-300 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            <Volume2 size={12} /> Nghe phát âm mẫu
                          </button>
                        </label>
                        
                        <div className="relative">
                          <input
                            type="text"
                            autoFocus
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            placeholder="Nhập chữ Hán tương ứng tại đây..."
                            value={typeInput}
                            disabled={typeStatus === 'correct'}
                            onChange={(e) => setTypeInput(e.target.value)}
                            className={`w-full px-4 py-3.5 rounded-xl border-2 font-serif text-lg tracking-wide focus:outline-none focus:ring-2 transition-all ${
                              typeStatus === 'correct' 
                                ? 'bg-emerald-950/30 border-emerald-500 text-emerald-300 focus:ring-emerald-500/10' 
                                : typeStatus === 'incorrect' 
                                ? 'bg-red-950/30 border-red-500 text-red-350 focus:ring-red-500/10'
                                : 'bg-[#0b0f19] border-[#1e2e61] text-white focus:bg-[#0c132c] focus:border-cyan-400 focus:ring-cyan-500/15'
                            }`}
                            id="typing-input-field"
                          />
                          
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1.5">
                            {typeInput && typeStatus !== 'correct' && (
                              <button
                                type="submit"
                                className="p-1.5 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg cursor-pointer shadow-md shadow-cyan-500/10"
                                title="Kiểm tra"
                              >
                                <CornerDownLeft size={14} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Character Keyboard hints */}
                      <div className="flex gap-1.5 flex-wrap items-center">
                        <span className="text-[10px] text-slate-500 font-medium">Gợi ý gõ:</span>
                        {currentWordsList[typeIndex].hanzi.split('').map((char, charIdx) => (
                          <button
                            key={charIdx}
                            type="button"
                            onClick={() => {
                              setTypeInput(prev => prev + char);
                            }}
                            className="px-2.5 py-1 bg-[#1b264f] hover:bg-[#25336d] text-cyan-300 rounded text-xs font-mono font-bold border border-[#1e2e61] hover:border-cyan-400 cursor-pointer duration-150"
                          >
                            {char}
                          </button>
                        ))}
                      </div>
                    </form>

                    {/* Status Feedback Row */}
                    {typeStatus !== 'pending' && (
                      <div className={`p-4 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${
                        typeStatus === 'correct' 
                          ? 'bg-emerald-950/35 border-emerald-500/30 text-emerald-300' 
                          : 'bg-red-950/35 border-red-900/30 text-red-300'
                      }`} id="typing-feedback-alert">
                        {typeStatus === 'correct' ? (
                          <>
                            <CheckCircle size={15} className="text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
                            <div>
                              <p className="font-bold text-white">Gõ chuẩn xác! Tuyệt vời!</p>
                              <p className="mt-0.5 text-slate-300">Bạn gõ đúng từ <strong>{currentWordsList[typeIndex].hanzi}</strong> ({currentWordsList[typeIndex].pinyin}).</p>
                            </div>
                          </>
                        ) : (
                          <>
                            <XCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-white">Chưa chính xác!</p>
                              <p className="mt-0.5 text-slate-300">Nhập liệu của bạn chưa khớp với đáp án chữ Hán. Hãy thử gõ lại hoặc ấn &quot;Xem đáp án&quot; bên dưới.</p>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Controller Action buttons */}
                    <div className="flex justify-between items-center gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAnswer(!showAnswer)}
                        className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white border border-[#1e2e61] hover:bg-[#1a2544] rounded-xl transition-all cursor-pointer"
                        id="btn-show-typing-answer"
                      >
                        {showAnswer ? "Ẩn đáp án mẫu" : "Xem đáp án mẫu"}
                      </button>

                      <div className="flex gap-2">
                        {typeStatus === 'pending' && (
                          <button
                            type="button"
                            onClick={() => handleCheckType()}
                            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-cyan-500/10 transition-all cursor-pointer"
                            id="btn-submit-typing"
                          >
                            Kiểm tra kết quả
                          </button>
                        )}

                        {(typeStatus !== 'pending' || showAnswer) && (
                          <button
                            type="button"
                            onClick={handleNextType}
                            className="px-5 py-2 bg-[#1b264f] hover:bg-[#25336d] text-cyan-400 border border-[#1e2e61] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                            id="btn-next-typing"
                          >
                            <span>Câu tiếp theo</span>
                            <ChevronRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Integrated mini stroke view helper for writing reinforcement */}
                    <div className="border-t border-[#1e2e61] pt-5 space-y-3">
                      <h5 className="text-[10px] uppercase font-bold text-slate-500">Tập viết trực quan từ đang gõ</h5>
                      <WordStrokes word={currentWordsList[typeIndex].hanzi} />
                    </div>

                  </div>
                ) : (
                  <div className="bg-[#131b32]/90 p-6 rounded-xl border border-[#1e2e61] text-center text-slate-400 text-xs">
                    Không tìm thấy từ tiếp theo để gõ.
                  </div>
                )}
 
              </div>
            )}
 
          </div>
        )}
 
      </main>
 
      {/* 4. FOOTER CREDITS */}
      <footer className="border-t border-[#1e2e61] bg-[#070b16] py-6 text-center text-slate-500 text-xs mt-12 space-y-2" id="app-footer-credit">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <p className="font-serif font-semibold text-cyan-400/90">TIẾNG TRUNG MIA — Chinh phục HSK 3.0 thông minh</p>
          <p>© 2026 TIẾNG TRUNG MIA. Mọi quyền được bảo lưu.</p>
        </div>
      </footer>

    </div>
  );
}
