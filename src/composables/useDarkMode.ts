// src/composables/useDarkMode.ts
import { ref } from 'vue'

export function useDarkMode() {
  const isDarkMode = ref<boolean>(false)

  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    document.body.classList.toggle('dark-mode', isDarkMode.value)
    localStorage.setItem('darkMode', isDarkMode.value ? 'enabled' : 'disabled')
  }

  // Initialize dark mode state based on local storage
  const storedDarkMode = localStorage.getItem('darkMode')
  if (storedDarkMode === 'enabled') {
    isDarkMode.value = true
    document.body.classList.add('dark-mode')
  }

  return {
    isDarkMode,
    toggleDarkMode
  }
}
