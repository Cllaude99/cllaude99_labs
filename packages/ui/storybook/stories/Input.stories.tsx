import type { Meta, StoryObj } from '@storybook/react';

import Button from '../../src/components/Button';
import Input from '../../src/components/Input';
import InputField from '../../src/components/Input/InputField';

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.45 4.39l3.08 3.08a.75.75 0 1 1-1.06 1.06l-3.08-3.08A7 7 0 0 1 2 9Z"
      fill="currentColor"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.5 5.5a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1v-9Zm1.217 0L10 10.012 16.283 5.5H3.717ZM16.5 6.488 10 11.988 3.5 6.488V14.5h13V6.488Z"
      fill="currentColor"
    />
  </svg>
);

const EyeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10 4.5c-3.432 0-6.125 2.5-7.5 5.5 1.375 3 4.068 5.5 7.5 5.5s6.125-2.5 7.5-5.5c-1.375-3-4.068-5.5-7.5-5.5Zm0 9a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm0-5.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"
      fill="currentColor"
    />
  </svg>
);

const meta = {
  title: 'Components/Input',
  component: InputField,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: '입력 필드 크기',
      table: {
        type: { summary: 'small | medium | large' },
        defaultValue: { summary: 'medium' },
      },
    },
    status: {
      control: 'select',
      options: ['default', 'error', 'success'],
      description: '입력 필드 상태',
      table: {
        type: { summary: 'default | error | success' },
        defaultValue: { summary: 'default' },
      },
    },
    disabled: {
      control: 'boolean',
      description: '비활성화 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    readOnly: {
      control: 'boolean',
      description: '읽기 전용 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    placeholder: {
      control: 'text',
      description: '플레이스홀더 텍스트',
    },
  },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 'medium',
    status: 'default',
    placeholder: '텍스트를 입력해주세요',
  },
};

export const Small: Story = {
  args: {
    size: 'small',
    placeholder: 'Small Input',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
    placeholder: 'Medium Input',
  },
};

export const Large: Story = {
  args: {
    size: 'large',
    placeholder: 'Large Input',
  },
};

export const Error: Story = {
  args: {
    size: 'medium',
    status: 'error',
    placeholder: '에러 상태',
  },
};

export const Success: Story = {
  args: {
    size: 'medium',
    status: 'success',
    placeholder: '성공 상태',
  },
};

export const Disabled: Story = {
  args: {
    size: 'medium',
    disabled: true,
    placeholder: '비활성화 상태',
  },
};

export const ReadOnly: Story = {
  args: {
    size: 'medium',
    readOnly: true,
    value: '읽기 전용 텍스트',
  },
};

export const WithStartIcon: Story = {
  args: {
    size: 'medium',
    placeholder: '검색어를 입력해주세요',
    startIcon: <SearchIcon />,
  },
};

export const WithEndIcon: Story = {
  args: {
    size: 'medium',
    placeholder: '비밀번호',
    type: 'password',
    endIcon: <EyeIcon />,
  },
};

export const WithEndButton: Story = {
  args: {
    size: 'medium',
    placeholder: '010-0000-0000',
    endButton: (
      <Button variant="outline" size="small">
        인증
      </Button>
    ),
  },
};

export const GroupDefault = {
  render: () => (
    <Input.Group size="medium">
      <Input.Label>이름</Input.Label>
      <Input.Field placeholder="이름을 입력해주세요" />
      <Input.Description>실명을 입력해주세요.</Input.Description>
    </Input.Group>
  ),
};

export const GroupError = {
  render: () => (
    <Input.Group size="medium">
      <Input.Label>이메일</Input.Label>
      <Input.Field
        placeholder="example@email.com"
        startIcon={<MailIcon />}
        status="error"
      />
      <Input.Description status="error">
        올바른 이메일 형식으로 입력해주세요.
      </Input.Description>
    </Input.Group>
  ),
};

export const GroupSuccess = {
  render: () => (
    <Input.Group size="medium">
      <Input.Label>이메일</Input.Label>
      <Input.Field
        placeholder="example@email.com"
        startIcon={<MailIcon />}
        value="user@email.com"
        status="success"
      />
      <Input.Description status="success">
        사용 가능한 이메일입니다.
      </Input.Description>
    </Input.Group>
  ),
};

