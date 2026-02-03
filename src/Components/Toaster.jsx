/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from 'react';

const Toaster = ({ message, type }) => {
  const [visible, setVisible] = useState(false);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (message) {
      setMounted(true);

      // wait one frame so the initial (hidden) state renders
      requestAnimationFrame(() => {
        setVisible(true);
      });

      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 3000);

      const unmountTimer = setTimeout(() => {
        setMounted(false);
      }, 3500);

      return () => {
        clearTimeout(hideTimer);
        clearTimeout(unmountTimer);
      };
    }
  }, [message]);

  if (!mounted) return null;

  let typeStyles = '';
  switch (type) {
    case 'success':
      typeStyles = 'text-green-800 border-black bg-green-100';
      break;
    case 'error':
      typeStyles = 'text-red-600 border-black bg-red-100';
      break;
    case 'info':
    default:
      typeStyles = 'text-blue-600 border-black bg-blue-50';
      break;
  }

  return (
    <div
      className={`border ${typeStyles} px-8 py-2 rounded fixed top-5 left-1/2 -translate-x-1/2 max-w-xs z-50 transition-all duration-500 ${
        visible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
      }`}
      role="alert"
    >
      {message}
    </div>
  );
};

export default Toaster;
