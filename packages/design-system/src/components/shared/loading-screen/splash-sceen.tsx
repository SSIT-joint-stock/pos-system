'use client';

import React from 'react';

import { motion } from 'framer-motion';

export default function SplashScreen({
  className,
  ...other
}: {
  className?: string;
}) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`absolute right-0 bottom-0 w-full h-screen z-[9998] flex items-center justify-center bg-black/60 ${className}`}
      {...other}
    >
      <>
        <motion.div
          animate={{
            scale: [1.6, 1, 1, 1.6, 1.6],
            rotate: [270, 0, 0, 270, 270],  
            opacity: [0.25, 1, 1, 1, 0.25],
            borderRadius: ['25%', '25%', '50%', '50%', '25%'],
          }}
          transition={{
            ease: 'linear',
            duration: 3.2,
            repeat: Infinity,
          }}
          className="w-[100px] h-[100px] absolute border border-surface opacity-24"
        />

        <motion.div
          animate={{
            scale: [1, 1.2, 1.2, 1, 1],
            rotate: [0, 270, 270, 0, 0],
            opacity: [1, 0.25, 0.25, 0.25, 1],
            borderRadius: ['25%', '25%', '50%', '50%', '25%'],
          }}
          transition={{
            ease: 'linear',
            duration: 3.2,
            repeat: Infinity,
          }}
          className="w-[120px] h-[120px] absolute border-[6px] border-secondary opacity-24"
        />
      </>
    </div>
  );
}
