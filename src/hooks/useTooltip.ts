import { useCallback, useRef } from 'react'

export function useTooltip() {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const showTip = useCallback((msg: string) => {
    const el = document.getElementById('tip')
    if (!el) return
    el.textContent = msg
    el.classList.add('show')
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => el.classList.remove('show'), 1600)
  }, [])

  return { showTip }
}
