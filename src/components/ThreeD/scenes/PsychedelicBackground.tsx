import { PerspectiveCamera, Sparkles, OrbitControls } from '@react-three/drei'
import { Color } from 'three'
import { useMediaQuery } from '../../../hooks/useMediaQuery'
// import CircuitBoardBackground from '../objects/CircuitBoardBackground'
import MouseFollower from '../objects/MouseFollower'

const PsychedelicBackground = () => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  
  return (
    <>
      <color attach="background" args={['#010108']} />
      
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
      
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[0, 0, 0]} intensity={0.5} color="#00ff4c" />
      
      {/* <CircuitBoardBackground /> */}
      
      <Sparkles 
        count={isMobile ? 1000 : 2000}
        scale={[20, 20, 20]} 
        size={2} 
        speed={0.3} 
        color={new Color('#ffffff')} 
      />
      
      <MouseFollower />
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        autoRotate 
        autoRotateSpeed={0.5} 
        maxPolarAngle={Math.PI / 2} 
        minPolarAngle={Math.PI / 2}
      />
    </>
  )
}

export default PsychedelicBackground 