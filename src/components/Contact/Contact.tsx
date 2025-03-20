import { useState } from 'react'
import './contact.scss'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }
    
    setFormStatus('submitting')
    
    // Simulate form submission
    setTimeout(() => {
      // In a real app, you would make an API call here
      console.log('Form data:', formData)
      
      // Simulate success
      setFormStatus('success')
      
      // Reset form after success
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setFormStatus('idle')
      }, 5000)
    }, 1500)
  }
  
  const getWhatsAppLink = () => {
    const phone = '5541995085440' // Replace with actual phone number
    const message = encodeURIComponent('Olá! Gostaria de saber mais sobre os eventos da Organized Confusion.')
    return `https://wa.me/${phone}?text=${message}`
  }
  
  return (
    <div className="contact-container">
      <div className="contact-wrapper">
        <div className="contact-info">
          <h2 className="contact-title">Entre em Contato</h2>
          <p className="contact-description">
            Tem interesse em nossos eventos ou produtos? Quer colaborar conosco?
            Envie-nos uma mensagem e responderemos o mais breve possível.
          </p>
          
          <div className="contact-methods">
            <div className="contact-method">
              <div className="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div className="contact-info-content">
                <h3>Telefone</h3>
                <p>+55 (41) 99508-5440</p>
              </div>
            </div>
            
            <div className="contact-method">
              <div className="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div className="contact-info-content">
                <h3>Email</h3>
                <p>organizedconfusion@gmail.com</p>
              </div>
            </div>
            
            <div className="contact-method">
              <div className="contact-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <div className="contact-info-content">
                <h3>Instagram</h3>
                <p>@oc041</p>
              </div>
            </div>
          </div>
          
          <div className="social-links">
            <a href="https://instagram.com/oc041" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="https://facebook.com/oc041" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385h-3.047v-3.47h3.047v-2.642c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385c5.737-.9 10.125-5.864 10.125-11.854z"/>
              </svg>
            </a>
            <a href="https://twitter.com/oc041" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.055 10.055 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.915 13.915 0 007.552 2.209c9.053 0 14-7.496 14-13.986 0-.209 0-.42-.015-.63A9.935 9.935 0 0024 4.59l-.047-.02z"/>
              </svg>
            </a>
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345z"/>
                <path d="M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.334.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.71 1.447h.006c6.585 0 11.946-5.336 11.949-11.896 0-3.176-1.24-6.165-3.495-8.411"/>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Seu nome"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu.email@exemplo.com"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Assunto</label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              >
                <option value="">Selecione um assunto</option>
                <option value="eventos">Eventos</option>
                <option value="produtos">Produtos</option>
                <option value="parcerias">Parcerias</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Mensagem *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Sua mensagem"
                rows={5}
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className={`submit-button ${formStatus === 'submitting' ? 'submitting' : ''}`}
              disabled={formStatus === 'submitting'}
            >
              {formStatus === 'submitting' ? (
                <span className="spinner"></span>
              ) : formStatus === 'success' ? (
                'Mensagem Enviada!'
              ) : (
                'Enviar Mensagem'
              )}
            </button>
            
            {formStatus === 'success' && (
              <div className="form-success-message">
                Sua mensagem foi enviada com sucesso! Retornaremos em breve.
              </div>
            )}
            
            {formStatus === 'error' && (
              <div className="form-error-message">
                Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact 