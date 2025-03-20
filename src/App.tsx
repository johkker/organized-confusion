import { useState, useRef, useEffect } from 'react'
import './App.css'
import Header from './components/Header/Header'
import Events from './components/Events/Events'
import Catalog from './components/Catalog/Catalog'
import Contact from './components/Contact/Contact'
import ThreeDBackground from './components/ThreeD/ThreeDBackground'

function App() {
  const [activeSection, setActiveSection] = useState<'home' | 'events' | 'catalog' | 'contact' | 'ingressos'>('home')
  const [logoLoaded, setLogoLoaded] = useState(false)
  const [showLogo, setShowLogo] = useState(false)
  
  const eventsRef = useRef<HTMLDivElement>(null)
  const catalogRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const ingressosRef = useRef<HTMLDivElement>(null)
  
  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      const headerOffset = 80; // Adjust this value based on your header height
      const elementPosition = ref.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
  
  const handleEventsClick = () => {
    setActiveSection('events');
    scrollToSection(eventsRef);
  }
  
  const handleCatalogClick = () => {
    setActiveSection('catalog');
    scrollToSection(catalogRef);
  }
  
  const handleContactClick = () => {
    setActiveSection('contact');
    scrollToSection(contactRef);
  }

  const handleIngressosClick = () => {
    setActiveSection('ingressos');
    scrollToSection(ingressosRef);
  }

  // Set active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100; // Add some offset
      
      if (ingressosRef.current && scrollPosition >= ingressosRef.current.offsetTop && 
          scrollPosition < eventsRef.current?.offsetTop!) {
        setActiveSection('ingressos');
      } else if (eventsRef.current && scrollPosition >= eventsRef.current.offsetTop && 
                scrollPosition < catalogRef.current?.offsetTop!) {
        setActiveSection('events');
      } else if (catalogRef.current && scrollPosition >= catalogRef.current.offsetTop && 
                scrollPosition < contactRef.current?.offsetTop!) {
        setActiveSection('catalog');
      } else if (contactRef.current && scrollPosition >= contactRef.current.offsetTop) {
        setActiveSection('contact');
      } else {
        setActiveSection('home');
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Preload the logo image with a delay
  useEffect(() => {
    const img = new Image();
    img.src = '/logo.png';
    img.onload = () => {
      setLogoLoaded(true);
      
      // Add a 3-second delay before showing the logo
      setTimeout(() => {
        setShowLogo(true);
      }, 1200);
    };
  }, []);

  return (
    <div className="app">
      <div className="background-container">
        <ThreeDBackground />
      </div>
      
      <Header 
        activeSection={activeSection}
        onEventsClick={handleEventsClick}
        onCatalogClick={handleCatalogClick}
        onContactClick={handleContactClick}
        onIngressosClick={handleIngressosClick}
      />
      
      <main>
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <div className="title-logo-container">
                {showLogo ? (
                  <div className="logo-container">
                    <img 
                      src="/logo.png" 
                      alt="Organized Confusion" 
                      className="hero-logo fade-in" 
                    />
                  </div>
                ) : (
                  <h1 className={`hero-title ${logoLoaded ? 'preparing-fade-out' : ''}`}>
                    Organized <span>Confusion</span>
                  </h1>
                )}
              </div>
              <p className="hero-subtitle">
                Eventos e produtos que exploram a interseção entre arte, música eletrônica e experiências imersivas
              </p>
              <div className="hero-buttons">
                <button
                  onClick={handleEventsClick}
                  className="btn btn-primary"
                >
                  Explorar Eventos
                </button>
                <button
                  onClick={handleCatalogClick}
                  className="btn btn-secondary"
                >
                  Ver Catálogo
                </button>
              </div>
            </div>
          </div>
        </section>
        
        <section id="ingressos" ref={ingressosRef} className="section ingressos-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Ingressos</h2>
              <p className="section-description">
                Ingressos à venda para nossos próximos eventos disponíveis aqui
              </p>
            </div>
            <div className="ingressos-content">
              <div className="ticket-card">
                <div className="ticket-card-inner">
                  <div className="ticket-card-front">
                    <div className="ticket-info">
                      <h3>Aniversários 2025</h3>
                      <p className="ticket-date">5 de Abril • 16h</p>
                      <p className="ticket-location">Local Secreto • Curitiba</p>
                      <div className="ticket-price">R$ 50,00</div>
                    </div>
                  </div>
                  <div className="ticket-card-back">
                    <p>Organized Confusion</p>
                    <p>Música, arte, contra-cultura</p>
                    <p>De amigos, para amigos.</p>
                  </div>
                </div>
              </div>
              <a href="https://pixta.me/p/organized-confusion" target="_blank" rel="noopener noreferrer" className="ticket-link-button">
                Comprar Ingressos
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </section>
        
        <section id="events" ref={eventsRef} className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Eventos</h2>
              <p className="section-description">
                Descubra nossos próximos eventos de música eletrônica e experiências imersivas
              </p>
            </div>
            <Events />
          </div>
        </section>
        
        <section id="catalog" ref={catalogRef} className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Catálogo</h2>
              <p className="section-description">
                Explore nossa coleção de produtos psicodélicos e arte digital
              </p>
            </div>
            <Catalog />
          </div>
        </section>
        
        <section id="contact" ref={contactRef} className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Contato</h2>
              <p className="section-description">
                Entre em contato conosco para mais informações sobre eventos ou produtos
              </p>
            </div>
            <Contact />
          </div>
        </section>
      </main>
      
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h2>
                <span className="text-white">OC</span>
                <span className="text-secondary">041</span>
              </h2>
            </div>
            <p className="footer-copyright">
              &copy; {new Date().getFullYear()} Organized Confusion. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
