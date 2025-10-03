import { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Mail, MapPin, Send } from "lucide-react"

export const metadata: Metadata = {
  title: "Contact Us | Civic Voice",
  description: "Get in touch with Civic Voice. Submit news tips, report errors, inquire about partnerships, or reach our editorial team. We're here to serve our community.",
  openGraph: {
    title: "Contact Us | Civic Voice",
    description: "Get in touch with Civic Voice. Submit news tips, report errors, or reach our editorial team.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Contact Us | Civic Voice",
    description: "Get in touch with Civic Voice. Submit news tips, report errors, or reach our editorial team.",
  },
}

export default function ContactPage() {
  return (
    <>
      <Header />
      <main>
        <div className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Have a news tip? Questions about our reporting? We'd love to hear from you.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Information */}
              <div className="lg:col-span-1 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <Mail className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <a href="mailto:tips@civicvoice.news" className="text-muted-foreground hover:text-primary">
                          tips@civicvoice.news
                        </a>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Location</h3>
                        <p className="text-muted-foreground">
                          Based in your community,<br />
                          serving local readers
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-6">
                  <h3 className="font-semibold mb-3">News Tips</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Have information about government misconduct, policy concerns, or community issues? We protect our sources.
                  </p>
                  <a href="mailto:tips@civicvoice.news" className="text-sm text-primary hover:underline">
                    Submit a confidential tip →
                  </a>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-8">
                  <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none bg-background"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none bg-background"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none bg-background"
                        placeholder="What's this about?"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        className="w-full px-4 py-2 border border-input rounded-md focus:ring-2 focus:ring-ring focus:outline-none bg-background resize-none"
                        placeholder="Your message..."
                      />
                    </div>
                    <Button type="submit" size="lg" className="w-full sm:w-auto">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </form>
                  <p className="text-xs text-muted-foreground mt-4">
                    We typically respond within 1-2 business days. For urgent matters, please email us directly.
                  </p>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-muted/30 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">Corrections</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Notice an error in our reporting? We take accuracy seriously.
                    </p>
                    <a href="mailto:corrections@civicvoice.news" className="text-sm text-primary hover:underline">
                      Report a correction →
                    </a>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-6">
                    <h3 className="font-semibold mb-2">Partnerships</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Interested in collaborating or sponsorship opportunities?
                    </p>
                    <a href="mailto:partnerships@civicvoice.news" className="text-sm text-primary hover:underline">
                      Get in touch →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}