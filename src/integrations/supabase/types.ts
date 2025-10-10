export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

  
export type Database1 = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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


export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bias_quiz_questions: {
        Row: {
          created_at: string
          headline: string
          id: string
          image_filename: string
          module_id: string
          question_number: number
        }
        Insert: {
          created_at?: string
          headline: string
          id?: string
          image_filename: string
          module_id: string
          question_number: number
        }
        Update: {
          created_at?: string
          headline?: string
          id?: string
          image_filename?: string
          module_id?: string
          question_number?: number
        }
        Relationships: []
      }
      connect_dots_answers: {
        Row: {
          answer_number: number
          created_at: string
          explanation: string
          id: string
          question_id: string
          title: string
        }
        Insert: {
          answer_number: number
          created_at?: string
          explanation: string
          id?: string
          question_id: string
          title: string
        }
        Update: {
          answer_number?: number
          created_at?: string
          explanation?: string
          id?: string
          question_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "connect_dots_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "connect_dots_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      connect_dots_questions: {
        Row: {
          correct_answer: number
          created_at: string
          headline: string
          id: string
          module_id: string
          question_number: number
          question_text: string
          tiktok_image_filename: string
        }
        Insert: {
          correct_answer: number
          created_at?: string
          headline: string
          id?: string
          module_id: string
          question_number: number
          question_text: string
          tiktok_image_filename: string
        }
        Update: {
          correct_answer?: number
          created_at?: string
          headline?: string
          id?: string
          module_id?: string
          question_number?: number
          question_text?: string
          tiktok_image_filename?: string
        }
        Relationships: []
      }
      modules: {
        Row: {
          created_at: string
          description: string
          duration_minutes: number
          id: string
          level: string
          max_score: number
          module_number: string
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          description: string
          duration_minutes: number
          id?: string
          level: string
          max_score?: number
          module_number: string
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          duration_minutes?: number
          id?: string
          level?: string
          max_score?: number
          module_number?: string
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          correct_answer: number
          created_at: string
          id: string
          module_id: string
          post1_author: string
          post1_comments: number
          post1_content: string
          post1_handle: string
          post1_image_url: string | null
          post1_likes: number
          post1_shares: number
          post2_author: string
          post2_comments: number
          post2_content: string
          post2_handle: string
          post2_image_url: string | null
          post2_likes: number
          post2_shares: number
          question_number: number
        }
        Insert: {
          correct_answer: number
          created_at?: string
          id?: string
          module_id: string
          post1_author: string
          post1_comments?: number
          post1_content: string
          post1_handle: string
          post1_image_url?: string | null
          post1_likes?: number
          post1_shares?: number
          post2_author: string
          post2_comments?: number
          post2_content: string
          post2_handle: string
          post2_image_url?: string | null
          post2_likes?: number
          post2_shares?: number
          question_number: number
        }
        Update: {
          correct_answer?: number
          created_at?: string
          id?: string
          module_id?: string
          post1_author?: string
          post1_comments?: number
          post1_content?: string
          post1_handle?: string
          post1_image_url?: string | null
          post1_likes?: number
          post1_shares?: number
          post2_author?: string
          post2_comments?: number
          post2_content?: string
          post2_handle?: string
          post2_image_url?: string | null
          post2_likes?: number
          post2_shares?: number
          question_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed: boolean
          completed_at: string | null
          current_question: number
          id: string
          module_id: string
          score: number
          started_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          current_question?: number
          id?: string
          module_id: string
          score?: number
          started_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          current_question?: number
          id?: string
          module_id?: string
          score?: number
          started_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

