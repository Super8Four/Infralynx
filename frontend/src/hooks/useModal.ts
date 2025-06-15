import { useState, useCallback } from 'react';

interface UseModalOptions {
  initialIsOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export const useModal = ({
  initialIsOpen = false,
  onOpen,
  onClose,
}: UseModalOptions = {}) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  const open = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const newState = !prev;
      if (newState) {
        onOpen?.();
      } else {
        onClose?.();
      }
      return newState;
    });
  }, [onOpen, onClose]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}; 