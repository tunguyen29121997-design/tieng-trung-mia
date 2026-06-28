import React, { useEffect, useRef, useState } from 'react';
import { Play, RotateCcw, HelpCircle } from 'lucide-react';

interface WordStrokesProps {
  word: string;
}

export const WordStrokes: React.FC<WordStrokesProps> = ({ word }) => {
  const containerRefs = useRef<HTMLDivElement[]>([]);
  const writerInstances = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clean up Hanzi chars
  const chars = word.replace(/[^\u4e00-\u9fa5]/g, '').split('');

  useEffect(() => {
    // Reset and initialize HanziWriter for each char
    setIsLoaded(false);
    setError(null);
    writerInstances.current.forEach((instance) => {
      try {
        instance.destroy();
      } catch (e) {
        // Safe catch
      }
    });
    writerInstances.current = [];

    const loadWriters = () => {
      const HanziWriter = (window as any).HanziWriter;
      if (!HanziWriter) {
        // Retry in 200ms
        setTimeout(loadWriters, 200);
        return;
      }

      try {
        chars.forEach((char, index) => {
          const el = containerRefs.current[index];
          if (!el) return;
          
          el.innerHTML = ''; // Clear previous content
          
          const writer = HanziWriter.create(el, char, {
            width: 120,
            height: 120,
            padding: 5,
            strokeColor: '#22d3ee', // Bright glowing cyan
            radicalColor: '#f59e0b', // Radiant amber gold for radicals
            outlineColor: '#1e293b', // Deep slate gray outline
            showOutline: true,
            delayBetweenStrokes: 150
          });
          
          writerInstances.current[index] = writer;
        });
        setIsLoaded(true);
      } catch (err) {
        console.error("HanziWriter initialization failed:", err);
        setError("Không tải được hình nét vẽ chữ này.");
      }
    };

    // Give the DOM a tiny moment to paint refs
    const timer = setTimeout(() => {
      loadWriters();
    }, 50);

    return () => {
      clearTimeout(timer);
    };
  }, [word]);

  const handleAnimate = () => {
    writerInstances.current.forEach((writer) => {
      if (writer) {
        writer.animateCharacter();
      }
    });
  };

  const handleLoop = () => {
    // Chain animations sequentially
    let delay = 0;
    writerInstances.current.forEach((writer, idx) => {
      setTimeout(() => {
        if (writer) writer.animateCharacter();
      }, delay);
      delay += 1500; // rough duration of one character animation
    });
  };

  const handleQuiz = () => {
    writerInstances.current.forEach((writer) => {
      if (writer) {
        writer.quiz();
      }
    });
  };

  if (chars.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-slate-400 font-sans" id="word-strokes-empty">
        <p>Không có ký tự chữ Hán để vẽ nét.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-[#131b32]/90 p-4 rounded-xl border border-[#1e2e61] shadow-inner transition-all hover:border-cyan-500/30" id="word-strokes-container">
      <div className="flex flex-wrap gap-4 items-center justify-center py-2">
        {chars.map((char, index) => (
          <div key={index} className="flex flex-col items-center bg-[#0b0f19] p-3 rounded-lg shadow-md border border-[#1e2e61] transition-all hover:scale-105 hover:border-cyan-400">
            <div
              ref={(el) => {
                if (el) containerRefs.current[index] = el;
              }}
              className="w-[120px] h-[120px]"
              style={{ minWidth: '120px', minHeight: '120px' }}
            />
            <span className="text-xs text-cyan-400 font-mono mt-1">Ký tự {index + 1}: {char}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mt-4 flex-wrap justify-center">
        <button
          onClick={handleAnimate}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs rounded-lg shadow-md shadow-cyan-500/10 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          id="btn-stroke-animate"
        >
          <Play size={14} />
          <span>Vẽ nét</span>
        </button>
        <button
          onClick={handleLoop}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 font-medium text-xs rounded-lg border border-slate-700 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          id="btn-stroke-loop"
        >
          <RotateCcw size={14} />
          <span>Tuần tự</span>
        </button>
        <button
          onClick={handleQuiz}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-white font-medium text-xs rounded-lg shadow-md shadow-amber-500/10 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          id="btn-stroke-quiz"
        >
          <HelpCircle size={14} />
          <span>Tự viết thử</span>
        </button>
      </div>
      <p className="text-[10px] text-slate-400 mt-2 text-center">
        * Bấm &quot;Tự viết thử&quot; và dùng chuột/ngón tay vẽ trực tiếp lên ô chữ để tập viết!
      </p>
    </div>
  );
};
