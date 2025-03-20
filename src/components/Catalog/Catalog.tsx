import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './catalog.scss'

interface DJ {
  id: number
  name: string
  genre: string
  image: string
  description: string
  soundcloud: string
  trackId: string
}

const mockDJs: DJ[] = [
  {
    id: 1,
    name: "Adarrun",
    genre: "Psytrance",
    image: "https://i1.sndcdn.com/avatars-Q4d8RgXR0Erj0EbO-mqDFqg-t500x500.jpg",
    description: "Explorando os limites da psicodelia sonora, Adarrun despensa apresentações. Só sentindo a pista, para entender.",
    soundcloud: "https://soundcloud.com/adarrun",
    trackId: "1393743490"
  },
  {
    id: 2,
    name: "Ynoc",
    genre: "Drum & Bass",
    image: "https://i.imgur.com/5MJnNOO.jpeg",
    description: "Produtor Musical, Beatmaker & DJ.",
    soundcloud: "https://soundcloud.com/ynocprod",
    trackId: "1354937299"
  },
  {
    id: 3,
    name: "Slippermode",
    genre: "Psytrance",
    image: "https://i1.sndcdn.com/avatars-B85zMCtvXB9eRi0K-ZS9YEg-t500x500.jpg",
    description: "Após se formar DJ, iniciou sua carreira no final de 2022 e desde então vem integrando o Line Up das melhores festas de Curitiba e Região.",
    soundcloud: "https://soundcloud.com/slippermode",
    trackId: "1919070914"
  },
  {
    id: 4,
    name: "Flória",
    genre: "House",
    image: "https://i1.sndcdn.com/avatars-YEEToU0sTzlEnfoB-oxWSxA-t500x500.jpg",
    description: "Sets imersivos, com influências de house, tech house, deep house e tech house.",
    soundcloud: "https://soundcloud.com/nathalia-dias-761771931",
    trackId: "1833171234"
  }
]

const DJCard = ({ dj, onClick }: { dj: DJ, onClick?: () => void }) => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Check initially
    checkMobile();
    
    // Set up listener for resize
    window.addEventListener('resize', checkMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-dark/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl h-full carousel-content-container"
      onClick={onClick}
    >
      <div className={`relative ${isMobile ? 'h-44' : 'h-64'}`}>
        <img 
          src={dj.image} 
          alt={dj.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 dj-content-container">
          <span className="inline-block px-4 py-2 bg-[#ff5b14] text-white text-sm font-semibold rounded-full mb-2 dj-genre">
            {dj.genre}
          </span>
          <h3 className="text-xl font-display font-semibold text-white dj-name">{dj.name}</h3>
        </div>
      </div>
      {!isMobile ? (
        <div className="p-4 flex flex-col h-[calc(100%-16rem)]">
          <p className="text-light/60 mb-4 text-sm flex-grow overflow-auto">
            {dj.description}
          </p>
          <div className="mb-4 soundcloud-container">
            <iframe 
              width="100%" 
              height="120" 
              scrolling="no" 
              frameBorder="no" 
              allow="autoplay" 
              src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${dj.trackId}&color=%23ff5b14&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
              title={`${dj.name} SoundCloud Track`}
            ></iframe>
          </div>
          <button 
            onClick={onClick}
            className="profile-button"
          >
            Perfil Completo
          </button>
        </div>
      ) : (
        <div className="p-3 flex flex-col">
          <div className="mb-2">
            <iframe 
              width="100%" 
              height="80" 
              scrolling="no" 
              frameBorder="no" 
              allow="autoplay" 
              src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${dj.trackId}&color=%23ff5b14&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
              title={`${dj.name} SoundCloud Track`}
            ></iframe>
          </div>
          <button 
            onClick={onClick}
            className="profile-button mobile-profile-button"
          >
            Perfil Completo
          </button>
        </div>
      )}
    </motion.div>
  )
}

