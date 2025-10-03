"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground">Civic Voice</h3>
            <p className="text-sm text-muted-foreground">Independent journalism on local governance.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Sections</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/municipal" className="hover:text-primary">Municipal</Link></li>
              <li><Link href="/provincial" className="hover:text-primary">Provincial</Link></li>
              <li><Link href="/investigations" className="hover:text-primary">Investigations</Link></li>
              <li><Link href="/opinion" className="hover:text-primary">Opinion</Link></li>
              <li><Link href="/international" className="hover:text-primary">International</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">About</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-muted-foreground mb-4">Stay updated on civic news.</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 border border-border rounded focus:ring-2 focus:ring-primary" />
              <Button size="sm">Subscribe</Button>
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-xs text-muted-foreground">
          © 2025 Civic Voice. All rights reserved.
        </div>
      </div>
    </footer>
  )
}