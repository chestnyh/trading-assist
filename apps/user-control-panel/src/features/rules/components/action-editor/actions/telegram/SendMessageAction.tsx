import { bindArgument } from '../../fields/bindArgument';
import { TextField } from '../../fields/TextField';
import { ActionCategory } from '../categories';
import { ActionComponentProps, ActionDefinition } from '../../types';

function SendMessageAction(props: ActionComponentProps) {
  return (
    <>
      <TextField label="Bot ID" type="text" {...bindArgument(props, 'botId')} />
      <TextField label="Message" type="text" {...bindArgument(props, 'message')} />
    </>
  );
}

export const sendMessageAction: ActionDefinition = {
  label: 'Telegram Send Message',
  category: ActionCategory.Telegram,
  defaultArguments: { botId: '', message: '' },
  Component: SendMessageAction,
};
