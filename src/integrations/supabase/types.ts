export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      app_notifications: {
        Row: {
          challenge_id: string | null
          content: string
          created_at: string
          host_id: string | null
          id: string
          message_type: string
          read_status: boolean
          title: string
          user_id: string | null
        }
        Insert: {
          challenge_id?: string | null
          content: string
          created_at?: string
          host_id?: string | null
          id?: string
          message_type?: string
          read_status?: boolean
          title: string
          user_id?: string | null
        }
        Update: {
          challenge_id?: string | null
          content?: string
          created_at?: string
          host_id?: string | null
          id?: string
          message_type?: string
          read_status?: boolean
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_notifications_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_notifications_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      challenge_metrics: {
        Row: {
          challenge_id: string
          collection_frequency: string[] | null
          created_at: string
          description: string | null
          id: string
          metric_name: string
          metric_type: string
        }
        Insert: {
          challenge_id: string
          collection_frequency?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          metric_name: string
          metric_type: string
        }
        Update: {
          challenge_id?: string
          collection_frequency?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          metric_name?: string
          metric_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "challenge_metrics_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          challenge_type: string | null
          created_at: string
          description: string | null
          duration_days: number
          featured: boolean
          host_id: string
          id: string
          image_url: string | null
          name: string
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          challenge_type?: string | null
          created_at?: string
          description?: string | null
          duration_days?: number
          featured?: boolean
          host_id: string
          id?: string
          image_url?: string | null
          name: string
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          challenge_type?: string | null
          created_at?: string
          description?: string | null
          duration_days?: number
          featured?: boolean
          host_id?: string
          id?: string
          image_url?: string | null
          name?: string
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_host_id_fkey"
            columns: ["host_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_tasks: {
        Row: {
          challenge_id: string
          created_at: string
          day_number: number
          description: string | null
          id: string
          resource_url: string | null
          title: string
          video_url: string | null
        }
        Insert: {
          challenge_id: string
          created_at?: string
          day_number: number
          description?: string | null
          id?: string
          resource_url?: string | null
          title: string
          video_url?: string | null
        }
        Update: {
          challenge_id?: string
          created_at?: string
          day_number?: number
          description?: string | null
          id?: string
          resource_url?: string | null
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_tasks_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenge_progress: {
        Row: {
          completed_at: string
          day_number: number
          id: string
          task_id: string
          user_challenge_id: string
        }
        Insert: {
          completed_at?: string
          day_number: number
          id?: string
          task_id: string
          user_challenge_id: string
        }
        Update: {
          completed_at?: string
          day_number?: number
          id?: string
          task_id?: string
          user_challenge_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "daily_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_challenge_progress_user_challenge_id_fkey"
            columns: ["user_challenge_id"]
            isOneToOne: false
            referencedRelation: "user_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_challenges: {
        Row: {
          challenge_id: string
          challenge_status: string
          current_day: number
          id: string
          joined_at: string
          last_accessed_at: string | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          challenge_status?: string
          current_day?: number
          id?: string
          joined_at?: string
          last_accessed_at?: string | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          challenge_status?: string
          current_day?: number
          id?: string
          joined_at?: string
          last_accessed_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_challenges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_metric_data: {
        Row: {
          data_type: string
          id: string
          metric_id: string
          recorded_at: string
          user_challenge_id: string
          value_number: number | null
          value_text: string | null
        }
        Insert: {
          data_type: string
          id?: string
          metric_id: string
          recorded_at?: string
          user_challenge_id: string
          value_number?: number | null
          value_text?: string | null
        }
        Update: {
          data_type?: string
          id?: string
          metric_id?: string
          recorded_at?: string
          user_challenge_id?: string
          value_number?: number | null
          value_text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_metric_data_metric_id_fkey"
            columns: ["metric_id"]
            isOneToOne: false
            referencedRelation: "challenge_metrics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_metric_data_user_challenge_id_fkey"
            columns: ["user_challenge_id"]
            isOneToOne: false
            referencedRelation: "user_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          id: string
          last_login_at: string | null
          name: string | null
          profile_picture_url: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          bio?: string | null
          id: string
          last_login_at?: string | null
          name?: string | null
          profile_picture_url?: string | null
          role?: string
          updated_at?: string | null
        }
        Update: {
          bio?: string | null
          id?: string
          last_login_at?: string | null
          name?: string | null
          profile_picture_url?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_public_challenges: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          description: string
          image_url: string
          challenge_type: string
          host_name: string
          participant_count: number
          duration_days: number
          start_date: string
          featured: boolean
        }[]
      }
      get_user_role: {
        Args: { p_user_id: string }
        Returns: string
      }
      is_challenge_host: {
        Args: { p_challenge_id: string; p_user_id: string }
        Returns: boolean
      }
      is_challenge_participant: {
        Args: { p_user_challenge_id: string; p_user_id: string }
        Returns: boolean
      }
      join_challenge_with_initial_data: {
        Args: {
          p_challenge_id: string
          p_user_id: string
          p_initial_metrics: Json
        }
        Returns: string
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
