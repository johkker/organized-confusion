import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { 
  Color, 
  Group, 
  Line, 
  LineBasicMaterial, 
  Mesh, 
  Vector3,
  BufferGeometry,
} from 'three'

// Circuit board line segment interface
interface CircuitSegment {
  startPoint: Vector3
  endPoint: Vector3
  progress: number
  tailProgress: number
  maxAge: number
  age: number
  thickness: number
  color: string
  active: boolean
  children: CircuitSegment[]
}

// Create a new circuit segment
const createSegment = (
  startPoint: Vector3, 
  direction: 'up' | 'down' | 'left' | 'right' | 'forward' | 'backward',
  length = Math.random() * 2 + 1,
  thickness = Math.random() * 0.1 + 0.05,
  parentColor?: string
): CircuitSegment => {
  const endPoint = startPoint.clone()
  switch (direction) {
    case 'up':
      endPoint.y += length
      break
    case 'down':
      endPoint.y -= length
      break
    case 'left':
      endPoint.x -= length
      break
    case 'right':
      endPoint.x += length
      break
    case 'forward':
      endPoint.z += length
      break
    case 'backward':
      endPoint.z -= length
      break
  }
  
  return {
    startPoint,
    endPoint,
    progress: 0,
    tailProgress: 0,
    maxAge: Math.random() * 10 + 10,
    age: 0,
    thickness,
    color: parentColor || '#00ff4c',
    active: true,
    children: []
  }
}

const CircuitBoardBackground = () => {
  const groupRef = useRef<Group>(null)
  const segments = useRef<CircuitSegment[]>([])
  const timer = useRef<number>(0)
  const { viewport } = useThree()
  
  useFrame((_, delta) => {
    timer.current += delta
    
    if (groupRef.current) {
      while (groupRef.current.children.length) {
        groupRef.current.remove(groupRef.current.children[0])
      }
    }
    
    const allSegments: CircuitSegment[] = [...segments.current]
    const newSegments: CircuitSegment[] = []
    
    for (const segment of allSegments) {
      if (!segment.active) continue
      
      segment.age += delta
      
      if (segment.progress < 1) {
        segment.progress += delta * 0.5
      }
      
      if (segment.progress > 0.2 && segment.age > segment.maxAge * 0.25) {
        segment.tailProgress += delta * 0.2
      }
      
      segment.tailProgress = Math.min(segment.tailProgress, segment.progress)
      
      if (segment.progress >= 1 && segment.age < segment.maxAge * 0.7 && segment.children.length === 0 && Math.random() < 0.05) {
        const numBranches = Math.random() < 0.5 ? 1 : Math.random() < 0.8 ? 2 : 3
        
        for (let i = 0; i < numBranches; i++) {
          const directions: ('up' | 'down' | 'left' | 'right' | 'forward' | 'backward')[] = 
            ['up', 'down', 'left', 'right', 'forward', 'backward']
          const direction = directions[Math.floor(Math.random() * directions.length)]
          
          const childSegment = createSegment(
            segment.endPoint.clone(),
            direction,
            Math.random() * 2 + 0.5,
            Math.max(segment.thickness * 0.8, 0.02),
            segment.color
          )
          
          segment.children.push(childSegment)
          newSegments.push(childSegment)
        }
      }
      
      if (segment.age >= segment.maxAge && segment.tailProgress >= segment.progress) {
        segment.active = false
      }
      
      if (groupRef.current) {
        const points = []
        const headPos = segment.startPoint.clone().lerp(segment.endPoint, segment.progress)
        const tailPos = segment.startPoint.clone().lerp(segment.endPoint, segment.tailProgress)
        
        points.push(tailPos, headPos)
        
        const geometry = new BufferGeometry().setFromPoints(points)
        const lifePercentage = segment.age / segment.maxAge
        const fadeInFactor = Math.min(1, segment.age / (segment.maxAge * 0.1))
        const fadeOutFactor = Math.max(0, 1 - (lifePercentage - 0.8) / 0.2)
        const opacity = fadeInFactor * fadeOutFactor
        const color = new Color(segment.color).multiplyScalar(opacity + 0.5)
        
        const material = new LineBasicMaterial({
          color,
          linewidth: segment.thickness * 10,
          opacity: opacity,
          transparent: true
        })
        
        const line = new Line(geometry, material)
        groupRef.current.add(line)
        
        if (segment.progress > 0.2 && Math.random() < 0.2) {
          const pointLight = new Mesh(
            new BufferGeometry().setFromPoints([new Vector3()]),
            new LineBasicMaterial({
              color: segment.color,
              opacity: opacity * 0.8,
              transparent: true
            })
          )
          pointLight.position.copy(headPos)
          pointLight.scale.set(0.2, 0.2, 0.2)
          groupRef.current.add(pointLight)
        }
      }
    }
    
    if (Math.random() < 0.06) {
      const width = viewport.width
      const height = viewport.height
      
      const startX = (Math.random() - 0.5) * width
      const startY = (Math.random() - 0.5) * height
      const startZ = -5 - Math.random() * 5
      
      const directions: ('up' | 'down' | 'left' | 'right' | 'forward' | 'backward')[] = 
        ['up', 'down', 'left', 'right', 'forward', 'backward']
      const direction = directions[Math.floor(Math.random() * directions.length)]
      
      newSegments.push(createSegment(new Vector3(startX, startY, startZ), direction))
    }
    
    segments.current = [
      ...segments.current.filter(s => s.active),
      ...newSegments
    ]
  })
  
  return <group ref={groupRef} position={[0, 0, -3]} />
}

export default CircuitBoardBackground 