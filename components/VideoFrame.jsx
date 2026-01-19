import { useEffect, useRef, useState } from 'react';

/**
 * VideoFrame - Optimized video component for documentation
 *
 * Features:
 * - Lazy loading with IntersectionObserver
 * - Automatic poster frame support
 * - Error handling with fallback
 * - Memory management (unload when out of view)
 * - Maintains autoPlay + loop + muted behavior
 *
 * @param {Object} props
 * @param {string} props.src - Video source path (required)
 * @param {string} props.poster - Poster image path (optional, auto-generated from src)
 * @param {boolean} props.lazyLoad - Enable lazy loading (default: true)
 */
export const VideoFrame = ({
  src,
  poster: customPoster,
  lazyLoad = true
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(!lazyLoad);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Auto-generate poster path from src
  const posterPath = customPoster || src.replace('.mp4', '.jpg').replace('/videos/', '/videos/posters/');

  useEffect(() => {
    if (!lazyLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          } else {
            // Unload video when out of viewport to save memory
            setIsInView(false);
            if (videoRef.current) {
              videoRef.current.pause();
              videoRef.current.removeAttribute('src');
              videoRef.current.load();
            }
            setIsLoaded(false);
          }
        });
      },
      {
        rootMargin: '200px', // Load 200px before entering viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [lazyLoad]);

  const handleLoadedData = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleError = () => {
    setHasError(true);
    console.error(`Failed to load video: ${src}`);
  };

  return (
    <Frame>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          backgroundColor: '#f5f5f5',
          borderRadius: '12px',
          overflow: 'hidden',
          minHeight: '400px'
        }}
      >
        {hasError ? (
          // Error state
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '400px',
            color: '#666',
            fontSize: '14px'
          }}>
            Unable to load video. Please refresh the page.
          </div>
        ) : (
          <>
            {/* Loading skeleton */}
            {!isLoaded && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'loading 1.5s ease-in-out infinite',
                borderRadius: '12px'
              }} />
            )}

            {/* Video element */}
            {isInView && (
              <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                poster={posterPath}
                width="100%"
                style={{
                  borderRadius: '12px',
                  display: 'block'
                }}
                onLoadedData={handleLoadedData}
                onError={handleError}
              >
                <source src={src} type="video/mp4" />
                {/* Fallback for browsers without video support */}
                <img src={posterPath} alt="Video preview" />
              </video>
            )}
          </>
        )}
      </div>

      {/* CSS animation for loading skeleton */}
      <style jsx>{`
        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </Frame>
  );
};
