import { useState } from 'react'

export const PALETTES = {
  body: ['#E8A830', '#C07840', '#F2F0E8', '#2C1A10', '#909090', '#E8A0A0', '#A0D090'],
  ear:  ['#B06818', '#904030', '#C0C0B8', '#180C04', '#606060', '#C06060', '#70A870'],
  nose: ['#1a1a1a', '#3a1a1a', '#5a2828', '#3a2010', '#000030'],
}

export const BREEDS = {
  normal: { bH: 0.72, bW: 1.00, bD: 1.80, legBase: 0.68, lW: 0.17, hS: 0.88 },
  corgi:  { bH: 0.58, bW: 1.12, bD: 2.20, legBase: 0.36, lW: 0.19, hS: 0.92 },
  hound:  { bH: 0.52, bW: 0.74, bD: 2.00, legBase: 1.10, lW: 0.15, hS: 0.74 },
  fluffy: { bH: 0.95, bW: 1.28, bD: 1.90, legBase: 0.58, lW: 0.26, hS: 1.02 },
}

export const SLIDER_DEFS = [
  { key: 'headSize',  label: 'Head Size',    min: 50,  max: 150 },
  { key: 'bodyWidth', label: 'Body Width',   min: 50,  max: 160 },
  { key: 'legLen',    label: 'Leg Length',   min: 30,  max: 180 },
  { key: 'snoutLen',  label: 'Snout Length', min: 20,  max: 220 },
  { key: 'earSize',   label: 'Ear Size',     min: 40,  max: 180 },
  { key: 'tailLen',   label: 'Tail Length',  min: 20,  max: 180 },
]

const INITIAL = {
  bodyColor: '#E8A830',
  earColor:  '#B06818',
  noseColor: '#1a1a1a',
  breed:     'normal',
  headSize:  1.0,
  bodyWidth: 1.0,
  legLen:    1.0,
  snoutLen:  1.0,
  earSize:   1.0,
  tailLen:   1.0,
}

export function useDogState() {
  const [dogState, setDogState] = useState(INITIAL)

  const update = (key, value) =>
    setDogState(prev => ({ ...prev, [key]: value }))

  return { dogState, update }
}
