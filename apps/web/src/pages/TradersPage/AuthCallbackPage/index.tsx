import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PATH } from '@/constants';
import { supabase } from '@/lib/supabase';

const AuthCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        navigate(PATH.TRADERS, { replace: true });
      }
    });
  }, [navigate]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <p>로그인 처리 중...</p>
    </div>
  );
};

export default AuthCallbackPage;
