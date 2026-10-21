import React, { useState, useRef, useEffect } from 'react';
import {
  Network,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
  BookOpen,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';
import { KnowledgeNode, KnowledgeEdge } from '../../types/quran';

interface QuranKnowledgeGraphProps {
  onOpenVerseInMushaf: (verseKey: string) => void;
}

export const QuranKnowledgeGraph: React.FC<QuranKnowledgeGraphProps> = ({
  onOpenVerseInMushaf
}) => {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Curated interconnected Quranic Knowledge Graph nodes
  const nodes: KnowledgeNode[] = [
    { id: 'c_ibadah', label: 'مفهوم العبادة', type: 'concept', details: 'الغاية الكبرى من الخلق في الاستعمال القرآني الخالص', x: 400, y: 180 },
    { id: 'v_51_56', label: 'الذاريات 56', type: 'verse', verse_key: '51:56', details: '﴿ وما خلقت الجن والإنس إلا ليعبدون ﴾', x: 260, y: 100 },
    { id: 'v_1_5', label: 'الفاتحة 5', type: 'verse', verse_key: '1:5', details: '﴿ إياك نعبد وإياك نستعين ﴾', x: 400, y: 50 },
    { id: 'c_taah', label: 'مفهوم الطاعة', type: 'concept', details: 'الامتثال للأمر، وتأتي مقيدة للبشر ومطلقة لله ورسوله', x: 580, y: 150 },
    { id: 'v_36_60', label: 'يس 60-61', type: 'verse', verse_key: '36:60', details: '﴿ أن لا تعبدوا الشيطان... وأن اعبدوني ﴾', x: 250, y: 260 },
    { id: 'c_amanah', label: 'الأمانة والتكليف', type: 'concept', details: 'الميثاق والمسؤولية المترتب عليها الثواب والعقاب', x: 420, y: 340 },
    { id: 'v_33_72', label: 'الأحزاب 72', type: 'verse', verse_key: '33:72', details: '﴿ إنا عرضنا الأمانة على السماوات والأرض ﴾', x: 260, y: 400 },
    { id: 'r_abd', label: 'جذر (ع-ب-د)', type: 'root', details: 'التذلل والانقياد المحض، متكرر 275 مرة', x: 550, y: 260 },
    { id: 'c_ruh', label: 'مفهوم الروح', type: 'concept', details: 'أمر الله الغيبي والوحي والملك جبريل عليه السلام', x: 650, y: 350 },
    { id: 'v_17_85', label: 'الإسراء 85', type: 'verse', verse_key: '17:85', details: '﴿ ويسألونك عن الروح قل الروح من أمر ربي ﴾', x: 550, y: 440 },
    { id: 'v_43_81', label: 'الزخرف 81', type: 'verse', verse_key: '43:81', details: '﴿ إن كان للرحمن ولد فأنا أول العابدين ﴾', x: 120, y: 180 },
    { id: 'h_amanah_ikhtiyar', label: 'فرضية: الأمانة هي الاختيار', type: 'hypothesis', details: 'فرضية ترجيحية تربط بين حمل الأمانة وتميز الإنسان بحرية الإرادة', x: 140, y: 340 }
  ];

  const edges: KnowledgeEdge[] = [
    { id: 'e1', source: 'c_ibadah', target: 'v_51_56', type: 'إحالة صريحة', description: 'نص صريح في حصر غاية الخلق في العبادة' },
    { id: 'e2', source: 'c_ibadah', target: 'v_1_5', type: 'إحالة صريحة', description: 'تقديم المعمول لإفادة الحصر المطلق' },
    { id: 'e3', source: 'c_ibadah', target: 'c_taah', type: 'تقابل دلالي', description: 'الطاعة من لوازم العبادة وليست مطابقة لها في كل سياق' },
    { id: 'e4', source: 'c_ibadah', target: 'v_36_60', type: 'تقابل دلالي', description: 'تقابل عبادة الله مع عبادة الشيطان' },
    { id: 'e5', source: 'c_ibadah', target: 'r_abd', type: 'اشتراك جذري', description: 'اشتقاق لفظي من الجذر ع-ب-د' },
    { id: 'e6', source: 'c_ibadah', target: 'v_43_81', type: 'تشابه تركيبي', description: 'أسلوب الشرط المنطقي في إبطال الولد' },
    { id: 'e7', source: 'c_amanah', target: 'v_33_72', type: 'إحالة صريحة', description: 'الموضع المركزي لعرض الأمانة وإشفاق المخلوقات' },
    { id: 'e8', source: 'c_amanah', target: 'h_amanah_ikhtiyar', type: 'دعم فرضية', description: 'علاقة مستنتجة: التكليف يستلزم قدرة الاختيار' },
    { id: 'e9', source: 'v_33_72', target: 'h_amanah_ikhtiyar', type: 'معارضة فرضية', description: 'اعتراض: ذم الإنسان بالظلم والجهل يضعف حصرها بالاختيار فقط' },
    { id: 'e10', source: 'c_ruh', target: 'v_17_85', type: 'إحالة صريحة', description: 'رد علم الروح للأمر الإلهي' },
    { id: 'e11', source: 'c_ibadah', target: 'c_amanah', type: 'علاقة موضوعية مستنتجة', description: 'العبادة مقتضى الأمانة المحمولة' }
  ];

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getNodeColor = (type: KnowledgeNode['type']) => {
    switch (type) {
      case 'concept':
        return { fill: '#064e3b', stroke: '#10b981', text: '#6ee7b7' }; // Emerald
      case 'verse':
        return { fill: '#134e4a', stroke: '#14b8a6', text: '#5eead4' }; // Teal
      case 'root':
        return { fill: '#312e81', stroke: '#6366f1', text: '#a5b4fc' }; // Indigo
      case 'hypothesis':
        return { fill: '#78350f', stroke: '#f59e0b', text: '#fcd34d' }; // Amber
      default:
        return { fill: '#1c1917', stroke: '#78716c', text: '#d6d3d1' };
    }
  };

  const getEdgeStyle = (type: KnowledgeEdge['type']) => {
    switch (type) {
      case 'إحالة صريحة':
        return { stroke: '#10b981', dash: '' }; // Solid emerald
      case 'اشتراك جذري':
        return { stroke: '#6366f1', dash: '4,4' }; // Dashed indigo
      case 'علاقة موضوعية مستنتجة':
        return { stroke: '#14b8a6', dash: '6,3' }; // Dotted teal
      case 'تقابل دلالي':
        return { stroke: '#f97316', dash: '' }; // Orange
      case 'دعم فرضية':
        return { stroke: '#22c55e', dash: '3,3' }; // Green
      case 'معارضة فرضية':
        return { stroke: '#ef4444', dash: '5,5' }; // Red
      default:
        return { stroke: '#78716c', dash: '' };
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 text-right">
      
      {/* Header */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-950/40 via-stone-900 to-stone-900 border border-indigo-900/50 space-y-2">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
          <Network className="w-5 h-5" />
          <h2>خريطة الترابط القرآني (Knowledge Graph)</h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
          شبكة استدلالية بصرية توضح الروابط بين المفاهيم المركزية، ونصوص الآيات، والجذور، والفرضيات. تلتزم المنصة بعدم عرض العلاقات الدلالية المستنتجة بوصفها حقائق نصية قطعية.
        </p>
      </div>

      {/* Graph Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-900/80 p-3 rounded-2xl border border-stone-800">
        
        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600" />
            <span className="text-stone-300">مفهوم</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-teal-500" />
            <span className="text-stone-300">آية محققة</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500" />
            <span className="text-stone-300">جذر لغوي</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-stone-300">فرضية بحثية</span>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.15))}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200"
            title="تصغير"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-[11px] px-2 text-stone-400 font-mono">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => setZoomLevel(prev => Math.min(1.8, prev + 0.15))}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200"
            title="تكبير"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setZoomLevel(1); setPan({ x: 0, y: 0 }); }}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200"
            title="إعادة الضبط"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* SVG Canvas Area */}
      <div className="relative rounded-2xl bg-stone-950 border border-stone-800 overflow-hidden h-[480px] cursor-grab active:cursor-grabbing select-none">
        
        <svg
          className="w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoomLevel})`}>
            
            {/* Edges */}
            {edges.map(e => {
              const srcNode = nodes.find(n => n.id === e.source);
              const tgtNode = nodes.find(n => n.id === e.target);
              if (!srcNode || !tgtNode) return null;

              const style = getEdgeStyle(e.type);
              return (
                <g key={e.id}>
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={style.stroke}
                    strokeWidth={1.5}
                    strokeDasharray={style.dash}
                    opacity={0.7}
                  />
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map(n => {
              const color = getNodeColor(n.type);
              const isSelected = selectedNode?.id === n.id;
              return (
                <g
                  key={n.id}
                  transform={`translate(${n.x}, ${n.y})`}
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedNode(n);
                  }}
                  className="cursor-pointer group"
                >
                  <circle
                    r={isSelected ? 26 : 22}
                    fill={color.fill}
                    stroke={isSelected ? '#ffffff' : color.stroke}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                    className="transition-all"
                  />
                  <text
                    y={34}
                    textAnchor="middle"
                    fill={color.text}
                    fontSize={11}
                    fontWeight="bold"
                    className="pointer-events-none font-sans"
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}

          </g>
        </svg>

        {/* Selected Node Overlay Card */}
        {selectedNode && (
          <div className="absolute bottom-4 right-4 max-w-sm rounded-xl p-4 bg-stone-900/95 border border-stone-700 shadow-2xl text-right space-y-2 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <span className="text-xs font-bold text-stone-100">{selectedNode.label}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-950 text-emerald-400 border border-emerald-900">
                {selectedNode.type}
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed font-sans">{selectedNode.details}</p>
            
            {selectedNode.verse_key && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onOpenVerseInMushaf(selectedNode.verse_key!)}
                  className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>فتح الآية في المصحف</span>
                </button>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};
