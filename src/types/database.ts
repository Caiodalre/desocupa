export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; full_name: string | null; locale: string; timezone: string; theme: string; onboarding_completed: boolean; weekly_review_day: number; worry_time_hour: string; ai_consent: boolean; created_at: string; updated_at: string };
        Insert: { id: string; full_name?: string | null; locale?: string; timezone?: string; theme?: string; onboarding_completed?: boolean; weekly_review_day?: number; worry_time_hour?: string; ai_consent?: boolean };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      obligations: {
        Row: { id: string; user_id: string; template_id: string | null; title: string; description: string | null; category_slug: string | null; due_date: string | null; recurrence_type: string; recurrence_rule: Json | null; priority: string; status: string; next_step: string | null; source_type: string; official_deadline_id: string | null; expected_confirmation_required: boolean; completed_at: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; user_id: string; template_id?: string | null; title: string; description?: string | null; category_slug?: string | null; due_date?: string | null; recurrence_type?: string; recurrence_rule?: Json | null; priority?: string; status?: string; next_step?: string | null; source_type?: string; official_deadline_id?: string | null; expected_confirmation_required?: boolean };
        Update: Partial<Database["public"]["Tables"]["obligations"]["Insert"]>;
      };
      notifications: {
        Row: { id: string; user_id: string; title: string; body: string | null; type: string; related_obligation_id: string | null; read_at: string | null; created_at: string };
        Insert: { id?: string; user_id: string; title: string; body?: string | null; type?: string; related_obligation_id?: string | null };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      worry_entries: {
        Row: { id: string; user_id: string; text: string; status: string; converted_obligation_id: string | null; created_at: string; archived_at: string | null };
        Insert: { id?: string; user_id: string; text: string; status?: string; converted_obligation_id?: string | null };
        Update: Partial<Database["public"]["Tables"]["worry_entries"]["Insert"]>;
      };
      weekly_reviews: {
        Row: { id: string; user_id: string; week_start: string; completed_at: string; notes: string | null; created_at: string };
        Insert: { id?: string; user_id: string; week_start: string; notes?: string | null };
        Update: Partial<Database["public"]["Tables"]["weekly_reviews"]["Insert"]>;
      };
      daily_priorities: {
        Row: { id: string; user_id: string; obligation_id: string | null; priority_date: string; position: number; completed_at: string | null; created_at: string };
        Insert: { id?: string; user_id: string; obligation_id?: string | null; priority_date: string; position: number; completed_at?: string | null };
        Update: Partial<Database["public"]["Tables"]["daily_priorities"]["Insert"]>;
      };
      user_roles: {
        Row: { user_id: string; role: string; created_at: string };
        Insert: { user_id: string; role?: string };
        Update: Partial<Database["public"]["Tables"]["user_roles"]["Insert"]>;
      };
      official_deadlines: {
        Row: { id: string; title: string; reference_year: number | null; category_slug: string | null; due_date: string; official_source_id: string | null; source_url: string | null; verified_at: string; verified_by: string | null; status: string; notes: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; title: string; reference_year?: number | null; category_slug?: string | null; due_date: string; official_source_id?: string | null; source_url?: string | null; verified_by?: string | null; status?: string; notes?: string | null };
        Update: Partial<Database["public"]["Tables"]["official_deadlines"]["Insert"]>;
      };
      official_sources: {
        Row: { id: string; name: string; base_url: string | null; organization: string | null; active: boolean; created_at: string; updated_at: string };
        Insert: { id?: string; name: string; base_url?: string | null; organization?: string | null; active?: boolean };
        Update: Partial<Database["public"]["Tables"]["official_sources"]["Insert"]>;
      };
      official_deadline_audit_logs: {
        Row: { id: string; official_deadline_id: string; admin_user_id: string | null; action: string; before_data: Json | null; after_data: Json | null; created_at: string };
        Insert: { id?: string; official_deadline_id: string; admin_user_id?: string | null; action: string; before_data?: Json | null; after_data?: Json | null };
        Update: Partial<Database["public"]["Tables"]["official_deadline_audit_logs"]["Insert"]>;
      };
      ai_analysis_requests: {
        Row: { id: string; user_id: string; input_redacted: string | null; status: string; model_used: string | null; tokens_input: number | null; tokens_output: number | null; created_at: string };
        Insert: { id?: string; user_id: string; input_redacted?: string | null; status?: string; model_used?: string | null; tokens_input?: number | null; tokens_output?: number | null };
        Update: Partial<Database["public"]["Tables"]["ai_analysis_requests"]["Insert"]>;
      };
      subscriptions: {
        Row: { id: string; user_id: string; plan_id: string; status: string; started_at: string; ends_at: string | null };
        Insert: { id?: string; user_id: string; plan_id: string; status?: string; started_at?: string; ends_at?: string | null };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Insert"]>;
      };
      plans: {
        Row: { id: string; code: string; name: string; monthly_price_brl: number | null; max_active_obligations: number; max_ai_analyses_per_month: number; active: boolean };
        Insert: { id?: string; code: string; name: string; monthly_price_brl?: number | null; max_active_obligations: number; max_ai_analyses_per_month?: number; active?: boolean };
        Update: Partial<Database["public"]["Tables"]["plans"]["Insert"]>;
      };
      categories: {
        Row: { id: string; name: string; slug: string; icon: string; is_system: boolean };
        Insert: { id?: string; name: string; slug: string; icon?: string; is_system?: boolean };
        Update: Partial<Database["public"]["Tables"]["categories"]["Insert"]>;
      };
      obligation_templates: {
        Row: { id: string; title: string; category_slug: string | null; description: string | null; default_recurrence: string; default_reminder_offsets: number[]; requires_official_deadline: boolean; active: boolean; checklist_defaults: string[] };
        Insert: { id?: string; title: string; category_slug?: string | null; description?: string | null; default_recurrence?: string; default_reminder_offsets?: number[]; requires_official_deadline?: boolean; active?: boolean; checklist_defaults?: string[] };
        Update: Partial<Database["public"]["Tables"]["obligation_templates"]["Insert"]>;
      };
      obligation_checklist_items: {
        Row: { id: string; obligation_id: string; user_id: string; title: string; completed: boolean; sort_order: number; created_at: string };
        Insert: { id?: string; obligation_id: string; user_id: string; title: string; completed?: boolean; sort_order?: number };
        Update: Partial<Database["public"]["Tables"]["obligation_checklist_items"]["Insert"]>;
      };
      reminders: {
        Row: { id: string; user_id: string; obligation_id: string; remind_at: string; reminder_type: string; status: string; created_at: string };
        Insert: { id?: string; user_id: string; obligation_id: string; remind_at: string; reminder_type?: string; status?: string };
        Update: Partial<Database["public"]["Tables"]["reminders"]["Insert"]>;
      };
      user_consents: {
        Row: { id: string; user_id: string; consent_type: string; version: string; accepted: boolean; accepted_at: string; revoked_at: string | null };
        Insert: { id?: string; user_id: string; consent_type: string; version?: string; accepted?: boolean; accepted_at?: string; revoked_at?: string | null };
        Update: Partial<Database["public"]["Tables"]["user_consents"]["Insert"]>;
      };
    };
  };
}
