'use server'

import { createSrvrClient } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"

export async function submitReview(formData: FormData) {
    const supabase = await createSrvrClient()

    const appId = formData.get('app_id') as string;
    const userName = formData.get('user_name') as string;
    const rating = parseInt(formData.get('rating') as string);
    const comment = formData.get('comment') as string;

    if (!appId || !userName || !rating) {
        throw new Error("Missing required fields");
    }

    const { error } = await supabase.from('reviews').insert({
        app_id: appId,
        user_name: userName,
        rating: rating,
        comment: comment
    });

    if (error) {
        console.error("Error submitting review:", error);
        throw new Error("Failed to submit review");
    }

    revalidatePath(`/app/${appId}`);
}
