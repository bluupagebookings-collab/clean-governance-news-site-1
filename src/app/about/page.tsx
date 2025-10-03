import { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "About Us | Civic Voice",
  description: "Learn about Civic Voice's mission to provide independent, in-depth journalism on municipal and provincial governance. Meet our team and discover our commitment to civic accountability.",
  openGraph: {
    title: "About Us | Civic Voice",
    description: "Learn about Civic Voice's mission to provide independent, in-depth journalism on municipal and provincial governance.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "About Us | Civic Voice",
    description: "Learn about Civic Voice's mission to provide independent, in-depth journalism on municipal and provincial governance.",
  },
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <div className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">About Civic Voice</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Independent journalism holding power accountable through investigative reporting and civic engagement.
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Our Mission */}
            <section>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <div className="prose prose-lg max-w-none text-foreground/90 space-y-4">
                <p>
                  Civic Voice is dedicated to providing clear, accurate, and in-depth coverage of municipal and provincial governance. We believe that an informed citizenry is essential for a healthy democracy.
                </p>
                <p>
                  Our journalists work tirelessly to uncover the stories that matter most to local communities—from budget decisions and policy changes to investigative reports that hold elected officials accountable.
                </p>
                <p>
                  We are committed to transparency, fairness, and journalistic integrity. Our reporting is guided by the principle that democracy thrives when citizens have access to reliable information about how their governments operate.
                </p>
              </div>
            </section>

            <Separator />

            {/* What We Cover */}
            <section>
              <h2 className="text-3xl font-bold mb-6">What We Cover</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Municipal</h3>
                  <p className="text-muted-foreground">
                    City council meetings, local budgets, zoning decisions, infrastructure projects, and community initiatives that shape daily life in your city.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Provincial</h3>
                  <p className="text-muted-foreground">
                    Legislative updates, provincial budget analysis, healthcare policy, education funding, and decisions that impact communities across the province.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Investigations</h3>
                  <p className="text-muted-foreground">
                    Deep-dive reporting on corruption, misuse of public funds, conflicts of interest, and systemic issues in local and provincial government.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-3">Opinion & Analysis</h3>
                  <p className="text-muted-foreground">
                    Expert commentary, policy analysis, and diverse perspectives on the issues affecting civic life and democratic participation.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Our Values */}
            <section>
              <h2 className="text-3xl font-bold mb-6">Our Values</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Independence</h3>
                  <p className="text-muted-foreground">
                    We maintain editorial independence and are not beholden to any political party, special interest group, or corporate sponsor.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Accuracy</h3>
                  <p className="text-muted-foreground">
                    We fact-check rigorously and correct errors promptly. Our commitment to accuracy builds trust with our readers.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Accountability</h3>
                  <p className="text-muted-foreground">
                    We hold power to account—whether in city hall, the provincial legislature, or corporate boardrooms affecting public policy.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Community</h3>
                  <p className="text-muted-foreground">
                    We serve our communities by amplifying voices, investigating concerns, and fostering informed civic participation.
                  </p>
                </div>
              </div>
            </section>

            <Separator />

            {/* Support Our Work */}
            <section className="bg-muted/50 rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-4">Support Our Work</h2>
              <p className="text-muted-foreground mb-6">
                Civic Voice is an independent news organization. Your support helps us continue providing in-depth, investigative journalism on the issues that matter most to your community.
              </p>
              <p className="text-muted-foreground">
                Interested in supporting our mission? Contact us to learn about sponsorship opportunities, partnerships, or ways to contribute to our journalism.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}