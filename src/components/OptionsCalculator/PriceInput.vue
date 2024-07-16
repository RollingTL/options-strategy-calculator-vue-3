<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  price: string
  readonly: boolean
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const currentPrice = ref(props.price)

const emit = defineEmits(['update:price'])

const onInput = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  if (isValid(value)) {
    currentPrice.value = value
  } else {
    if (inputRef.value) {
      inputRef.value.value = currentPrice.value
    }
  }
}
const onBlur = (e: Event) => {
  const value = (e.target as HTMLInputElement).value
  if (value !== '') emit('update:price', Number(value))
  else {
    if (inputRef.value) {
      inputRef.value.value = props.price
    }
  }
}

const isValid = (value: string) => {
  if (value === '') return true
  if (isNaN(Number(value))) return false
  if (Number(value) < 1) return false
  if (Number(value) > 10000) return false
  return true
}
</script>

<template>
  <input
    ref="inputRef"
    :value="currentPrice"
    type="text"
    inputmode="numeric"
    pattern="[0-9]*"
    @input="onInput"
    @blur="onBlur"
    @keyup.enter="onBlur"
    maxlength="7"
    :disabled="readonly"
  />
</template>

<style lang="scss" scoped>
input[type='text'] {
  width: 100px;
  padding: 4px 6px;
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
  background-color: var(--red-light-input);
}
.call {
  input[type='text']:focus-visible {
    background-color: var(--green-light-input);
  }
}

input[type='text']::placeholder {
  color: #aaa;
}

input[type='text']:disabled {
  background-color: transparent;
  border-bottom: 1px solid var(--primary-text-disabled);
  color: var(--primary-text-disabled);
  -webkit-text-fill-color: var(--primary-text-disabled);
}

@media screen and (max-width: 640px) {
  input[type='text'] {
    font-size: 12px;
    width: 60px;
  }
}
</style>
