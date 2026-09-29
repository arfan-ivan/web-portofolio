const S = [
  [0, '#f97316', '#fdba74', '#fff3e6', '#ffc98a', '#7c2d12', '#ffffff', '#ea580c'],
  [0.2, '#f59e0b', '#fde68a', '#fffbe6', '#fde9a0', '#78350f', '#5b2a06', '#d97706'],
  [0.5, '#eab308', '#fef08a', '#fffdf0', '#fff3b0', '#713f12', '#5b2a06', '#ca8a04'],
  [0.8, '#f59e0b', '#fde68a', '#fffbe6', '#fde9a0', '#78350f', '#5b2a06', '#d97706'],
  [1, '#ea580c', '#fb923c', '#fff1e6', '#ffb877', '#7c2d12', '#ffffff', '#ea580c'],
  [1.15, '#2a479a', '#6a9be6', '#f0f6ff', '#5b8be0', '#1e3a8a', '#ffffff', '#2f9bff'],
  [1.5, '#223c8c', '#5a88d8', '#eaf2ff', '#4a78d4', '#1e3a8a', '#ffffff', '#2f9bff'],
  [1.85, '#2a479a', '#6a9be6', '#f0f6ff', '#5b8be0', '#1e3a8a', '#ffffff', '#2f9bff'],
  [2, '#f97316', '#fdba74', '#fff3e6', '#ffc98a', '#7c2d12', '#ffffff', '#ea580c']
]

const H = [[0, 178, 1.05], [0.2, 196, 1.15], [0.5, 196, 1.15], [0.8, 196, 1.15], [1, 178, 1], [1.15, 0, 0.8], [1.5, 0, 0.72], [1.85, 0, 0.8], [2, 178, 1.05]]

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))

const mix = (a, b, t) => {
  const x = rgb(a)
  const y = rgb(b)
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('')
}

const seg = (T, c) => {
  let i = 0
  while (i < T.length - 2 && c >= T[i + 1][0]) i++
  const a = T[i]
  const b = T[i + 1]
  return [a, b, Math.min(1, Math.max(0, (c - a[0]) / (b[0] - a[0])))]
}

export function skyAt(c) {
  const [a, b, t] = seg(S, c)
  return ['top', 'bottom', 'light', 'cloud', 'ink', 'on', 'acc'].reduce((o, k, j) => {
    o[k] = mix(a[j + 1], b[j + 1], t)
    return o
  }, {})
}

export function fxAt(c) {
  const [a, b, t] = seg(H, c)
  return { hue: a[1] + (b[1] - a[1]) * t + 'deg', cb: a[2] + (b[2] - a[2]) * t }
}

export function startCycle() {
  const d = new Date()
  const h = d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600
  return h >= 6 && h < 18 ? (h - 6) / 12 : 1 + ((h - 18 + 24) % 24) / 12
}

export function starOpacity(c) {
  return c < 1 ? 0 : Math.max(0, Math.min(1, (c - 1) * 5, (2 - c) * 5))
}
