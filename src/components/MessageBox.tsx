import React from 'react';

const MessageBox = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const backgroundColors = {
    error: '#f8d7da',
    success: '#d4edda',
    info: '#d1ecf1',
    warning: '#fff3cd',
  };

  const textColors = {
    error: '#721c24',
    success: '#155724',
    info: '#0c5460',
    warning: '#856404',
  };

  return (
    <div
      style={{
        backgroundColor: backgroundColors[type],
        color: textColors[type],
        padding: '10px 15px',
        borderRadius: '4px',
        margin: '10px 0',
        position: 'relative',
      }}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            right: 10,
            top: 10,
            border: 'none',
            background: 'transparent',
            fontWeight: 'bold',
            cursor: 'pointer',
            color: textColors[type],
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default MessageBox;
