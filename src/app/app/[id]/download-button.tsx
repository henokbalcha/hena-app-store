'use client'

import { incrementDownloads } from "@/app/actions"

export function DownloadButton({ apkUrl, appId }: { apkUrl: string, appId: number }) {

    const handleDownload = async () => {
        // 1. Trigger the download immediately
        const link = document.createElement('a');
        link.href = apkUrl;
        link.download = '';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 2. Increment count in background
        await incrementDownloads(appId);
    }

    return (
        <button
            onClick={handleDownload}
            className="btn btn-primary"
            style={{ padding: '12px 40px', fontSize: '1.1rem' }}
        >
            Install
        </button>
    )
}
