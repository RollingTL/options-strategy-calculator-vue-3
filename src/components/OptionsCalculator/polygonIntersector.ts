import * as martinez from 'martinez-polygon-clipping'

// Define the types
type MartinezPoint = [number, number]
type MartinezPolygon = MartinezPoint[][]
type MartinezMultiPolygon = MartinezPolygon[]

// Define a function to convert points to Martinez format
const toMartinezPath = (points: Point[]): MartinezPolygon => {
  return [points.map((point) => [point.x, point.y])]
}

// Define a function to convert Martinez format points back to regular points
const fromMartinezMultiPolygon = (martinezMultiPolygon: MartinezMultiPolygon): Point[][] => {
  const result: Point[][] = []
  if (martinezMultiPolygon) {
    for (let i = 0; i < martinezMultiPolygon.length; i++) {
      const martinezPolygon = martinezMultiPolygon[i]
      const polygon: Point[] = []
      for (let j = 0; j < martinezPolygon[0].length; j++) {
        const martinezPoint = martinezPolygon[0][j]
        polygon.push(new Point(martinezPoint[0], martinezPoint[1]))
      }
      result.push(polygon)
    }
  }

  return result
}

// Define a point structure for your use
export class Point {
  constructor(
    public x: number,
    public y: number
  ) {}
}

export type Line = {
  start: { x: number; y: number }
  end: { x: number; y: number }
}

// Define the function that performs the intersection
export const intersectPolygons = (polygon: Point[], rectangle: Point[]): Point[][] => {
  // Convert points to Martinez format
  const subjectPolygon: MartinezMultiPolygon = [toMartinezPath(polygon)]

  const clipPolygon: MartinezMultiPolygon = [toMartinezPath(rectangle)]

  // Perform the intersection
  const result: MartinezMultiPolygon = martinez.intersection(
    subjectPolygon,
    clipPolygon
  ) as MartinezMultiPolygon

  return fromMartinezMultiPolygon(result)
}
