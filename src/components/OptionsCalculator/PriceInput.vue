<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  price: string
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
  emit('update:price', Number(value))
}

const isValid = (value: string) => {
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
    class="monospace"
    @input="onInput"
    @blur="onBlur"
    @keyup.enter="onBlur"
    maxlength="16"
  />
</template>

<style lang="scss" scoped></style>
