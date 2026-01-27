import { useState, useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SwipeAction {
  icon: ReactNode;
  label: string;
  color: string;
  onClick: () => void;
}

interface SwipeableCardProps {
  children: ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  className?: string;
  threshold?: number;
}

export function SwipeableCard({
  children,
  leftActions = [],
  rightActions = [],
  className,
  threshold = 80,
}: SwipeableCardProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const maxLeftSwipe = leftActions.length * 70;
  const maxRightSwipe = rightActions.length * 70;

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    currentX.current = translateX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const diff = e.touches[0].clientX - startX.current;
    let newTranslate = currentX.current + diff;
    
    // Limit the swipe distance with resistance
    if (newTranslate > 0) {
      newTranslate = Math.min(newTranslate, maxLeftSwipe + 20);
      if (newTranslate > maxLeftSwipe) {
        newTranslate = maxLeftSwipe + (newTranslate - maxLeftSwipe) * 0.3;
      }
    } else {
      newTranslate = Math.max(newTranslate, -maxRightSwipe - 20);
      if (newTranslate < -maxRightSwipe) {
        newTranslate = -maxRightSwipe + (newTranslate + maxRightSwipe) * 0.3;
      }
    }
    
    setTranslateX(newTranslate);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Snap to action buttons or back to center
    if (translateX > threshold && leftActions.length > 0) {
      setTranslateX(maxLeftSwipe);
    } else if (translateX < -threshold && rightActions.length > 0) {
      setTranslateX(-maxRightSwipe);
    } else {
      setTranslateX(0);
    }
  };

  const handleActionClick = (action: SwipeAction) => {
    action.onClick();
    setTranslateX(0);
  };

  const resetPosition = () => {
    setTranslateX(0);
  };

  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      {/* Left Actions (swipe right to reveal) */}
      {leftActions.length > 0 && (
        <div className="absolute inset-y-0 left-0 flex">
          {leftActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className={cn(
                "flex flex-col items-center justify-center w-[70px] h-full transition-opacity",
                action.color
              )}
              style={{
                opacity: translateX > 20 ? 1 : 0,
              }}
            >
              {action.icon}
              <span className="text-[10px] font-medium mt-1">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Right Actions (swipe left to reveal) */}
      {rightActions.length > 0 && (
        <div className="absolute inset-y-0 right-0 flex">
          {rightActions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className={cn(
                "flex flex-col items-center justify-center w-[70px] h-full transition-opacity",
                action.color
              )}
              style={{
                opacity: translateX < -20 ? 1 : 0,
              }}
            >
              {action.icon}
              <span className="text-[10px] font-medium mt-1">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main Content */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={translateX !== 0 ? resetPosition : undefined}
        className={cn(
          "relative bg-card transition-transform",
          isDragging ? "transition-none" : "duration-200 ease-out"
        )}
        style={{
          transform: `translateX(${translateX}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
