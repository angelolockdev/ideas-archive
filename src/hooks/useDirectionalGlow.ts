import { useCallback, useRef } from 'react'

export function useDirectionalGlow() {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return

    const bounds = card.getBoundingClientRect()
    const x = ((event.clientX - bounds.left) / bounds.width) * 100
    const y = ((event.clientY - bounds.top) / bounds.height) * 100
    card.style.setProperty('--mx', `${x}%`)
    card.style.setProperty('--my', `${y}%`)
  }, [])

  return { cardRef, handleMouseMove }
}
