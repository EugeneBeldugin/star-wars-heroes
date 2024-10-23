import React from 'react'

// Loading placeholder for HeroCard

const HeroCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-950 rounded-xl overflow-hidden shadow-lg animate-pulse">
      {/* Name placeholder */}
      <div className="p-4">
        <div className="h-6 bg-gradient-to-r from-gray-700 to-gray-800 rounded w-2/3"></div>
      </div>

      {/* Image placeholder */}
      <div className="h-[20rem] relative border-t-2 border-b-1 border-gray-700">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700"></div>
      </div>

      {/* Stats placeholder */}
      <div className="border-t-2 border-gray-700 p-4 flex gap-6 items-center">
        {/* Height stat */}
        <div className="flex gap-2 items-center">
          <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
          <div className="w-10 h-5 bg-gray-700 rounded"></div>
        </div>
        {/* Mass stat */}
        <div className="flex gap-2 items-center">
          <div className="w-5 h-5 bg-gray-700 rounded-full"></div>
          <div className="w-10 h-5 bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export default HeroCardSkeleton
