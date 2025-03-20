import { useState, useEffect } from 'react'
import './header.scss'

interface HeaderProps {
  activeSection: 'home' | 'events' | 'catalog' | 'contact' | 'ingressos'
  onEventsClick: () => void
  onCatalogClick: () => void
  onContactClick: () => void
  onIngressosClick?: () => void
}

const Header = ({ 
  activeSection, 
  onEventsClick, 
  onCatalogClick, 
  onContactClick, 
  onIngressosClick 
}: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={isScrolled ? 'scrolled' : 'transparent'}>
      <div className="container header-container">
        {/* Logo */}
        <div className="logo">
          <h1>
            <span className="logo-text">OC</span>
            <span className="logo-highlight">041</span>
          </h1>
        </div>

        {/* Desktop Menu */}
        <nav className="desktop-menu">
          {onIngressosClick && (
            <button 
              onClick={onIngressosClick} 
              className={`nav-button ticket-nav-button ${activeSection === 'ingressos' ? 'active' : ''}`}
            >
              Ingressos
              <span className="ticket-indicator"></span>
            </button>
          )}
          <button 
            onClick={onEventsClick} 
            className={`nav-button ${activeSection === 'events' ? 'active' : ''}`}
          >
            Eventos
          </button>
          <button 
            onClick={onCatalogClick} 
            className={`nav-button ${activeSection === 'catalog' ? 'active' : ''}`}
          >
            Catálogo
          </button>
          <button 
            onClick={onContactClick} 
            className={`nav-button ${activeSection === 'contact' ? 'active' : ''}`}
          >
            Contato
          </button>
          <a 
            href="https://www.instagram.com/oc041/" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="social-icon"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
            </svg>
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="icon">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="container mobile-menu-container">
            {onIngressosClick && (
              <button 
                onClick={() => {
                  onIngressosClick()
                  setIsMobileMenuOpen(false)
                }} 
                className={`mobile-nav-button mobile-ticket-button ${activeSection === 'ingressos' ? 'active' : ''}`}
              >
                Ingressos
                <span className="ticket-indicator"></span>
              </button>
            )}
            <button 
              onClick={() => {
                onEventsClick()
                setIsMobileMenuOpen(false)
              }} 
              className={`mobile-nav-button ${activeSection === 'events' ? 'active' : ''}`}
            >
              Eventos
            </button>
            <button 
              onClick={() => {
                onCatalogClick()
                setIsMobileMenuOpen(false)
              }} 
              className={`mobile-nav-button ${activeSection === 'catalog' ? 'active' : ''}`}
            >
              Catálogo
            </button>
            <button 
              onClick={() => {
                onContactClick()
                setIsMobileMenuOpen(false)
              }} 
              className={`mobile-nav-button ${activeSection === 'contact' ? 'active' : ''}`}
            >
              Contato
            </button>
            <a 
              href="https://www.instagram.com/oc041/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mobile-social-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="icon">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              Instagram
            </a>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header 