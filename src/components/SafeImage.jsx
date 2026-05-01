import React, { useState } from 'react';

export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=85&w=1800&auto=format&fit=crop';

const SafeImage = ({ src, alt, className = '', fallback = FALLBACK_IMAGE, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState(src || fallback);
  const [failed, setFailed] = useState(false);

  return (
    <img
      {...props}
      src={currentSrc || fallback}
      alt={alt || ''}
      className={className}
      loading={props.loading || 'lazy'}
      referrerPolicy={props.referrerPolicy || 'no-referrer'}
      onError={() => {
        if (!failed) {
          setFailed(true);
          setCurrentSrc(fallback);
        }
      }}
    />
  );
};

export default SafeImage;
