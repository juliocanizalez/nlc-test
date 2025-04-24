import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import type { VariantProps } from 'class-variance-authority';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/lib/button-variants';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const buttonAnimation = {
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.15 },
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      );
    }

    // Create a regular button element
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);

// Create a separate animated button that wraps the standard button
const AnimatedButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    if (asChild) {
      return (
        <Button
          asChild={true}
          {...props}
          ref={ref}
        />
      );
    }

    return (
      <motion.div
        className='contents'
        whileHover={buttonAnimation.whileHover}
        whileTap={buttonAnimation.whileTap}
        transition={buttonAnimation.transition}
      >
        <button
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        />
      </motion.div>
    );
  },
);
AnimatedButton.displayName = 'AnimatedButton';

Button.displayName = 'Button';

export { Button, AnimatedButton };
