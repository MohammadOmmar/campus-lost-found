import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border/30 mt-20">
      <div className="container-wide py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <p className="text-[15px] font-semibold tracking-tight text-foreground mb-3">
              Campus Lost & Found
            </p>
            <p className="text-[13px] text-muted-foreground leading-relaxed max-w-[240px]">
              Helping students reunite with their belongings.
            </p>
          </div>

          <div>
            <h4 className="text-caption text-muted-foreground mb-4">Product</h4>
            <nav className="flex flex-col gap-3" aria-label="Product links">
              <Link href="/items" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200">Browse</Link>
              <Link href="/items/new" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200">Report Lost</Link>
              <Link href="/items/new" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200">Report Found</Link>
              <Link href="/items" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200">How It Works</Link>
            </nav>
          </div>

          <div>
            <h4 className="text-caption text-muted-foreground mb-4">Account</h4>
            <nav className="flex flex-col gap-3" aria-label="Account links">
              <Link href="/dashboard" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200">Dashboard</Link>
              <Link href="/dashboard/items" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200">My Items</Link>
              <Link href="/dashboard/claims" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200">My Claims</Link>
            </nav>
          </div>

          <div>
            <h4 className="text-caption text-muted-foreground mb-4">Legal</h4>
            <nav className="flex flex-col gap-3" aria-label="Legal links">
              <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200">Privacy</Link>
              <Link href="#" className="text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-200">Terms</Link>
            </nav>
          </div>
        </div>

        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-muted-foreground">
            &copy; {new Date().getFullYear()} Campus Lost & Found. All rights reserved.
          </p>
          <p className="text-[12px] text-muted-foreground">
            Built for your campus community
          </p>
        </div>
      </div>
    </footer>
  )
}
