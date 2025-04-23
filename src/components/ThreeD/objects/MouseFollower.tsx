import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Vector3, Mesh } from 'three'
import { useMousePosition } from '../../../hooks/useMousePosition'

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
        color="#0080a0" 
        emissive="#004449"
        emissiveIntensity={0.8}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

export default MouseFollower 