import type { Meta, StoryObj } from '@storybook/react';

import ResizableRoot from '../../src/components/Resizable';
import ResizableHandle from '../../src/components/Resizable/ResizableHandle';
import ResizablePanel from '../../src/components/Resizable/ResizablePanel';

const meta = {
  title: 'Components/Resizable',
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const PanelContent = ({
  title,
  color = '#f0f0f0',
}: {
  title: string;
  color?: string;
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      minHeight: 100,
      backgroundColor: color,
      padding: 16,
      fontFamily: 'sans-serif',
      fontSize: 14,
      fontWeight: 600,
      color: '#333',
    }}
  >
    {title}
  </div>
);

export const Horizontal: Story = {
  render: () => (
    <div style={{ height: 400, padding: 20 }}>
      <ResizableRoot orientation="horizontal">
        <ResizablePanel defaultSize={50} minSize={20}>
          <PanelContent title="Left Panel" color="#E8F3FF" />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50} minSize={20}>
          <PanelContent title="Right Panel" color="#E8FAF0" />
        </ResizablePanel>
      </ResizableRoot>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div style={{ height: 500, padding: 20 }}>
      <ResizableRoot orientation="vertical">
        <ResizablePanel defaultSize={60} minSize={20}>
          <PanelContent title="Top Panel" color="#E8F3FF" />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={40} minSize={20}>
          <PanelContent title="Bottom Panel" color="#E8FAF0" />
        </ResizablePanel>
      </ResizableRoot>
    </div>
  ),
};

export const WithHandle: Story = {
  render: () => (
    <div style={{ height: 400, padding: 20 }}>
      <ResizableRoot orientation="horizontal">
        <ResizablePanel defaultSize={50} minSize={20}>
          <PanelContent title="Left Panel" color="#E8F3FF" />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50} minSize={20}>
          <PanelContent title="Right Panel" color="#E8FAF0" />
        </ResizablePanel>
      </ResizableRoot>
    </div>
  ),
};

export const ThreePanels: Story = {
  render: () => (
    <div style={{ height: 400, padding: 20 }}>
      <ResizableRoot orientation="horizontal">
        <ResizablePanel defaultSize={30} minSize={15}>
          <PanelContent title="Sidebar" color="#F3E5F5" />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={20}>
          <PanelContent title="Content" color="#E8F3FF" />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={30} minSize={15}>
          <PanelContent title="Inspector" color="#E8FAF0" />
        </ResizablePanel>
      </ResizableRoot>
    </div>
  ),
};

export const Collapsible: Story = {
  render: () => (
    <div style={{ height: 400, padding: 20 }}>
      <ResizableRoot orientation="horizontal">
        <ResizablePanel
          defaultSize={25}
          minSize={15}
          collapsible
          collapsedSize={0}
        >
          <PanelContent title="Collapsible Sidebar" color="#F3E5F5" />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={75} minSize={30}>
          <PanelContent title="Main Content" color="#E8F3FF" />
        </ResizablePanel>
      </ResizableRoot>
    </div>
  ),
};

export const Nested: Story = {
  render: () => (
    <div style={{ height: 500, padding: 20 }}>
      <ResizableRoot orientation="horizontal">
        <ResizablePanel defaultSize={30} minSize={20}>
          <PanelContent title="Sidebar" color="#F3E5F5" />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={70} minSize={30}>
          <ResizableRoot orientation="vertical">
            <ResizablePanel defaultSize={60} minSize={20}>
              <PanelContent title="Editor" color="#E8F3FF" />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={40} minSize={20}>
              <PanelContent title="Terminal" color="#E8FAF0" />
            </ResizablePanel>
          </ResizableRoot>
        </ResizablePanel>
      </ResizableRoot>
    </div>
  ),
};

export const VerticalWithHandle: Story = {
  render: () => (
    <div style={{ height: 500, padding: 20 }}>
      <ResizableRoot orientation="vertical">
        <ResizablePanel defaultSize={60} minSize={20}>
          <PanelContent title="Chart Area" color="#E8F3FF" />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={20}>
          <PanelContent title="Trading Controls" color="#E8FAF0" />
        </ResizablePanel>
      </ResizableRoot>
    </div>
  ),
};
