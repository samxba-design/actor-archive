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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      actor_stats: {
        Row: {
          accents: string[] | null
          age_range_max: number | null
          age_range_min: number | null
          availability_note: string | null
          based_in_primary: string | null
          based_in_secondary: string[] | null
          body_type: string | null
          casting_availability: string | null
          created_at: string | null
          dance_styles: string[] | null
          ethnicity: string[] | null
          eye_color: string | null
          gender_identity: string | null
          hair_color: string | null
          height_cm: number | null
          height_display: string | null
          id: string
          languages: Json | null
          passport_countries: string[] | null
          profile_id: string
          self_tape_turnaround: string | null
          special_skills: string[] | null
          travel_regions: string[] | null
          union_status: string[] | null
          updated_at: string | null
          vocal_range: string | null
          weight_range: string | null
          willing_to_travel: boolean | null
          work_permits: Json | null
        }
        Insert: {
          accents?: string[] | null
          age_range_max?: number | null
          age_range_min?: number | null
          availability_note?: string | null
          based_in_primary?: string | null
          based_in_secondary?: string[] | null
          body_type?: string | null
          casting_availability?: string | null
          created_at?: string | null
          dance_styles?: string[] | null
          ethnicity?: string[] | null
          eye_color?: string | null
          gender_identity?: string | null
          hair_color?: string | null
          height_cm?: number | null
          height_display?: string | null
          id?: string
          languages?: Json | null
          passport_countries?: string[] | null
          profile_id: string
          self_tape_turnaround?: string | null
          special_skills?: string[] | null
          travel_regions?: string[] | null
          union_status?: string[] | null
          updated_at?: string | null
          vocal_range?: string | null
          weight_range?: string | null
          willing_to_travel?: boolean | null
          work_permits?: Json | null
        }
        Update: {
          accents?: string[] | null
          age_range_max?: number | null
          age_range_min?: number | null
          availability_note?: string | null
          based_in_primary?: string | null
          based_in_secondary?: string[] | null
          body_type?: string | null
          casting_availability?: string | null
          created_at?: string | null
          dance_styles?: string[] | null
          ethnicity?: string[] | null
          eye_color?: string | null
          gender_identity?: string | null
          hair_color?: string | null
          height_cm?: number | null
          height_display?: string | null
          id?: string
          languages?: Json | null
          passport_countries?: string[] | null
          profile_id?: string
          self_tape_turnaround?: string | null
          special_skills?: string[] | null
          travel_regions?: string[] | null
          union_status?: string[] | null
          updated_at?: string | null
          vocal_range?: string | null
          weight_range?: string | null
          willing_to_travel?: boolean | null
          work_permits?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "actor_stats_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_audit_logs: {
        Row: {
          action_type: string
          admin_id: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: string | null
          target_id: string | null
          target_type: string | null
        }
        Insert: {
          action_type: string
          admin_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Update: {
          action_type?: string
          admin_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: string | null
          target_id?: string | null
          target_type?: string | null
        }
        Relationships: []
      }
      awards: {
        Row: {
          category: string | null
          created_at: string | null
          display_order: number | null
          id: string
          laurel_image_url: string | null
          name: string
          organization: string | null
          profile_id: string
          project_id: string | null
          result: string | null
          year: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          laurel_image_url?: string | null
          name: string
          organization?: string | null
          profile_id: string
          project_id?: string | null
          result?: string | null
          year?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          laurel_image_url?: string | null
          name?: string
          organization?: string | null
          profile_id?: string
          project_id?: string | null
          result?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "awards_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "awards_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      client_logos_profile: {
        Row: {
          company_name: string
          created_at: string | null
          display_order: number | null
          id: string
          logo_url: string | null
          profile_id: string
          website_url: string | null
        }
        Insert: {
          company_name: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          logo_url?: string | null
          profile_id: string
          website_url?: string | null
        }
        Update: {
          company_name?: string
          created_at?: string | null
          display_order?: number | null
          id?: string
          logo_url?: string | null
          profile_id?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_logos_profile_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_logos: {
        Row: {
          company_name: string
          created_at: string | null
          domain: string | null
          id: string
          logo_source: string | null
          logo_url: string
        }
        Insert: {
          company_name: string
          created_at?: string | null
          domain?: string | null
          id?: string
          logo_source?: string | null
          logo_url: string
        }
        Update: {
          company_name?: string
          created_at?: string | null
          domain?: string | null
          id?: string
          logo_source?: string | null
          logo_url?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          id: string
          is_archived: boolean | null
          is_read: boolean | null
          is_starred: boolean | null
          message: string
          profile_id: string
          project_id: string | null
          reply_sent: boolean | null
          sender_email: string
          sender_name: string
          subject: string | null
          subject_type:
            | Database["public"]["Enums"]["contact_subject_type"]
            | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          is_starred?: boolean | null
          message: string
          profile_id: string
          project_id?: string | null
          reply_sent?: boolean | null
          sender_email: string
          sender_name: string
          subject?: string | null
          subject_type?:
            | Database["public"]["Enums"]["contact_subject_type"]
            | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          is_read?: boolean | null
          is_starred?: boolean | null
          message?: string
          profile_id?: string
          project_id?: string | null
          reply_sent?: boolean | null
          sender_email?: string
          sender_name?: string
          subject?: string | null
          subject_type?:
            | Database["public"]["Enums"]["contact_subject_type"]
            | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_submissions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_submissions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      content_flags: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          details: string | null
          flagged_by: string | null
          id: string
          profile_id: string | null
          reason: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          details?: string | null
          flagged_by?: string | null
          id?: string
          profile_id?: string | null
          reason: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          details?: string | null
          flagged_by?: string | null
          id?: string
          profile_id?: string | null
          reason?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_flags_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      custom_sections: {
        Row: {
          content: string | null
          created_at: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_visible: boolean | null
          profile_id: string
          section_type: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_visible?: boolean | null
          profile_id: string
          section_type?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_visible?: boolean | null
          profile_id?: string
          section_type?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_sections_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      download_logs: {
        Row: {
          created_at: string | null
          document_url: string | null
          downloader_email: string | null
          downloader_name: string | null
          id: string
          ip_address: string | null
          profile_id: string
          project_id: string | null
        }
        Insert: {
          created_at?: string | null
          document_url?: string | null
          downloader_email?: string | null
          downloader_name?: string | null
          id?: string
          ip_address?: string | null
          profile_id: string
          project_id?: string | null
        }
        Update: {
          created_at?: string | null
          document_url?: string | null
          downloader_email?: string | null
          downloader_name?: string | null
          id?: string
          ip_address?: string | null
          profile_id?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "download_logs_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "download_logs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      education: {
        Row: {
          created_at: string | null
          degree_or_certificate: string | null
          description: string | null
          display_order: number | null
          education_type: string | null
          field_of_study: string | null
          id: string
          institution: string
          is_ongoing: boolean | null
          profile_id: string
          teacher_name: string | null
          year_end: number | null
          year_start: number | null
        }
        Insert: {
          created_at?: string | null
          degree_or_certificate?: string | null
          description?: string | null
          display_order?: number | null
          education_type?: string | null
          field_of_study?: string | null
          id?: string
          institution: string
          is_ongoing?: boolean | null
          profile_id: string
          teacher_name?: string | null
          year_end?: number | null
          year_start?: number | null
        }
        Update: {
          created_at?: string | null
          degree_or_certificate?: string | null
          description?: string | null
          display_order?: number | null
          education_type?: string | null
          field_of_study?: string | null
          id?: string
          institution?: string
          is_ongoing?: boolean | null
          profile_id?: string
          teacher_name?: string | null
          year_end?: number | null
          year_start?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "education_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_captures: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          profile_id: string
          project_id: string | null
          source: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          profile_id: string
          project_id?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          profile_id?: string
          project_id?: string | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_captures_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_captures_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          date: string | null
          description: string | null
          display_order: number | null
          end_date: string | null
          event_type: string | null
          id: string
          is_upcoming: boolean | null
          profile_id: string
          project_id: string | null
          ticket_url: string | null
          title: string
          venue: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          event_type?: string | null
          id?: string
          is_upcoming?: boolean | null
          profile_id: string
          project_id?: string | null
          ticket_url?: string | null
          title: string
          venue?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          date?: string | null
          description?: string | null
          display_order?: number | null
          end_date?: string | null
          event_type?: string | null
          id?: string
          is_upcoming?: boolean | null
          profile_id?: string
          project_id?: string | null
          ticket_url?: string | null
          title?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      gallery_images: {
        Row: {
          caption: string | null
          created_at: string | null
          display_order: number | null
          id: string
          image_type: string
          image_url: string
          is_primary: boolean | null
          photographer_credit: string | null
          profile_id: string
          project_id: string | null
          tags: string[] | null
          thumbnail_url: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_type: string
          image_url: string
          is_primary?: boolean | null
          photographer_credit?: string | null
          profile_id: string
          project_id?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          image_type?: string
          image_url?: string
          is_primary?: boolean | null
          photographer_credit?: string | null
          profile_id?: string
          project_id?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_images_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gallery_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      page_views: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          device_type: string | null
          id: string
          path: string | null
          profile_id: string
          project_id: string | null
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          path?: string | null
          profile_id: string
          project_id?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          path?: string | null
          profile_id?: string
          project_id?: string | null
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "page_views_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      pipeline_submissions: {
        Row: {
          company_name: string
          contact_email: string | null
          contact_name: string | null
          created_at: string | null
          display_order: number | null
          id: string
          notes: string | null
          profile_id: string
          project_id: string | null
          response_at: string | null
          status: string
          submission_type: string | null
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          company_name: string
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          notes?: string | null
          profile_id: string
          project_id?: string | null
          response_at?: string | null
          status?: string
          submission_type?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          company_name?: string
          contact_email?: string | null
          contact_name?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          notes?: string | null
          profile_id?: string
          project_id?: string | null
          response_at?: string | null
          status?: string
          submission_type?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pipeline_submissions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pipeline_submissions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      press: {
        Row: {
          article_url: string | null
          created_at: string | null
          date: string | null
          display_order: number | null
          excerpt: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          press_type: string | null
          profile_id: string
          project_id: string | null
          publication: string | null
          publication_logo_url: string | null
          pull_quote: string | null
          star_rating: number | null
          title: string
        }
        Insert: {
          article_url?: string | null
          created_at?: string | null
          date?: string | null
          display_order?: number | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          press_type?: string | null
          profile_id: string
          project_id?: string | null
          publication?: string | null
          publication_logo_url?: string | null
          pull_quote?: string | null
          star_rating?: number | null
          title: string
        }
        Update: {
          article_url?: string | null
          created_at?: string | null
          date?: string | null
          display_order?: number | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          press_type?: string | null
          profile_id?: string
          project_id?: string | null
          publication?: string | null
          publication_logo_url?: string | null
          pull_quote?: string | null
          star_rating?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "press_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "press_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      production_history: {
        Row: {
          cast_names: string[] | null
          city: string | null
          country: string | null
          created_at: string | null
          director: string | null
          id: string
          production_photos: string[] | null
          profile_id: string
          project_id: string
          run_dates: string | null
          theatre_name: string | null
          year: number | null
        }
        Insert: {
          cast_names?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          director?: string | null
          id?: string
          production_photos?: string[] | null
          profile_id: string
          project_id: string
          run_dates?: string | null
          theatre_name?: string | null
          year?: number | null
        }
        Update: {
          cast_names?: string[] | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          director?: string | null
          id?: string
          production_photos?: string[] | null
          profile_id?: string
          project_id?: string
          run_dates?: string | null
          theatre_name?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "production_history_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_history_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          accent_color: string | null
          auto_responder_enabled: boolean | null
          auto_responder_message: string | null
          available_for_hire: boolean | null
          banner_url: string | null
          bio: string | null
          booking_url: string | null
          contact_mode: string | null
          created_at: string | null
          cta_label: string | null
          cta_type: string | null
          cta_url: string | null
          custom_css: string | null
          custom_domain: string | null
          display_name: string | null
          first_name: string | null
          font_pairing: string | null
          headline: string | null
          hero_background_preset: string | null
          hero_bg_solid_color: string | null
          hero_bg_type: string | null
          hero_bg_video_url: string | null
          hero_style: string | null
          id: string
          is_draft: boolean | null
          is_published: boolean | null
          is_suspended: boolean | null
          known_for_position: string | null
          last_name: string | null
          layout_density: string | null
          location: string | null
          onboarding_completed: boolean | null
          primary_goal: string | null
          profile_photo_url: string | null
          profile_type: Database["public"]["Enums"]["profile_type"] | null
          secondary_types: string[] | null
          section_order: string[] | null
          sections_visible: Json | null
          seeking_representation: boolean | null
          seo_indexable: boolean | null
          show_contact_form: boolean | null
          slug: string | null
          subscription_tier:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          suspended_at: string | null
          suspended_by: string | null
          suspended_reason: string | null
          tagline: string | null
          theme: string | null
          updated_at: string | null
        }
        Insert: {
          accent_color?: string | null
          auto_responder_enabled?: boolean | null
          auto_responder_message?: string | null
          available_for_hire?: boolean | null
          banner_url?: string | null
          bio?: string | null
          booking_url?: string | null
          contact_mode?: string | null
          created_at?: string | null
          cta_label?: string | null
          cta_type?: string | null
          cta_url?: string | null
          custom_css?: string | null
          custom_domain?: string | null
          display_name?: string | null
          first_name?: string | null
          font_pairing?: string | null
          headline?: string | null
          hero_background_preset?: string | null
          hero_bg_solid_color?: string | null
          hero_bg_type?: string | null
          hero_bg_video_url?: string | null
          hero_style?: string | null
          id: string
          is_draft?: boolean | null
          is_published?: boolean | null
          is_suspended?: boolean | null
          known_for_position?: string | null
          last_name?: string | null
          layout_density?: string | null
          location?: string | null
          onboarding_completed?: boolean | null
          primary_goal?: string | null
          profile_photo_url?: string | null
          profile_type?: Database["public"]["Enums"]["profile_type"] | null
          secondary_types?: string[] | null
          section_order?: string[] | null
          sections_visible?: Json | null
          seeking_representation?: boolean | null
          seo_indexable?: boolean | null
          show_contact_form?: boolean | null
          slug?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          suspended_at?: string | null
          suspended_by?: string | null
          suspended_reason?: string | null
          tagline?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Update: {
          accent_color?: string | null
          auto_responder_enabled?: boolean | null
          auto_responder_message?: string | null
          available_for_hire?: boolean | null
          banner_url?: string | null
          bio?: string | null
          booking_url?: string | null
          contact_mode?: string | null
          created_at?: string | null
          cta_label?: string | null
          cta_type?: string | null
          cta_url?: string | null
          custom_css?: string | null
          custom_domain?: string | null
          display_name?: string | null
          first_name?: string | null
          font_pairing?: string | null
          headline?: string | null
          hero_background_preset?: string | null
          hero_bg_solid_color?: string | null
          hero_bg_type?: string | null
          hero_bg_video_url?: string | null
          hero_style?: string | null
          id?: string
          is_draft?: boolean | null
          is_published?: boolean | null
          is_suspended?: boolean | null
          known_for_position?: string | null
          last_name?: string | null
          layout_density?: string | null
          location?: string | null
          onboarding_completed?: boolean | null
          primary_goal?: string | null
          profile_photo_url?: string | null
          profile_type?: Database["public"]["Enums"]["profile_type"] | null
          secondary_types?: string[] | null
          section_order?: string[] | null
          sections_visible?: Json | null
          seeking_representation?: boolean | null
          seo_indexable?: boolean | null
          show_contact_form?: boolean | null
          slug?: string | null
          subscription_tier?:
            | Database["public"]["Enums"]["subscription_tier"]
            | null
          suspended_at?: string | null
          suspended_by?: string | null
          suspended_reason?: string | null
          tagline?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          access_level: Database["public"]["Enums"]["access_level"] | null
          article_url: string | null
          backdrop_url: string | null
          beat: string | null
          cast_size_notation: string | null
          challenge: string | null
          chapters: Json | null
          client: string | null
          comparable_titles: Json | null
          coverage_excerpt: string | null
          created_at: string | null
          credit_medium: string | null
          custom_image_url: string | null
          description: string | null
          director: string | null
          display_order: number | null
          duration: string | null
          episode_count: number | null
          format: string | null
          genre: string[] | null
          id: string
          imdb_link: string | null
          is_featured: boolean | null
          is_notable: boolean | null
          isbn: string | null
          logline: string | null
          metric_callouts: Json | null
          nda_url: string | null
          network: string | null
          network_or_studio: string | null
          notable_cast: string[] | null
          page_count: number | null
          password_hash: string | null
          poster_url: string | null
          production_company: string | null
          profile_id: string
          project_slug: string | null
          project_type: Database["public"]["Enums"]["project_type"]
          publication: string | null
          publisher: string | null
          purchase_links: Json | null
          results: string | null
          rights_status: string | null
          role_name: string | null
          role_type: string | null
          runtime_minutes: number | null
          script_pdf_url: string | null
          season_number: number | null
          series_bible_url: string | null
          set_requirements: string | null
          show_role: string | null
          solution: string | null
          status: string | null
          synopsis: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          tmdb_id: number | null
          updated_at: string | null
          video_thumbnail_url: string | null
          video_type: string | null
          video_url: string | null
          writing_samples_category: string | null
          year: number | null
        }
        Insert: {
          access_level?: Database["public"]["Enums"]["access_level"] | null
          article_url?: string | null
          backdrop_url?: string | null
          beat?: string | null
          cast_size_notation?: string | null
          challenge?: string | null
          chapters?: Json | null
          client?: string | null
          comparable_titles?: Json | null
          coverage_excerpt?: string | null
          created_at?: string | null
          credit_medium?: string | null
          custom_image_url?: string | null
          description?: string | null
          director?: string | null
          display_order?: number | null
          duration?: string | null
          episode_count?: number | null
          format?: string | null
          genre?: string[] | null
          id?: string
          imdb_link?: string | null
          is_featured?: boolean | null
          is_notable?: boolean | null
          isbn?: string | null
          logline?: string | null
          metric_callouts?: Json | null
          nda_url?: string | null
          network?: string | null
          network_or_studio?: string | null
          notable_cast?: string[] | null
          page_count?: number | null
          password_hash?: string | null
          poster_url?: string | null
          production_company?: string | null
          profile_id: string
          project_slug?: string | null
          project_type: Database["public"]["Enums"]["project_type"]
          publication?: string | null
          publisher?: string | null
          purchase_links?: Json | null
          results?: string | null
          rights_status?: string | null
          role_name?: string | null
          role_type?: string | null
          runtime_minutes?: number | null
          script_pdf_url?: string | null
          season_number?: number | null
          series_bible_url?: string | null
          set_requirements?: string | null
          show_role?: string | null
          solution?: string | null
          status?: string | null
          synopsis?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          tmdb_id?: number | null
          updated_at?: string | null
          video_thumbnail_url?: string | null
          video_type?: string | null
          video_url?: string | null
          writing_samples_category?: string | null
          year?: number | null
        }
        Update: {
          access_level?: Database["public"]["Enums"]["access_level"] | null
          article_url?: string | null
          backdrop_url?: string | null
          beat?: string | null
          cast_size_notation?: string | null
          challenge?: string | null
          chapters?: Json | null
          client?: string | null
          comparable_titles?: Json | null
          coverage_excerpt?: string | null
          created_at?: string | null
          credit_medium?: string | null
          custom_image_url?: string | null
          description?: string | null
          director?: string | null
          display_order?: number | null
          duration?: string | null
          episode_count?: number | null
          format?: string | null
          genre?: string[] | null
          id?: string
          imdb_link?: string | null
          is_featured?: boolean | null
          is_notable?: boolean | null
          isbn?: string | null
          logline?: string | null
          metric_callouts?: Json | null
          nda_url?: string | null
          network?: string | null
          network_or_studio?: string | null
          notable_cast?: string[] | null
          page_count?: number | null
          password_hash?: string | null
          poster_url?: string | null
          production_company?: string | null
          profile_id?: string
          project_slug?: string | null
          project_type?: Database["public"]["Enums"]["project_type"]
          publication?: string | null
          publisher?: string | null
          purchase_links?: Json | null
          results?: string | null
          rights_status?: string | null
          role_name?: string | null
          role_type?: string | null
          runtime_minutes?: number | null
          script_pdf_url?: string | null
          season_number?: number | null
          series_bible_url?: string | null
          set_requirements?: string | null
          show_role?: string | null
          solution?: string | null
          status?: string | null
          synopsis?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          tmdb_id?: number | null
          updated_at?: string | null
          video_thumbnail_url?: string | null
          video_type?: string | null
          video_url?: string | null
          writing_samples_category?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      published_works: {
        Row: {
          article_url: string | null
          category: string | null
          cover_image_url: string | null
          created_at: string | null
          date: string | null
          display_order: number | null
          id: string
          is_featured: boolean | null
          pdf_thumbnail_url: string | null
          pdf_url: string | null
          profile_id: string
          publication: string | null
          read_time: string | null
          show_text_overlay: boolean | null
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          article_url?: string | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          date?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          pdf_thumbnail_url?: string | null
          pdf_url?: string | null
          profile_id: string
          publication?: string | null
          read_time?: string | null
          show_text_overlay?: boolean | null
          summary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          article_url?: string | null
          category?: string | null
          cover_image_url?: string | null
          created_at?: string | null
          date?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          pdf_thumbnail_url?: string | null
          pdf_url?: string | null
          profile_id?: string
          publication?: string | null
          read_time?: string | null
          show_text_overlay?: boolean | null
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "published_works_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      representation: {
        Row: {
          company: string | null
          created_at: string | null
          department: string | null
          display_order: number | null
          email: string | null
          id: string
          is_primary: boolean | null
          logo_url: string | null
          market: string | null
          name: string | null
          phone: string | null
          profile_id: string
          rep_type: string
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          department?: string | null
          display_order?: number | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          logo_url?: string | null
          market?: string | null
          name?: string | null
          phone?: string | null
          profile_id: string
          rep_type: string
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          department?: string | null
          display_order?: number | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          logo_url?: string | null
          market?: string | null
          name?: string | null
          phone?: string | null
          profile_id?: string
          rep_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "representation_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          created_at: string | null
          currency: string | null
          deliverables: string[] | null
          description: string | null
          display_order: number | null
          id: string
          is_featured: boolean | null
          name: string
          profile_id: string
          starting_price: string | null
          turnaround: string | null
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          deliverables?: string[] | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          name: string
          profile_id: string
          starting_price?: string | null
          turnaround?: string | null
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          deliverables?: string[] | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          name?: string
          profile_id?: string
          starting_price?: string | null
          turnaround?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category: string | null
          created_at: string | null
          display_order: number | null
          id: string
          name: string
          proficiency: string | null
          profile_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          name: string
          proficiency?: string | null
          profile_id: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          name?: string
          proficiency?: string | null
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          created_at: string | null
          display_order: number | null
          id: string
          label: string | null
          platform: string
          profile_id: string
          url: string
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          label?: string | null
          platform: string
          profile_id: string
          url: string
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          id?: string
          label?: string | null
          platform?: string
          profile_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_links_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          author_company: string | null
          author_name: string
          author_photo_url: string | null
          author_role: string | null
          created_at: string | null
          display_order: number | null
          id: string
          is_featured: boolean | null
          profile_id: string
          project_id: string | null
          quote: string
        }
        Insert: {
          author_company?: string | null
          author_name: string
          author_photo_url?: string | null
          author_role?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          profile_id: string
          project_id?: string | null
          quote: string
        }
        Update: {
          author_company?: string | null
          author_name?: string
          author_photo_url?: string | null
          author_role?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          profile_id?: string
          project_id?: string | null
          quote?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "testimonials_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      tmdb_cache: {
        Row: {
          backdrop_url: string | null
          director: string | null
          fetched_at: string | null
          genre: string[] | null
          id: string
          media_type: string
          network_or_studio: string | null
          notable_cast: string[] | null
          poster_url: string | null
          raw_data: Json | null
          runtime_minutes: number | null
          synopsis: string | null
          title: string
          tmdb_id: number
          year: number | null
        }
        Insert: {
          backdrop_url?: string | null
          director?: string | null
          fetched_at?: string | null
          genre?: string[] | null
          id?: string
          media_type: string
          network_or_studio?: string | null
          notable_cast?: string[] | null
          poster_url?: string | null
          raw_data?: Json | null
          runtime_minutes?: number | null
          synopsis?: string | null
          title: string
          tmdb_id: number
          year?: number | null
        }
        Update: {
          backdrop_url?: string | null
          director?: string | null
          fetched_at?: string | null
          genre?: string[] | null
          id?: string
          media_type?: string
          network_or_studio?: string | null
          notable_cast?: string[] | null
          poster_url?: string | null
          raw_data?: Json | null
          runtime_minutes?: number | null
          synopsis?: string | null
          title?: string
          tmdb_id?: number
          year?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      access_level:
        | "public"
        | "gated"
        | "password_protected"
        | "private"
        | "nda_required"
      app_role: "admin" | "moderator" | "user"
      contact_subject_type:
        | "script_request"
        | "commission"
        | "meeting"
        | "press"
        | "representation"
        | "casting"
        | "rights_enquiry"
        | "general"
        | "quote_request"
        | "booking"
      profile_type:
        | "screenwriter"
        | "tv_writer"
        | "playwright"
        | "author"
        | "journalist"
        | "copywriter"
        | "actor"
        | "director_producer"
        | "corporate_video"
        | "multi_hyphenate"
      project_type:
        | "screenplay"
        | "pilot"
        | "spec_script"
        | "play"
        | "novel"
        | "short_story"
        | "article"
        | "case_study"
        | "campaign"
        | "video"
        | "film"
        | "tv_show"
        | "book"
        | "writing_sample"
        | "series_bible"
        | "comedy_packet"
        | "other"
      subscription_tier: "free" | "pro" | "premium"
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
      access_level: [
        "public",
        "gated",
        "password_protected",
        "private",
        "nda_required",
      ],
      app_role: ["admin", "moderator", "user"],
      contact_subject_type: [
        "script_request",
        "commission",
        "meeting",
        "press",
        "representation",
        "casting",
        "rights_enquiry",
        "general",
        "quote_request",
        "booking",
      ],
      profile_type: [
        "screenwriter",
        "tv_writer",
        "playwright",
        "author",
        "journalist",
        "copywriter",
        "actor",
        "director_producer",
        "corporate_video",
        "multi_hyphenate",
      ],
      project_type: [
        "screenplay",
        "pilot",
        "spec_script",
        "play",
        "novel",
        "short_story",
        "article",
        "case_study",
        "campaign",
        "video",
        "film",
        "tv_show",
        "book",
        "writing_sample",
        "series_bible",
        "comedy_packet",
        "other",
      ],
      subscription_tier: ["free", "pro", "premium"],
    },
  },
} as const
