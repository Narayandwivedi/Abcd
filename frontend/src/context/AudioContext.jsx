import { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react'

const AudioContext = createContext(null)

export function AudioProvider({ children }) {
  const audioRef = useRef(null)
  const [volume, setVolumeState] = useState(0.6)
  const [isPlaying, setIsPlaying] = useState(false)
  const playbackRef = useRef(false)

  const setVolume = useCallback((v) => {
    const clamped = Math.max(0, Math.min(1, v))
    setVolumeState(clamped)
    if (audioRef.current) audioRef.current.volume = clamped
  }, [])

  const volumeUp = useCallback(() => setVolume(volume + 0.1), [volume, setVolume])
  const volumeDown = useCallback(() => setVolume(volume - 0.1), [volume, setVolume])

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.play().then(() => {
      setIsPlaying(true)
      playbackRef.current = true
    }).catch(() => {})
  }, [])

  const stop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    playbackRef.current = false
  }, [])

  const togglePlay = useCallback(() => {
    if (playbackRef.current) {
      stop()
    } else {
      play()
    }
  }, [play, stop])

  const registerAudio = useCallback((audioEl) => {
    audioRef.current = audioEl
    if (audioEl) {
      audioEl.volume = volume
    }
  }, [volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onPlay = () => { setIsPlaying(true); playbackRef.current = true }
    const onPause = () => { setIsPlaying(false) }
    const onEnded = () => { setIsPlaying(false); playbackRef.current = false }
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  return (
    <AudioContext.Provider value={{ volume, isPlaying, play, stop, togglePlay, volumeUp, volumeDown, setVolume, registerAudio }}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudio must be used within an AudioProvider')
  return ctx
}