export const GroupDisabled = {
  render: () => (
    <Input.Group size="medium">
      <Input.Label disabled>이메일</Input.Label>
      <Input.Field placeholder="비활성화된 입력" disabled />
      <Input.Description disabled>
        이 필드는 수정할 수 없습니다.
      </Input.Description>
    </Input.Group>
  ),
};

export const GroupRequired = {
  render: () => (
    <Input.Group size="medium">
      <Input.Label required>이메일</Input.Label>
      <Input.Field placeholder="example@email.com" />
      <Input.Description>필수 입력 항목입니다.</Input.Description>
    </Input.Group>
  ),
};

export const GroupWithButton = {
  render: () => (
    <Input.Group size="medium">
      <Input.Label>전화번호</Input.Label>
      <Input.Field
        placeholder="010-0000-0000"
        endButton={
          <Button variant="outline" size="small">
            인증
          </Button>
        }
      />
    </Input.Group>
  ),
};

export const AllSizes = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '360px' }}>
      <Input.Group size="small">
        <Input.Label>Small</Input.Label>
        <Input.Field placeholder="Small Input" startIcon={<SearchIcon />} />
      </Input.Group>
      <Input.Group size="medium">
        <Input.Label>Medium</Input.Label>
        <Input.Field placeholder="Medium Input" startIcon={<SearchIcon />} />
      </Input.Group>
      <Input.Group size="large">
        <Input.Label>Large</Input.Label>
        <Input.Field placeholder="Large Input" startIcon={<SearchIcon />} />
      </Input.Group>
    </div>
  ),
};

export const AllStates = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '360px' }}>
      <Input.Group size="medium">
        <Input.Label>Default</Input.Label>
        <Input.Field placeholder="기본 상태" />
        <Input.Description>기본 설명 텍스트</Input.Description>
      </Input.Group>
      <Input.Group size="medium">
        <Input.Label required>Error</Input.Label>
        <Input.Field placeholder="에러 상태" status="error" />
        <Input.Description status="error">
          에러 메시지입니다.
        </Input.Description>
      </Input.Group>
      <Input.Group size="medium">
        <Input.Label>Success</Input.Label>
        <Input.Field
          placeholder="성공 상태"
          value="올바른 입력"
          status="success"
        />
        <Input.Description status="success">
          사용 가능합니다.
        </Input.Description>
      </Input.Group>
      <Input.Group size="medium">
        <Input.Label disabled>Disabled</Input.Label>
        <Input.Field placeholder="비활성화" disabled />
        <Input.Description disabled>비활성화된 필드</Input.Description>
      </Input.Group>
      <Input.Group size="medium">
        <Input.Label>ReadOnly</Input.Label>
        <Input.Field value="읽기 전용 값" readOnly />
        <Input.Description>수정할 수 없습니다.</Input.Description>
      </Input.Group>
    </div>
  ),
};

export const FormExample = {
  render: () => (
    <form
      onSubmit={(e) => e.preventDefault()}
      style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '360px' }}
    >
      <Input.Group size="medium">
        <Input.Label required>이름</Input.Label>
        <Input.Field placeholder="홍길동" />
      </Input.Group>
      <Input.Group size="medium">
        <Input.Label required>이메일</Input.Label>
        <Input.Field
          placeholder="example@email.com"
          startIcon={<MailIcon />}
          status="error"
        />
        <Input.Description status="error">
          올바른 이메일을 입력해주세요.
        </Input.Description>
      </Input.Group>
      <Input.Group size="medium">
        <Input.Label required>비밀번호</Input.Label>
        <Input.Field
          type="password"
          placeholder="8자 이상 입력해주세요"
          endIcon={<EyeIcon />}
        />
      </Input.Group>
      <Input.Group size="medium">
        <Input.Label>전화번호</Input.Label>
        <Input.Field
          placeholder="010-0000-0000"
          endButton={
            <Button variant="outline" size="small">
              인증요청
            </Button>
          }
        />
      </Input.Group>
      <Button type="submit" variant="primary" size="medium" style={{ marginTop: '8px' }}>
        가입하기
      </Button>
    </form>
  ),
};
