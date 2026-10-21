export interface Surah {
  id: number;
  name_ar: string;
  name_en: string;
  name_translation: string;
  verse_count: number;
  revelation_place: 'makkah' | 'madinah';
  display_order: number;
}

export interface Verse {
  verse_key: string; // e.g. "33:72"
  surah_id: number;
  ayah_number: number;
  surah_name_ar: string;
  uthmani_text: string;
  normalized_text: string;
  source_version?: string;
}

export interface WordAnnotation {
  word_position: number;
  word_text: string;
  root?: string;
  lemma?: string;
  morphology?: string;
  annotation_source?: string;
  verification_status: 'verified' | 'provisional' | 'unavailable';
}

export type EvidenceLevel =
  | 'نص صريح'
  | 'استنتاج قوي مدعوم'
  | 'تفسير محتمل'
  | 'فرضية بحثية'
  | 'غير محسوم';

export interface VerifiedCitation {
  verse_key: string;
  surah_name: string;
  ayah_number: number;
  uthmani_text: string;
  context_relation: string; // why it's cited
  is_verified: boolean;
}

export interface ResearchResult {
  question: string;
  summary: string;
  evidence_level: EvidenceLevel;
  evidence_reasoning: string;
  primary_verses: VerifiedCitation[];
  related_verses: VerifiedCitation[];
  linguistic_analysis: {
    vocabulary: Array<{ term: string; root?: string; context_meaning: string; is_verified_root: boolean }>;
    syntactic_structures: string[];
    grammatical_notes: string;
  };
  contextual_analysis: {
    immediate_context: string;
    surah_context: string;
    holistic_quranic_context: string;
  };
  hypotheses: Array<{
    title: string;
    description: string;
    supporting_arguments: string[];
    counter_arguments: string[];
    plausibility: 'قوية' | 'متوسطة' | 'ضعيفة' | 'مردودة بالقرآن';
  }>;
  critical_refutations: string[];
  supported_conclusion: string;
  unresolved_aspects: string[];
  follow_up_questions: string[];
  verification_status: {
    total_citations: number;
    verified_citations: number;
    rejected_citations: string[];
    timestamp: string;
  };
}

export interface HypothesisRecord {
  id?: string;
  owner_id: string;
  statement: string;
  central_terms: string;
  supporting_evidence: VerifiedCitation[];
  opposing_evidence: VerifiedCitation[];
  counter_arguments: string[];
  logical_deductions: string[];
  unsettled_questions: string[];
  status: 'draft' | 'tested' | 'supported' | 'countered' | 'inconclusive';
  created_at: string;
  updated_at: string;
  revisions?: Array<{
    timestamp: string;
    statement: string;
    reason_for_change: string;
  }>;
}

export interface LexiconEntry {
  term: string;
  root: string;
  derived_forms: string[];
  occurrences_count: number;
  surahs_distribution: Array<{ surah_id: number; surah_name: string; count: number }>;
  semantic_contexts: Array<{
    context_type: string;
    meaning_in_context: string;
    sample_verses: VerifiedCitation[];
  }>;
  related_roots: string[];
}

export interface KnowledgeNode {
  id: string;
  label: string;
  type: 'concept' | 'verse' | 'surah' | 'hypothesis' | 'root';
  details?: string;
  verse_key?: string;
  x?: number;
  y?: number;
}

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  type:
    | 'اشتراك لفظي'
    | 'اشتراك جذري'
    | 'علاقة موضوعية مستنتجة'
    | 'إحالة صريحة'
    | 'تقابل دلالي'
    | 'تشابه تركيبي'
    | 'دعم فرضية'
    | 'معارضة فرضية';
  description?: string;
}

export interface ResearchCouncilMember {
  id: string;
  name: string;
  provider: 'gemini' | 'openai' | 'claude' | 'open_source';
  model_name: string;
  role_title: string;
  role_description: string;
  status: 'active' | 'disconnected' | 'planned';
}
