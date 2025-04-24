import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  const spinTransition = {
    repeat: Infinity,
    ease: 'linear',
    duration: 1,
  };

  return (
    <motion.div
      className='flex justify-center items-center'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={cn(
          'rounded-full border-4 border-gray-200 border-t-blue-600',
          sizeClasses[size],
          className,
        )}
        animate={{ rotate: 360 }}
        transition={spinTransition}
      />
    </motion.div>
  );
}
