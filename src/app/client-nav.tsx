'use client';

import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <button
            onClick={handleLogout}
            className="btn btn-glass"
            style={{ fontSize: '0.9rem', padding: '6px 16px' }}
        >
            Logout
        </button>
    );
}

export function UploadButton() {
    return null; // Not using centralized button currently, direct link in navbar.
}
