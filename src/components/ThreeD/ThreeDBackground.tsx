import { Canvas } from '@react-three/fiber'
import PsychedelicBackground from './scenes/PsychedelicBackground'

const ThreeDBackground = () => {
  return (
    <div className="threejs-container">
      <Canvas 
        dpr={[1, 2]}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      >
        <PsychedelicBackground />
      </Canvas>
    </div>
  )
}

export default ThreeDBackground 