import React from 'react';
import { motion } from 'framer-motion';

type LogoIconProps = {
  size?: number;
  className?: string;
};

const LogoIcon: React.FC<LogoIconProps> = ({ size = 40, className = "" }) => {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <motion.circle
        cx="20"
        cy="20"
        r="18"
        stroke="url(#gradient)"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      <motion.path
        d="M13 15L20 22L27 15"
        stroke="url(#gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.4 }}
      />
      <motion.path
        d="M13 25L20 18L27 25"
        stroke="url(#gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut", delay: 0.6 }}
      />
      <defs>
        <linearGradient id="gradient" x1="10" y1="10" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f45b69" />
          <stop offset="1" stopColor="#00d4ff" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
};

export default LogoIcon;