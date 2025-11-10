import toast from 'react-hot-toast';

import { Button } from '@cllaude99/ui';

const DefaultComponent = () => {
  return (
    <div>
      <h1>DefaultComponent</h1>
      <Button
        variant="primary"
        size="medium"
        onClick={() => {
          toast.error('Error');
        }}
      >
        Click me
      </Button>
    </div>
  );
};

export default DefaultComponent;
