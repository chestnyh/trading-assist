import { ChildActionSlot } from '../../ChildActionSlot';
import { bindArgument } from '../../fields/bindArgument';
import { TextField } from '../../fields/TextField';
import { ActionCategory } from '../categories';
import { ActionChildSlot, ActionComponentProps, ActionDefinition } from '../../types';

const DO: ActionChildSlot = { key: 'do', label: 'Action', multiple: false };

function CronAction(props: ActionComponentProps) {
  return (
    <>
      <TextField label="Schedule" type="text" {...bindArgument(props, 'schedule')} />
      <ChildActionSlot {...props} slot={DO} />
    </>
  );
}

export const cronAction: ActionDefinition = {
  label: 'Cron',
  category: ActionCategory.Common,
  defaultArguments: { schedule: '* * * * *' },
  childSlots: [DO],
  Component: CronAction,
};
