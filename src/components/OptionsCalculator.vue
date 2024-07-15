<script setup lang="ts">
import { computed } from 'vue'

import { useOptionsData } from '@/components/OptionsCalculator/useOptionsData'
import OptionsList from '@/components/OptionsCalculator/OptionsList.vue'
import OptionsGraph from '@/components/OptionsCalculator/OptionsGraph.vue'
import { useDarkMode } from '@/composables/useDarkMode'
const { isDarkMode, toggleDarkMode } = useDarkMode()

const {
  optionsData,
  setOptionsData,
  toggleChecked,
  toggleCallPut,
  toggleLongShort,
  updateStrikePrice,
  updateBid,
  updateAsk
} = useOptionsData()

const encodedOptionData = computed(() => {
  const jsonData = JSON.stringify(optionsData.value)
  return btoa(jsonData) // base64 encode the JSON string
})
const urlData = getOptionDataFromURL()

if (urlData) {
  setOptionsData(urlData)
}

const fullUrl = computed(() => {
  const baseUrl = window.location.origin + window.location.pathname
  return `${baseUrl}?data=${encodedOptionData.value}`
})

const showCopyButton = computed(() => {
  if (!optionsData.value.some((item) => item.checked === true)) return false
  return JSON.stringify(urlData) !== JSON.stringify(optionsData.value)
})

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(fullUrl.value)
    alert('URL copied to clipboard')
  } catch (err) {
    alert('Failed to copy URL')
  }
}

function getOptionDataFromURL() {
  const params = new URLSearchParams(window.location.search)
  const encodedData = params.get('data')
  if (encodedData) {
    try {
      const jsonData = atob(encodedData) // base64 decode
      return JSON.parse(jsonData)
    } catch (error) {
      return null
    }
  }
  return null
}
</script>

<template>
  <div class="mode-holder">
    <button class="mode-button" :class="{ dark: isDarkMode }" @click="toggleDarkMode"></button>
  </div>
  <h1>Options Strategy Calculator</h1>
  <div class="container">
    <div class="calculator">
      <OptionsList
        :options-data="optionsData"
        @option-clicked="toggleChecked"
        @swap-call-put="toggleCallPut"
        @swap-long-short="toggleLongShort"
        @update-strike-price="updateStrikePrice"
        @update-bid="updateBid"
        @update-ask="updateAsk"
      />
      <OptionsGraph :checked-options-data="optionsData" />
      <div v-if="showCopyButton" class="url-button">
        <div class="label">Copy URL with current Options data:</div>
        <button class="flat-round-button" @click="copyToClipboard"></button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
h1 {
  padding-top: 2rem;
  padding-bottom: 1rem;
  margin: 0;
  color: var(--primary-text-lighter);
  font-weight: 400;
  @media screen and (max-width: 640px) {
    padding-top: 0.5rem;
    font-size: 1.6rem;
  }
}
.calculator {
  max-width: 960px;
  margin: auto;
  margin-bottom: 2rem;
  background-color: var(--applet-background-color);
  box-shadow:
    0 0 5px var(--shadow-narrow),
    0 0 20px var(--shadow-wide);
  border-radius: 1rem;
  padding-bottom: 1rem;
  /* padding-top: 1rem; */
  text-align: left;
  .url-button {
    padding-left: 2rem;
    padding-bottom: 1rem;
    display: flex;
    gap: 1rem;
    align-items: center;
    @media screen and (max-width: 640px) {
      padding-left: 1rem;
    }
    .label {
      font-size: 14px;
      color: var(--primary-text-lighter);
    }
    .flat-round-button {
      width: 28px;
      height: 28px;
      border: 1px solid var(--primary-gray-lighter);
      border-radius: 5px;
      background-color: var(--applet-background-color);

      background-repeat: no-repeat;
      background-position: center;
      background-size: 16px;

      cursor: pointer;
      transition:
        background-color 0.3s,
        transform 0.2s;
    }
    .flat-round-button {
      z-index: 100;

      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%234d7ee0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>');
    }

    .flat-round-button:hover {
      box-shadow: 0 0 0 3px var(--tab-hover-color);
      transform: scale(1.1);
    }

    .flat-round-button:active {
      outline: none;
      transform: scale(0.95);
    }

    .flat-round-button:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px var(--tab-hover-color);
    }
  }
}
.mode-holder {
  max-width: 960px;
  box-sizing: border-box;
  margin: auto;
  text-align: right;
  padding: 0 1.2rem;
  // border: 1px solid red;
  @media screen and (max-width: 640px) {
    padding: 0 0.4rem;
  }
  .mode-button {
    width: 28px;
    height: 28px;
    // border: 1px solid var(--primary-gray-lighter);
    border: none;
    border-radius: 5px;

    background-repeat: no-repeat;
    background-position: center;
    background-size: 16px;

    cursor: pointer;
    transition:
      background-color 0.3s,
      transform 0.2s;

    z-index: 100;
    background-color: transparent;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%234d7ee0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>');

    &:hover {
      box-shadow: 0 0 0 3px var(--tab-hover-color);
      transform: scale(1.1);
    }

    &:active {
      outline: none;
      transform: scale(0.95);
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px var(--tab-hover-color);
    }
    &.dark {
      background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%234d7ee0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>');
    }
  }
}
</style>
