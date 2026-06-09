"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function ProgressBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0,
            height: '3px', zIndex: 9999, pointerEvents: 'none',
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            style={{
              height: '100%',
              background: 'var(--sage-deep)',
              boxShadow: '0 0 10px var(--sage-deep)',
              originX: 0,
            }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.55, ease: [0.2, 0.7, 0.2, 1] }}
          />
          <motion.div
            style={{
              position: 'absolute', right: 0, top: '50%',
              transform: 'translateY(-50%)',
              width: '6px', height: '6px', borderRadius: '50%',
              background: 'var(--sage-deep)',
              boxShadow: '0 0 8px 3px var(--sage-deep)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
