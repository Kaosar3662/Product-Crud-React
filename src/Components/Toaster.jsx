import React, { useEffect, useState } from 'react';

const Toaster = ({ message, type }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!visible) return null;

  let typeStyles = '';
  switch (type) {
    case 'success':
      typeStyles = 'text-blue-600 border-black bg-blue-100';
      break;
    case 'error':
      typeStyles = 'text-blue-600 border-black bg-red-100';
      break;
    case 'info':
    default:
      typeStyles = 'text-blue-600 border-black bg-blue-50';
      break;
  }

  return (
    <div
      className={`border ${typeStyles} p-4 rounded fixed top-5 right-5 max-w-xs shadow-md z-50`}
      role="alert"
    >
      {message}
    </div>
  );
};

export default Toaster;
