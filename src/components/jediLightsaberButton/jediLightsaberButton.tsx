import React, { useState, useEffect } from 'react'

type Props = {
  action: () => void
  direction?: 'left' | 'right'
  disabled?: boolean
}

const JediLightsaberButton: React.FC<Props> = ({
  action,
  direction = 'right',
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [wasDisabled, setWasDisabled] = useState(disabled)

  useEffect(() => {
    if (disabled) {
      setIsHovered(false)
    }
    setWasDisabled(disabled)
  }, [disabled])

  // Reset hover state when touch ends
  useEffect(() => {
    const handleTouchEnd = () => {
      setIsHovered(false)
    }

    document.addEventListener('touchend', handleTouchEnd)
    return () => {
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [])

  const handlelePartClasses = 'h-[15px]'
  const metalPartClasses = 'bg-neutral-500'
  const plasticPartClasses = 'bg-neutral-200'
  const isLeftDirection = direction === 'left'

  const buttonClasses = `
    relative flex items-center justify-start w-48 h-4
    ${disabled ? 'cursor-not-allowed' : 'bg-gray-800 cursor-pointer'}
    rounded-full focus:outline-none transform transition-all duration-300 ease-in-out
  `

  const handleClasses = `
    absolute ${isLeftDirection ? 'right-0' : 'left-0'}
    w-16 h-4 flex items-center justify-center z-10
    ${isLeftDirection ? 'flex-row-reverse' : ''}
  `

  const bladeClasses = `
    absolute ${isLeftDirection ? 'right-12' : 'left-12'}
    top-1/2 -translate-y-1/2 h-2
    ${disabled ? 'bg-gray-400' : 'bg-sky-300'}
    rounded-full transition-all duration-300 ease-in-out
    ${isHovered && !disabled ? 'w-40 shadow-[0_0_10px_3px_rgba(59,130,246,0.5),0_0_20px_6px_rgba(59,130,246,0.3)]' : 'w-0'}
  `

  const handleInteractionStart = () => {
    if (!disabled && !wasDisabled) {
      setIsHovered(true)
    }
  }

  const handleInteractionEnd = () => {
    setIsHovered(false)
  }

  const handleClick = () => {
    if (!disabled) {
      action()

      if ('ontouchstart' in window) {
        setTimeout(() => setIsHovered(false), 300)
      }
    }
  }

  return (
    <div className="flex items-center p-4">
      <button
        className={buttonClasses}
        onMouseEnter={handleInteractionStart}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onClick={handleClick}
        disabled={disabled}
      >
        <div className={handleClasses}>
          <div
            className={`${metalPartClasses} w-[15px] ${isLeftDirection ? 'rounded-e-full' : 'rounded-s-full'} ${handlelePartClasses}`}
          ></div>
          <div className={`${plasticPartClasses} w-[4px] h-[13px]`}></div>
          <div
            className={`${metalPartClasses} w-[2px] ${handlelePartClasses}`}
          ></div>
          <div className={`${plasticPartClasses} w-[4px] h-[13px]`}></div>
          <div
            className={`${metalPartClasses} w-[2px] ${handlelePartClasses}`}
          ></div>
          <div className={`${plasticPartClasses} w-[4px] h-[13px]`}></div>
          <div
            className={`w-1 h-1 ${disabled ? 'bg-gray-400' : 'bg-yellow-500'} rounded-full`}
          ></div>
          <div className={`${plasticPartClasses} w-[15px] h-[13px]`}></div>
          <div
            className={`${metalPartClasses} w-[10px] ${handlelePartClasses}`}
          ></div>
        </div>
        <div className={bladeClasses}></div>
      </button>
    </div>
  )
}

export default JediLightsaberButton
