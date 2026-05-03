import { MotionConfig } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

export function MotionConfigProvider({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  const reducedMotion = shouldReduceMotion ? 'always' : 'never';

  return (
    <MotionConfig
      reducedMotion={reducedMotion as any}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionConfig>
  );
}

