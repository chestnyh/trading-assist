import { useState } from 'react';
import {
  ActionEditor,
  ActionNode,
  actionTreeToRuleBody,
  createActionNode,
} from '../rules/components/action-editor';

export function Test() {
  const [rootAction, setRootAction] = useState<ActionNode>(createActionNode());
  const generatedRule = actionTreeToRuleBody(rootAction);

  const targetJsonRule = {
    name: 'Test simple config',
    description: 'TODO add description',
    type: 'interval',
    arguments: {
      do: {
        type: 'debug',
        arguments: {
          message: 'Some message',
        },
      },
      interval: 1000,
    },
  };

  return (
    <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>
        Rule Builder Test (Task 86c9wc65k)
      </h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Build hierarchical action structures. Interval/Timeout can have nested actions, Debug cannot.
      </p>

      <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '15px', color: '#333' }}>
          Target Rule (Required Format)
        </h2>
        <pre style={{ fontSize: '13px', background: '#f8f9fa', padding: '15px', borderRadius: '8px', overflow: 'auto', border: '1px solid #e9ecef' }}>
          {JSON.stringify(targetJsonRule, null, 2)}
        </pre>
      </div>

      <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '15px', color: '#333' }}>
          UI Builder
        </h2>
        <ActionEditor
          action={rootAction}
          onChange={setRootAction}
          onDelete={() => setRootAction(createActionNode())}
        />
      </div>

      <div style={{ padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '15px', color: '#333' }}>
          Generated Rule (JSON)
        </h2>
        <pre style={{ fontSize: '13px', background: generatedRule ? '#e3f2fd' : '#f5f5f5', padding: '15px', borderRadius: '8px', overflow: 'auto', border: '1px solid ' + (generatedRule ? '#90caf9' : '#ddd') }}>
          {generatedRule ? JSON.stringify(generatedRule, null, 2) : 'Select action type to see generated JSON...'}
        </pre>
      </div>
    </div>
  );
}
