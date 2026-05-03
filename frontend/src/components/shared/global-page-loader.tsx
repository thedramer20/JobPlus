import { motion } from 'framer-motion';

interface GlobalPageLoaderProps {
  isPending?: boolean;
}

export function GlobalPageLoader({ isPending = false }: GlobalPageLoaderProps) {
  if (!isPending) return null;

  return (
    <motion.div
      className="jp-global-loader is-visible"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="jp-global-loader-spinner">
        <div className="jp-global-loader-ring" />
      </div>
    </motion.div>
  );
}

