import { motion as Motion, useReducedMotion } from 'framer-motion';
import moneyLogo from '../../money-logo.gif';

function Header({ theme, onToggleTheme }) {
  const shouldReduceMotion = useReducedMotion();

  const motionKicker = shouldReduceMotion
    ? {}
    : {
        animate: { opacity: 1, y: 0 },
        initial: { opacity: 0, y: -8 },
        transition: { duration: 0.4, ease: 'easeOut' },
      };

  const motionTitle = shouldReduceMotion
    ? {}
    : {
        animate: { opacity: 1, y: 0 },
        initial: { opacity: 0, y: -10 },
        transition: { delay: 0.1, duration: 0.45, ease: 'easeOut' },
      };

  const motionSubtitle = shouldReduceMotion
    ? {}
    : {
        animate: { opacity: 1 },
        initial: { opacity: 0 },
        transition: { delay: 0.2, duration: 0.45 },
      };

  return (
    <header className="panel brand-bar">
      <div className="brand-copy">
        <Motion.p className="brand-kicker" {...motionKicker}>
          Personal Finance Workspace
        </Motion.p>

        <Motion.h1 className="brand-title" {...motionTitle}>
          <span className="brand-title-row">
            <img alt="" aria-hidden="true" className="brand-logo" src={moneyLogo} />
            <span className="brand-gradient">SpendWise</span>
          </span>
        </Motion.h1>

        <Motion.p className="brand-subtitle" {...motionSubtitle}>
          Monitor transactions, explore spending patterns, and review trends in one place.
        </Motion.p>
      </div>

      <div className="brand-actions">
        <Motion.button
          aria-label="Toggle dark mode"
          aria-pressed={theme === 'dark'}
          className="theme-toggle"
          onClick={onToggleTheme}
          type="button"
          whileHover={shouldReduceMotion ? undefined : { y: -1 }}
          whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
        >
          <span className="theme-toggle-track" aria-hidden="true">
            <Motion.span
              animate={{ x: theme === 'dark' ? 24 : 0 }}
              className="theme-toggle-thumb"
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' }}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </Motion.span>
          </span>
          <span className="theme-toggle-label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
        </Motion.button>
      </div>
    </header>
  );
}

export default Header;
