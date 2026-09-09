import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container-wide py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="text-base font-semibold tracking-tight text-foreground mb-2">
              Campus Lost & Found
            </p>
            <p className="text-small text-muted-foreground leading-relaxed">
              Helping students reunite with their belongings.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-caption text-muted-foreground mb-4">Product</h4>
            <nav className="flex flex-col gap-3" aria-label="Product links">
              <Link href="/items" className="text-small text-muted-foreground hover:text-foreground transition-colors duration-200">
                Browse
              </Link>
              <Link href="/items/new" className="text-small text-muted-foreground hover:text-foreground transition-colors duration-200">
                Report Lost
              </Link>
              <Link href="/items/new" className="text-small text-muted-foreground hover:text-foreground transition-colors duration-200">
                Report Found
              </Link>
              <Link href="/items" className="text-small text-muted-foreground hover:text-foreground transition-colors duration-200">
                How It Works
              </Link>
            </nav>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-caption text-muted-foreground mb-4">Account</h4>
            <nav className="flex flex-col gap-3" aria-label="Account links">
              <Link href="/dashboard" className="text-small text-muted-foreground hover:text-foreground transition-colors duration-200">
                Dashboard
              </Link>
              <Link href="/dashboard/items" className="text-small text-muted-foreground hover:text-foreground transition-colors duration-200">
                My Items
              </Link>
              <Link href="/dashboard/claims" className="text-small text-muted-foreground hover:text-foreground transition-colors duration-200">
                My Claims
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-caption text-muted-foreground mb-4">Legal</h4>
            <nav className="flex flex-col gap-3" aria-label="Legal links">
              <Link href="#" className="text-small text-muted-foreground hover:text-foreground transition-colors duration-200">
                Privacy
              </Link>
              <Link href="#" className="text-small text-muted-foreground hover:text-foreground transition-colors duration-200">
                Terms
              </Link>
            </nav>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-small text-muted-foreground">
            &copy; {new Date().getFullYear()} Campus Lost & Found. All rights reserved.
          </p>
          <p className="text-caption text-muted-foreground">
            Built for your campus community
          </p>
        </div>
      </div>
    </footer>
  )
}
