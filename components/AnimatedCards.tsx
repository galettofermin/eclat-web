"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedCards({ children, className = "", style }: ContainerProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function AnimatedCard({ children, className = "", style }: CardProps) {
  return (
    <motion.div
      className={className}
      style={style}
      variants={{
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.2, 0.7, 0.2, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
