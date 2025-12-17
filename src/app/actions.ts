'use server'

import { createSrvrClient } from "@/lib/supabase-server"

export async function incrementDownloads(appId: number) {
    const supabase = await createSrvrClient()

    // Try to call RPC first (Best Practice)
    const { error: rpcError } = await supabase.rpc('increment_downloads', { row_id: appId })

    if (!rpcError) return;

    // Fallback: Direct Update (Requires RLS Policy allowing update)
    // Fetch current count
    const { data: app } = await supabase.from('apps').select('downloads').eq('id', appId).single()

    if (app) {
        await supabase.from('apps').update({ downloads: (app.downloads || 0) + 1 }).eq('id', appId)
    }
}
