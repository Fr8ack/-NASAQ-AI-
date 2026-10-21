/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/home/Dashboard';
import { SmartMushaf } from './components/mushaf/SmartMushaf';
import { QuranResearcher } from './components/search/QuranResearcher';
import { HypothesisLab } from './components/hypothesis/HypothesisLab';
import { QuranLexicon } from './components/lexicon/QuranLexicon';
import { QuranKnowledgeGraph } from './components/graph/QuranKnowledgeGraph';
import { MultiAiCouncil } from './components/council/MultiAiCouncil';
import { ResearchLibrary } from './components/library/ResearchLibrary';
import { MethodologySpecs } from './components/methodology/MethodologySpecs';
import { AuthModal } from './components/modals/AuthModal';
import { auth, onAuthStateChanged, signOut, User } from './lib/firebase';
import {
  fetchUserResearches,
  getLocalBookmarks,
  SavedResearchItem,
  SavedBookmark
} from './services/researchStore';
import {
  LayoutDashboard,
  BookOpen,
  Search,
  FlaskConical,
  Folder,
  Menu,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(true);

  // Cross-component coordination state
  const [researchQuery, setResearchQuery] = useState<string>('');
  const [targetVerseKey, setTargetVerseKey] = useState<string>('1:1');
  const [hypothesisStatement, setHypothesisStatement] = useState<string>('');

  // Persisted data
  const [recentResearches, setRecentResearches] = useState<SavedResearchItem[]>([]);
  const [bookmarks, setBookmarks] = useState<SavedBookmark[]>([]);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      refreshUserData(currentUser?.uid || null);
    });
    return () => unsubscribe();
  }, []);

  const refreshUserData = async (uid: string | null) => {
    try {
      const items = await fetchUserResearches(uid);
      setRecentResearches(items);
      const bmarks = getLocalBookmarks();
      setBookmarks(bmarks);
    } catch (e) {
      console.warn("Failed to refresh user data:", e);
    }
  };

  // Launch research from dashboard or methodology
  const handleLaunchResearch = (queryText: string) => {
    setResearchQuery(queryText);
    setActiveTab('researcher');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Analyze verse from Mushaf
  const handleAnalyzeVerse = (verseText: string, verseKey: string, surahName: string) => {
    const q = `ما دلالة قوله تعالى ﴿ ${verseText} ﴾ في سورة ${surahName} (${verseKey}) وما سياقها الداخلي ونظائرها في القرآن؟`;
    handleLaunchResearch(q);
  };

  // Open verse in Mushaf from citations
  const handleOpenVerseInMushaf = (verseKey: string) => {
    setTargetVerseKey(verseKey);
    setActiveTab('mushaf');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open in Hypothesis Lab
  const handleOpenInHypothesisLab = (statement: string) => {
    setHypothesisStatement(statement);
    setActiveTab('hypothesis');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTheme = () => {
    setIsDark(prev => !prev);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      refreshUserData(null);
    } catch (e) {
      console.error("Sign out failed:", e);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-stone-950 text-stone-100' : 'bg-stone-100 text-stone-900'} transition-colors font-sans`} dir="rtl">
      
      {/* Top Header */}
      <Header
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      <div className="flex">
        {/* Desktop & Mobile Drawer Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpenMobile={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Pane */}
        <main className="flex-1 md:mr-64 p-4 sm:p-6 lg:p-8 pb-24 md:pb-12 max-w-7xl mx-auto overflow-x-hidden min-h-[calc(100vh-4rem)]">
          
          {/* Mobile Top Sub-bar */}
          <div className="flex md:hidden items-center justify-between pb-4 mb-4 border-b border-stone-800">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="flex items-center gap-2 p-2 rounded-xl bg-stone-900 text-stone-300 border border-stone-800"
            >
              <Menu className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-semibold">قائمة الأدوات</span>
            </button>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>القرآن بالقرآن</span>
            </div>
          </div>

          {/* Active Tab Views */}
          {activeTab === 'dashboard' && (
            <Dashboard
              onSelectTab={setActiveTab}
              onLaunchResearch={handleLaunchResearch}
              recentResearches={recentResearches}
            />
          )}

          {activeTab === 'mushaf' && (
            <SmartMushaf
              user={user}
              onAnalyzeVerse={handleAnalyzeVerse}
              initialVerseKey={targetVerseKey}
            />
          )}

          {activeTab === 'researcher' && (
            <QuranResearcher
              user={user}
              initialQuery={researchQuery}
              onOpenVerseInMushaf={handleOpenVerseInMushaf}
              onOpenInHypothesisLab={handleOpenInHypothesisLab}
              onSaveSuccess={() => refreshUserData(user?.uid || null)}
            />
          )}

          {activeTab === 'hypothesis' && (
            <HypothesisLab
              user={user}
              initialStatement={hypothesisStatement}
              onOpenVerseInMushaf={handleOpenVerseInMushaf}
            />
          )}

          {activeTab === 'lexicon' && (
            <QuranLexicon
              onOpenVerseInMushaf={handleOpenVerseInMushaf}
            />
          )}

          {activeTab === 'graph' && (
            <QuranKnowledgeGraph
              onOpenVerseInMushaf={handleOpenVerseInMushaf}
            />
          )}

          {activeTab === 'council' && (
            <MultiAiCouncil />
          )}

          {activeTab === 'library' && (
            <ResearchLibrary
              user={user}
              onOpenAuth={() => setIsAuthModalOpen(true)}
              researches={recentResearches}
              bookmarks={bookmarks}
              onSelectResearch={item => {
                setResearchQuery(item.question);
                setActiveTab('researcher');
              }}
              onOpenVerseInMushaf={handleOpenVerseInMushaf}
              onRefresh={() => refreshUserData(user?.uid || null)}
            />
          )}

          {activeTab === 'methodology' && (
            <MethodologySpecs
              onRunTestCase={handleLaunchResearch}
            />
          )}

        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-stone-950/95 border-t border-stone-800 backdrop-blur-md px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] ${
            activeTab === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-stone-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>الرئيسية</span>
        </button>

        <button
          onClick={() => setActiveTab('mushaf')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] ${
            activeTab === 'mushaf' ? 'text-emerald-400 font-bold' : 'text-stone-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>المصحف</span>
        </button>

        <button
          onClick={() => setActiveTab('researcher')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] ${
            activeTab === 'researcher' ? 'text-emerald-400 font-bold' : 'text-stone-400'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>الباحث</span>
        </button>

        <button
          onClick={() => setActiveTab('hypothesis')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] ${
            activeTab === 'hypothesis' ? 'text-emerald-400 font-bold' : 'text-stone-400'
          }`}
        >
          <FlaskConical className="w-4 h-4" />
          <span>الفرضيات</span>
        </button>

        <button
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] ${
            activeTab === 'library' ? 'text-emerald-400 font-bold' : 'text-stone-400'
          }`}
        >
          <Folder className="w-4 h-4" />
          <span>مكتبتي</span>
        </button>
      </nav>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        user={user}
      />

    </div>
  );
}
