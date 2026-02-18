module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import', 'jsx-a11y'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'jsx-a11y': {
      components: {
        Button: 'button',
        InputField: 'input',
        InputLabel: 'label',
      },
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',

    // jsx-a11y: recommended 기본값(error)을 warn으로 완화 (점진적 도입)
    'jsx-a11y/click-events-have-key-events': 'warn',
    'jsx-a11y/no-static-element-interactions': 'warn',
    'jsx-a11y/no-noninteractive-element-interactions': 'warn',
    // jsx-a11y: recommended에 미포함, 수동 활성화
    'jsx-a11y/control-has-associated-label': 'warn',

    // Import 정렬 규칙
    'import/order': [
      'error',
      {
        groups: [
          'builtin', // Node.js 빌트인 모듈 (fs, path 등)
          'external', // 외부 라이브러리 (react, axios 등)
          'internal', // 내부 패키지 (@cllaude99/*)
          ['parent', 'sibling'], // 상대 경로 (../, ./)
          'index', // index 파일
        ],
        pathGroups: [
          // CSS imports를 최상단으로
          {
            pattern: '*.css',
            group: 'builtin',
            position: 'before',
          },
          // React 관련을 external 최상단으로
          {
            pattern: 'react**',
            group: 'external',
            position: 'before',
          },
          // 내부 패키지를 별도 그룹으로
          {
            pattern: '@cllaude99/**',
            group: 'internal',
            position: 'before',
          },
          // 앱 내부 절대 경로
          {
            pattern: '@/**',
            group: 'internal',
            position: 'after',
          },
        ],
        pathGroupsExcludedImportTypes: ['react'],
        'newlines-between': 'always', // 그룹 간 빈 줄
        alphabetize: {
          order: 'asc', // 알파벳 순 정렬
          caseInsensitive: true, // 대소문자 무시
        },
      },
    ],
    'import/newline-after-import': 'error', // import 후 빈 줄
    'import/no-duplicates': 'error', // 중복 import 방지
  },
  ignorePatterns: [
    'dist/**/*',
    'build/**/*',
    '.next/**/*',
    'node_modules/**/*',
  ],
};
