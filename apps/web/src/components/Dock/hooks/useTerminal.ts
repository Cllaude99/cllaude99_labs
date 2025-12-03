import { useState } from 'react';

import { TERMINAL_COMMANDS } from '../constants';

interface TerminalHistoryEntry {
  command: string;
  output: string;
  timestamp: number;
}

const useTerminal = () => {
  const [history, setHistory] = useState<TerminalHistoryEntry[]>([
    {
      command: 'welcome',
      output: TERMINAL_COMMANDS.welcome.handler([]),
      timestamp: Date.now(),
    },
  ]);

  const executeCommand = (input: string) => {
    const [command, ...args] = input.split(' ');

    if (command.toLowerCase() === 'clear') {
      setHistory([]);
      return;
    }

    const cmd = TERMINAL_COMMANDS[command.toLowerCase()];

    const output = cmd
      ? cmd.handler(args)
      : `명령어를 찾을 수 없습니다: ${command}\n'help'를 입력하여 사용 가능한 명령어를 확인하세요.`;

    setHistory((prev) => [
      ...prev,
      {
        command: input,
        output,
        timestamp: Date.now(),
      },
    ]);
  };

  return { history, executeCommand };
};

export default useTerminal;
