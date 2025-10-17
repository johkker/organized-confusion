import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { 
  Group, 
  Line, 
  LineBasicMaterial, 
  Vector3, 
  BufferGeometry,
  Float32BufferAttribute
} from 'three'

interface BouncingMetatronCubeProps {
  color: string
  initialPosition: [number, number, number]
  initialRotation: [number, number, number]
  size?: number
}

const BouncingMetatronCube = ({ 
  color, 
  initialPosition, 
  initialRotation,
  size = 5
}: BouncingMetatronCubeProps) => {
  const groupRef = useRef<Group>(null)
  const time = useRef(0)
  const position = useRef(new Vector3(...initialPosition))
  const velocity = useRef(new Vector3(
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02,
    (Math.random() - 0.5) * 0.02
  ))
  const { viewport } = useThree()

  const createCircle = (radius: number, segments = 64) => {
    const points = []
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      const x = Math.cos(theta) * radius
      const y = Math.sin(theta) * radius
      points.push(new Vector3(x, y, 0))
    }
    const geometry = new BufferGeometry().setFromPoints(points)
    const material = new LineBasicMaterial({ color })
    return new Line(geometry, material)
  }
  
  const createMetatronCube = () => {
    const group = new Group()
    
    // Main central circle
    const mainCircle = createCircle(size / 2)
    group.add(mainCircle)
    
    // Outer circles
    const numCircles = 6
    const outerRadius = size / 2
    const smallCircleRadius = size / 12
    
    for (let i = 0; i < numCircles; i++) {
      const angle = (i / numCircles) * Math.PI * 2
      const x = Math.cos(angle) * outerRadius
      const y = Math.sin(angle) * outerRadius
      
      const circle = createCircle(smallCircleRadius)
      circle.position.set(x, y, 0)
      group.add(circle)
    }
    
    // Inner circle
    const innerCircle = createCircle(size / 4)
    group.add(innerCircle)
    
    // Connect centers with lines
    const lineGeometry = new BufferGeometry()
    const lineVertices = []
    
    // Create hexagon
    for (let i = 0; i < numCircles; i++) {
      const angle1 = (i / numCircles) * Math.PI * 2
      const angle2 = ((i + 1) % numCircles / numCircles) * Math.PI * 2
      
      const x1 = Math.cos(angle1) * outerRadius
      const y1 = Math.sin(angle1) * outerRadius
      
      const x2 = Math.cos(angle2) * outerRadius
      const y2 = Math.sin(angle2) * outerRadius
      
      lineVertices.push(x1, y1, 0, x2, y2, 0)
      lineVertices.push(0, 0, 0, x1, y1, 0)
    }
    
    lineGeometry.setAttribute('position', new Float32BufferAttribute(lineVertices, 3))
    const lineMaterial = new LineBasicMaterial({ color })
    const lines = new Line(lineGeometry, lineMaterial)
    group.add(lines)
    
    // Add 3D elements
    const topPoint = new Vector3(0, 0, size / 2)
    const bottomPoint = new Vector3(0, 0, -size / 2)
    
    const pyramidGeometry = new BufferGeometry()
    const pyramidVertices = []
    
    for (let i = 0; i < numCircles; i++) {
      const angle = (i / numCircles) * Math.PI * 2
      const x = Math.cos(angle) * outerRadius
      const y = Math.sin(angle) * outerRadius
      
      pyramidVertices.push(x, y, 0, topPoint.x, topPoint.y, topPoint.z)
      pyramidVertices.push(x, y, 0, bottomPoint.x, bottomPoint.y, bottomPoint.z)
    }
    
    pyramidGeometry.setAttribute('position', new Float32BufferAttribute(pyramidVertices, 3))
    const pyramidMaterial = new LineBasicMaterial({ color })
    const pyramidLines = new Line(pyramidGeometry, pyramidMaterial)
    group.add(pyramidLines)
    
    return group
  }
  
  useEffect(() => {
    if (groupRef.current) {
      const metatronCube = createMetatronCube()
      groupRef.current.add(metatronCube)
      groupRef.current.rotation.set(...initialRotation)
    }
    
    return () => {
      if (groupRef.current) {
        while (groupRef.current.children.length) {
          groupRef.current.remove(groupRef.current.children[0])
        }
      }
    }
  }, [])
  
  useFrame((_, delta) => {
    time.current += delta * 0.5
    
    if (groupRef.current) {
      // Rotate the cube
      groupRef.current.rotation.x += delta * 0.2
      groupRef.current.rotation.y += delta * 0.3
      groupRef.current.rotation.z += delta * 0.1
      
      // Update position based on velocity
      position.current.add(velocity.current)
      
      // Check boundaries and bounce
      const halfSize = size / 1.5
      const boundsX = viewport.width / 2
      const boundsY = viewport.height / 2
      const boundsZ = 15
      
      if (Math.abs(position.current.x) > boundsX - halfSize) {
        velocity.current.x *= -1
        position.current.x = Math.sign(position.current.x) * (boundsX - halfSize)
      }
      
      if (Math.abs(position.current.y) > boundsY - halfSize) {
        velocity.current.y *= -1
        position.current.y = Math.sign(position.current.y) * (boundsY - halfSize)
      }
      
      if (Math.abs(position.current.z) > boundsZ - halfSize) {
        velocity.current.z *= -1
        position.current.z = Math.sign(position.current.z) * (boundsZ - halfSize)
      }
      
      groupRef.current.position.copy(position.current)
      
      // Add randomness to velocity
      velocity.current.x += (Math.random() - 0.5) * 0.001
      velocity.current.y += (Math.random() - 0.5) * 0.001
      velocity.current.z += (Math.random() - 0.5) * 0.001
      
      // Limit max velocity
      const maxVelocity = 0.05
      if (velocity.current.length() > maxVelocity) {
        velocity.current.normalize().multiplyScalar(maxVelocity)
      }
    }
  })
  
  return <group ref={groupRef} />
}

export default BouncingMetatronCube 