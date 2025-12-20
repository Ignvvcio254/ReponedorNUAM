import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'header'
  showText?: boolean
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8', 
  lg: 'h-12 w-12',
  header: 'h-14 w-14',  // Size optimized for header
  xl: 'h-16 w-16',
  '2xl': 'h-24 w-24 sm:h-32 sm:w-32 lg:h-40 lg:w-40 xl:h-48 xl:w-48',
  '3xl': 'h-32 w-32 sm:h-48 sm:w-48 lg:h-64 lg:w-64 xl:h-80 xl:w-80'
}

export function Logo({ className, size = 'md', showText = true }: LogoProps) {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        <Image
          src="/logonuam.svg"
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