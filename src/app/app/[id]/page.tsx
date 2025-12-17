import { createClient } from "@/lib/supabase"; // Use client-side safe creation or singleton for public data
import { notFound } from "next/navigation";
import Image from "next/image";
import { DownloadButton } from "./download-button";
import { ReviewForm } from "../../review-form";

// Revalidate app data every 60 seconds
export const revalidate = 60;

export async function generateStaticParams() {
    const { data: apps } = await createClient().from('apps').select('id')
    return apps?.map(({ id }: { id: number }) => ({ id: String(id) })) || []
}

export default async function AppDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = createClient();
    const { id } = await params

    // Parallel Fetch: App Data + Reviews
    const [appReq, reviewsReq] = await Promise.all([
        supabase.from('apps').select('*').eq('id', id).single(),
        supabase.from('reviews').select('*').eq('app_id', id).order('created_at', { ascending: false })
    ]);

    const app = appReq.data;
    const reviews = reviewsReq.data || [];

    if (appReq.error || !app) {
        notFound();
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', paddingBottom: '100px' }}>
            {/* Navbar Placeholder (Consistent with Layout) */}
            <div style={{ height: '80px' }}></div>

            <div className="container" style={{ maxWidth: '800px' }}>

                {/* Header Section */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '40px', alignItems: 'flex-start' }}>
                    {/* App Icon */}
                    <div style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        background: app.icon_url ? `url('${app.icon_url}') center/cover` : 'var(--bg-tertiary)',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                        border: '1px solid var(--glass-border)',
                        flexShrink: 0
                    }}></div>

                    <div style={{ flex: 1, minWidth: '280px' }}>
                        <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '8px', lineHeight: 1.2 }}>
                            {app.title}
                        </h1>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: 'var(--text-secondary)', marginBottom: '24px', alignItems: 'center' }}>
                            <span style={{ background: 'var(--bg-tertiary)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }}>
                                {app.category}
                            </span>
                            <span>★ {app.rating}</span>
                            <span>{app.downloads > 0 ? `${app.downloads} Downloads` : 'New Release'}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <DownloadButton apkUrl={app.apk_url} appId={app.id} />
                            <button className="btn btn-glass">Share</button>
                        </div>
                    </div>
                </div>

                {/* Screenshots Section */}
                {app.screenshots && app.screenshots.length > 0 && (
                    <div style={{ marginBottom: '40px', overflowX: 'auto', display: 'flex', gap: '16px', paddingBottom: '20px' }}>
                        {app.screenshots.map((shot: string, i: number) => (
                            <div key={i} style={{
                                minWidth: '250px',
                                height: '450px',
                                borderRadius: 'var(--radius-md)',
                                overflow: 'hidden',
                                flexShrink: 0,
                                border: '1px solid var(--glass-border)'
                            }}>
                                <img src={shot} alt={`Screenshot ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        ))}
                    </div>
                )}

                {/* Description Section */}
                <div className="glass" style={{ padding: '30px', borderRadius: 'var(--radius-lg)', marginBottom: '40px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>About this app</h2>
                    <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                        {app.description || "No description available."}
                    </p>
                </div>

                {/* Reviews Section */}
                <div style={{ marginBottom: '60px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>Ratings & Reviews</h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>

                        {/* Reviews List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {reviews.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first!</p>
                            ) : (
                                reviews.map((review: any) => (
                                    <div key={review.id} className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                            <span style={{ fontWeight: 'bold' }}>{review.user_name}</span>
                                            <span style={{ color: 'gold' }}>{'★'.repeat(review.rating)}<span style={{ color: '#444' }}>{'★'.repeat(5 - review.rating)}</span></span>
                                        </div>
                                        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{review.comment}</p>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>{new Date(review.created_at).toLocaleDateString()}</span>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Submission Form */}
                        <div>
                            <ReviewForm appId={String(app.id)} />
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginTop: '30px' }}>
                    <div className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Version</h3>
                        <p>1.0.0</p>
                    </div>
                    <div className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)' }}>
                        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Last Updated</h3>
                        <p>{new Date(app.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

            </div>
        </div>
    )
}
