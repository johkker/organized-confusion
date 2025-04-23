import { useState, useEffect } from 'react'
import { Vector2 } from 'three'

export const useMousePosition = () => {
    const [mousePos, setMousePos] = useState<Vector2>(new Vector2(0, 0))

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            // Convert screen coordinates to normalized device coordinates (-1 to +1)
            const x = (e.clientX / window.innerWidth) * 2 - 1
            const y = -(e.clientY / window.innerHeight) * 2 + 1
            setMousePos(new Vector2(x, y))
        }

        window.addEventListener('mousemove', updateMousePosition)

        return () => {
            window.removeEventListener('mousemove', updateMousePosition)
        }
    }, [])

    return mousePos
} 