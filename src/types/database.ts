export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      ai_analysis_requests: {
        Row: {
          created_at: string | null
          id: string
          input_redacted: string | null
          model_used: string | null
          status: string | null
          tokens_input: number | null
          tokens_output: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          input_redacted?: string | null
          model_used?: string | null
          status?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          input_redacted?: string | null
          model_used?: string | null
          status?: string | null
          tokens_input?: number | null
          tokens_output?: number | null
          user_id?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string | null
          icon: string | null
          id: string
          is_system: boolean | null
          name: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          icon?: string | null
          id?: string
          is_system?: boolean | null
          name: string
          slug: string
        }
        Update: {
          created_at?: string | null
          icon?: string | null
          id?: string
          is_system?: boolean | null
          name?: string
          slug?: string
        }
        Relationships: []
      }
      daily_priorities: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          obligation_id: string | null
          position: number | null
          priority_date: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          obligation_id?: string | null
          position?: number | null
          priority_date: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          obligation_id?: string | null
          position?: number | null
          priority_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_priorities_obligation_id_fkey"
            columns: ["obligation_id"]
            isOneToOne: false
            referencedRelation: "obligations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          read_at: string | null
          related_obligation_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"] | null
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          read_at?: string | null
          related_obligation_id?: string | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          read_at?: string | null
          related_obligation_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_obligation_id_fkey"
            columns: ["related_obligation_id"]
            isOneToOne: false
            referencedRelation: "obligations"
            referencedColumns: ["id"]
          },
        ]
      }
      obligation_checklist_items: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          obligation_id: string
          sort_order: number | null
          title: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          obligation_id: string
          sort_order?: number | null
          title: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          obligation_id?: string
          sort_order?: number | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "obligation_checklist_items_obligation_id_fkey"
            columns: ["obligation_id"]
            isOneToOne: false
            referencedRelation: "obligations"
            referencedColumns: ["id"]
          },
        ]
      }
      obligation_templates: {
        Row: {
          active: boolean | null
          category_slug: string | null
          checklist_defaults: string[] | null
          created_at: string | null
          default_recurrence:
            | Database["public"]["Enums"]["recurrence_type"]
            | null
          default_reminder_offsets: number[] | null
          description: string | null
          id: string
          requires_official_deadline: boolean | null
          title: string
        }
        Insert: {
          active?: boolean | null
          category_slug?: string | null
          checklist_defaults?: string[] | null
          created_at?: string | null
          default_recurrence?:
            | Database["public"]["Enums"]["recurrence_type"]
            | null
          default_reminder_offsets?: number[] | null
          description?: string | null
          id?: string
          requires_official_deadline?: boolean | null
          title: string
        }
        Update: {
          active?: boolean | null
          category_slug?: string | null
          checklist_defaults?: string[] | null
          created_at?: string | null
          default_recurrence?:
            | Database["public"]["Enums"]["recurrence_type"]
            | null
          default_reminder_offsets?: number[] | null
          description?: string | null
          id?: string
          requires_official_deadline?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "obligation_templates_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
        ]
      }
      obligations: {
        Row: {
          category_slug: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          expected_confirmation_required: boolean | null
          id: string
          next_step: string | null
          official_deadline_id: string | null
          priority: Database["public"]["Enums"]["priority_level"] | null
          recurrence_rule: Json | null
          recurrence_type: Database["public"]["Enums"]["recurrence_type"] | null
          source_type: Database["public"]["Enums"]["obligation_source"] | null
          status: Database["public"]["Enums"]["obligation_status"] | null
          template_id: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category_slug?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          expected_confirmation_required?: boolean | null
          id?: string
          next_step?: string | null
          official_deadline_id?: string | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          recurrence_rule?: Json | null
          recurrence_type?:
            | Database["public"]["Enums"]["recurrence_type"]
            | null
          source_type?: Database["public"]["Enums"]["obligation_source"] | null
          status?: Database["public"]["Enums"]["obligation_status"] | null
          template_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category_slug?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          expected_confirmation_required?: boolean | null
          id?: string
          next_step?: string | null
          official_deadline_id?: string | null
          priority?: Database["public"]["Enums"]["priority_level"] | null
          recurrence_rule?: Json | null
          recurrence_type?:
            | Database["public"]["Enums"]["recurrence_type"]
            | null
          source_type?: Database["public"]["Enums"]["obligation_source"] | null
          status?: Database["public"]["Enums"]["obligation_status"] | null
          template_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "obligations_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "obligations_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "obligation_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      official_deadline_audit_logs: {
        Row: {
          action: string
          admin_user_id: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string | null
          id: string
          official_deadline_id: string | null
        }
        Insert: {
          action: string
          admin_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string | null
          id?: string
          official_deadline_id?: string | null
        }
        Update: {
          action?: string
          admin_user_id?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string | null
          id?: string
          official_deadline_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "official_deadline_audit_logs_official_deadline_id_fkey"
            columns: ["official_deadline_id"]
            isOneToOne: false
            referencedRelation: "official_deadlines"
            referencedColumns: ["id"]
          },
        ]
      }
      official_deadlines: {
        Row: {
          category_slug: string | null
          created_at: string | null
          due_date: string
          id: string
          notes: string | null
          official_source_id: string | null
          reference_year: number | null
          source_url: string | null
          status: Database["public"]["Enums"]["deadline_status"] | null
          title: string
          updated_at: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          category_slug?: string | null
          created_at?: string | null
          due_date: string
          id?: string
          notes?: string | null
          official_source_id?: string | null
          reference_year?: number | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["deadline_status"] | null
          title: string
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          category_slug?: string | null
          created_at?: string | null
          due_date?: string
          id?: string
          notes?: string | null
          official_source_id?: string | null
          reference_year?: number | null
          source_url?: string | null
          status?: Database["public"]["Enums"]["deadline_status"] | null
          title?: string
          updated_at?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "official_deadlines_category_slug_fkey"
            columns: ["category_slug"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["slug"]
          },
          {
            foreignKeyName: "official_deadlines_official_source_id_fkey"
            columns: ["official_source_id"]
            isOneToOne: false
            referencedRelation: "official_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      official_sources: {
        Row: {
          active: boolean | null
          base_url: string | null
          created_at: string | null
          id: string
          name: string
          organization: string | null
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          base_url?: string | null
          created_at?: string | null
          id?: string
          name: string
          organization?: string | null
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          base_url?: string | null
          created_at?: string | null
          id?: string
          name?: string
          organization?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      plans: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          id: string
          max_active_obligations: number
          max_ai_analyses_per_month: number | null
          monthly_price_brl: number | null
          name: string
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          id?: string
          max_active_obligations: number
          max_ai_analyses_per_month?: number | null
          monthly_price_brl?: number | null
          name: string
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          id?: string
          max_active_obligations?: number
          max_ai_analyses_per_month?: number | null
          monthly_price_brl?: number | null
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ai_consent: boolean | null
          created_at: string | null
          full_name: string | null
          id: string
          locale: string | null
          onboarding_completed: boolean | null
          theme: string | null
          timezone: string | null
          updated_at: string | null
          weekly_review_day: number | null
          worry_time_hour: string | null
        }
        Insert: {
          ai_consent?: boolean | null
          created_at?: string | null
          full_name?: string | null
          id: string
          locale?: string | null
          onboarding_completed?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          weekly_review_day?: number | null
          worry_time_hour?: string | null
        }
        Update: {
          ai_consent?: boolean | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          locale?: string | null
          onboarding_completed?: boolean | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
          weekly_review_day?: number | null
          worry_time_hour?: string | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string | null
          id: string
          obligation_id: string
          remind_at: string
          reminder_type: string | null
          status: Database["public"]["Enums"]["reminder_status"] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          obligation_id: string
          remind_at: string
          reminder_type?: string | null
          status?: Database["public"]["Enums"]["reminder_status"] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          obligation_id?: string
          remind_at?: string
          reminder_type?: string | null
          status?: Database["public"]["Enums"]["reminder_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reminders_obligation_id_fkey"
            columns: ["obligation_id"]
            isOneToOne: false
            referencedRelation: "obligations"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          ends_at: string | null
          id: string
          plan_id: string | null
          started_at: string | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          plan_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          plan_id?: string | null
          started_at?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_consents: {
        Row: {
          accepted: boolean | null
          accepted_at: string | null
          consent_type: Database["public"]["Enums"]["consent_type"]
          id: string
          revoked_at: string | null
          user_id: string
          version: string
        }
        Insert: {
          accepted?: boolean | null
          accepted_at?: string | null
          consent_type: Database["public"]["Enums"]["consent_type"]
          id?: string
          revoked_at?: string | null
          user_id: string
          version?: string
        }
        Update: {
          accepted?: boolean | null
          accepted_at?: string | null
          consent_type?: Database["public"]["Enums"]["consent_type"]
          id?: string
          revoked_at?: string | null
          user_id?: string
          version?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          role: Database["public"]["Enums"]["user_role_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          role?: Database["public"]["Enums"]["user_role_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          role?: Database["public"]["Enums"]["user_role_type"]
          user_id?: string
        }
        Relationships: []
      }
      weekly_reviews: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          notes: string | null
          user_id: string
          week_start: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          user_id: string
          week_start: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          user_id?: string
          week_start?: string
        }
        Relationships: []
      }
      worry_entries: {
        Row: {
          archived_at: string | null
          converted_obligation_id: string | null
          created_at: string | null
          id: string
          status: Database["public"]["Enums"]["worry_status"] | null
          text: string
          user_id: string
        }
        Insert: {
          archived_at?: string | null
          converted_obligation_id?: string | null
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["worry_status"] | null
          text: string
          user_id: string
        }
        Update: {
          archived_at?: string | null
          converted_obligation_id?: string | null
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["worry_status"] | null
          text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "worry_entries_converted_obligation_id_fkey"
            columns: ["converted_obligation_id"]
            isOneToOne: false
            referencedRelation: "obligations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      consent_type: "ai_processing" | "privacy_policy" | "terms_of_service"
      deadline_status: "draft" | "published" | "archived"
      notification_type: "reminder" | "deadline_alert" | "system" | "review"
      obligation_source:
        | "manual"
        | "onboarding"
        | "ai"
        | "template"
        | "official"
      obligation_status: "active" | "completed" | "archived" | "deferred"
      priority_level: "low" | "medium" | "high"
      recurrence_type:
        | "none"
        | "daily"
        | "weekly"
        | "biweekly"
        | "monthly"
        | "bimonthly"
        | "quarterly"
        | "semiannual"
        | "annual"
        | "custom"
      reminder_status: "pending" | "sent" | "dismissed"
      subscription_status: "active" | "inactive" | "trial" | "expired"
      user_role_type: "user" | "admin"
      worry_status: "inbox" | "converted" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      consent_type: ["ai_processing", "privacy_policy", "terms_of_service"],
      deadline_status: ["draft", "published", "archived"],
      notification_type: ["reminder", "deadline_alert", "system", "review"],
      obligation_source: ["manual", "onboarding", "ai", "template", "official"],
      obligation_status: ["active", "completed", "archived", "deferred"],
      priority_level: ["low", "medium", "high"],
      recurrence_type: [
        "none",
        "daily",
        "weekly",
        "biweekly",
        "monthly",
        "bimonthly",
        "quarterly",
        "semiannual",
        "annual",
        "custom",
      ],
      reminder_status: ["pending", "sent", "dismissed"],
      subscription_status: ["active", "inactive", "trial", "expired"],
      user_role_type: ["user", "admin"],
      worry_status: ["inbox", "converted", "archived"],
    },
  },
} as const
