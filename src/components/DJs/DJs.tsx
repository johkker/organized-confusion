import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './DJs.scss'
import { useDJStore, type DJ } from '../../store/djStore'

interface DJModalProps {
  dj: DJ
  onClose: () => void
}

const DJModal = ({ dj, onClose }: DJModalProps) => (
  <div className="dj-modal">
    <div className="dj-modal-content">
      <button className="close-modal" onClick={onClose}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      
      <div className="modal-dj-details">
        <div className="modal-dj-header">
          <img src={dj.image} alt={dj.name} className="modal-dj-image" />
          <div className="modal-dj-info">
            <h2 className="modal-dj-name">{dj.name}</h2>
          </div>
        </div>
        
        <p className="modal-dj-description">{dj.description}</p>
        
        <div className="modal-soundcloud-widget">
          <iframe 
            width="100%" 
            height="166" 
            scrolling="no" 
            frameBorder="no" 
            allow="autoplay" 
            src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${dj.trackId}&color=%23ff5b14&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`}
            title={`${dj.name} SoundCloud Track`}
          ></iframe>
        </div>
        
        <a 
          href={dj.soundcloud} 
          target="_blank" 
          rel="noopener noreferrer"
          className="soundcloud-profile-link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 17.939h-1v-8.068c.308-.231.639-.429 1-.566v8.634zm3 0h1v-9.224c-.229.265-.443.548-.621.857l-.379-.184v8.551zm-2 0h1v-8.848c-.508-.079-.623-.268-1-.398v9.246zm-4 0h1v-7.02c-.312.183-.657.304-1 .362v6.658zm-3-5.25c-.606.547-1 1.354-1 2.268 0 .914.394 1.721 1 2.268v-4.536zm18.879-.671c-.204-2.837-2.404-5.079-5.117-5.079-1.022 0-1.964.328-2.762.877v10.123h9.089c1.607 0 2.911-1.393 2.911-3.106 0-2.233-2.168-3.772-4.121-2.815zm-16.879-.027c-.302-.024-.526-.03-1 .122v5.689c.446.143.636.138 1 .138v-5.949z"/>
          </svg>
          Ver perfil no SoundCloud
        </a>
      </div>
    </div>
  </div>
)

interface DJCardProps {
  dj: DJ
  onClick: () => void
}

const DJCard = ({ dj, onClick }: DJCardProps) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <motion.div
      className="dj-card"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="dj-image">
        <img src={dj.image} alt={dj.name} />
      </div>
      <h3 className="dj-name">{dj.name}</h3>
      {!isMobile && (
        <div className="dj-genres">
          {dj.genres.map((genre, index) => (
            <span key={index} className="genre-tag">{genre}</span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

interface DJsProps {
  djNames?: string[]
}

const DJs = ({ djNames }: DJsProps) => {
  const { djs } = useDJStore()
  const [selectedDJ, setSelectedDJ] = useState<DJ | null>(null)
  const [displayDJs, setDisplayDJs] = useState<DJ[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)
  const [availableGenres, setAvailableGenres] = useState<string[]>([])

  // First filter DJs based on provided names
  useEffect(() => {
    let filtered = djs
    if (djNames && djNames.length > 0) {
      filtered = filtered.filter(dj => djNames.includes(dj.name))
    }
    setDisplayDJs(filtered)
  }, [djNames, djs])

  // Then extract genres only from the filtered DJs
  useEffect(() => {
    const genres = new Set<string>()
    displayDJs.forEach(dj => {
      dj.genres.forEach(genre => genres.add(genre))
    })
    setAvailableGenres(Array.from(genres).sort())
    // Reset selected genre if it's not in the new available genres
    if (selectedGenre && !genres.has(selectedGenre)) {
      setSelectedGenre(null)
    }
  }, [displayDJs, selectedGenre])

  // Finally filter by genre if one is selected
  useEffect(() => {
    if (selectedGenre) {
      setDisplayDJs(prev => 
        prev.filter(dj => dj.genres.includes(selectedGenre))
      )
    } else {
      // Reset to initial filtered state
      let filtered = djs
      if (djNames && djNames.length > 0) {
        filtered = filtered.filter(dj => djNames.includes(dj.name))
      }
      setDisplayDJs(filtered)
    }
  }, [selectedGenre, djNames, djs])

  return (
    <div className="djs-container">
      {availableGenres.length > 0 && (
        <div className="genre-filters">
          <button
            className={`genre-filter ${!selectedGenre ? 'active' : ''}`}
            onClick={() => setSelectedGenre(null)}
          >
            <span>TODOS</span>
          </button>
          {availableGenres.map((genre) => (
            <button
              key={genre}
              className={`genre-filter ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              <span>{genre}</span>
            </button>
          ))}
        </div>
      )}

      <div className="djs-grid">
        {displayDJs.map((dj) => (
          <DJCard
            key={dj.id}
            dj={dj}
            onClick={() => setSelectedDJ(dj)}
          />
        ))}
      </div>

      {selectedDJ && (
        <DJModal
          dj={selectedDJ}
          onClose={() => setSelectedDJ(null)}
        />
      )}
    </div>
  )
}

export default DJs