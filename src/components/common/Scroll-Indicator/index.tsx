import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ScrollIndicatorProps {
  color?: string;
  glowIntensity?: number;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  color = "#ffffff",
  glowIntensity = 5,
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-24 w-12 cursor-pointer ">
      <motion.div
        className="mb-1"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 8 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1.2,
          ease: "easeInOut",
        }}
        style={{
          filter: `drop-shadow(0 0 ${glowIntensity}px ${color})`,
        }}
      >
        <ChevronDown size={28} color={color} strokeWidth={2.5} />
      </motion.div>

      <motion.div
        className="mt-[-8px]"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 8 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1.2,
          delay: 0.3,
          ease: "easeInOut",
        }}
        style={{
          filter: `drop-shadow(0 0 ${glowIntensity}px ${color})`,
        }}
      >
        <ChevronDown size={28} color={color} strokeWidth={2.5} />
      </motion.div>
    </div>
  );
};

export default ScrollIndicator;
