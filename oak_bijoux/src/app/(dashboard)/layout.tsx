import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import { User as UserProfile, Subscription } from '@/types/database.types';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Get user profile and subscription
    const { data: profileData } = await supabase
        .from('users')
        .select('full_name, email')
        .eq('id', user.id)
        .single();

    const profile = profileData as UserProfile | null;

    const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('tier, credits_used, monthly_credits')
        .eq('user_id', user.id)
        .single();

    const subscription = subscriptionData as Subscription | null;

    return (
        <div className="min-h-screen bg-background">
            <Sidebar
                userName={profile?.full_name || user.email?.split('@')[0] || 'Utilisateur'}
                userEmail={user.email || ''}
                tier={subscription?.tier as 'freemium' | 'pro' | 'premium' || 'freemium'}
                creditsUsed={subscription?.credits_used || 0}
                monthlyCredits={subscription?.monthly_credits || 1}
            />
            <main className="lg:pl-72">
                <div className="min-h-screen p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
