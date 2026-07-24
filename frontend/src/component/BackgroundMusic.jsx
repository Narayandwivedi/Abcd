import { useEffect, useRef } from 'react'

export default function BackgroundMusic({ src = '/music.mp3', volume = 0.18 }) {
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume

    const tryPlay = () => audio.play().catch(() => {})
    tryPlay()

    const startOnInteraction = () => {
      tryPlay()
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('touchstart', startOnInteraction)
    }
    document.addEventListener('click', startOnInteraction)
    document.addEventListener('touchstart', startOnInteraction)

    return () => {
      document.removeEventListener('click', startOnInteraction)
      document.removeEventListener('touchstart', startOnInteraction)
    }
  }, [volume])

  return <audio ref={audioRef} src={src} loop preload="auto" />
}
