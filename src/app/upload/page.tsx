import { createSrvrClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { UploadForm } from './form';

export default async function UploadPage() {
    const supabase = await createSrvrClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div style={{ minHeight: '100vh', padding: '100px 20px', background: 'var(--bg-primary)' }}>
            <div className="container" style={{ maxWidth: '600px' }}>
                <div className="glass" style={{ padding: '40px', borderRadius: 'var(--radius-lg)' }}>
                    <h1 className="text-gradient" style={{ fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>Upload New App</h1>
                    <UploadForm />
                </div>
            </div>
        </div>
    );
}
