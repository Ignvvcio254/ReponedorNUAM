import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8', 
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
}

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        <Image
          src="/Nuam-logo.png"
          alt="NUAM Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className="text-lg font-bold text-nuam-500">NUAM</span>
          <span className="text-xs text-gray-500 -mt-1">Tax System</span>
        </div>
      )}
    </div>
  )
}