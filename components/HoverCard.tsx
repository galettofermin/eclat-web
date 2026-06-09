"use client";
import { motion } from "framer-motion";

export function HoverCard({ children, className = "", style }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <motion.div className={className} style={style}
      whileHover={{ y: -5, boxShadow: "0 20px 40px -20px rgba(41,51,47,0.35)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
