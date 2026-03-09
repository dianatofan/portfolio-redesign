"use client"

interface CloudinaryVideoPlayerProps {
    publicId: string
    cloudName?: string
}

export function CloudinaryVideoPlayer({
    publicId,
    cloudName = "dzpdf5ygh"
}: CloudinaryVideoPlayerProps) {
    // Construct Cloudinary video URL
    const videoUrl = `https://res.cloudinary.com/${cloudName}/video/upload/${publicId}.mp4`

    return (
        <div className="mt-8 relative aspect-video rounded-lg overflow-hidden">
            <video
                style={{ width: "100%", height: "100%" }}
                autoPlay
                loop
                muted
                className="object-cover"
            >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    )
}
