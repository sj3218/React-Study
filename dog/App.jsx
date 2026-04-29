import { useRef, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import ControlPanel from './components/ControlPanel'
import DogModel from './components/DogModel'
import { useDogState } from './useDogState'
import styles from './App.module.css'

export default function App() {
  const { dogState, update } = useDogState()
  const glRef = useRef()

  // Save PNG: grab the WebGL canvas and trigger download
  const handleSave = useCallback(() => {
    const canvas = glRef.current?.domElement
    if (!canvas) return
    const link = document.createElement('a')
    link.download = 'dog-generator.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [])

  return (
    <div className={styles.layout}>
      <ControlPanel dogState={dogState} update={update} onSave={handleSave} />

      <div className={styles.canvasWrap}>
        <div className={styles.hints}>
          <span>drag → rotate</span>
          <span>scroll → zoom</span>
          <span>right-drag → pan</span>
        </div>

        <Canvas
          shadows
          camera={{ position: [0, 2.0, 6.5], fov: 42 }}
          gl={{ preserveDrawingBuffer: true }}   /* needed for toDataURL */
          onCreated={({ gl }) => { glRef.current = gl }}
        >
          <DogModel dogState={dogState} />
        </Canvas>
      </div>
    </div>
  )
}