const Catalog = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos')
  const [filteredDJs, setFilteredDJs] = useState<DJ[]>([])
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<DJ | null>(null)
  
  // Carousel state
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)
  
  const isMobile = () => window.innerWidth <= 768
  
  // DJs data
  const djList: DJ[] = mockDJs
  
  // Filter DJs when category changes
  useEffect(() => {
    let result = [...djList]
    
    // Apply category filter
    if (selectedCategory !== 'Todos') {
      result = result.filter(dj => dj.genre === selectedCategory)
    }
    
    setFilteredDJs(result)
  }, [selectedCategory])
  
  // Handle automatic scrolling when activeIndex changes
  useEffect(() => {
    if (!carouselRef.current) return
    
    const slideWidth = isMobile() 
      ? carouselRef.current.offsetWidth
      : (carouselRef.current.offsetWidth - 64) / 3 + 16 // Accounting for gap
      
    carouselRef.current.scrollTo({
      left: activeIndex * (slideWidth + (isMobile() ? 16 : 32)), // Adding gap
      behavior: 'smooth'
    })
  }, [activeIndex])
  
  // Update activeIndex when screen size changes
  useEffect(() => {
    const handleResize = () => {
      // Reset active index when switching between mobile and desktop
      if (activeIndex > 0) {
        setActiveIndex(0)
      }
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [activeIndex])
  
  const openProductModal = (product: DJ) => {
    setSelectedProduct(product)
    setIsProductModalOpen(true)
  }
  
  const closeProductModal = () => {
    setIsProductModalOpen(false)
  }
  
  // Mobile touch handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current || !isMobile()) return
    
    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!carouselRef.current || !isMobile()) return
    
    setIsDragging(true)
    setStartX(e.touches[0].pageX - carouselRef.current.offsetLeft)
    setScrollLeft(carouselRef.current.scrollLeft)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !carouselRef.current || !isMobile()) return
    
    e.preventDefault()
    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2 // *2 for faster scrolling
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !carouselRef.current || !isMobile()) return
    
    const x = e.touches[0].pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2
    carouselRef.current.scrollLeft = scrollLeft - walk
  }

  const handleDragEnd = () => {
    if (!carouselRef.current || !isMobile()) return
    
    setIsDragging(false)
    
    // Determine which slide we should snap to
    const slideWidth = carouselRef.current.offsetWidth + 16 // Width + gap
    const newIndex = Math.round(carouselRef.current.scrollLeft / slideWidth)
    setActiveIndex(Math.max(0, Math.min(newIndex, filteredDJs.length - 1)))
  }
  
  // Calculate total slides based on screen size
  const totalSlides = isMobile() ? filteredDJs.length : Math.ceil(filteredDJs.length / 3)
  
  const scrollToIndex = (index: number) => {
    setActiveIndex(index)
  }

  const nextSlide = () => {
    setActiveIndex(prev => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setActiveIndex(prev => (prev - 1 + totalSlides) % totalSlides)
  }
  
  return (
    <div className="catalog-container">
      <div className="catalog-filters">
        <div className="category-filters">
          {['Todos', 'Psytrance', 'Drum & Bass', 'House', 'Techno', 'Ambient'].map(category => (
            <button
              key={category}
              className={`category-filter ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="catalog-carousel-wrapper">
        <button 
          className="carousel-nav-button prev" 
          onClick={prevSlide}
          aria-label="Previous DJ"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        
        <div 
          className="catalog-carousel"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
        >
          {filteredDJs.map(dj => (
            <div key={dj.id} className="carousel-item">
              <DJCard dj={dj} onClick={() => openProductModal(dj)} />
            </div>
          ))}
        </div>
        
        <button 
          className="carousel-nav-button next" 
          onClick={nextSlide}
          aria-label="Next DJ"
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
      
      {filteredDJs.length === 0 && (
        <div className="no-djs">
          <p>Nenhum DJ encontrado na categoria selecionada.</p>
        </div>
      )}
      
      {isProductModalOpen && selectedProduct && (
        <div className="product-modal">
          <div className="product-modal-content">
            <button className="close-modal" onClick={closeProductModal}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            
            <div className="modal-product-details">
              <div className="modal-product-image">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>
              <div className="modal-product-info">
                <h2 className="modal-product-name">{selectedProduct.name}</h2>
                <p className="modal-product-category">{selectedProduct.genre}</p>
                <p className="modal-product-description">{selectedProduct.description}</p>
                
                <div className="product-actions">
                  <a 
                    href={selectedProduct.soundcloud} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="soundcloud-button"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7 17.939h-1v-8.068c.308-.231.639-.429 1-.566v8.634zm3 0h1v-9.224c-.229.265-.443.548-.621.857l-.379-.184v8.551zm-2 0h1v-8.848c-.508-.079-.623-.268-1-.398v9.246zm-4 0h1v-7.02c-.312.183-.657.304-1 .362v6.658zm-3-5.25c-.606.547-1 1.354-1 2.268 0 .914.394 1.721 1 2.268v-4.536zm18.879-.671c-.204-2.837-2.404-5.079-5.117-5.079-1.022 0-1.964.328-2.762.877v10.123h9.089c1.607 0 2.911-1.393 2.911-3.106 0-2.233-2.168-3.772-4.121-2.815zm-16.879-.027c-.302-.024-.526-.03-1 .122v5.689c.446.143.636.138 1 .138v-5.949z"/>
                    </svg>
                    Ver no SoundCloud
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Catalog 