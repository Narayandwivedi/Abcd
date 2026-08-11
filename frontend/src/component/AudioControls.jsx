import { useState, useRef, useEffect } from 'react'
import { useAudio } from '../context/AudioContext'
import { Music, Play, Pause, X } from 'lucide-react'

export default function AudioControls({ inline = false, compact = false }) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)
  const { volume, isPlaying, togglePlay, setVolume } = useAudio()

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const panel = (
    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg shadow-black/10 border border-gray-200/80 pl-3 pr-1.5 py-1.5 animate-fade-in">
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="w-16 sm:w-20 h-1.5 appearance-none cursor-pointer bg-gray-200 rounded-full accent-[#C67A2D] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 sm:[&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3 sm:[&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#C67A2D] [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:shadow-[#C67A2D]/40"
        title={`Volume: ${Math.round(volume * 100)}%`}
      />

      <button
        onClick={togglePlay}
        className="w-7 h-7 rounded-full flex items-center justify-center text-white bg-gradient-to-r from-[#C67A2D] to-[#A8651E] hover:shadow-md hover:shadow-[#C67A2D]/30 transition-all cursor-pointer shrink-0"
        title={isPlaying ? 'Stop Music' : 'Play Music'}
      >
        {isPlaying ? <Pause size={12} /> : <Play size={12} />}
      </button>

      <button
        onClick={() => setOpen(false)}
        className="w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all cursor-pointer shrink-0"
        title="Close"
      >
        <X size={10} />
      </button>
    </div>
  )

  const button = (
    <button
      onClick={() => setOpen((o) => !o)}
      className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} rounded-full flex items-center justify-center text-white bg-gradient-to-r from-[#C67A2D] to-[#A8651E] shadow-lg shadow-[#C67A2D]/30 hover:shadow-xl hover:shadow-[#C67A2D]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer shrink-0`}
      title="Music Controls"
    >
      <Music size={compact ? 11 : 14} />
    </button>
  )

  if (inline) {
    return (
      <div ref={containerRef} className="relative inline-flex items-center">
        {button}
        {open && (
          <div className="absolute top-full right-0 mt-1.5 z-50 whitespace-nowrap sm:top-1/2 sm:right-auto sm:left-full sm:ml-1.5 sm:mt-0 sm:-translate-y-1/2">
            {panel}
          </div>
        )}
      </div>
    )
  }

  return (
    <div ref={containerRef} className="fixed bottom-4 right-4 z-50 flex items-center gap-1">
      {open && panel}
      {button}
    </div>
  )
}