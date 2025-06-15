import { useEffect, useCallback } from 'react';

type KeyCombo = string | string[];
type ModifierKey = 'ctrl' | 'alt' | 'shift' | 'meta';

interface ShortcutOptions {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

interface ShortcutConfig {
  key: KeyCombo;
  callback: (event: KeyboardEvent) => void;
  options?: ShortcutOptions;
}

export const useKeyboardShortcut = (shortcuts: ShortcutConfig[]) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      shortcuts.forEach(({ key, callback, options = {} }) => {
        const {
          ctrl = false,
          alt = false,
          shift = false,
          meta = false,
          preventDefault = true,
          stopPropagation = true,
        } = options;

        const keys = Array.isArray(key) ? key : [key];
        const pressedKey = event.key.toLowerCase();

        const modifierKeysMatch =
          event.ctrlKey === ctrl &&
          event.altKey === alt &&
          event.shiftKey === shift &&
          event.metaKey === meta;

        const keyMatch = keys.some(
          (k) => k.toLowerCase() === pressedKey
        );

        if (modifierKeysMatch && keyMatch) {
          if (preventDefault) {
            event.preventDefault();
          }
          if (stopPropagation) {
            event.stopPropagation();
          }
          callback(event);
        }
      });
    },
    [shortcuts]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    handleKeyDown,
  };
}; 