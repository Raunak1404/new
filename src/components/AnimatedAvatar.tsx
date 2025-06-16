import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type AvatarType = 'boy1' | 'boy2' | 'girl1' | 'girl2';

interface AnimatedAvatarProps {
  type: AvatarType;
  size?: number;
  interval?: number;
  selected?: boolean;
  onClick?: () => void;
}

// Define avatar configurations
const avatarConfigs = {
  boy1: {
    primaryColor: "#3b82f6", // blue
    secondaryColor: "#1e40af",
    skinColor: "#f8d9b4",
    hairColor: "#222222"
  },
  boy2: {
    primaryColor: "#10b981", // green
    secondaryColor: "#047857",
    skinColor: "#e5c298",
    hairColor: "#513b2a"
  },
  girl1: {
    primaryColor: "#ec4899", // pink
    secondaryColor: "#be185d",
    skinColor: "#f8d9b4",
    hairColor: "#513b2a"
  },
  girl2: {
    primaryColor: "#8b5cf6", // purple
    secondaryColor: "#6d28d9",
    skinColor: "#e5c298",
    hairColor: "#222222"
  }
};

const AnimatedAvatar: React.FC<AnimatedAvatarProps> = ({ 
  type, 
  size = 120, 
  interval = 10000, 
  selected = false,
  onClick 
}) => {
  const [isWaving, setIsWaving] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const config = avatarConfigs[type];
  
  // Periodic animations
  useEffect(() => {
    // Wave animation at specified interval
    const waveInterval = setInterval(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 2500); // Stop waving after 2.5 seconds
    }, interval);
    
    // Blinking animation at random intervals
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 300); // Eyes closed for 300ms
    }, Math.random() * 3000 + 2000); // Random time between 2-5 seconds
    
    // Initial wave after a short delay
    const initialTimer = setTimeout(() => {
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 2500);
    }, 1000);
    
    return () => {
      clearInterval(waveInterval);
      clearInterval(blinkInterval);
      clearTimeout(initialTimer);
    };
  }, [interval]);

  // Arm wave animation variants
  const armVariants = {
    rest: { rotate: 0, x: 0 },
    wave: {
      rotate: [0, 20, -10, 20, -10, 20, 0],
      x: [0, 2, -1, 2, -1, 2, 0],
      transition: {
        duration: 2.5,
        times: [0, 0.2, 0.4, 0.6, 0.8, 0.9, 1],
        ease: "easeInOut"
      }
    }
  };
  
  // Face animation variants
  const faceVariants = {
    rest: { y: 0 },
    happy: {
      y: [0, -2, 0],
      transition: { duration: 0.5, repeat: 1, repeatType: "reverse" }
    }
  };
  
  // Eye animation variants
  const eyeVariants = {
    open: { scaleY: 1 },
    blink: { scaleY: 0.1, transition: { duration: 0.1 } }
  };

  // Smooth entry animation
  const entryAnimation = {
    initial: { opacity: 0, rotate: -180, scale: 0.5 },
    animate: { 
      opacity: 1, 
      rotate: 0,
      scale: 1,
      transition: {
        duration: 1.5,
        ease: [0.34, 1.56, 0.64, 1], // Custom spring-like easing
      }
    }
  };

  // Render appropriate avatar based on type
  return (
    <motion.div 
      className={`relative rounded-full overflow-hidden cursor-pointer ${selected ? 'ring-4 ring-[var(--accent)]' : ''}`}
      style={{ 
        width: size, 
        height: size,
        background: `radial-gradient(circle at center, ${config.primaryColor}, ${config.secondaryColor})`,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      {...entryAnimation}
    >
      {/* Background circles/bubbles for 3D effect */}
      <motion.div 
        className="absolute"
        style={{
          width: size * 0.8,
          height: size * 0.8,
          borderRadius: "50%",
          background: `radial-gradient(circle at 30% 30%, ${config.primaryColor}99, transparent)`,
          top: size * 0.1,
          left: size * 0.1,
        }}
        animate={{
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      
      {/* Character Body */}
      <motion.div
        className="absolute bottom-0 w-full"
        style={{ height: size * 0.6 }}
        animate={{
          y: [0, -2, 0],
        }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      >
        {/* Torso/Shirt */}
        <motion.div
          style={{
            width: size * 0.5,
            height: size * 0.3,
            background: config.primaryColor,
            borderRadius: `${size * 0.1}px ${size * 0.1}px 0 0`,
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
        />
      </motion.div>
      
      {/* Character Head */}
      <motion.div
        style={{
          width: size * 0.4,
          height: size * 0.4,
          background: config.skinColor,
          borderRadius: '50%',
          position: 'absolute',
          top: size * 0.15,
          left: '50%',
          transform: 'translateX(-50%)'
        }}
        variants={faceVariants}
        animate={isWaving ? "happy" : "rest"}
      >
        {/* Eyes */}
        <motion.div
          style={{
            width: size * 0.07,
            height: size * 0.07,
            background: '#222',
            borderRadius: '50%',
            position: 'absolute',
            top: size * 0.16,
            left: size * 0.13,
            transformOrigin: 'center'
          }}
          variants={eyeVariants}
          animate={isBlinking ? "blink" : "open"}
        />
        <motion.div
          style={{
            width: size * 0.07,
            height: size * 0.07,
            background: '#222',
            borderRadius: '50%',
            position: 'absolute',
            top: size * 0.16,
            right: size * 0.13,
            transformOrigin: 'center'
          }}
          variants={eyeVariants}
          animate={isBlinking ? "blink" : "open"}
        />
        
        {/* Mouth */}
        <motion.div
          style={{
            width: size * 0.16,
            height: size * 0.06,
            background: type.includes('girl') ? '#f472b6' : '#222',
            borderRadius: '5px 5px 10px 10px',
            position: 'absolute',
            bottom: size * 0.08,
            left: '50%',
            transform: 'translateX(-50%)'
          }}
          animate={isWaving ? {
            height: size * 0.08,
            borderRadius: '5px 5px 12px 12px'
          } : {}}
        />

        {/* Hair style based on avatar type */}
        {type === 'boy1' && (
          <motion.div
            style={{
              width: size * 0.42,
              height: size * 0.15,
              background: config.hairColor,
              position: 'absolute',
              borderRadius: `${size * 0.1}px ${size * 0.1}px 0 0`,
              top: -size * 0.02,
              left: -size * 0.01
            }}
          />
        )}
        {type === 'boy2' && (
          <motion.div
            style={{
              width: size * 0.42,
              height: size * 0.2,
              background: config.hairColor,
              position: 'absolute',
              borderRadius: '50% 50% 0 0',
              top: -size * 0.05,
              left: -size * 0.01
            }}
          />
        )}
        {type === 'girl1' && (
          <>
            <motion.div
              style={{
                width: size * 0.48,
                height: size * 0.3,
                background: config.hairColor,
                position: 'absolute',
                borderRadius: '50% 50% 30% 30%',
                top: -size * 0.1,
                left: -size * 0.04
              }}
            />
            <motion.div
              style={{
                width: size * 0.15,
                height: size * 0.25,
                background: config.hairColor,
                position: 'absolute',
                borderRadius: '20px',
                top: size * 0.15,
                left: -size * 0.03
              }}
            />
            <motion.div
              style={{
                width: size * 0.15,
                height: size * 0.25,
                background: config.hairColor,
                position: 'absolute',
                borderRadius: '20px',
                top: size * 0.15,
                right: -size * 0.03
              }}
            />
          </>
        )}
        {type === 'girl2' && (
          <>
            <motion.div
              style={{
                width: size * 0.48,
                height: size * 0.25,
                background: config.hairColor,
                position: 'absolute',
                borderRadius: '50% 50% 0 0',
                top: -size * 0.08,
                left: -size * 0.04
              }}
            />
            <motion.div
              style={{
                width: size * 0.12,
                height: size * 0.4,
                background: config.hairColor,
                position: 'absolute',
                borderRadius: '10px 10px 0 20px',
                top: size * 0.12,
                left: -size * 0.06,
                transform: 'rotate(5deg)'
              }}
            />
            <motion.div
              style={{
                width: size * 0.12,
                height: size * 0.4,
                background: config.hairColor,
                position: 'absolute',
                borderRadius: '10px 10px 20px 0',
                top: size * 0.12,
                right: -size * 0.06,
                transform: 'rotate(-5deg)'
              }}
            />
          </>
        )}
      </motion.div>
      
      {/* Left arm (the waving one) */}
      <motion.div
        style={{
          width: size * 0.1,
          height: size * 0.3,
          background: config.primaryColor,
          borderRadius: '10px',
          position: 'absolute',
          bottom: size * 0.1,
          left: size * 0.15,
          transformOrigin: 'bottom center',
          zIndex: 10
        }}
        variants={armVariants}
        animate={isWaving ? "wave" : "rest"}
      >
        {/* Hand */}
        <motion.div
          style={{
            width: size * 0.12,
            height: size * 0.12,
            background: config.skinColor,
            borderRadius: '50%',
            position: 'absolute',
            top: -size * 0.05,
            left: -size * 0.01
          }}
        />
      </motion.div>
      
      {/* Right arm (static) */}
      <motion.div
        style={{
          width: size * 0.1,
          height: size * 0.2,
          background: config.primaryColor,
          borderRadius: '10px',
          position: 'absolute',
          bottom: size * 0.1,
          right: size * 0.2,
          transformOrigin: 'bottom center',
          transform: 'rotate(-10deg)',
          zIndex: -1
        }}
      >
        {/* Hand */}
        <motion.div
          style={{
            width: size * 0.12,
            height: size * 0.12,
            background: config.skinColor,
            borderRadius: '50%',
            position: 'absolute',
            top: -size * 0.06,
            right: -size * 0.02
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedAvatar;