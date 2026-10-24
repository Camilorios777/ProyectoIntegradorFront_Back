function PrimaryButton({ children, variant = 'primary', type = 'button', ...props }) {
  const styles =
    variant === 'secondary'
      ? 'border border-line bg-white text-ink hover:bg-mist'
      : 'bg-pine text-white hover:bg-pine-dark'

  return (
    <button
      type={type}
      className={`rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${styles}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default PrimaryButton
