import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-border-subtle mt-20">
      <div className="container-tight py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          <div className="col-span-2 md:col-span-1">
            <p className="text-[14px] font-medium tracking-tight text-text-primary mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Campus Lost & Found
            </p>
            <p className="text-[13px] text-text-muted leading-relaxed max-w-[240px]">
              Reuniting students with their belongings.
            </p>
          </div>

          <div>
            <h4 className="text-mono mb-4">Product</h4>
            <nav className="flex flex-col gap-3" aria-label="Product links">
              <Link href="/items" className="text-[13px] text-text-muted hover:text-text-primary transition-colors duration-200">Browse</Link>
              <Link href="/items/new" className="text-[13px] text-text-muted hover:text-text-primary transition-colors duration-200">Report Lost</Link>
              <Link href="/items/new" className="text-[13px] text-text-muted hover:text-text-primary transition-colors duration-200">Report Found</Link>
              <Link href="/items" className="text-[13px] text-text-muted hover:text-text-primary transition-colors duration-200">How It Works</Link>
            </nav>
          </div>

          <div>
            <h4 className="text-mono mb-4">Account</h4>
            <nav className="flex flex-col gap-3" aria-label="Account links">
              <Link href="/dashboard" className="text-[13px] text-text-muted hover:text-text-primary transition-colors duration-200">Dashboard</Link>
              <Link href="/dashboard/items" className="text-[13px] text-text-muted hover:text-text-primary transition-colors duration-200">My Items</Link>
              <Link href="/dashboard/claims" className="text-[13px] text-text-muted hover:text-text-primary transition-colors duration-200">My Claims</Link>
            </nav>
          </div>

          <div>
            <h4 className="text-mono mb-4">Legal</h4>
            <nav className="flex flex-col gap-3" aria-label="Legal links">
              <Link href="#" className="text-[13px] text-text-muted hover:text-text-primary transition-colors duration-200">Privacy</Link>
              <Link href="#" className="text-[13px] text-text-muted hover:text-text-primary transition-colors duration-200">Terms</Link>
            </nav>
          </div>
        </div>

        <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[13px] text-text-muted">
            &copy; {new Date().getFullYear()} Campus Lost & Found
          </p>
          <p className="text-[12px] text-text-muted">
            Built for your campus community
          </p>
        </div>
      </div>
    </footer>
  )
}
