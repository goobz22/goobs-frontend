'use client'

interface AddCircleIconProps extends React.SVGProps<SVGSVGElement> {
  styles?: any
}

const AddCircleIcon: React.FC<AddCircleIconProps> = ({
  styles,
  width = 24,
  height = 24,
  ...props
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={styles?.color || 'currentColor'}
      {...props}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
    </svg>
  )
}

export default AddCircleIcon
