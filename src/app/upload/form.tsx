'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function UploadForm() {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Action',
    });
    const [iconFile, setIconFile] = useState<File | null>(null);
    const [apkFile, setApkFile] = useState<File | null>(null);
    const [screenshotFiles, setScreenshotFiles] = useState<FileList | null>(null);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!iconFile || !apkFile) return alert('Please select Icon and APK files');

        setLoading(true);
        try {
            // 1. Upload Icon
            const iconName = `${Date.now()}-${iconFile.name}`;
            const { error: iconError } = await supabase.storage
                .from('icons')
                .upload(iconName, iconFile);

            if (iconError) throw iconError;

            // 2. Upload APK
            const apkName = `${Date.now()}-${apkFile.name}`;
            const { error: apkError } = await supabase.storage
                .from('apks')
                .upload(apkName, apkFile);

            if (apkError) throw apkError;

            // 3. Upload Screenshots
            const screenshotUrls: string[] = [];
            if (screenshotFiles) {
                for (let i = 0; i < screenshotFiles.length; i++) {
                    const file = screenshotFiles[i];
                    const name = `${Date.now()}-${i}-${file.name}`;
                    const { error: ssError } = await supabase.storage
                        .from('screenshots')
                        .upload(name, file);

                    if (ssError) throw ssError;
                    const url = supabase.storage.from('screenshots').getPublicUrl(name).data.publicUrl;
                    screenshotUrls.push(url);
                }
            }

            // Unpack URLs
            const iconUrl = supabase.storage.from('icons').getPublicUrl(iconName).data.publicUrl;
            const apkUrl = supabase.storage.from('apks').getPublicUrl(apkName).data.publicUrl;

            // 4. Insert into DB
            const { error: dbError } = await supabase
                .from('apps')
                .insert({
                    title: formData.title,
                    description: formData.description,
                    category: formData.category,
                    icon_url: iconUrl,
                    apk_url: apkUrl,
                    screenshots: screenshotUrls,
                    rating: 4.5, // Default for now
                    downloads: 0
                });

            if (dbError) throw dbError;

            alert('App uploaded successfully!');
            router.push('/');
        } catch (error: any) {
            console.error('Error uploading:', error);
            alert('Upload failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Title */}
            <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>App Title</label>
                <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--glass-border)',
                        color: 'white',
                        outline: 'none'
                    }}
                />
            </div>

            {/* Description */}
            <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Description</label>
                <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--glass-border)',
                        color: 'white',
                        outline: 'none',
                        resize: 'none'
                    }}
                />
            </div>

            {/* Category */}
            <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Category</label>
                <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--glass-border)',
                        color: 'white',
                        outline: 'none'
                    }}
                >
                    {['Action', 'RPG', 'Strategy', 'Puzzle', 'Sports', 'Productivity', 'Social', 'Tools'].map(c => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            {/* Icon File */}
            <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>App Icon (Image)</label>
                <input
                    required
                    type="file"
                    accept="image/*"
                    onChange={e => setIconFile(e.target.files?.[0] || null)}
                    style={{ color: 'var(--text-secondary)' }}
                />
            </div>

            {/* Screenshots */}
            <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Screenshots (Optional)</label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => setScreenshotFiles(e.target.files)}
                    style={{ color: 'var(--text-secondary)' }}
                />
            </div>

            {/* APK File */}
            <div>
                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>APK File</label>
                <input
                    required
                    type="file"
                    accept=".apk"
                    onChange={e => setApkFile(e.target.files?.[0] || null)}
                    style={{ color: 'var(--text-secondary)' }}
                />
            </div>

            <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ marginTop: '20px', opacity: loading ? 0.7 : 1 }}
            >
                {loading ? 'Uploading...' : 'Publish App'}
            </button>

        </form>
    );
}
