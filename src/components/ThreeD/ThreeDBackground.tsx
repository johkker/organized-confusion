import { useRef, useState, useEffect } from 'react'
import { useFrame, Canvas, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Sparkles, OrbitControls } from '@react-three/drei'
import { Color, Mesh, PlaneGeometry, Vector2, Vector3 } from 'three'
import { useMediaQuery } from '../../hooks/useMediaQuery'

// Add a custom hook to track mouse position in normalized coordinates
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState(new Vector2(0, 0))
  
  const updateMousePosition = (event: MouseEvent) => {
    // Normalize mouse position to -1 to 1
    const x = (event.clientX / window.innerWidth) * 2 - 1
    const y = -(event.clientY / window.innerHeight) * 2 + 1
    setMousePosition(new Vector2(x, y))
  }
  
  useEffect(() => {
    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [])
  
  return mousePosition
}

interface WavyPlaneProps {
  color: string
  position: [number, number, number]
  rotation: [number, number, number]
}

// Mouse-following object component
const MouseFollower = () => {
  const mesh = useRef<Mesh>(null)
  const mousePos = useMousePosition()
  const { camera } = useThree()
  
  useFrame(() => {
    if (mesh.current) {
      // Convert mouse position to 3D space
      const vector = new Vector3(mousePos.x, mousePos.y, 0.5)
      vector.unproject(camera)
      const dir = vector.sub(camera.position).normalize()
      const distance = -camera.position.z / dir.z
      const pos = camera.position.clone().add(dir.multiplyScalar(distance))
      
      // Smooth movement with lerp
      mesh.current.position.x = mesh.current.position.x + (pos.x - mesh.current.position.x) * 0.1
      mesh.current.position.y = mesh.current.position.y + (pos.y - mesh.current.position.y) * 0.1
      
      // Add some movement to make it more interesting
      mesh.current.rotation.x += 0.01
      mesh.current.rotation.y += 0.01
    }
  })
  
  return (
    <mesh ref={mesh} position={[0, 0, 2]}>
      <icosahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial 
        color="#ff5b14" 
        emissive="#ff8c14"
        emissiveIntensity={0.8}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

const WavyPlane = ({ color, position, rotation }: WavyPlaneProps) => {
  const mesh = useRef<Mesh>(null)
  const time = useRef(0)
  
  useFrame((_state, delta) => {
    time.current += delta * 0.3
    
    if (mesh.current && mesh.current.geometry instanceof PlaneGeometry) {
      mesh.current.geometry.attributes.position.needsUpdate = true
      
      const positions = mesh.current.geometry.attributes.position.array as Float32Array
      const widthSegments = 32 // Match the args in the planeGeometry
      const heightSegments = 32 // Match the args in the planeGeometry
      const amountX = widthSegments + 1
      const amountY = heightSegments + 1
      
      for (let i = 0; i < amountX * amountY; i++) {
        const x = i % amountX
        const y = Math.floor(i / amountX)
        
        const posIndex = i * 3
        const waveX = 0.1 * Math.sin(x * 0.5 + time.current)
        const waveY = 0.1 * Math.sin(y * 0.5 + time.current * 0.8)
        
        positions[posIndex + 2] = waveX + waveY
      }
    }
  })
  
  return (
    <mesh ref={mesh} position={position} rotation={rotation}>
      <planeGeometry args={[25, 25, 32, 32]} />
      <meshStandardMaterial color={color} wireframe />
    </mesh>
  )
}

const PsychedelicBackground = () => {
  const ref = useRef<Mesh>(null)
  const isMobile = useMediaQuery('(max-width: 768px)')

  useFrame((_state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.05
      ref.current.rotation.y += delta * 0.05
    }
  })
  
  return (
    <>
      <color attach="background" args={['#010108']} />
      
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
      
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      
      <WavyPlane 
        color="#5f00e0" 
        position={[0, 0, -5]} 
        rotation={[Math.PI / 4, 0, 0]} 
      />
      
      <WavyPlane 
        color="#ff5b14" 
        position={[0, 0, -10]} 
        rotation={[-Math.PI / 5, Math.PI / 6, 0]} 
      />
      
      <Sparkles 
        count={isMobile ? 1000 : 2000}
        scale={[20, 20, 20]} 
        size={2} 
        speed={0.3} 
        color={new Color('#ffffff')} 
      />
      
      <mesh ref={ref} position={[0, 0, 0]}>
        <dodecahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial 
          color="#ff5b14" 
          emissive="#5f00e0"
          emissiveIntensity={0.5}
          wireframe 
        />
      </mesh>
      
      {/* Add the mouse follower */}
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

const ThreeDBackground = () => {
  return (
    <Canvas dpr={[1, 2]}>
      <PsychedelicBackground />
    </Canvas>
  )
}

export default ThreeDBackground 