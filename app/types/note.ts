export type Note = {
  id: string;
  user_id: string;
  parent_id: string | null;
  path: string; // e.g. "1.2.3"
  title: string;
  content: string;
  embedding: number[];
  keywords: string[];
  created_at: string;
  updated_at: string;
  metadata: {
    source: "telegram" | "web" | "api";
    chat_id?: string;
    ai_summary?: string;
    language?: string;
  };
  thread_depth: number; // computed from path
};
