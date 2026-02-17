'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Lock, Delete, X, Check } from 'lucide-react';

const PIN_LENGTH = 4;
const DUMMY_PRESS_COUNT = 2;
const DUMMY_PRESS_DURATION_MS = 150;
const NUMBER_KEYS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

type VerifyStatus = 'idle' | 'verifying' | 'success' | 'error';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (password: string) => Promise<boolean>;
}

function getRandomDummyKeys(pressedKey: string, count: number): string[] {
  const candidates = NUMBER_KEYS.filter((k) => k !== pressedKey);
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function PasswordModal({
  isOpen,
  onClose,
  onVerify,
}: PasswordModalProps) {
  const [pin, setPin] = useState<string[]>([]);
  const [status, setStatus] = useState<VerifyStatus>('idle');
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const dummyTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const clearPressedKeys = useCallback(() => {
    if (dummyTimerRef.current) clearTimeout(dummyTimerRef.current);
    dummyTimerRef.current = setTimeout(() => {
      setPressedKeys(new Set());
    }, DUMMY_PRESS_DURATION_MS);
  }, []);

  const triggerDummyPress = useCallback(
    (realKey: string) => {
      const dummyKeys = getRandomDummyKeys(realKey, DUMMY_PRESS_COUNT);
      setPressedKeys(new Set([realKey, ...dummyKeys]));
      clearPressedKeys();
    },
    [clearPressedKeys],
  );

  const resetPin = useCallback(() => {
    setPin([]);
    setStatus('idle');
    setPressedKeys(new Set());
  }, []);

  const handleNumberInput = useCallback(
    (num: string) => {
      if (status !== 'idle' || pin.length >= PIN_LENGTH) return;

      triggerDummyPress(num);

      const newPin = [...pin, num];
      setPin(newPin);

      if (newPin.length === PIN_LENGTH) {
        setStatus('verifying');
        const password = newPin.join('');

        onVerify(password).then((success) => {
          if (success) {
            setStatus('success');
          } else {
            setStatus('error');
            setTimeout(resetPin, 700);
          }
        });
      }
    },
    [pin, status, onVerify, resetPin, triggerDummyPress],
  );

  const handleDelete = useCallback(() => {
    if (status !== 'idle' || pin.length === 0) return;
    setPin((prev) => prev.slice(0, -1));
  }, [status, pin.length]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Backspace') {
        handleDelete();
        return;
      }
      if (/^[0-9]$/.test(e.key)) {
        handleNumberInput(e.key);
      }
    },
    [onClose, handleDelete, handleNumberInput],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      resetPin();
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown, resetPin]);

  useEffect(() => {
    return () => {
      if (dummyTimerRef.current) clearTimeout(dummyTimerRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const dotColor = (index: number) => {
    const isFilled = index < pin.length;

    if (status === 'success') return 'bg-green-500 scale-110';
    if (status === 'error') return 'bg-red-500';
    if (isFilled) return 'bg-primary-500 scale-110';
    return 'bg-gray-200 dark:bg-gray-700';
  };

  const KEYPAD = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'delete'],
  ];

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 w-full max-w-sm mx-4 p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* 아이콘 + 안내 텍스트 */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            비밀번호를 입력해주세요
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            4자리 숫자를 입력하세요
          </p>
        </div>

        {/* Dot Indicators */}
        <div
          className={`flex justify-center gap-4 mb-10 ${status === 'error' ? 'animate-shake' : ''}`}
        >
          {Array.from({ length: PIN_LENGTH }).map((_, index) => (
            <div key={index} className="relative w-4 h-4">
              <div
                className={`w-4 h-4 rounded-full transition-all duration-150 ease-out ${dotColor(index)}`}
              />
              {status === 'success' && index < pin.length && (
                <Check className="absolute inset-0 w-4 h-4 text-white" />
              )}
            </div>
          ))}
        </div>

        {/* 숫자 키패드 */}
        <div className="grid grid-cols-3 gap-3">
          {KEYPAD.flat().map((key, index) => {
            if (key === '') {
              return <div key={index} />;
            }

            if (key === 'delete') {
              return (
                <button
                  key={index}
                  onClick={handleDelete}
                  className="flex items-center justify-center h-14 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 active:scale-95 transition-all"
                >
                  <Delete className="w-6 h-6" />
                </button>
              );
            }

            const isPressed = pressedKeys.has(key);

            return (
              <button
                key={index}
                onClick={() => handleNumberInput(key)}
                className={`flex items-center justify-center h-14 rounded-xl text-xl font-medium transition-all duration-100 ${
                  isPressed
                    ? 'bg-gray-300 dark:bg-gray-600 scale-95 text-gray-900 dark:text-gray-100'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95'
                }`}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
