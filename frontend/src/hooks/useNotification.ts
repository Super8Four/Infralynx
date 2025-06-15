import { useCallback } from 'react';
import { CToast, CToastBody, CToastHeader } from '@coreui/react';

interface NotificationOptions {
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export const useNotification = () => {
  const showNotification = useCallback(
    ({ title, message, type = 'info', duration = 3000 }: NotificationOptions) => {
      const toast = document.createElement('div');
      toast.className = 'toast-container position-fixed top-0 end-0 p-3';
      document.body.appendChild(toast);

      const toastComponent = (
        <CToast
          visible={true}
          color={type}
          className="text-white align-items-center"
          delay={duration}
          onClose={() => {
            document.body.removeChild(toast);
          }}
        >
          <div className="d-flex">
            <CToastBody>
              {title && <CToastHeader>{title}</CToastHeader>}
              {message}
            </CToastBody>
          </div>
        </CToast>
      );

      // Render the toast component
      const root = document.createElement('div');
      toast.appendChild(root);
      // You would need to use ReactDOM.render here in a real implementation
      // For now, we'll just show a simple alert
      alert(`${title ? title + ': ' : ''}${message}`);
    },
    []
  );

  const success = useCallback(
    (message: string, title?: string) =>
      showNotification({ title, message, type: 'success' }),
    [showNotification]
  );

  const error = useCallback(
    (message: string, title?: string) =>
      showNotification({ title, message, type: 'error' }),
    [showNotification]
  );

  const warning = useCallback(
    (message: string, title?: string) =>
      showNotification({ title, message, type: 'warning' }),
    [showNotification]
  );

  const info = useCallback(
    (message: string, title?: string) =>
      showNotification({ title, message, type: 'info' }),
    [showNotification]
  );

  return {
    success,
    error,
    warning,
    info,
  };
}; 