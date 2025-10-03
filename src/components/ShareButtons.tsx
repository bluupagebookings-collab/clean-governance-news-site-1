"use client"

import { Button } from "@/components/ui/button"
import { Mail, Link2, MessageCircle } from "lucide-react"
import { toast } from "sonner"

interface ShareButtonsProps {
  title: string
  excerpt: string
  url: string
}

// Custom SVG Icons
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className={className} fill="currentColor">
    <path d="M576 320C576 178.6 461.4 64 320 64C178.6 64 64 178.6 64 320C64 440 146.7 540.8 258.2 568.5L258.2 398.2L205.4 398.2L205.4 320L258.2 320L258.2 286.3C258.2 199.2 297.6 158.8 383.2 158.8C399.4 158.8 427.4 162 438.9 165.2L438.9 236C432.9 235.4 422.4 235 409.3 235C367.3 235 351.1 250.9 351.1 292.2L351.1 320L434.7 320L420.3 398.2L351 398.2L351 574.1C477.8 558.8 576 450.9 576 320z"/>
  </svg>
)

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className={className} fill="currentColor">
    <path d="M544.5 273.9C500.5 274 457.5 260.3 421.7 234.7L421.7 413.4C421.7 446.5 411.6 478.8 392.7 506C373.8 533.2 347.1 554 316.1 565.6C285.1 577.2 251.3 579.1 219.2 570.9C187.1 562.7 158.3 545 136.5 520.1C114.7 495.2 101.2 464.1 97.5 431.2C93.8 398.3 100.4 365.1 116.1 336C131.8 306.9 156.1 283.3 185.7 268.3C215.3 253.3 248.6 247.8 281.4 252.3L281.4 342.2C266.4 337.5 250.3 337.6 235.4 342.6C220.5 347.6 207.5 357.2 198.4 369.9C189.3 382.6 184.4 398 184.5 413.8C184.6 429.6 189.7 444.8 199 457.5C208.3 470.2 221.4 479.6 236.4 484.4C251.4 489.2 267.5 489.2 282.4 484.3C297.3 479.4 310.4 469.9 319.6 457.2C328.8 444.5 333.8 429.1 333.8 413.4L333.8 64H421.8C421.7 71.4 422.4 78.9 423.7 86.2C426.8 102.5 433.1 118.1 442.4 131.9C451.7 145.7 463.7 157.5 477.6 166.5C497.5 179.6 520.8 186.6 544.6 186.6L544.6 274z"/>
  </svg>
)

const YouTubeIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className={className} fill="currentColor">
    <path d="M581.7 188.1C575.5 164.4 556.9 145.8 533.4 139.5C490.9 128 320.1 128 320.1 128C320.1 128 149.3 128 106.7 139.5C83.2 145.8 64.7 164.4 58.4 188.1C47 231 47 320.4 47 320.4C47 320.4 47 409.8 58.4 452.7C64.7 476.3 83.2 494.2 106.7 500.5C149.3 512 320.1 512 320.1 512C320.1 512 490.9 512 533.5 500.5C557 494.2 575.5 476.3 581.8 452.7C593.2 409.8 593.2 320.4 593.2 320.4C593.2 320.4 593.2 231 581.8 188.1zM264.2 401.6L264.2 239.2L406.9 320.4L264.2 401.6z"/>
  </svg>
)

export default function ShareButtons({ title, excerpt, url }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedText = encodeURIComponent(excerpt)

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    tiktok: `https://www.tiktok.com/`,
    youtube: `https://www.youtube.com/`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
  }

  const handleShare = (platform: keyof typeof shareLinks) => {
    const link = shareLinks[platform]
    
    if (platform === 'email') {
      window.location.href = link
    } else {
      const isInIframe = window.self !== window.top
      if (isInIframe) {
        window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: link } }, "*")
      } else {
        window.open(link, "_blank", "noopener,noreferrer,width=600,height=600")
      }
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Link copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy link")
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
        Share this article
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('facebook')}
          className="gap-2"
        >
          <FacebookIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Facebook</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('tiktok')}
          className="gap-2"
        >
          <TikTokIcon className="h-4 w-4" />
          <span className="hidden sm:inline">TikTok</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('youtube')}
          className="gap-2"
        >
          <YouTubeIcon className="h-4 w-4" />
          <span className="hidden sm:inline">YouTube</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('whatsapp')}
          className="gap-2"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleShare('email')}
          className="gap-2"
        >
          <Mail className="h-4 w-4" />
          <span className="hidden sm:inline">Email</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2"
        >
          <Link2 className="h-4 w-4" />
          <span className="hidden sm:inline">Copy Link</span>
        </Button>
      </div>
    </div>
  )
}