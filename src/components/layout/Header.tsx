import React from 'react';
import { BookOpen, ShieldCheck, User as UserIcon, Moon, Sun, Sparkles, LogIn, LogOut, CheckCircle2, Download } from 'lucide-react';
import { User } from '../../lib/firebase';

interface HeaderProps {
  user: User | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenAuth,
  onSignOut,
  isDark,
  onToggleTheme,
  onSelectTab,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors border-stone-800 bg-stone-950/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Slogan */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-3 focus:outline-none text-right cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50 border border-emerald-500/30 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-emerald-400 tracking-wide font-sans">نَسَق</span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60 font-mono">NASAQ AI</span>
              </div>
              <p className="text-[11px] text-stone-400 font-medium">«القرآن يُبيّن بعضه بعضًا»</p>
            </div>
          </button>

          {/* Active Mode Badge */}
          <div className="hidden md:flex items-center gap-1.5 mr-6 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>المنهج:</span>
            <span className="font-semibold text-emerald-200">القرآن بالقرآن</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Integrity Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-stone-900 border border-stone-800 text-stone-300">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>مصحف حفص موثق (6236 آية)</span>
          </div>

          {/* Download Project ZIP */}
          <a
            href="/nasap-ai-v1.3.zip"
            download="nasap-ai-v1.3.zip"
            title="تنزيل المشروع كاملاً كملف ZIP"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 hover:text-emerald-100 border border-emerald-700/60 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">تحميل كود المشروع ZIP</span>
            <span className="text-[10px] text-emerald-400/70 font-mono hidden md:inline">(0.96MB)</span>
          </a>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="تبديل المظهر"
            className="p-2 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-900 border border-stone-800 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-400" />}
          </button>

          {/* User Auth */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-stone-900 border border-stone-800 text-xs text-stone-200">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-5 h-5 rounded-full" />
                ) : (
                  <UserIcon className="w-4 h-4 text-emerald-400" />
                )}
                <span className="hidden sm:inline max-w-[120px] truncate">{user.displayName || user.email?.split('@')[0]}</span>
              </div>
              <button
                onClick={onSignOut}
                title="تسجيل الخروج"
                aria-label="تسجيل الخروج"
                className="p-2 rounded-lg text-stone-400 hover:text-red-400 hover:bg-stone-900 border border-stone-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-700 hover:bg-emerald-600 text-white shadow transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>تسجيل الدخول</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
