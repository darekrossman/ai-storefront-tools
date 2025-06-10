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
          market_position: string | null
          mission: string | null
          name: string
          personality_traits: string[] | null
          price_point: Database["public"]["Enums"]["price_point"] | null
          project_id: number
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
          market_position?: string | null
          mission?: string | null
          name: string
          personality_traits?: string[] | null
          price_point?: Database["public"]["Enums"]["price_point"] | null
          project_id: number
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
          market_position?: string | null
          mission?: string | null
          name?: string
          personality_traits?: string[] | null
          price_point?: Database["public"]["Enums"]["price_point"] | null
          project_id?: number
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
          values?: string[] | null
          vision?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brands_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          catalog_id: number
          created_at: string
          description: string
          id: number
          is_active: boolean
          metadata: Json | null
          name: string
          parent_category_id: number | null
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          catalog_id: number
          created_at?: string
          description: string
          id?: never
          is_active?: boolean
          metadata?: Json | null
          name: string
          parent_category_id?: number | null
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          catalog_id?: number
          created_at?: string
          description?: string
          id?: never
          is_active?: boolean
          metadata?: Json | null
          name?: string
          parent_category_id?: number | null
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
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_attributes: {
        Row: {
          attribute_id: string
          attribute_label: string
          created_at: string
          id: number
          is_required: boolean
          options: Json
          product_id: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          attribute_id: string
          attribute_label: string
          created_at?: string
          id?: never
          is_required?: boolean
          options?: Json
          product_id: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          attribute_id?: string
          attribute_label?: string
          created_at?: string
          id?: never
          is_required?: boolean
          options?: Json
          product_id?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_attributes_product_id_fkey"
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
          created_at: string
          description: string | null
          id: number
          name: string
          settings: Json | null
          slug: string
          status: Database["public"]["Enums"]["brand_status"]
          total_products: number
          updated_at: string
        }
        Insert: {
          brand_id: number
          created_at?: string
          description?: string | null
          id?: never
          name: string
          settings?: Json | null
          slug: string
          status?: Database["public"]["Enums"]["brand_status"]
          total_products?: number
          updated_at?: string
        }
        Update: {
          brand_id?: number
          created_at?: string
          description?: string | null
          id?: never
          name?: string
          settings?: Json | null
          slug?: string
          status?: Database["public"]["Enums"]["brand_status"]
          total_products?: number
          updated_at?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          alt_text: string | null
          attribute_filters: Json | null
          color_id: string | null
          created_at: string
          id: number
          product_id: number
          sort_order: number
          type: string
          updated_at: string
          url: string
        }
        Insert: {
          alt_text?: string | null
          attribute_filters?: Json | null
          color_id?: string | null
          created_at?: string
          id?: never
          product_id: number
          sort_order?: number
          type?: string
          updated_at?: string
          url: string
        }
        Update: {
          alt_text?: string | null
          attribute_filters?: Json | null
          color_id?: string | null
          created_at?: string
          id?: never
          product_id?: number
          sort_order?: number
          type?: string
          updated_at?: string
          url?: string
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
          created_at: string
          id: number
          orderable: boolean
          price: number
          product_id: number
          sku: string
          sort_order: number
          status: Database["public"]["Enums"]["brand_status"]
          updated_at: string
        }
        Insert: {
          attributes?: Json
          barcode?: string | null
          created_at?: string
          id?: never
          orderable?: boolean
          price: number
          product_id: number
          sku: string
          sort_order?: number
          status?: Database["public"]["Enums"]["brand_status"]
          updated_at?: string
        }
        Update: {
          attributes?: Json
          barcode?: string | null
          created_at?: string
          id?: never
          orderable?: boolean
          price?: number
          product_id?: number
          sku?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["brand_status"]
          updated_at?: string
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
          attributes: Json | null
          catalog_id: number
          created_at: string
          description: string
          id: number
          max_price: number | null
          meta_description: string | null
          meta_title: string | null
          min_price: number | null
          name: string
          parent_category_id: number | null
          short_description: string
          sort_order: number
          specifications: Json
          status: Database["public"]["Enums"]["brand_status"]
          tags: string[] | null
          total_inventory: number | null
          updated_at: string
        }
        Insert: {
          attributes?: Json | null
          catalog_id: number
          created_at?: string
          description: string
          id?: never
          max_price?: number | null
          meta_description?: string | null
          meta_title?: string | null
          min_price?: number | null
          name: string
          parent_category_id?: number | null
          short_description: string
          sort_order?: number
          specifications?: Json
          status?: Database["public"]["Enums"]["brand_status"]
          tags?: string[] | null
          total_inventory?: number | null
          updated_at?: string
        }
        Update: {
          attributes?: Json | null
          catalog_id?: number
          created_at?: string
          description?: string
          id?: never
          max_price?: number | null
          meta_description?: string | null
          meta_title?: string | null
          min_price?: number | null
          name?: string
          parent_category_id?: number | null
          short_description?: string
          sort_order?: number
          specifications?: Json
          status?: Database["public"]["Enums"]["brand_status"]
          tags?: string[] | null
          total_inventory?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "product_catalogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
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
      projects: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string
          settings: Json | null
          status: Database["public"]["Enums"]["session_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: never
          name: string
          settings?: Json | null
          status?: Database["public"]["Enums"]["session_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: never
          name?: string
          settings?: Json | null
          status?: Database["public"]["Enums"]["session_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
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
      [_ in never]: never
    }
    Enums: {
      brand_status: "draft" | "active" | "inactive" | "archived"
      price_point: "luxury" | "premium" | "mid-market" | "value" | "budget"
      session_status: "active" | "completed" | "archived"
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
      session_status: ["active", "completed", "archived"],
    },
  },
} as const

