<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, type Ref } from 'vue'
import SvgDisplay from '@/components/OptionsCalculator/SvgDisplay.vue'

const props = defineProps<{
  checkedOptionsData: OptionData
}>()
const container: Ref<HTMLElement | null> = ref(null)
const containerWidth = ref(300)
const containerHeight = ref(480)
const profitStep = 20 // pixels
const profitScaleArray = [160, 80, 40, 20, 10, 4, 2, 1, 0.5]
const profitCurrentScale = ref(2) // one profit dollar is equal to profitCurrentScale pixels
const priceStep = 20 // pixels
const priceScaleArray = [160, 80, 40, 20, 10, 4, 2, 1, 0.5]
const priceCurrentScale = ref(2) // one profit dollar is equal to profitCurrentScale pixels

const showGraph = computed(() => {
  return props.checkedOptionsData.some((item) => item.checked === true)
})

function handleResize(entries: ResizeObserverEntry[]) {
  if (entries.length > 0) {
    containerWidth.value = entries[0].contentRect.width
  }
}

function incrementProfitScale() {
  const currentIndex = profitScaleArray.indexOf(profitCurrentScale.value)
  if (currentIndex < profitScaleArray.length - 1) {
    profitCurrentScale.value = profitScaleArray[currentIndex + 1]
  }
}

function decrementProfitScale() {
  const currentIndex = profitScaleArray.indexOf(profitCurrentScale.value)
  if (currentIndex > 0) {
    profitCurrentScale.value = profitScaleArray[currentIndex - 1]
  }
}

function incrementPriceScale() {
  const currentIndex = priceScaleArray.indexOf(priceCurrentScale.value)
  if (currentIndex < priceScaleArray.length - 1) {
    priceCurrentScale.value = priceScaleArray[currentIndex + 1]
  }
}

function decrementPriceScale() {
  const currentIndex = priceScaleArray.indexOf(priceCurrentScale.value)
  if (currentIndex > 0) {
    priceCurrentScale.value = priceScaleArray[currentIndex - 1]
  }
}

let resizeObserver: ResizeObserver
onMounted(() => {
  if (container.value) {
    containerWidth.value = container.value.offsetWidth
    resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver.disconnect()
})
</script>

<template>
  <div ref="container" class="display-container">
    <SvgDisplay
      v-if="showGraph"
      :options-data="checkedOptionsData"
      :container-width="containerWidth"
      :container-height="containerHeight"
      :price-step="priceStep"
      :profit-step="profitStep"
      :profit-current-scale="profitCurrentScale"
      :price-current-scale="priceCurrentScale"
    />
    <div v-if="showGraph" class="button-holder">
      <div class="increment-group">
        <div class="increment-label">Profit scale</div>
        <div class="increment">
          <button
            class="flat-round-button left"
            @click="decrementProfitScale"
            :disabled="profitCurrentScale === profitScaleArray[0]"
          ></button>
          <div class="value">{{ profitStep / profitCurrentScale }}</div>
          <button
            class="flat-round-button right"
            @click="incrementProfitScale"
            :disabled="profitCurrentScale === profitScaleArray[profitScaleArray.length - 1]"
          ></button>
        </div>
      </div>
      <div class="increment-group">
        <div class="increment-label">Price scale</div>
        <div class="increment">
          <button
            class="flat-round-button left"
            @click="decrementPriceScale"
            :disabled="priceCurrentScale === priceScaleArray[0]"
          ></button>
          <div class="value">{{ priceStep / priceCurrentScale }}</div>
          <button
            class="flat-round-button right"
            @click="incrementPriceScale"
            :disabled="priceCurrentScale === priceScaleArray[priceScaleArray.length - 1]"
          ></button>
        </div>
      </div>
    </div>
    <div class="warning" v-if="!showGraph">
      <div class="text">Select at least one option to display results!</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.display-container {
  padding-top: 2rem;
}
.button-holder {
  display: flex;
  column-gap: 2rem;

  padding: 0 60px 24px 60px;
  justify-content: flex-end;
  flex-wrap: wrap;
  row-gap: 2rem;
}
.increment-group {
  text-align: left;
}
.increment-group .increment-label {
  color: var(--primary-text-lighter-2);
  font-size: 12px;
  padding-bottom: 4px;
  white-space: nowrap;
}
.increment-group .increment {
  display: flex;
  flex-wrap: nowrap;
  border-radius: 12px;
}
.increment-group .increment .value {
  color: var(--primary-text-lighter);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  line-height: 12px;
  width: 44px;
  box-sizing: border-box;
  padding-left: 4px;
  padding-right: 4px;
  text-align: center;
  border-top: 1px solid var(--primary-gray-lighter);
  border-bottom: 1px solid var(--primary-gray-lighter);
  background-color: var(--primary-background-light);
}

.flat-round-button {
  --button-background-color: #3498db;

  width: 24px;
  height: 24px;
  border: 1px solid var(--primary-gray-lighter);

  background-color: var(--applet-background-color);

  background-repeat: no-repeat;
  background-position: center;
  background-size: 16px;

  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.2s;
}
.flat-round-button.left {
  z-index: 100;
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%234d7ee0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="m15 18-6-6 6-6"/></svg>');
}
.flat-round-button.right {
  z-index: 100;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%234d7ee0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="m9 18 6-6-6-6"/></svg>');
}
@media (hover: hover) {
  .flat-round-button:hover {
    box-shadow: 0 0 0 3px var(--tab-hover-color);
    transform: scale(1.1);
  }
}

.flat-round-button:active {
  outline: none;
  transform: scale(0.95);
}

.flat-round-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--tab-hover-color);
}
.flat-round-button.right:disabled {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="m9 18 6-6-6-6"/></svg>');
  cursor: not-allowed;
  pointer-events: none;
}
.flat-round-button.left:disabled {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23CCCCCC" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><path d="m15 18-6-6 6-6"/></svg>');
  cursor: not-allowed;
  pointer-events: none;
}

.warning {
  max-width: 960px;
  display: flex;
  margin: auto;
  height: 480px;
  align-items: center;
  justify-content: center;
  .text {
    color: var(--warning-color);
  }
}
</style>
