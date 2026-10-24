export const inputClass =
  'w-full rounded-md border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink/40 focus:border-pine focus:outline-none focus:ring-2 focus:ring-pine/25'

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-ink/80">{label}</span>
      <span className="mt-1 block">{children}</span>
    </label>
  )
}

export default Field
