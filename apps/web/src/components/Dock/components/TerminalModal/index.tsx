import { useEffect, useRef, useState } from 'react';

import useDialog from '@cllaude99/ui/hooks/useDialog';

import * as S from './TerminalModal.styles';
import { useTerminal } from '../../hooks';
import { DockPosition } from '../../types';

interface TerminalContentProps {
  onMinimize: () => void;
  dockPosition: DockPosition;
}

const TerminalContent = ({
  onMinimize,
  dockPosition,
}: TerminalContentProps) => {
  const { closeDialog } = useDialog();
  const [input, setInput] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimizing, setIsMinimizing] = useState(false);
  const { history, executeCommand } = useTerminal();
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  /* 마운트 시 input에 포커스 */
  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(timer);
  }, []);

  /* 새 명령어 실행 시 스크롤을 맨 아래로 */
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [history]);

  return (
    <S.Container isMinimizing={isMinimizing} dockPosition={dockPosition}>
      <S.Terminal isFullscreen={isFullscreen}>
        <S.Header>
          <S.TrafficLights>
            <S.TrafficLight
              color="red"
              title="닫기"
              onClick={() => closeDialog()}
            />
            <S.TrafficLight
              color="yellow"
              title="최소화"
              onClick={() => {
                setIsMinimizing(true);
                setTimeout(() => {
                  onMinimize();
                  closeDialog();
                }, 300);
              }}
            />
            <S.TrafficLight
              color="green"
              title={isFullscreen ? '원래 크기' : '전체화면'}
              onClick={() => setIsFullscreen((prev) => !prev)}
            />
          </S.TrafficLights>
          <S.Title>Cllaude99_Labs Terminal</S.Title>
          <S.HeaderSpacer />
        </S.Header>

        <S.TerminalHistory ref={outputRef}>
          {history.map((entry, index) => (
            <S.Entry key={index}>
              <S.Command>$ {entry.command}</S.Command>
              <S.CommandOutput>{entry.output}</S.CommandOutput>
            </S.Entry>
          ))}
        </S.TerminalHistory>

        <S.UserPromptForm
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) {
              executeCommand(input.trim());
              setInput('');
            }
          }}
        >
          <S.PromptLogo>$</S.PromptLogo>
          <S.UserPromptInput
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="명령어를 입력하세요 (help)"
          />
        </S.UserPromptForm>
      </S.Terminal>
    </S.Container>
  );
};

export default TerminalContent;
