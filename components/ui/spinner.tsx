import { css, cva } from '@/styled-system/css'

const spinnerStyles = cva({
  base: {
    display: 'inline-block',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderRadius: 'full',
    borderColor: 'gray.200',
    borderTopColor: 'blue.600',
    animation: 'spin 1s linear infinite',
  },
  variants: {
    size: {
      sm: {
        width: '4',
        height: '4',
      },
      md: {
        width: '6',
        height: '6',
      },
      lg: {
        width: '8',
        height: '8',
      },
      xl: {
        width: '12',
        height: '12',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={`${spinnerStyles({ size })} ${className || ''}`}
      role="status"
      aria-label="Loading"
    >
      <span className={css({ srOnly: true })}>Loading...</span>
    </div>
  )
}

// Alternative pulse spinner
export function PulseSpinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={css({
        display: 'inline-block',
        width: size === 'sm' ? '4' : size === 'md' ? '6' : size === 'lg' ? '8' : '12',
        height: size === 'sm' ? '4' : size === 'md' ? '6' : size === 'lg' ? '8' : '12',
        borderRadius: 'full',
        bg: 'blue.600',
        animation: 'pulse 2s ease-in-out infinite',
      })}
      role="status"
      aria-label="Loading"
    >
      <span className={css({ srOnly: true })}>Loading...</span>
    </div>
  )
}
