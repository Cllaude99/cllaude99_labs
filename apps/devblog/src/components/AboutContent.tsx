'use client';

import { useState } from 'react';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import { HiMail } from 'react-icons/hi';
import { FiCopy, FiCheck, FiGlobe } from 'react-icons/fi';

export function AboutContent() {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText('npx cllaude99');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <main className="flex-1 mx-auto px-6 py-16 max-w-[52rem] w-full">
      {/* 헤더 섹션 */}
      <section className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">
          김태윤
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          변화에 유연한 코드와 사용자 관찰로 완성도를 높이는 개발자 김태윤
          입니다.
        </p>
      </section>

      {/* 소개 섹션 */}
      <section className="mb-8 space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
        <p>
          저는 문제를 명확히 정의하고 끝까지 해결하려는 사람입니다. 어떤 일이든
          &apos;어떻게(How)&apos;보다 &apos;왜(Why)&apos;를 먼저 묻습니다.
          <br />
          문제의 본질을 이해해야 올바른 방향으로 나아갈 수 있다고 믿기
          때문입니다. 꾸준함의 가치를 중요하게 생각합니다. <br /> 당장의
          결과보다 과정을 중시하며, 완벽하지 않아도 멈추지 않고 부족함을
          채워가며 배우고자 합니다. 새로운 것에 대한 호기심이 많고, Comfortable
          Zone에 머무르기보다는 성장할 수 있는 환경을 선택하려 노력합니다. 함께
          성장하는 환경을 좋아하고, 동료와 생각을 나누며 배우는 과정을 소중히
          여깁니다. 구조와 재사용성을 고려해 지속 가능한 코드를 설계하려
          노력합니다. 문제를 정확히 이해하고, 상황에 가장 알맞은 기술로 풀어내는
          것을 중요하게 생각합니다. 예상대로 동작하는 코드에 안주하지 않고,
          사용자 관점에서 더 나은 경험을 만들기 위해 끊임없이 개선합니다. 맡은
          일에 책임감을 가지고 주도적으로 움직이며, 동료와의 소통을 통해 더 나은
          결과를 만들어갑니다. 개발 외에는 식물 키우기와 심리학에 관심이
          많습니다. 작은 변화를 관찰하고 돌보는 과정에서 성장을 발견하는 일이
          즐겁고, 사람의 마음과 행동을 이해하는 것이 더 나은 제품을 만드는 데도
          도움이 된다고 생각합니다. 결국 제가 추구하는 것은 의미 있는 변화를
          만들어내는 사람이 되는 것입니다. 함께 일하는 사람들에게 신뢰를 주고,
          긍정적인 영향을 남기는 개발자가 되고 싶습니다.
        </p>
      </section>

      {/* NPX 명령어 섹션 */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Execute the cllaude99 CLI as follows
        </h2>
        <div
          className="group relative flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer transition-colors hover:border-gray-300 dark:hover:border-gray-600"
          onClick={handleCopy}
        >
          <code className="text-sm font-mono text-gray-800 dark:text-gray-200">
            npx cllaude99
          </code>
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            aria-label="Copy command"
          >
            {isCopied ? (
              <FiCheck className="w-5 h-5" />
            ) : (
              <FiCopy className="w-5 h-5" />
            )}
          </button>
        </div>
      </section>

      {/* Contacts 섹션 */}
      <section className="pt-4 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Contacts
        </h2>
        <div className="flex items-center gap-4">
          <a
            href="https://www.cllaude99-labs.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label="Personal Website"
          >
            <FiGlobe className="w-6 h-6" />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              개인 개발공간
            </span>
          </a>

          <a
            href="https://github.com/Cllaude99"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label="GitHub"
          >
            <SiGithub className="w-6 h-6" />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              GitHub
            </span>
          </a>

          <a
            href="https://www.linkedin.com/in/%ED%83%9C%EC%9C%A4-%EA%B9%80-a94635301/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label="LinkedIn"
          >
            <SiLinkedin className="w-6 h-6" />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              LinkedIn
            </span>
          </a>

          <a
            href="mailto:cllaude1025@gmail.com"
            className="relative group text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            aria-label="Email"
          >
            <HiMail className="w-6 h-6" />
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              이메일
            </span>
          </a>
        </div>
      </section>
    </main>
  );
}
