'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import './Navbar.css';

const services = [
  { label: 'Web Development', href: '#contact', icon: '⟨/⟩' },
  { label: 'Graphics Design', href: '#contact', icon: '◆' },
  { label: 'Video Editing', href: '#contact', icon: '▶' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownMenuRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  /* ── Scroll detection ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Close dropdown when clicking outside ── */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* ── GSAP dropdown animation ── */
  useEffect(() => {
    if (!dropdownMenuRef.current) return;
    if (dropdownOpen) {
      gsap.fromTo(
        dropdownMenuRef.current,
        { opacity: 0, y: -8, scale: 0.96, pointerEvents: 'none' },
        { opacity: 1, y: 0, scale: 1, pointerEvents: 'all', duration: 0.25, ease: 'power3.out' }
      );
      // Stagger children
      const items = dropdownMenuRef.current.querySelectorAll('.nav-dropdown-item');
      gsap.fromTo(items, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.2, stagger: 0.04, ease: 'power2.out', delay: 0.08 });
    } else {
      gsap.to(dropdownMenuRef.current, { opacity: 0, y: -6, scale: 0.97, pointerEvents: 'none', duration: 0.18, ease: 'power2.in' });
    }
  }, [dropdownOpen]);

  /* ── GSAP mobile drawer animation ── */
  useEffect(() => {
    if (!mobileDrawerRef.current) return;
    if (mobileOpen) {
      gsap.fromTo(
        mobileDrawerRef.current,
        { x: '100%', opacity: 0 },
        { x: '0%', opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    } else {
      gsap.to(mobileDrawerRef.current, { x: '100%', opacity: 0, duration: 0.3, ease: 'power2.in' });
    }
  }, [mobileOpen]);

  /* ── Navbar entrance ── */
  useEffect(() => {
    if (navRef.current) {
      gsap.fromTo(navRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.2 });
    }
  }, []);

  const handleServiceClick = (href: string) => {
    setDropdownOpen(false);
    setMobileOpen(false);
    if (pathname !== '/') {
      window.location.href = '/' + href;
    }
  };

  return (
    <>
      <div ref={navRef} className={`navbar-wrapper ${scrolled ? 'navbar-scrolled' : ''}`}>
        <nav className="navbar-inner">
          {/* Logo */}
          <Link href="/" className="navbar-brand">
            <div className="navbar-logo-ring">
              <img
                src="/images/icon-logo.png"
                alt="Prominence"
                className="navbar-logo-img"
                onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
              />
              <div className="navbar-logo-pulse" />
            </div>
            <span className="navbar-brand-text">Prominence</span>
          </Link>

          {/* Desktop Nav */}
          <div className="navbar-links">
            {/* Services Dropdown */}
            <div ref={dropdownRef} className="nav-dropdown-wrapper">
              <button
                className={`navbar-link nav-dropdown-trigger ${dropdownOpen ? 'active' : ''}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                Services
                <svg className={`nav-chevron ${dropdownOpen ? 'nav-chevron-open' : ''}`} width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div ref={dropdownMenuRef} className="nav-dropdown-menu" style={{ opacity: 0, pointerEvents: 'none' }}>
                {services.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    className="nav-dropdown-item"
                    onClick={() => handleServiceClick(s.href)}
                  >
                    <span className="nav-dropdown-icon">{s.icon}</span>
                    <span>{s.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* About Us */}
            <Link href="/about" className={`navbar-link ${pathname === '/about' ? 'navbar-link-active' : ''}`}>
              About Us
            </Link>
          </div>

          {/* Contact CTA */}
          <a
            href={pathname === '/' ? '#contact' : '/#contact'}
            className="navbar-cta"
          >
            Contact Us
          </a>

          {/* Mobile hamburger */}
          <button
            className={`navbar-hamburger ${mobileOpen ? 'navbar-hamburger-open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
          >
            <span /><span /><span />
          </button>
        </nav>
      </div>

      {/* Mobile Drawer */}
      <div ref={mobileDrawerRef} className={`navbar-mobile-drawer ${mobileOpen ? 'open' : ''}`} style={{ transform: 'translateX(100%)', opacity: 0 }}>
        <div className="navbar-mobile-drawer-inner">
          {/* Close */}
          <button className="navbar-mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          {/* Mobile links */}
          <div className="navbar-mobile-links">
            <p className="navbar-mobile-label">Services</p>
            {services.map((s) => (
              <a key={s.label} href={s.href} className="navbar-mobile-link" onClick={() => handleServiceClick(s.href)}>
                <span className="nav-dropdown-icon">{s.icon}</span>
                {s.label}
              </a>
            ))}
            <div className="navbar-mobile-divider" />
            <Link href="/about" className="navbar-mobile-link" onClick={() => setMobileOpen(false)}>
              About Us
            </Link>
            <div className="navbar-mobile-divider" />
            <a
              href={pathname === '/' ? '#contact' : '/#contact'}
              className="navbar-mobile-cta"
              onClick={() => setMobileOpen(false)}
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {mobileOpen && <div className="navbar-mobile-backdrop" onClick={() => setMobileOpen(false)} />}
    </>
  );
}
