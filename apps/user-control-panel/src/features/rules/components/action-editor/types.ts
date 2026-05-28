export type ActionType = '' | 'interval' | 'timeout' | 'debug';

export type ActionNode = {
  id: string;
  type: ActionType;
  arguments: {
    interval?: number;
    timeout?: number;
    message?: string;
    do?: ActionNode | ActionNode[];
  };
};

export type ActionTypeConfig = {
  value: Exclude<ActionType, ''>;
  label: string;
  canHaveChildren: boolean;
};
