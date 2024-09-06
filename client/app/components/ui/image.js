import React from 'react';
import { cn } from '@/lib/utils';

const Image = React.forwardRef(
  ({ src, alt = '', className, ...props }, ref) => {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          'w-full h-auto rounded-md object-cover shadow-sm transition-transform duration-300 ease-in-out',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Image.displayName = 'Image';

export { Image };
