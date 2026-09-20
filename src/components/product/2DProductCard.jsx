import React from 'react';


const TwoDProductCard = ({
  src,
  alt = 'Product Image',
  badge = null,
  badgeIcon = null,
  onBadgeClick,
  className = '',
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="bg-[#f7f7f7] p-8 md:p-0 relative aspect-square flex items-center justify-center overflow-hidden group">
        {badge && (
          <span
            onClick={onBadgeClick}
            className={`absolute top-6 right-6 bg-black/80 text-white px-4 py-2 rounded-full text-[0.7rem] font-bold tracking-wider flex items-center gap-2 backdrop-blur-md z-10 ${onBadgeClick ? 'cursor-pointer' : ''}`}
          >
            {badgeIcon && <span className="icon">{badgeIcon}</span>}
            {badge}
          </span>
        )}
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain transition-transform duration-500 ease-custom group-hover:scale-105"
        />
      </div>
    </div>
  );
};

export default TwoDProductCard;
