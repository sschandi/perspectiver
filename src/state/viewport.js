import { readable } from 'svelte/store'

export const viewport = readable(
  { width: window.innerWidth, height: window.innerHeight },
  function start(set) {
    window.addEventListener('resize', () => {
      set({ width: window.innerWidth, height: window.innerHeight })
    })
    
    return function stop() {
      window.removeEventListener('resize')
    }
  }
)