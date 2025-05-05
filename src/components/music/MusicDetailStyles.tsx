'use client';

export default function MusicDetailStyles() {
  return (
    <style jsx global>{`
      @keyframes pulse-slow {
        0% { opacity: 0.5; }
        50% { opacity: 0.8; }
        100% { opacity: 0.5; }
      }
      
      .animate-pulse-slow {
        animation: pulse-slow 4s infinite ease-in-out;
      }
      
      @keyframes vinyl-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .animate-vinyl-spin {
        animation: vinyl-spin 20s linear infinite;
      }
      
      /* Glowing effect for track hover */
      .track-hover-glow:hover {
        box-shadow: 0 0 15px rgba(var(--primary-rgb), 0.2);
      }
      
      /* 3D Perspective */
      .perspective {
        perspective: 1000px;
      }
      
      /* Gradient text animation */
      @keyframes gradient-text {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      
      .gradient-text-animate {
        background: linear-gradient(90deg, rgba(var(--primary-rgb), 1), rgba(var(--accent-rgb), 1), rgba(var(--primary-rgb), 1));
        background-size: 200% auto;
        color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
        animation: gradient-text 3s linear infinite;
      }
      
      /* Floating animation */
      @keyframes float {
        0% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
        100% {
          transform: translateY(0px);
        }
      }
      
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      
      /* Smooth transitions for all elements */
      * {
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
      }
    `}</style>
  );
} 