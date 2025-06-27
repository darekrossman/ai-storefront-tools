export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      brands: {
        Row: {
          brand_archetype: string | null
          brand_tone: string | null
          brand_voice: string | null
          category: string | null
          color_scheme: string[] | null
          communication_style: string | null
          competitive_advantages: string[] | null
          created_at: string
          design_principles: string[] | null
          differentiation: string | null
          id: number
          imagery_guidelines: string[] | null
          imagery_mood: string | null
          imagery_style: string | null
          logo_description: string | null
          logo_url: string | null
          market_position: string | null
          mission: string | null
          name: string
          personality_traits: string[] | null
          price_point: Database["public"]["Enums"]["price_point"] | null
          slug: string
          status: Database["public"]["Enums"]["brand_status"]
          tagline: string | null
          target_age_range: string | null
          target_education: string | null
          target_income: string | null
          target_interests: string[] | null
          target_lifestyle: string | null
          target_location: string | null
          target_needs: string[] | null
          target_pain_points: string[] | null
          target_personality_traits: string[] | null
          target_values: string[] | null
          typography_accent: string | null
          typography_primary: string | null
          typography_secondary: string | null
          updated_at: string
          user_id: string
          values: string[] | null
          vision: string | null
        }
        Insert: {
          brand_archetype?: string | null
          brand_tone?: string | null
          brand_voice?: string | null
          category?: string | null
          color_scheme?: string[] | null
          communication_style?: string | null
          competitive_advantages?: string[] | null
          created_at?: string
          design_principles?: string[] | null
          differentiation?: string | null
          id?: never
          imagery_guidelines?: string[] | null
          imagery_mood?: string | null
          imagery_style?: string | null
          logo_description?: string | null
          logo_url?: string | null
          market_position?: string | null
          mission?: string | null
          name: string
          personality_traits?: string[] | null
          price_point?: Database["public"]["Enums"]["price_point"] | null
          slug: string
          status?: Database["public"]["Enums"]["brand_status"]
          tagline?: string | null
          target_age_range?: string | null
          target_education?: string | null
          target_income?: string | null
          target_interests?: string[] | null
          target_lifestyle?: string | null
          target_location?: string | null
          target_needs?: string[] | null
          target_pain_points?: string[] | null
          target_personality_traits?: string[] | null
          target_values?: string[] | null
          typography_accent?: string | null
          typography_primary?: string | null
          typography_secondary?: string | null
          updated_at?: string
          user_id: string
          values?: string[] | null
          vision?: string | null
        }
        Update: {
          brand_archetype?: string | null
          brand_tone?: string | null
          brand_voice?: string | null
          category?: string | null
          color_scheme?: string[] | null
          communication_style?: string | null
          competitive_advantages?: string[] | null
          created_at?: string
          design_principles?: string[] | null
          differentiation?: string | null
          id?: never
          imagery_guidelines?: string[] | null
          imagery_mood?: string | null
          imagery_style?: string | null
          logo_description?: string | null
          logo_url?: string | null
          market_position?: string | null
          mission?: string | null
          name?: string
          personality_traits?: string[] | null
          price_point?: Database["public"]["Enums"]["price_point"] | null
          slug?: string
          status?: Database["public"]["Enums"]["brand_status"]
          tagline?: string | null
          target_age_range?: string | null
          target_education?: string | null
          target_income?: string | null
          target_interests?: string[] | null
          target_lifestyle?: string | null
          target_location?: string | null
          target_needs?: string[] | null
          target_pain_points?: string[] | null
          target_personality_traits?: string[] | null
          target_values?: string[] | null
          typography_accent?: string | null
          typography_primary?: string | null
          typography_secondary?: string | null
          updated_at?: string
          user_id?: string
          values?: string[] | null
          vision?: string | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          catalog_id: string
          category_id: string
          created_at: string
          description: string
          id: number
          is_active: boolean
          metadata: Json | null
          name: string
          parent_category_id: string | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          catalog_id: string
          category_id: string
          created_at?: string
          description: string
          id?: never
          is_active?: boolean
          metadata?: Json | null
          name: string
          parent_category_id?: string | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          catalog_id?: string
          category_id?: string
          created_at?: string
          description?: string
          id?: never
          is_active?: boolean
          metadata?: Json | null
          name?: string
          parent_category_id?: string | null
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "categories_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "product_catalogs"
            referencedColumns: ["catalog_id"]
          },
          {
            foreignKeyName: "categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
      job_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          data: Json | null
          id: string
          job_id: string
          message: string | null
          progress_percent: number | null
          started_at: string | null
          status: string
          step_name: string
          step_order: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          job_id: string
          message?: string | null
          progress_percent?: number | null
          started_at?: string | null
          status?: string
          step_name: string
          step_order: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          job_id?: string
          message?: string | null
          progress_percent?: number | null
          started_at?: string | null
          status?: string
          step_name?: string
          step_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "job_progress_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_queue"
            referencedColumns: ["id"]
          },
        ]
      }
      job_queue: {
        Row: {
          actual_duration_seconds: number | null
          catalog_id: string | null
          completed_at: string | null
          created_at: string
          error_data: Json | null
          estimated_duration_seconds: number | null
          id: string
          input_data: Json
          job_type: string
          output_data: Json | null
          priority: number
          progress_message: string | null
          progress_percent: number | null
          started_at: string | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          actual_duration_seconds?: number | null
          catalog_id?: string | null
          completed_at?: string | null
          created_at?: string
          error_data?: Json | null
          estimated_duration_seconds?: number | null
          id?: string
          input_data: Json
          job_type: string
          output_data?: Json | null
          priority?: number
          progress_message?: string | null
          progress_percent?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          actual_duration_seconds?: number | null
          catalog_id?: string | null
          completed_at?: string | null
          created_at?: string
          error_data?: Json | null
          estimated_duration_seconds?: number | null
          id?: string
          input_data?: Json
          job_type?: string
          output_data?: Json | null
          priority?: number
          progress_message?: string | null
          progress_percent?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_queue_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "product_catalogs"
            referencedColumns: ["catalog_id"]
          },
        ]
      }
      product_attribute_schemas: {
        Row: {
          attribute_key: string
          attribute_label: string
          attribute_type: string
          created_at: string
          default_value: Json | null
          help_text: string | null
          id: number
          is_required: boolean
          is_variant_defining: boolean
          options: Json | null
          product_id: number
          sort_order: number
          updated_at: string
          validation_rules: Json | null
        }
        Insert: {
          attribute_key: string
          attribute_label: string
          attribute_type: string
          created_at?: string
          default_value?: Json | null
          help_text?: string | null
          id?: never
          is_required?: boolean
          is_variant_defining?: boolean
          options?: Json | null
          product_id: number
          sort_order?: number
          updated_at?: string
          validation_rules?: Json | null
        }
        Update: {
          attribute_key?: string
          attribute_label?: string
          attribute_type?: string
          created_at?: string
          default_value?: Json | null
          help_text?: string | null
          id?: never
          is_required?: boolean
          is_variant_defining?: boolean
          options?: Json | null
          product_id?: number
          sort_order?: number
          updated_at?: string
          validation_rules?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "product_attribute_schemas_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_catalogs: {
        Row: {
          brand_id: number
          catalog_id: string
          created_at: string
          description: string | null
          id: number
          name: string
          settings: Json | null
          slug: string
          status: Database["public"]["Enums"]["brand_status"]
          total_categories: number
          total_products: number
          updated_at: string
        }
        Insert: {
          brand_id: number
          catalog_id: string
          created_at?: string
          description?: string | null
          id?: never
          name: string
          settings?: Json | null
          slug: string
          status?: Database["public"]["Enums"]["brand_status"]
          total_categories?: number
          total_products?: number
          updated_at?: string
        }
        Update: {
          brand_id?: number
          catalog_id?: string
          created_at?: string
          description?: string | null
          id?: never
          name?: string
          settings?: Json | null
          slug?: string
          status?: Database["public"]["Enums"]["brand_status"]
          total_categories?: number
          total_products?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_catalogs_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          aspect_ratio: number | null
          attribute_filters: Json | null
          color_id: string | null
          created_at: string
          height: number | null
          id: number
          product_id: number
          prompt: string | null
          seed: number | null
          sort_order: number
          type: string
          updated_at: string
          url: string
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          aspect_ratio?: number | null
          attribute_filters?: Json | null
          color_id?: string | null
          created_at?: string
          height?: number | null
          id?: never
          product_id: number
          prompt?: string | null
          seed?: number | null
          sort_order?: number
          type?: string
          updated_at?: string
          url: string
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          aspect_ratio?: number | null
          attribute_filters?: Json | null
          color_id?: string | null
          created_at?: string
          height?: number | null
          id?: never
          product_id?: number
          prompt?: string | null
          seed?: number | null
          sort_order?: number
          type?: string
          updated_at?: string
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          attributes: Json
          barcode: string | null
          compare_at_price: number | null
          cost_per_item: number | null
          created_at: string
          id: number
          inventory_count: number | null
          inventory_policy: string | null
          inventory_tracked: boolean | null
          is_active: boolean
          price: number
          product_id: number
          sku: string
          sort_order: number
          status: Database["public"]["Enums"]["brand_status"]
          updated_at: string
          weight: number | null
          weight_unit: string | null
        }
        Insert: {
          attributes?: Json
          barcode?: string | null
          compare_at_price?: number | null
          cost_per_item?: number | null
          created_at?: string
          id?: never
          inventory_count?: number | null
          inventory_policy?: string | null
          inventory_tracked?: boolean | null
          is_active?: boolean
          price: number
          product_id: number
          sku: string
          sort_order?: number
          status?: Database["public"]["Enums"]["brand_status"]
          updated_at?: string
          weight?: number | null
          weight_unit?: string | null
        }
        Update: {
          attributes?: Json
          barcode?: string | null
          compare_at_price?: number | null
          cost_per_item?: number | null
          created_at?: string
          id?: never
          inventory_count?: number | null
          inventory_policy?: string | null
          inventory_tracked?: boolean | null
          is_active?: boolean
          price?: number
          product_id?: number
          sku?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["brand_status"]
          updated_at?: string
          weight?: number | null
          weight_unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          active_variant_count: number | null
          base_attributes: Json
          catalog_id: string
          created_at: string
          description: string
          id: number
          max_price: number | null
          meta_description: string | null
          meta_title: string | null
          min_price: number | null
          name: string
          parent_category_id: string | null
          short_description: string
          sort_order: number
          specifications: Json
          status: Database["public"]["Enums"]["brand_status"]
          tags: string[] | null
          updated_at: string
          variant_count: number | null
        }
        Insert: {
          active_variant_count?: number | null
          base_attributes?: Json
          catalog_id: string
          created_at?: string
          description: string
          id?: never
          max_price?: number | null
          meta_description?: string | null
          meta_title?: string | null
          min_price?: number | null
          name: string
          parent_category_id?: string | null
          short_description: string
          sort_order?: number
          specifications?: Json
          status?: Database["public"]["Enums"]["brand_status"]
          tags?: string[] | null
          updated_at?: string
          variant_count?: number | null
        }
        Update: {
          active_variant_count?: number | null
          base_attributes?: Json
          catalog_id?: string
          created_at?: string
          description?: string
          id?: never
          max_price?: number | null
          meta_description?: string | null
          meta_title?: string | null
          min_price?: number | null
          name?: string
          parent_category_id?: string | null
          short_description?: string
          sort_order?: number
          specifications?: Json
          status?: Database["public"]["Enums"]["brand_status"]
          tags?: string[] | null
          updated_at?: string
          variant_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "product_catalogs"
            referencedColumns: ["catalog_id"]
          },
          {
            foreignKeyName: "products_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          source: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          source?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          source?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_job_progress_step: {
        Args: {
          p_job_id: string
          p_step_name: string
          p_step_order: number
          p_status?: string
          p_progress_percent?: number
          p_message?: string
          p_data?: Json
        }
        Returns: string
      }
      complete_job: {
        Args: {
          p_job_id: string
          p_status: string
          p_output_data?: Json
          p_error_data?: Json
        }
        Returns: undefined
      }
      generate_brand_slug: {
        Args: { brand_name: string; brand_id?: number }
        Returns: string
      }
      get_effective_attributes: {
        Args: { p_product_id: number; p_variant_attributes?: Json }
        Returns: Json
      }
      get_next_job: {
        Args: Record<PropertyKey, never>
        Returns: {
          job_id: string
          job_type: string
          input_data: Json
          user_id: string
          catalog_id: string
        }[]
      }
      get_product_attribute_schema: {
        Args: { p_product_id: number }
        Returns: Json
      }
      get_variant_display_name: {
        Args: { p_variant_id: number; p_include_product_name?: boolean }
        Returns: string
      }
      update_job_progress_step: {
        Args: {
          p_step_id: string
          p_status: string
          p_progress_percent?: number
          p_message?: string
          p_data?: Json
        }
        Returns: undefined
      }
      validate_attribute_values: {
        Args: { p_product_id: number; p_attribute_values: Json }
        Returns: boolean
      }
    }
    Enums: {
      brand_status: "draft" | "active" | "inactive" | "archived"
      price_point: "luxury" | "premium" | "mid-market" | "value" | "budget"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      brand_status: ["draft", "active", "inactive", "archived"],
      price_point: ["luxury", "premium", "mid-market", "value", "budget"],
    },
  },
} as const
