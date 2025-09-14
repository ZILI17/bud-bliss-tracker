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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      consumptions: {
        Row: {
          created_at: string
          date: string
          id: string
          note: string | null
          price: number | null
          quantity: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          note?: string | null
          price?: number | null
          quantity: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          note?: string | null
          price?: number | null
          quantity?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          age: number | null
          alternative_activities: string[] | null
          consumption_goal: string | null
          created_at: string
          default_cigarette_price: number | null
          default_cigarette_quantity: number | null
          default_hash_price: number | null
          default_hash_quantity: number | null
          default_herbe_price: number | null
          default_herbe_quantity: number | null
          goal_description: string | null
          goal_motivation: string | null
          goal_timeline: string | null
          height_cm: number | null
          id: string
          medical_conditions: string[] | null
          medications: string[] | null
          motivation_personal: string | null
          motivation_reasons: string[] | null
          onboarding_completed: boolean | null
          profile_completed: boolean | null
          support_entourage: boolean | null
          support_preference: string | null
          triggers_moments: string[] | null
          triggers_specific: string[] | null
          updated_at: string
          username: string | null
          wants_daily_suggestions: boolean | null
          weight_kg: number | null
        }
        Insert: {
          activity_level?: string | null
          age?: number | null
          alternative_activities?: string[] | null
          consumption_goal?: string | null
          created_at?: string
          default_cigarette_price?: number | null
          default_cigarette_quantity?: number | null
          default_hash_price?: number | null
          default_hash_quantity?: number | null
          default_herbe_price?: number | null
          default_herbe_quantity?: number | null
          goal_description?: string | null
          goal_motivation?: string | null
          goal_timeline?: string | null
          height_cm?: number | null
          id: string
          medical_conditions?: string[] | null
          medications?: string[] | null
          motivation_personal?: string | null
          motivation_reasons?: string[] | null
          onboarding_completed?: boolean | null
          profile_completed?: boolean | null
          support_entourage?: boolean | null
          support_preference?: string | null
          triggers_moments?: string[] | null
          triggers_specific?: string[] | null
          updated_at?: string
          username?: string | null
          wants_daily_suggestions?: boolean | null
          weight_kg?: number | null
        }
        Update: {
          activity_level?: string | null
          age?: number | null
          alternative_activities?: string[] | null
          consumption_goal?: string | null
          created_at?: string
          default_cigarette_price?: number | null
          default_cigarette_quantity?: number | null
          default_hash_price?: number | null
          default_hash_quantity?: number | null
          default_herbe_price?: number | null
          default_herbe_quantity?: number | null
          goal_description?: string | null
          goal_motivation?: string | null
          goal_timeline?: string | null
          height_cm?: number | null
          id?: string
          medical_conditions?: string[] | null
          medications?: string[] | null
          motivation_personal?: string | null
          motivation_reasons?: string[] | null
          onboarding_completed?: boolean | null
          profile_completed?: boolean | null
          support_entourage?: boolean | null
          support_preference?: string | null
          triggers_moments?: string[] | null
          triggers_specific?: string[] | null
          updated_at?: string
          username?: string | null
          wants_daily_suggestions?: boolean | null
          weight_kg?: number | null
        }
        Relationships: []
      }
      recommendations: {
        Row: {
          content: string
          created_at: string
          expires_at: string | null
          id: string
          is_read: boolean | null
          priority: number | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          priority?: number | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          priority?: number | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_personalized_recommendations: {
        Args: { user_uuid: string }
        Returns: {
          rec_content: string
          rec_priority: number
          rec_title: string
          rec_type: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
