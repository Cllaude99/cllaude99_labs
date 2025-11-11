import type { Meta, StoryObj } from '@storybook/react';

import Button from '../src/components/Button';

/**
 * Button 컴포넌트는 사용자 상호작용을 위한 기본 버튼입니다.
 *
 * ## 사용 예시
 * ```tsx
 * import { Button } from '@cllaude99/ui';
 *
 * <Button variant="primary" size="medium">
 *   클릭하세요
 * </Button>
 * ```
 */
const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'danger'],
      description: '버튼의 스타일 변형',
      table: {
        type: { summary: 'primary | secondary | outline | danger' },
        defaultValue: { summary: 'primary' },
      },
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '버튼의 크기',
      table: {
        type: { summary: 'small | medium | large' },
        defaultValue: { summary: 'medium' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '버튼 비활성화 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    children: {
      control: 'text',
      description: '버튼 내부 텍스트',
    },
    onClick: {
      action: 'clicked',
      description: '버튼 클릭 이벤트',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary 버튼은 주요 액션에 사용됩니다.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Primary Button',
  },
};

/**
 * Secondary 버튼은 보조 액션에 사용됩니다.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
    children: 'Secondary Button',
  },
};

/**
 * Outline 버튼은 덜 중요한 액션에 사용됩니다.
 */
export const Outline: Story = {
  args: {
    variant: 'outline',
    size: 'medium',
    children: 'Outline Button',
  },
};

/**
 * Danger 버튼은 삭제, 취소 등 위험한 액션에 사용됩니다.
 */
export const Danger: Story = {
  args: {
    variant: 'danger',
    size: 'medium',
    children: 'Danger Button',
  },
};

/**
 * Small 크기 버튼
 */
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
    children: 'Small Button',
  },
};

/**
 * Medium 크기 버튼 (기본)
 */
export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Medium Button',
  },
};

/**
 * Large 크기 버튼
 */
export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    children: 'Large Button',
  },
};

/**
 * 비활성화된 버튼
 */
export const Disabled: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Disabled Button',
    disabled: true,
  },
};

/**
 * 아이콘과 함께 사용하는 버튼
 */
export const WithIcon: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    children: 'Button with Icon',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 5V15M5 10H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

/**
 * 아이콘만 있는 버튼
 */
export const IconOnly: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 5V15M5 10H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
};

/**
 * 모든 변형을 한 번에 보여주는 스토리
 */
export const AllVariants = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '12px',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button variant="primary" size="medium">
          Primary
        </Button>
        <Button variant="secondary" size="medium">
          Secondary
        </Button>
        <Button variant="outline" size="medium">
          Outline
        </Button>
        <Button variant="danger" size="medium">
          Danger
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button variant="primary" size="small">
          Small
        </Button>
        <Button variant="primary" size="medium">
          Medium
        </Button>
        <Button variant="primary" size="large">
          Large
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <Button variant="primary" size="medium" disabled>
          Disabled
        </Button>
        <Button
          variant="primary"
          size="medium"
          icon={
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 5V15M5 10H15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          }
        >
          With Icon
        </Button>
      </div>
    </div>
  ),
};
