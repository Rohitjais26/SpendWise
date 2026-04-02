import { motion } from 'framer-motion';

function Header({ theme, onToggleTheme }) {
  return (
    <header className="panel brand-bar">
      <div className="brand-copy">
        <motion.p
          className="brand-kicker"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          Personal Finance Workspace
        </motion.p>

        <motion.h1
          className="brand-title"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45, ease: 'easeOut' }}
        >
          <span className="brand-gradient">💸 SpendWise</span>
        </motion.h1>

        <motion.p
          className="brand-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.45 }}
        >
          Monitor transactions, explore spending patterns, and review trends in one place.
        </motion.p>
      </div>

      <div className="brand-actions">
        <motion.button
          className="theme-toggle"
          aria-label="Toggle dark mode"
          aria-pressed={theme === 'dark'}
          onClick={onToggleTheme}
          type="button"
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
        >
          <span className="theme-toggle-track" aria-hidden="true">
            <motion.span
              animate={{ x: theme === 'dark' ? 24 : 0 }}
              className="theme-toggle-thumb"
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </motion.span>
          </span>
          <span className="theme-toggle-label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
        </motion.button>
      </div>
    </header>
  );
}

export default Header;
