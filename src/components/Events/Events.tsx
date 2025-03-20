import { useState, useRef, useEffect } from 'react'
import './events.scss'
import { useMediaQuery } from '../../hooks/useMediaQuery'

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  imageUrl: string
  ticketLink: string
}

const Events = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const carouselRef = useRef<HTMLDivElement>(null)
  
  const events: Event[] = [
    {
      id: '1',
      title: "B'day Party",
      date: '05 Abril 2025',
      time: '16:00',
      location: 'Pinhais, PR',
      description: 'Open Cooler, piscina e 24h de muitaaaa psicodelia.',
      imageUrl: 'https://i.imgur.com/pGbpAdL.png',
      ticketLink: 'https://pixta.me/u/aniversarios-2025-oc'
    },
    {
      id: '2',
      title: 'Edição Julina - 2025',
      date: 'Julho 2025',
      time: '??:??',
      location: 'TBD',
      description: 'Fogueira, quentão e forrozinho alienígena.',
      imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
      ticketLink: '#'
    },
    {
      id: '3',
      title: 'Halloween Edition',
      date: 'Outubro 2025',
      time: '??:??',
      location: 'TBD',
      description: 'Uma noite aterrorizante de HIBPM daquele jeitinho que você gosta.',
      imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
      ticketLink: '#'
    },
    {
      id: '4',
      title: 'Encerramento do Ano',
      date: 'Dezembro 2025',
      time: '??:??',
      location: 'TBD',
      description: 'Encerramento do ano, recheado de nossos DJs favoritos.',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
      ticketLink: '#'
    }
  ]

  const totalSlides = isMobile ? events.length : Math.ceil(events.length / 3)
  
  // Handle automatic scrolling when activeIndex changes
  useEffect(() => {
    if (!carouselRef.current) return
    
    const slideWidth = isMobile 
      ? carouselRef.current.offsetWidth
      : (carouselRef.current.offsetWidth - 64) / 3 + 16 // Accounting for gap
      
    carouselRef.current.scrollTo({
      left: activeIndex * (slideWidth + (isMobile ? 16 : 32)), // Adding gap
      behavior: 'smooth'
    })
  }, [activeIndex, isMobile])

  const scrollToIndex = (index: number) => {
    setActiveIndex(index)
  }

  const nextSlide = () => {
    setActiveIndex(prev => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setActiveIndex(prev => (prev - 1 + totalSlides) % totalSlides)
  }

  // Mobile touch handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current || !isMobile) return
    
    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!carouselRef.current || !isMobile) return
    
    setIsDragging(true)
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current || !isMobile) return
    
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2 // *2 for faster scrolling
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current || !isMobile) return
    
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleDragEnd = () => {
    if (!carouselRef.current || !isMobile) return
    
    setIsDragging(false)
    
    // Determine which slide we should snap to
    const slideWidth = carouselRef.current.offsetWidth + 16 // Width + gap
    const newIndex = Math.round(carouselRef.current.scrollLeft / slideWidth)
    setActiveIndex(Math.max(0, Math.min(newIndex, events.length - 1)))
  }

  return (
    <div className="events-container">
      <div className="events-carousel-wrapper">
        <button 
          className="carousel-nav-button prev" 
          onClick={prevSlide}
          aria-label="Previous event"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <div 
          className="events-carousel"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
        >
          {events.map((event, _index) => (
            <div className="event-card" key={event.id}>
              <div className="event-image">
                <img src={event.imageUrl} alt={event.title} />
                <div className="event-overlay"></div>
                <div className="event-date-badge">{event.date}</div>
              </div>
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                <div className="event-details">
                  <div className="event-detail">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{event.time}</span>
                  </div>
                  <div className="event-detail">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{event.location}</span>
                  </div>
                </div>
                <p className="event-description">{event.description}</p>
                <a href={event.ticketLink} className="event-link">
                  Ver Detalhes
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          className="carousel-nav-button next" 
          onClick={nextSlide}
          aria-label="Next event"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      
      <div className="carousel-indicators">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`carousel-indicator ${activeIndex === index ? 'active' : ''}`}
            onClick={() => scrollToIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default Events 