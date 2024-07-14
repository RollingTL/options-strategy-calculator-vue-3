<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  bid: string
  ask: string
  readonly: boolean
}>()

const bidRef = ref<HTMLInputElement | null>(null)
const askRef = ref<HTMLInputElement | null>(null)
const currentBid = ref(props.bid)
const currentAsk = ref(props.ask)

const emit = defineEmits(['update:bid', 'update:ask'])

const onInputBid = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  if (isValid(value)) {
    currentBid.value = value
  } else {
    if (bidRef.value) {
      bidRef.value.value = currentBid.value
    }
  }
}
const onInputAsk = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  if (isValid(value)) {
    currentAsk.value = value
  } else {
    if (askRef.value) {
      askRef.value.value = currentAsk.value
    }
  }
}
const onBlurBid = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  if (isValidBid(value)) emit('update:bid', Number(value))
  else {
    if (bidRef.value) {
      bidRef.value.value = props.bid
    }
  }
}
const onBlurAsk = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  if (isValidAsk(value)) emit('update:ask', Number(value))
  else {
    if (askRef.value) {
      askRef.value.value = props.ask
    }
  }
}
const isValid = (value: string) => {
  if (value === '') return true
  if (isNaN(Number(value))) return false
  if (Number(value) < 0) return false
  if (Number(value) > 1000) return false
  return true
}
const isValidBid = (value: string) => {
  if (value === '') return false
  if (isNaN(Number(value))) return false
  if (Number(value) < 0.1) return false
  if (Number(value) > 1000) return false
  if (Number(value) >= Number(currentAsk.value)) return false
  return true
}
const isValidAsk = (value: string) => {
  if (value === '') return false
  if (isNaN(Number(value))) return false
  if (Number(value) < 0) return false
  if (Number(value) > 1000) return false
  if (Number(value) <= Number(currentBid.value)) return false
  return true
}
</script>

<template>
  <span>Bid:</span>
  <input
    ref="bidRef"
    :value="currentBid"
    type="text"
    inputmode="numeric"
    pattern="[0-9]*"
    class="monospace"
    @input="onInputBid"
    @blur="onBlurBid"
    @keyup.enter="onBlurBid"
    maxlength="16"
    :disabled="readonly"
  />
  <span>Ask:</span>
  <input
    ref="askRef"
    :value="currentAsk"
    type="text"
    inputmode="numeric"
    pattern="[0-9]*"
    class="monospace"
    @input="onInputAsk"
    @blur="onBlurAsk"
    @keyup.enter="onBlurAsk"
    maxlength="8"
    :disabled="readonly"
  />
</template>

<style lang="scss" scoped>
input[type='text'] {
  width: 80px;
  padding: 4px;
  // font-family: 'Courier New', Courier, monospace;
  // font-weight: 600;
  font-size: 16px;
  color: var(--red-dark);
  background-color: transparent;
  border: 1px solid transparent;
  border-bottom: 1px solid var(--red-medium);
  border-radius: 4px;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
}
.call {
  input[type='text'] {
    color: var(--green-dark);
    border-bottom: 1px solid var(--green-medium);
  }
}
input[type='text']:focus,
input[type='text']:focus-visible {
  box-shadow: 0 0 0 3px var(--tab-hover-color);
  border-bottom: 1px solid transparent;
  outline: none;
  background-color: rgba(255, 255, 255, 0.3);
}

input[type='text']::placeholder {
  color: #aaa;
}

input[type='text']:disabled {
  background-color: transparent;
  border-bottom: 1px solid var(--primary-text-disabled);
  color: var(--primary-text-disabled);
}

span {
  font-size: 14px;
  color: var(--red-dark);
  font-weight: 100;
  padding-right: 3px;
  :nth-child(1) {
    padding-left: 7px;
  }
}

.call {
  span {
    color: var(--green-dark);
  }
}
.off {
  span {
    color: var(--primary-text-disabled);
  }
}
@media screen and (max-width: 640px) {
  span {
    display: none;
  }
}

@media screen and (max-width: 640px) {
  input[type='text'] {
    font-size: 12px;
    width: 44px;
  }
}
</style>
