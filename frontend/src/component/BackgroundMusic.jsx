import { useEffect, useRef } from 'react'

export default function BackgroundMusic({ src = '/music.mp3', volume = 0.18 }) {
  const audioRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume

    const events = ['touchstart', 'touchend', 'pointerdown', 'mousedown', 'click', 'keydown']
    const unlock = () => events.forEach((evt) => document.removeEventListener(evt, startOnInteraction, true))
    const tryPlay = () => audio.play().then(unlock).catch(() => {})
    tryPlay()

    const startOnInteraction = () => {
      tryPlay()
    }
    // capture: true so an ancestor/descendant calling stopPropagation() on its own
    // click/touch handler (dropdowns, modals, etc.) can't swallow the gesture before
    // it reaches this listener.
    events.forEach((evt) => document.addEventListener(evt, startOnInteraction, true))

    return () => {
      events.forEach((evt) => document.removeEventListener(evt, startOnInteraction, true))
    }
  }, [volume])

  return <audio ref={audioRef} src={src} loop preload="auto" />
}
