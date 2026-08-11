import { useEffect, useRef, useCallback } from 'react'
import { useAudio } from '../context/AudioContext'

export default function BackgroundMusic({ src = '/music.mp3', volume: _volume }) {
  const audioRef = useRef(null)
  const { registerAudio } = useAudio()

  const setRef = useCallback((el) => {
    audioRef.current = el
    registerAudio(el)
  }, [registerAudio])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const events = ['touchstart', 'touchend', 'pointerdown', 'mousedown', 'click', 'keydown']
    const unlock = () => events.forEach((evt) => document.removeEventListener(evt, startOnInteraction, true))
    const tryPlay = () => audio.play().then(unlock).catch(() => {})
    tryPlay()

    const startOnInteraction = () => { tryPlay() }
    events.forEach((evt) => document.addEventListener(evt, startOnInteraction, true))

    return () => {
      events.forEach((evt) => document.removeEventListener(evt, startOnInteraction, true))
    }
  }, [])

  return <audio ref={setRef} src={src} loop preload="auto" />
}
