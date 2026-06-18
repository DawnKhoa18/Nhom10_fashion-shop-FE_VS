import React, { useEffect, useRef, useState } from 'react';

const GOOGLE_SCRIPT_ID = 'google-identity-services';

const GoogleSignInButton = ({ onSuccess, onError, text = 'signin_with' }) => {
  const buttonRef = useRef(null);
  const [configError, setConfigError] = useState('');

  useEffect(() => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    if (!clientId || clientId.includes('YOUR_GOOGLE_CLIENT_ID')) {
      setConfigError('Chưa cấu hình REACT_APP_GOOGLE_CLIENT_ID');
      return;
    }

    const renderButton = () => {
      if (!window.google || !buttonRef.current) return;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response?.credential) {
            onSuccess(response.credential);
          } else {
            onError?.('Không nhận được token Google');
          }
        },
      });

      buttonRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text,
      });
    };

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID);
    if (existingScript) {
      renderButton();
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_SCRIPT_ID;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = renderButton;
    script.onerror = () => setConfigError('Không tải được Google Login');
    document.body.appendChild(script);
  }, [onSuccess, onError, text]);

  if (configError) {
    return <div className="text-muted small text-center">{configError}</div>;
  }

  return <div className="d-flex justify-content-center" ref={buttonRef} />;
};

export default GoogleSignInButton;
