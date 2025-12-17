'use client'

import { useState } from 'react'
import { submitReview } from './actions-reviews'

export function ReviewForm({ appId }: { appId: string }) {
    const [loading, setLoading] = useState(false)
    const [rating, setRating] = useState(5)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        formData.append('app_id', appId);
        formData.append('rating', rating.toString());

        try {
            await submitReview(formData);
            (e.target as HTMLFormElement).reset();
            setRating(5);
            alert('Review submitted!');
        } catch (err) {
            alert('Error submitting review');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="glass" style={{ padding: '24px', borderRadius: 'var(--radius-md)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '16px' }}>Write a Review</h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Rating Select */}
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Rating (1-5)</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                type="button"
                                key={star}
                                onClick={() => setRating(star)}
                                style={{
                                    fontSize: '1.5rem',
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: star <= rating ? 'gold' : 'gray'
                                }}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Your Name</label>
                    <input
                        name="user_name"
                        required
                        type="text"
                        placeholder="John Doe"
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

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Comment</label>
                    <textarea
                        name="comment"
                        rows={3}
                        placeholder="Great app!"
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

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'Submitting...' : 'Post Review'}
                </button>
            </form>
        </div>
    )
}
