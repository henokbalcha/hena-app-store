'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [query, setQuery] = useState(searchParams.get('search') || '')

    // Update local state if URL changes externally
    useEffect(() => {
        setQuery(searchParams.get('search') || '')
    }, [searchParams])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/?search=${encodeURIComponent(query)}`)
        } else {
            router.push('/')
        }
    }

    return (
        <form onSubmit={handleSearch} className="glass" style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px 16px',
            borderRadius: 'var(--radius-full)',
            width: '300px'
        }}>
            <span style={{ marginRight: '10px', opacity: 0.5 }}>🔍</span>
            <input
                type="text"
                placeholder="Search apps & games"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    color: 'white',
                    width: '100%'
                }}
            />
        </form>
    )
}
