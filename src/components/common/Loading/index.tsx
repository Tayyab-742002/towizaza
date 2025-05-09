"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  fullScreen?: boolean;
  size?: "small" | "medium" | "large";
}

export const Loading = ({
  message = "Loading...",
  fullScreen = true,
  size = "medium",
}: LoadingProps) => {
  // Size variants for the loader
  const sizes = {
    small: {
      container: "h-32",
      icon: "w-6 h-6",
      text: "text-sm",
    },
    medium: {
      container: "h-48",
      icon: "w-12 h-12",
      text: "text-xl",
    },
    large: {
      container: "h-64",
      icon: "w-16 h-16",
      text: "text-2xl",
    },
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  // Child element animation variants
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  return (
    <div
      className={`${fullScreen ? "min-h-screen" : sizes[size].container} bg-dark text-light flex items-center justify-center`}
    >
      <motion.div
        className="flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="relative mb-6" variants={itemVariants}>
          <div className={`${sizes[size].icon} text-primary animate-spin`}>
            <Loader2 className="w-full h-full" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1/3 h-1/3 bg-dark rounded-full"></div>
          </div>
        </motion.div>

        <motion.div
          className={`${sizes[size].text} font-medium text-light/80 text-center`}
          variants={itemVariants}
        >
          {message}
        </motion.div>

        <motion.div className="mt-4 flex space-x-1" variants={itemVariants}>
          <span
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></span>
          <span
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></span>
          <span
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></span>
        </motion.div>
      </motion.div>
    </div>
  );
};
