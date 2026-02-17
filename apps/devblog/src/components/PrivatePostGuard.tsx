'use client';

import { useState, useEffect, useCallback } from 'react';
import { verifyPassword } from '@/app/post/[slug]/actions';
import { PasswordModal } from '@/components/PasswordModal';

interface PrivatePostGuardProps {
  slug: string;
  children: React.ReactNode;
}

const getSessionKey = (slug: string) => `private_post_${slug}`;

export function PrivatePostGuard({ slug, children }: PrivatePostGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const authenticated =
      sessionStorage.getItem(getSessionKey(slug)) === 'true';
    if (authenticated) {
      setIsAuthenticated(true);
    } else {
      setShowModal(true);
    }
  }, [slug]);

  const handleVerify = useCallback(
    async (password: string): Promise<boolean> => {
      const result = await verifyPassword(password);
      if (result.success) {
        sessionStorage.setItem(getSessionKey(slug), 'true');
        setTimeout(() => {
          setShowModal(false);
          setIsAuthenticated(true);
        }, 800);
        return true;
      }
      return false;
    },
    [slug],
  );

  const handleClose = useCallback(() => {
    setShowModal(false);
    window.history.back();
  }, []);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-center text-gray-400 dark:text-gray-600">
          <p className="text-lg">이 글은 비밀번호로 보호되어 있습니다.</p>
        </div>
      </div>
      <PasswordModal
        isOpen={showModal}
        onClose={handleClose}
        onVerify={handleVerify}
      />
    </>
  );
}
