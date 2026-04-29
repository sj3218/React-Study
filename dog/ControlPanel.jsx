import { useRef } from 'react'
import styles from './ControlPanel.module.css'
import { PALETTES, SLIDER_DEFS, BREEDS } from '../useDogState'

/* ── SliderRow sub-component ── */
function SliderRow({ def, value, onChange }) {
  const { key, label, min, max } = def
  const pct = (((value * 100) - min) / (max - min) * 100).toFixed(1)

  const handleChange = (e) => {
    onChange(key, parseInt(e.target.value) / 100)
  }

  return (
    <div className={styles.sliderBlock}>
      <div className={styles.sliderTop}>
        <span className={styles.sliderName}>{label}</span>
        <span className={styles.sliderBadge}>{value.toFixed(1)}×</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={Math.round(value * 100)}
        style={{ '--pct': `${pct}%` }}
        onChange={handleChange}
      />
      <div className={styles.sliderRangeLabels}>
        <span>{(min / 100).toFixed(1)}</span>
        <span>{(max / 100).toFixed(1)}</span>
      </div>
    </div>
  )
}

/* ── SwatchRow sub-component ── */
function SwatchRow({ palette, active, onSelect }) {
  return (
    <div className={styles.swatchRow}>
      {palette.map((color) => (
        <button
          key={color}
          className={`${styles.swatch} ${active === color ? styles.swatchActive : ''}`}
          style={{
            background: color,
            boxShadow: color === '#F2F0E8' ? 'inset 0 0 0 1px #ccc' : 'none',
          }}
          onClick={() => onSelect(color)}
          aria-label={color}
        />
      ))}
    </div>
  )
}

/* ── ControlPanel ── */
export default function ControlPanel({ dogState, update, onSave }) {
  return (
    <aside className={styles.panel}>
      <div className={styles.inner}>

        <h1 className={styles.title}>Dog<br />Generator</h1>

        {/* Breed */}
        <div className={styles.sectionHeader}>Breed</div>
        <div className={styles.breedGrid}>
          {Object.keys(BREEDS).map((breed) => (
            <button
              key={breed}
              className={`${styles.breedBtn} ${dogState.breed === breed ? styles.breedBtnActive : ''}`}
              onClick={() => update('breed', breed)}
            >
              {{ normal: 'Normal', corgi: 'Corgi', hound: 'Greyhound', fluffy: 'Chow Chow' }[breed]}
            </button>
          ))}
        </div>

        {/* Colors */}
        <div className={styles.sectionHeader}>Body Color</div>
        <SwatchRow palette={PALETTES.body} active={dogState.bodyColor} onSelect={(c) => update('bodyColor', c)} />

        <div className={styles.sectionHeader}>Ear / Accent</div>
        <SwatchRow palette={PALETTES.ear} active={dogState.earColor} onSelect={(c) => update('earColor', c)} />

        <div className={styles.sectionHeader}>Nose</div>
        <SwatchRow palette={PALETTES.nose} active={dogState.noseColor} onSelect={(c) => update('noseColor', c)} />

        {/* Sliders */}
        <div className={styles.sectionHeader}>Proportions</div>
        {SLIDER_DEFS.map((def) => (
          <SliderRow
            key={def.key}
            def={def}
            value={dogState[def.key]}
            onChange={update}
          />
        ))}

      </div>

      <div className={styles.saveWrap}>
        <button className={styles.saveBtn} onClick={onSave}>↓ Save PNG</button>
      </div>
    </aside>
  )
}
