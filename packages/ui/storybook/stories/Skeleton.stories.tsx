import type { Meta, StoryObj } from '@storybook/react';

import Skeleton from '../../src/components/Skeleton';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['rectangular', 'rounded', 'circular'],
      description: '스켈레톤의 형태 변형',
      table: {
        type: { summary: 'rectangular | rounded | circular' },
        defaultValue: { summary: 'rectangular' },
      },
    },
    width: {
      control: 'text',
      description: '너비 (숫자는 px 단위, 문자열은 그대로 적용)',
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: '100%' },
      },
    },
    height: {
      control: 'text',
      description: '높이 (숫자는 px 단위, 문자열은 그대로 적용)',
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: '16px' },
      },
    },
    borderRadius: {
      control: 'text',
      description:
        'border-radius 직접 지정 (variant의 기본값을 덮어씁니다)',
      table: {
        type: { summary: 'string | number' },
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Rectangular 스켈레톤 — 텍스트나 이미지 영역의 기본 플레이스홀더
 */
export const Rectangular: Story = {
  args: {
    variant: 'rectangular',
    width: 200,
    height: 16,
  },
};

/**
 * Rounded 스켈레톤 — 카드나 버튼 등 둥근 모서리가 필요한 영역
 */
export const Rounded: Story = {
  args: {
    variant: 'rounded',
    width: 200,
    height: 40,
  },
};

/**
 * Circular 스켈레톤 — 아바타, 프로필 이미지 플레이스홀더
 */
export const Circular: Story = {
  args: {
    variant: 'circular',
    width: 48,
    height: 48,
  },
};

/**
 * 커스텀 크기 스켈레톤
 */
export const CustomSize: Story = {
  args: {
    variant: 'rectangular',
    width: 300,
    height: 120,
  },
};

/**
 * borderRadius를 직접 지정하여 variant 기본값을 덮어쓰는 예시
 */
export const CustomBorderRadius: Story = {
  args: {
    variant: 'rectangular',
    width: 200,
    height: 40,
    borderRadius: 20,
  },
};

/**
 * 카드 형태의 로딩 플레이스홀더 조합 (실사용 예시)
 */
export const CardPlaceholder: Story = {
  render: () => (
    <div
      style={{
        width: 320,
        padding: 16,
        border: '1px solid #e0e0e0',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Skeleton variant="circular" width={40} height={40} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1 }}>
          <Skeleton variant="rectangular" width={120} height={14} />
          <Skeleton variant="rectangular" width={80} height={12} />
        </div>
      </div>
      <Skeleton variant="rounded" width="100%" height={160} />
      <Skeleton variant="rectangular" width="100%" height={14} />
      <Skeleton variant="rectangular" width="60%" height={14} />
    </div>
  ),
};

/**
 * 모든 variant를 한 번에 보여주는 스토리
 */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['rectangular', 'rounded', 'circular'] as const).map((variant) => (
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
          <Skeleton
            variant={variant}
            width={variant === 'circular' ? 48 : 200}
            height={variant === 'circular' ? 48 : 40}
          />
        </div>
      ))}
    </div>
  ),
};
