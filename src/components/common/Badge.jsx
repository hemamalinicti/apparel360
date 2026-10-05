import React from 'react';

export const StockBadge = ({ stock, minStock = 10 }) => {
  if (stock <= 0) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mr-1.5 animate-pulse"></span>
        Out of Stock (0)
      </span>
    );
  }
  if (stock <= minStock) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-burnt-50 text-burnt-700 border border-burnt-200">
        <span className="w-1.5 h-1.5 rounded-full bg-burnt-500 mr-1.5"></span>
        Low Stock ({stock})
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1.5"></span>
      In Stock ({stock})
    </span>
  );
};

export const SIZE_COLORS = {
  'XS': {
    bg: '#0D9488', // Teal
    border: '#0F766E',
    text: '#FFFFFF',
    lightBg: '#F0FDFA',
    lightBorder: '#99F6E4',
    lightText: '#115E59'
  },
  'S': {
    bg: '#2563EB', // Blue
    border: '#1D4ED8',
    text: '#FFFFFF',
    lightBg: '#EFF6FF',
    lightBorder: '#BFDBFE',
    lightText: '#1E40AF'
  },
  'M': {
    bg: '#EA580C', // Burnt Orange
    border: '#C2410C',
    text: '#FFFFFF',
    lightBg: '#FFF7ED',
    lightBorder: '#FED7AA',
    lightText: '#9A3412'
  },
  'L': {
    bg: '#059669', // Emerald Green
    border: '#047857',
    text: '#FFFFFF',
    lightBg: '#ECFDF5',
    lightBorder: '#A7F3D0',
    lightText: '#065F46'
  },
  'XL': {
    bg: '#7C3AED', // Purple
    border: '#6D28D9',
    text: '#FFFFFF',
    lightBg: '#FAF5FF',
    lightBorder: '#E9D5FF',
    lightText: '#6B21A8'
  },
  'XXL': {
    bg: '#4F46E5', // Indigo
    border: '#4338CA',
    text: '#FFFFFF',
    lightBg: '#EEF2FF',
    lightBorder: '#C7D2FE',
    lightText: '#3730A3'
  },
  '3XL': {
    bg: '#E11D48', // Rose / Crimson
    border: '#BE123C',
    text: '#FFFFFF',
    lightBg: '#FFF1F2',
    lightBorder: '#FECDD3',
    lightText: '#9F1239'
  },
  '4XL': {
    bg: '#C026D3', // Fuchsia
    border: '#A21CAF',
    text: '#FFFFFF',
    lightBg: '#FDF4FF',
    lightBorder: '#F5D0FE',
    lightText: '#86198F'
  },
  'Free Size': {
    bg: '#1B0E06', // Chocolate Brown
    border: '#000000',
    text: '#FFFFFF',
    lightBg: '#FAF5EB',
    lightBorder: '#DEC5A6',
    lightText: '#1B0E06'
  }
};

export const getSizeStyle = (sizeName, isSelected = false) => {
  const clean = sizeName?.replace(/^Size:\s*/i, '').trim();
  const matchedKey = Object.keys(SIZE_COLORS).find((k) => clean === k || clean?.includes(k));
  const color = matchedKey ? SIZE_COLORS[matchedKey] : SIZE_COLORS['Free Size'];

  if (isSelected) {
    return {
      backgroundColor: color.bg,
      borderColor: color.border,
      color: color.text,
      boxShadow: '0 2px 8px rgba(0,0,0,0.18)'
    };
  }

  return {
    backgroundColor: '#FFFFFF',
    borderColor: '#DEC5A6',
    color: '#1B0E06'
  };
};

export const SizeBadge = ({ size, variant = 'subtle' }) => {
  const clean = size?.replace(/^Size:\s*/i, '').trim();
  const matchedKey = Object.keys(SIZE_COLORS).find((k) => clean === k || clean?.includes(k));
  const color = matchedKey ? SIZE_COLORS[matchedKey] : SIZE_COLORS['Free Size'];

  if (variant === 'solid') {
    return (
      <span
        className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border shadow-2xs font-mono"
        style={{ backgroundColor: color.bg, borderColor: color.border, color: color.text }}
      >
        {size}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border shadow-2xs font-mono"
      style={{
        backgroundColor: color.lightBg,
        borderColor: color.lightBorder,
        color: color.lightText
      }}
    >
      {size}
    </span>
  );
};

export const ColorBadge = ({ color, hex }) => (
  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-white text-chocolate-800 border border-cream-300 shadow-2xs">
    {hex && (
      <span
        className="w-3 h-3 rounded-full border border-cream-300 shadow-2xs shrink-0"
        style={{ backgroundColor: hex }}
      />
    )}
    <span>{color}</span>
  </div>
);

export const CategoryBadge = ({ category }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-cream-200 text-chocolate-900 border border-cream-300">
    {category}
  </span>
);

export const GarmentImage = ({
  src,
  alt = 'Garment',
  category = "Men's Wear",
  className = 'w-10 h-10 rounded-lg object-cover',
  fallbackIconSize = 'w-5 h-5'
}) => {
  const [hasError, setHasError] = React.useState(false);

  // High-reliability CDN URLs for each garment category
  const fallbackUrls = {
    "Men's Wear": 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80',
    "Women's Wear": 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&auto=format&fit=crop&q=80',
    "Ethnic Wear": 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300&auto=format&fit=crop&q=80',
    "Winter & Outerwear": 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&auto=format&fit=crop&q=80',
    "Activewear & Sports": 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&auto=format&fit=crop&q=80',
  };

  const imageToDisplay = hasError ? (fallbackUrls[category] || fallbackUrls["Men's Wear"]) : (src || fallbackUrls[category]);

  return (
    <img
      src={imageToDisplay}
      alt={alt}
      onError={() => setHasError(true)}
      loading="lazy"
      className={`${className} border border-cream-300 shadow-2xs`}
    />
  );
};
