import './App.scss'
import { useState } from 'react'
import Header from './components/Header/Header'
import Events from './components/Events/Events'
import DJs from './components/DJs/DJs'
import Contact from './components/Contact/Contact'
import ThreeDBackground from './components/ThreeD/ThreeDBackground'

function App() {
  const [activeSection, setActiveSection] = useState<'events' | 'DJs' | 'contact'>('events')



  const renderActiveSection = () => {
    switch (activeSection) {
      case 'events':
        return <Events />;
      case 'DJs':
        return <DJs />;
      case 'contact':
        return <Contact />;
    }
  };

  return (
    <div className="app">
      <div className="background-container">
        <ThreeDBackground />
      </div>
      
      <Header 
        activeSection={activeSection}
        onEventsClick={() => setActiveSection('events')}
        onDJsClick={() => setActiveSection('DJs')}
        onContactClick={() => setActiveSection('contact')}
      />
      
      <main className="pwa-main">
        {renderActiveSection()}
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
