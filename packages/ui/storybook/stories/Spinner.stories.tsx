import type { Meta, StoryObj } from '@storybook/react';

import Spinner from '../../src/components/Spinner';

const meta = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '스피너의 크기',
      table: {
        type: { summary: 'small | medium | large' },
        defaultValue: { summary: 'medium' },
      },
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'inherit'],
      description: '스피너의 색상 변형',
      table: {
        type: { summary: 'primary | secondary | inherit' },
        defaultValue: { summary: 'primary' },
      },
    },
    thickness: {
      control: { type: 'number', min: 1, max: 10 },
      description: '스피너 선의 두께 (px)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '4' },
      },
    },
    speed: {
      control: { type: 'number', min: 0.1, max: 3, step: 0.1 },
      description: '회전 속도 배율 (높을수록 빠름)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '1' },
      },
    },
    label: {
      control: 'text',
      description: '접근성을 위한 aria-label 텍스트',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: '로딩중' },
      },
    },
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Primary 스피너는 주요 로딩 상태에 사용됩니다.
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
  },
};

/**
 * Secondary 스피너는 보조 로딩 상태에 사용됩니다.
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    size: 'medium',
  },
};

/**
 * Inherit 스피너는 부모 요소의 색상을 상속받습니다.
 */
export const Inherit: Story = {
  args: {
    variant: 'inherit',
    size: 'medium',
  },
  render: (args) => (
    <div style={{ color: '#e91e63' }}>
      <Spinner {...args} />
      <span style={{ marginLeft: 8, fontSize: 14 }}>부모 색상(#e91e63) 상속</span>
    </div>
  ),
};

/**
 * Small 크기 스피너 (16px)
 */
export const Small: Story = {
  args: {
    variant: 'primary',
    size: 'small',
  },
};

/**
 * Medium 크기 스피너 (24px, 기본)
 */
export const Medium: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
  },
};

/**
 * Large 크기 스피너 (40px)
 */
export const Large: Story = {
  args: {
    variant: 'primary',
    size: 'large',
  },
};

/**
 * 두꺼운 선의 스피너
 */
export const CustomThickness: Story = {
  args: {
    variant: 'primary',
    size: 'large',
    thickness: 8,
  },
};

/**
 * 느린 속도 스피너 (0.3x)
 */
export const SlowSpeed: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    speed: 0.3,
  },
};

/**
 * 빠른 속도 스피너 (2.5x)
 */
export const FastSpeed: Story = {
  args: {
    variant: 'primary',
    size: 'medium',
    speed: 2.5,
  },
};

/**
 * 모든 변형을 한 번에 보여주는 매트릭스 (variant × size)
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['primary', 'secondary', 'inherit'] as const).map((variant) => (
        <div key={variant}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 8,
              textTransform: 'capitalize',
            }}
          >
            {variant}
          </div>
          <div
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'center',
              color: variant === 'inherit' ? '#e91e63' : undefined,
            }}
          >
            <Spinner variant={variant} size="small" />
            <Spinner variant={variant} size="medium" />
            <Spinner variant={variant} size="large" />
          </div>
        </div>
      ))}
    </div>
  ),
};
