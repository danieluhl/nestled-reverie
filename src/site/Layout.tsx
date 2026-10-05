import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

function Lotus() {
  return (
    <svg viewBox="0 0 40 24" className="gs-lotus" aria-hidden="true">
      <path d="M20 22 C16 16 16 8 20 2 C24 8 24 16 20 22 Z" />
      <path d="M20 22 C14 19 9 14 8 8 C13 10 18 15 20 22 Z" />
      <path d="M20 22 C26 19 31 14 32 8 C27 10 22 15 20 22 Z" />
    </svg>
  )
}

export function Divider() {
  return (
    <div className="gs-divider" aria-hidden="true">
      <span />
      <Lotus />
      <span />
    </div>
  )
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="gs">
      <header className="gs-header">
        <nav className="gs-nav gs-nav-left" aria-label="Main">
          <Link to="/">Home</Link>
          <Link to="/journal">Journal</Link>
        </nav>
        <Link to="/" className="gs-logo">
          Nestled Reverie
        </Link>
        <nav className="gs-nav gs-nav-right" aria-label="More">
          <Link to="/" hash="about">
            About
          </Link>
          <Link to="/" hash="topics">
            Topics
          </Link>
        </nav>
      </header>
      <Divider />

      <main>{children}</main>

      <footer className="gs-footer">
        <Divider />
        <Link to="/" className="gs-logo gs-logo-small">
          Nestled Reverie
        </Link>
        <nav aria-label="Footer">
          <Link to="/">Home</Link>
          <Link to="/journal">Journal</Link>
          <Link to="/" hash="about">
            About
          </Link>
        </nav>
        <span className="gs-copy">© {new Date().getFullYear()} · Written in Boston</span>
      </footer>
    </div>
  )
}
