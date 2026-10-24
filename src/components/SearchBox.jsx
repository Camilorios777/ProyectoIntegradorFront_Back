import { inputClass } from './Field'

function SearchBox({ value, onChange, placeholder }) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className={`${inputClass} mb-4`}
    />
  )
}

export default SearchBox
