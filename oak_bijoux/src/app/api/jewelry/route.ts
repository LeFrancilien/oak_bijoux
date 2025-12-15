import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
    try {
        const supabase: any = await createClient();

        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            );
        }

        // Parse FormData
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const jewelryType = formData.get('jewelryType') as string;

        if (!file || !jewelryType) {
            return NextResponse.json(
                { error: 'Fichier et type de bijou requis' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'Le fichier doit être une image' },
                { status: 400 }
            );
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'L\'image ne doit pas dépasser 10 Mo' },
                { status: 400 }
            );
        }

        // Generate unique filename
        const extension = file.name.split('.').pop() || 'png';
        const filename = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('jewelry')
            .upload(filename, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error('[Jewelry Upload] Storage error:', uploadError);
            return NextResponse.json(
                { error: 'Erreur lors de l\'upload' },
                { status: 500 }
            );
        }

        // Get public URL
        const { data: urlData } = supabase.storage
            .from('jewelry')
            .getPublicUrl(filename);

        // Insert record in database
        const { data: jewelry, error: dbError } = await supabase
            .from('jewelry_uploads')
            .insert({
                user_id: user.id,
                storage_path: uploadData.path,
                public_url: urlData.publicUrl,
                jewelry_type: jewelryType,
                original_filename: file.name,
                file_size: file.size,
            })
            .select()
            .single();

        if (dbError) {
            console.error('[Jewelry Upload] Database error:', dbError);
            return NextResponse.json(
                { error: 'Erreur lors de l\'enregistrement' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            id: jewelry.id,
            publicUrl: urlData.publicUrl,
        });

    } catch (error) {
        console.error('[Jewelry Upload] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Erreur serveur inattendue' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const supabase: any = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Non autorisé' },
                { status: 401 }
            );
        }

        const { data: jewelry, error } = await supabase
            .from('jewelry_uploads')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json(
                { error: 'Erreur lors de la récupération' },
                { status: 500 }
            );
        }

        return NextResponse.json({ jewelry });

    } catch (error) {
        console.error('[Jewelry List] Unexpected error:', error);
        return NextResponse.json(
            { error: 'Erreur serveur inattendue' },
            { status: 500 }
        );
    }
}
