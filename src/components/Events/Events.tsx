import { useState, useRef, useEffect } from 'react'
import './events.scss'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import DJs from '../DJs/DJs'
import { useEventStore } from '../../store/eventStore'

const Events = () => {
  const { events, loading, error, fetchEvents } = useEventStore()
  const [activeIndex, setActiveIndex] = useState(0)
  const [showPastEvents, setShowPastEvents] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [selectedLineup, setSelectedLineup] = useState<string[] | null>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const carouselRef = useRef<HTMLDivElement>(null)
  
  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const filteredEvents = events.filter(event => event.isPast === showPastEvents)
  const totalSlides = filteredEvents.length

  useEffect(() => {
    setActiveIndex(0)
  }, [showPastEvents])
  
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
    const walk = (x - startX) * 2
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
    const slideWidth = carouselRef.current.offsetWidth
    const newIndex = Math.round(carouselRef.current.scrollLeft / slideWidth)
    setActiveIndex(Math.max(0, Math.min(newIndex, filteredEvents.length - 1)))
  }

  const nextSlide = () => {
    if (!carouselRef.current) return
    const newIndex = (activeIndex + 1) % totalSlides
    setActiveIndex(newIndex)
    carouselRef.current.scrollTo({
      left: carouselRef.current.offsetWidth * newIndex,
      behavior: 'smooth'
    })
  }

  const prevSlide = () => {
    if (!carouselRef.current) return
    const newIndex = (activeIndex - 1 + totalSlides) % totalSlides
    setActiveIndex(newIndex)
    carouselRef.current.scrollTo({
      left: carouselRef.current.offsetWidth * newIndex,
      behavior: 'smooth'
    })
  }

  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return
    setActiveIndex(index)
    carouselRef.current.scrollTo({
      left: carouselRef.current.offsetWidth * index,
      behavior: 'smooth'
    })
  }

  // Add effect to handle carousel position when filtered events change
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: 0,
        behavior: 'smooth'
      })
      setActiveIndex(0)
    }
  }, [showPastEvents])

  // Add effect to handle carousel position when active index changes
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollTo({
        left: carouselRef.current.offsetWidth * activeIndex,
        behavior: 'smooth'
      })
    }
  }, [activeIndex])

  if (loading) {
    return <div className="loading-container">Loading events...</div>;
  }

  if (error) {
    console.warn(error);
    // Continue with the fallback data
  }

  return (
    <>
      {selectedLineup ? (
        <>
          <button 
            className="back-to-events"
            onClick={() => setSelectedLineup(null)}
            title="Voltar para Eventos"
          >
            <span className="material-symbols-outlined back-icon">arrow_back</span>
          </button>
          <DJs djNames={selectedLineup} />
        </>
      ) : (
        <>
          <div className="events-container">
            <div className="events-header">
              <div className="events-toggle">
                <button 
                  className={`toggle-button ${!showPastEvents ? 'active' : ''}`}
                  onClick={() => setShowPastEvents(false)}
                >
                  Próximos Eventos
                </button>
                <button 
                  className={`toggle-button ${showPastEvents ? 'active' : ''}`}
                  onClick={() => setShowPastEvents(true)}
                >
                  Eventos Passados
                </button>
              </div>
            </div>

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
                style={{
                  display: 'flex',
                  scrollSnapType: 'x mandatory',
                  scrollBehavior: 'smooth',
                  overflowX: 'hidden'
                }}
              >
                {filteredEvents.map((event, _index) => (
                  <div 
                    className={`event-card ${event.status}`} 
                    key={event.id}
                    style={{
                      flex: '0 0 100%',
                      scrollSnapAlign: 'start'
                    }}
                  >
                    <div className="event-image">
                      <img src={event.imageUrl} alt={event.title} />
                      <div className="event-overlay"></div>
                      <div className="event-date-badge">{event.date}</div>
                      {event.status && (
                        <div className={`event-status ${event.status}`}>
                          {event.status === 'sold-out' ? 'Esgotado' : 
                           event.status === 'coming-soon' ? 'Em Breve' : 
                           'Disponível'}
                        </div>
                      )}
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
                        {event.price && (
                          <div className="event-detail">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <line x1="12" y1="1" x2="12" y2="23"></line>
                              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                            <span>{event.price}</span>
                          </div>
                        )}
                      </div>
                      <p className="event-description">{event.description}</p>
                      
                      {event.djs && event.djs.length > 0 && (
                        <div className="event-lineup">
                          <button 
                            className="lineup-button"
                            onClick={() => setSelectedLineup(event.djs?.map(dj => dj.name) || null)}
                          >
                            Ver Line-up
                          </button>
                        </div>
                      )}

                      <a 
                        href={event.ticketLink || '#'} 
                        className={`event-link ${event.status}`}
                        {...((event.status === 'coming-soon' || event.status === 'sold-out' || event.isPast) && { 'aria-disabled': 'true' })}
                      >
                        {event.status === 'sold-out' ? 'ESGOTADO' :
                         event.status === 'coming-soon' ? 'EM BREVE' :
                         event.isPast ? 'INDISPONÍVEL' :
                         'INGRESSOS'}
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
        </>
      )}
    </>
  )
}

export default Events 