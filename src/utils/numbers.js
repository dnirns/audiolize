import scaleLinear from 'd3-scale/src/linear'

export function randomNumber(min = 0, max = 1, round = false) {
  const num = scaleLinear([0, 1], [min, max])(Math.random())
  if (round) return Math.round(num)
  return num
}

export function clamp (num, min = 0, max = 1) {
  if (num >= min && num <= max) return num
  if (num < min) return min
  if (num > max) return max
}