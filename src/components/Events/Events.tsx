import { useState, useRef, useEffect } from 'react'
import './events.scss'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import DJs from '../DJs/DJs'

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  imageUrl: string
  ticketLink: string
  isPast: boolean
  status?: 'sold-out' | 'available' | 'coming-soon'
  price?: string
  lineup?: {
    name: string
    role: 'dj' | 'vj' | 'live'
    time?: string
  }[]
}

const Events = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [showPastEvents, setShowPastEvents] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const [selectedLineup, setSelectedLineup] = useState<string[] | null>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')
  const carouselRef = useRef<HTMLDivElement>(null)
  
  const events: Event[] = [
    {
      id: '1',
      title: "B'day Party",
      date: '05 Abril 2025',
      time: '16:00',
      location: 'Pinhais, PR',
      description: 'Open Cooler, piscina e 24h de muitaaaa psicodelia. Uma celebração única com os melhores DJs da cena local e muitas surpresas para você curtir!',
      imageUrl: 'https://i.imgur.com/pGbpAdL.png',
      ticketLink: 'https://pixta.me/u/aniversarios-2025-oc',
      isPast: true,
      status: 'available',
      price: 'R$ 50,00',
      lineup: [
      ]
    },
    {
      id: '2',
      title: 'DARK-TECH',
      date: '17 Maio 2025',
      time: '21:00',
      location: 'Oroboro Underground - Curitiba, PR',
      description: `A gente simplesmente não consegue ficar sem trazer uma bagunça para vocês.

Dessa vez, uma noite dedicada ao melhor que temos de dark-psy e hi-tech! No coração da cidade, no bar mais underground da cena, Oroboro Underground.

Com somente 4 nomes, para que o artistas possam contar suas histórias com liberdade.

Venha, chame os amigos, aproveite a bruxaria.

Vida longa ao underground.`,
      imageUrl: 'https://s3.sa-east-1.amazonaws.com/pixtame-public/qtu7euqkss2c73uejy204qrzc2a4.webp',
      ticketLink: 'https://pixta.me/u/organized-confusion-dark_tech-pokt-edition',
      isPast: false,
      status: 'available',
      lineup: [
        {
          name: 'Adarrun',
          role: 'dj',
          time: '00:00 - 03:00',
        },
        {
          name: 'DARTRIX',
          role: 'dj',
          time: '23:00 - 01:00',
        },
        {
          name: 'AMMINT',
          role: 'dj',
          time: '21:00 - 23:00',
        },
        {
          name: 'Slippermode',
          role: 'dj',
          time: '03:00 - 05:00',
        }
      ]
    },
    {
      id: '3',
      title: 'Edição Julina - 2025',
      date: 'Julho 2025',
      time: '??:??',
      location: 'TBD',
      description: 'Fogueira, quentão e forrozinho alienígena.',
      imageUrl: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
      ticketLink: '#',
      isPast: false,
      status: 'coming-soon',
      lineup: [
        {
          name: 'Line-up em breve',
          role: 'dj'
        }
      ]
    },
    {
      id: '4',
      title: 'Halloween Edition',
      date: 'Outubro 2025',
      time: '??:??',
      location: 'TBD',
      description: 'Trick or treat, mdfker??? ',
      imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3',
      ticketLink: '#',
      isPast: false,
      status: 'coming-soon'
    },
    {
      id: '5',
      title: 'Encerramento do Ano',
      date: 'Dezembro 2025',
      time: '??:??',
      location: 'TBD',
      description: 'Pra fechar daquele jeito.',
      imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
      ticketLink: '#',
      isPast: false,
      status: 'coming-soon'
    }
  ]

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
                      
                      {event.lineup && event.lineup.length > 0 && (
                        <div className="event-lineup">
                          <button 
                            className="lineup-button"
                            onClick={() => setSelectedLineup(event.lineup?.map(artist => artist.name) || null)}
                          >
                            Ver Line-up
                          </button>
                        </div>
                      )}

                      <a 
                        href={event.ticketLink} 
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