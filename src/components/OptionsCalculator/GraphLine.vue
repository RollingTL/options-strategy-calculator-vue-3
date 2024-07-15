<script setup lang="ts">
import { computed } from 'vue'
import {
  Point,
  type Line,
  intersectPolygons
} from '@/components/OptionsCalculator/polygonIntersector'

const props = defineProps<{
  width: number
  height: number
  paddingX: number
  paddingY: number
  metaPoints: MetaPoints
  profitCurrentScale: number
  priceCurrentScale: number
  offsetX: number
}>()

const getTopPolygons = computed(() => {
  console.log('metaPoints', props.metaPoints)

  const polygon: Point[] = []
  for (let i = 0; i < props.metaPoints.length; i++) {
    const point = props.metaPoints[i]
    if (point.type !== 'break-point')
      polygon.push(
        new Point(
          point.price * props.priceCurrentScale - props.offsetX,
          props.height / 2 - point.profit * props.profitCurrentScale
        )
      )
  }
  const pointBottomRight = props.metaPoints[props.metaPoints.length - 1]
  polygon.push(
    new Point(
      pointBottomRight.price * props.priceCurrentScale - props.offsetX,
      props.height / 2 + 100000 * props.profitCurrentScale
    )
  )

  polygon.push(
    new Point(
      0 * props.priceCurrentScale - props.offsetX,
      props.height / 2 + 100000 * props.profitCurrentScale
    )
  )
  const pointClose = props.metaPoints[0]
  polygon.push(
    new Point(
      pointClose.price * props.priceCurrentScale - props.offsetX,
      props.height / 2 - pointClose.profit * props.profitCurrentScale
    )
  )

  const rectangle: Point[] = [
    new Point(0, 0),
    new Point(props.width, 0),
    new Point(props.width, props.height / 2),
    new Point(0, props.height / 2),
    new Point(0, 0)
  ]

  const resultPolygons: Point[][] = intersectPolygons(polygon, rectangle)

  return resultPolygons
})

const getTopLines = computed(() => {
  const lines: Line[][] = []

  for (let i = 0; i < getTopPolygons.value.length; i++) {
    const line: Line[] = []
    for (let j = 0; j < getTopPolygons.value[i].length - 1; j++) {
      const startX = getTopPolygons.value[i][j].x
      const startY = getTopPolygons.value[i][j].y
      const endX = getTopPolygons.value[i][j + 1].x
      const endY = getTopPolygons.value[i][j + 1].y
      if (round(startX) === round(endX)) continue
      if (round(startY) === 0 && round(endY) === 0) continue
      if (round(startY) === round(props.height / 2) && round(endY) === round(props.height / 2))
        continue
      line.push({
        start: { x: startX, y: startY },
        end: { x: endX, y: endY }
      })
    }

    lines.push(line)
  }
  return lines
})

const getBottomPolygons = computed(() => {
  const polygon: Point[] = []
  for (let i = 0; i < props.metaPoints.length; i++) {
    const point = props.metaPoints[i]

    if (point.type !== 'break-point')
      polygon.push(
        new Point(
          point.price * props.priceCurrentScale - props.offsetX,
          props.height / 2 - point.profit * props.profitCurrentScale
        )
      )
  }
  const pointBottomRight = props.metaPoints[props.metaPoints.length - 1]
  polygon.push(
    new Point(
      pointBottomRight.price * props.priceCurrentScale - props.offsetX,
      props.height / 2 - 100000 * props.profitCurrentScale
    )
  )

  polygon.push(
    new Point(
      0 * props.priceCurrentScale - props.offsetX,
      props.height / 2 - 100000 * props.profitCurrentScale
    )
  )
  const pointClose = props.metaPoints[0]
  polygon.push(
    new Point(
      pointClose.price * props.priceCurrentScale - props.offsetX,
      props.height / 2 - pointClose.profit * props.profitCurrentScale
    )
  )

  const rectangle: Point[] = [
    new Point(0, props.height / 2),
    new Point(props.width, props.height / 2),
    new Point(props.width, props.height),
    new Point(0, props.height),
    new Point(0, props.height / 2)
  ]

  const resultPolygons: Point[][] = intersectPolygons(polygon, rectangle)

  //////
  return resultPolygons
})

const getBottomLines = computed(() => {
  const lines: Line[][] = []

  for (let i = 0; i < getBottomPolygons.value.length; i++) {
    const line: Line[] = []
    for (let j = 0; j < getBottomPolygons.value[i].length - 1; j++) {
      const startX = getBottomPolygons.value[i][j].x
      const startY = getBottomPolygons.value[i][j].y
      const endX = getBottomPolygons.value[i][j + 1].x
      const endY = getBottomPolygons.value[i][j + 1].y
      if (round(startX) === round(endX)) continue
      if (round(startY) === props.height && round(endY) === round(props.height)) continue
      if (round(startY) === round(props.height / 2) && round(endY) === round(props.height / 2))
        continue
      line.push({
        start: { x: startX, y: startY },
        end: { x: endX, y: endY }
      })
    }

    lines.push(line)
  }
  return lines
})

function formatPoints(points: Point[]) {
  return points.map((point) => `${point.x},${point.y}`).join(' ')
}

function round(value: number) {
  return parseFloat(value.toFixed(9))
}
</script>
<template>
  <linearGradient id="gradientTop" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0%" stop-color="hsla(160, 70%, 40%, 30%)" />
    <stop offset="100%" stop-color="hsla(160, 70%, 40%, 0%)" />
  </linearGradient>
  <linearGradient id="gradientBottom" x1="0" x2="0" y1="0" y2="1">
    <stop offset="0%" stop-color="hsla(360, 80%, 40%, 0%)" />
    <stop offset="100%" stop-color="hsla(360, 80%, 40%, 30%)" />
  </linearGradient>
  <g :transform="`translate(${paddingX}, ${paddingY})`">
    <g v-for="(polygon, index) in getTopPolygons" :key="index">
      <polygon :points="formatPoints(polygon)" fill="url(#gradientTop)" stroke="none" />
    </g>
    <g v-for="(line, index) in getTopLines" :key="index">
      <g v-for="(segment, index) in line" :key="index">
        <line
          :x1="segment.start.x"
          :y1="segment.start.y"
          :x2="segment.end.x"
          :y2="segment.end.y"
          class="profit-line"
        />
      </g>
    </g>
    <g v-for="(polygon, index) in getBottomPolygons" :key="index">
      <polygon :points="formatPoints(polygon)" fill="url(#gradientBottom)" stroke="none" />
    </g>
    <g v-for="(line, index) in getBottomLines" :key="index">
      <g v-for="(segment, index) in line" :key="index">
        <line
          :x1="segment.start.x"
          :y1="segment.start.y"
          :x2="segment.end.x"
          :y2="segment.end.y"
          class="loss-line"
        />
      </g>
    </g>
  </g>
</template>

<style scoped lang="scss">
.profit-line {
  stroke: var(--green-line);
  stroke-width: 2;
}
.loss-line {
  stroke: var(--red-line);
  stroke-width: 2;
}
</style>
