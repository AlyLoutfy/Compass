import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

export const Tooltip = ({ content, children, side = 'top', className = '' }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        
        let top = 0;
        let left = 0;

        // Simple positioning logic
        switch (side) {
          case 'top':
            top = rect.top - 8; // rect.top is relative to viewport, which works for fixed div
            left = rect.left + rect.width / 2;
            break;
          case 'bottom':
            top = rect.bottom + 8;
            left = rect.left + rect.width / 2;
            break;
          case 'left':
            top = rect.top + rect.height / 2;
            left = rect.left - 8;
            break;
          case 'right':
            top = rect.top + rect.height / 2;
            left = rect.right + 8;
            break;
        }
        setPosition({ top, left });
    }
  };

  const handleMouseEnter = () => {
      updatePosition();
      setIsVisible(true);
  };

  return (
    <div 
        ref={triggerRef}
        className="relative inline-flex items-center" 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && createPortal(
        <div 
            className={`fixed z-[9999] px-2 py-1 text-xs font-medium text-zinc-50 bg-zinc-900 border border-zinc-700/50 rounded shadow-md animate-in fade-in zoom-in-95 duration-200 pointer-events-none ${className || 'whitespace-nowrap'}`}
            style={{ 
                top: position.top, 
                left: position.left,
                transform: `translate(${side === 'left' || side === 'right' ? (side === 'left' ? '-100%, -50%' : '0, -50%') : '-50%, ' + (side === 'top' ? '-100%' : '0')})` 
            }}
        >
          {content}
        </div>,
        document.body
      )}
    </div>
  );
};
