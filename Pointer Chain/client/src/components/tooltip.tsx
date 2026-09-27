import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  delay?: number;
}

export function Tooltip({ content, children, delay = 500 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  let timeout: NodeJS.Timeout;

  const showTooltip = (event: React.MouseEvent) => {
    timeout = setTimeout(() => {
      setPosition({ x: event.pageX + 10, y: event.pageY - 10 });
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeout);
    setIsVisible(false);
  };

  const updatePosition = (event: React.MouseEvent) => {
    if (isVisible) {
      setPosition({ x: event.pageX + 10, y: event.pageY - 10 });
    }
  };

  return (
    <>
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onMouseMove={updatePosition}
      >
        {children}
      </div>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-lg pointer-events-none max-w-xs"
            style={{ left: position.x, top: position.y }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
