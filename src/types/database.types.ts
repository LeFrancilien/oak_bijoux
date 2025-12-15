// Database types for OAK BIJOUX Supabase

export type SubscriptionTier = 'freemium' | 'pro' | 'premium';
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';
export type JewelryType = 'ring' | 'necklace' | 'earring' | 'bracelet' | 'set';
export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type ImageResolution = 'low' | 'high';

export interface User {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    created_at: string;
    updated_at: string;
}

export interface Subscription {
    id: string;
    user_id: string;
    stripe_customer_id: string | null;
    stripe_subscription_id: string | null;
    tier: SubscriptionTier;
    monthly_credits: number;
    credits_used: number;
    current_period_start: string | null;
    current_period_end: string | null;
    status: SubscriptionStatus;
    created_at: string;
    updated_at: string;
}

export interface JewelryUpload {
    id: string;
    user_id: string;
    storage_path: string;
    public_url: string;
    jewelry_type: JewelryType;
    original_filename: string | null;
    file_size: number | null;
    created_at: string;
}

export interface Generation {
    id: string;
    user_id: string;
    jewelry_id: string;
    prompt_model: string;
    prompt_decor: string;
    result_image_url: string | null;
    status: GenerationStatus;
    error_message: string | null;
    has_watermark: boolean;
    resolution: ImageResolution;
    processing_time_ms: number | null;
    metadata: Record<string, unknown>;
    created_at: string;
}

// Database schema for Supabase client
export interface Database {
    public: {
        Tables: {
            users: {
                Row: User;
                Insert: Omit<User, 'created_at' | 'updated_at'>;
                Update: Partial<Omit<User, 'id' | 'created_at'>>;
            };
            subscriptions: {
                Row: Subscription;
                Insert: Omit<Subscription, 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Subscription, 'id' | 'created_at'>>;
            };
            jewelry_uploads: {
                Row: JewelryUpload;
                Insert: Omit<JewelryUpload, 'id' | 'created_at'>;
                Update: Partial<Omit<JewelryUpload, 'id' | 'created_at'>>;
            };
            generations: {
                Row: Generation;
                Insert: Omit<Generation, 'id' | 'created_at'>;
                Update: Partial<Omit<Generation, 'id' | 'created_at'>>;
            };
        };
    };
}
