import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Search,
  FlaskConical,
  Compass,
  Network,
  Users,
  Folder,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile
}) => {
  const navItems = [
    { id: 'dashboard', label: 'الرئيسية', icon: LayoutDashboard, badge: '' },
    { id: 'mushaf', label: 'المصحف الذكي', icon: BookOpen, badge: '114 سورة' },
    { id: 'researcher', label: 'الباحث القرآني', icon: Search, badge: 'AI' },
    { id: 'hypothesis', label: 'مختبر الفرضيات', icon: FlaskConical, badge: 'نقض وتأييد' },
    { id: 'lexicon', label: 'المعجم القرآني', icon: Compass, badge: 'جذور' },
    { id: 'graph', label: 'خريطة الترابط', icon: Network, badge: 'تفاعلي' },
    { id: 'council', label: 'مجلس النماذج', icon: Users, badge: 'Multi-AI' },
    { id: 'library', label: 'مكتبة الأبحاث', icon: Folder, badge: '' },
    { id: 'methodology', label: 'محرك التحقق', icon: ShieldCheck, badge: 'موثق' },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-stone-950/80 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed top-16 right-0 bottom-0 z-30 w-64 border-l transition-transform duration-200 md:translate-x-0 bg-stone-950 border-stone-800 ${
          isOpenMobile ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col justify-between py-4 px-3 overflow-y-auto">
          <nav className="space-y-1">
            <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
              أدوات الاستدلال القرآني
            </div>
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 shadow-xs'
                      : 'text-stone-300 hover:text-stone-100 hover:bg-stone-900/70 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-sans font-medium ${
                        isActive
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/80'
                          : 'bg-stone-900 text-stone-400 border border-stone-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Info Card */}
          <div className="p-3 rounded-xl bg-gradient-to-b from-stone-900/60 to-stone-900/30 border border-stone-800/80 text-right">
            <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ضمان الدقة النصية</span>
            </div>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              جميع الآيات القرآنية مسترجعة من النص العثماني المحقق، ولا يُسمح للذكاء الاصطناعي بتوليد أي نص قرآني.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
