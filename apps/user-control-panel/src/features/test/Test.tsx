import React, { useState, useCallback } from 'react';

/**
 * Hierarchical Rule Builder
 * 
 * User builds a tree structure of actions:
 * - interval: has ms field + can have nested actions (via "Add Action")
 * - timeout: has ms field + can have nested actions (via "Add Action")  
 * - debug: has message field, NO nested actions
 * 
 * Target JSON format:
 * {
 *   "name": "Test simple config",
 *   "type": "interval",
 *   "arguments": {
 *     "do": { "type": "debug", "arguments": { "message": "..." } },
 *     "interval": 1000
 *   }
 * }
 */

type ActionType = 'interval' | 'timeout' | 'debug';

interface Action {
  id: string;
  type: ActionType;
  arguments: {
    interval?: number;
    timeout?: number;
    message?: string;
    do?: Action | Action[];
  };
}

const ACTION_TYPES: { value: ActionType; label: string; canHaveChildren: boolean }[] = [
  { value: 'interval', label: 'Interval', canHaveChildren: true },
  { value: 'timeout', label: 'Timeout', canHaveChildren: true },
  { value: 'debug', label: 'Debug', canHaveChildren: false },
];

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

// Action Editor Component
interface ActionEditorProps {
  action: Action;
  onChange: (action: Action) => void;
  onDelete?: () => void;
  depth?: number;
}

const ActionEditor: React.FC<ActionEditorProps> = ({ action, onChange, onDelete, depth = 0 }) => {
  const handleTypeChange = (type: ActionType) => {
    const typeConfig = ACTION_TYPES.find(t => t.value === type);
    const newAction: Action = {
      ...action,
      type,
      arguments: {},
    };
    onChange(newAction);
  };

  const handleAddChild = () => {
    const newChild: Action = {
      id: generateId(),
      type: 'debug',
      arguments: { message: '' },
    };
    const currentDo = action.arguments.do;
    const newDo = currentDo ? (Array.isArray(currentDo) ? [...currentDo, newChild] : [currentDo, newChild]) : newChild;
    onChange({ ...action, arguments: { ...action.arguments, do: newDo } });
  };

  const handleChildChange = (index: number, child: Action) => {
    const currentDo = action.arguments.do;
    if (Array.isArray(currentDo)) {
      const newDo = [...currentDo];
      newDo[index] = child;
      onChange({ ...action, arguments: { ...action.arguments, do: newDo } });
    } else {
      onChange({ ...action, arguments: { ...action.arguments, do: child } });
    }
  };

  const handleDeleteChild = (index: number) => {
    const currentDo = action.arguments.do;
    if (Array.isArray(currentDo)) {
      const newDo = currentDo.filter((_, i) => i !== index);
      onChange({ ...action, arguments: { ...action.arguments, do: newDo.length === 1 ? newDo[0] : newDo } });
    } else {
      onChange({ ...action, arguments: { ...action.arguments, do: undefined } });
    }
  };

  const typeConfig = ACTION_TYPES.find(t => t.value === action.type);
  const children = action.arguments.do ? (Array.isArray(action.arguments.do) ? action.arguments.do : [action.arguments.do]) : [];

  return (
    <div className={`action-editor depth-${depth}`} style={{ 
      border: '2px solid #667eea', 
      borderRadius: '8px', 
      padding: '15px', 
      margin: '10px 0',
      background: '#f8f9fa'
    }}>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
        <span style={{ fontWeight: 600, minWidth: '80px' }}>Type:</span>
        <select 
          value={action.type} 
          onChange={(e) => handleTypeChange(e.target.value as ActionType)}
          style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 }}
        >
          <option value="">Select Type</option>
          {ACTION_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        {onDelete && (
          <button 
            onClick={onDelete}
            style={{ 
              padding: '8px 16px', 
              background: '#dc3545', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Delete
          </button>
        )}
      </div>

      {action.type === 'interval' && (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontWeight: 600, minWidth: '80px' }}>Interval:</span>
          <input
            type="number"
            value={action.arguments.interval || ''}
            onChange={(e) => onChange({ ...action, arguments: { ...action.arguments, interval: parseInt(e.target.value) || 0 } })}
            placeholder="ms"
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 }}
          />
          <span>ms</span>
        </div>
      )}

      {action.type === 'timeout' && (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontWeight: 600, minWidth: '80px' }}>Timeout:</span>
          <input
            type="number"
            value={action.arguments.timeout || ''}
            onChange={(e) => onChange({ ...action, arguments: { ...action.arguments, timeout: parseInt(e.target.value) || 0 } })}
            placeholder="ms"
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 }}
          />
          <span>ms</span>
        </div>
      )}

      {action.type === 'debug' && (
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontWeight: 600, minWidth: '80px' }}>Message:</span>
          <input
            type="text"
            value={action.arguments.message || ''}
            onChange={(e) => onChange({ ...action, arguments: { ...action.arguments, message: e.target.value } })}
            placeholder="Enter message..."
            style={{ padding: '8px 12px', borderRadius: '4px', border: '1px solid #ddd', flex: 1 }}
          />
        </div>
      )}

      {typeConfig?.canHaveChildren && (
        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #dee2e6' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 600 }}>Nested Actions:</span>
            <button 
              onClick={handleAddChild}
              style={{ 
                padding: '8px 16px', 
                background: '#28a745', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              + Add Action
            </button>
          </div>
          
          {children.length > 0 && (
            <div style={{ marginLeft: '20px' }}>
              {children.map((child, index) => (
                <ActionEditor
                  key={child.id}
                  action={child}
                  onChange={(newChild) => handleChildChange(index, newChild)}
                  onDelete={() => handleDeleteChild(index)}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Convert Action tree to target JSON format
function convertToJsonFormat(action: Action): any {
  const result: any = {
    type: action.type,
  };

  if (action.type === 'interval') {
    result.arguments = { interval: action.arguments.interval || 1000 };
  } else if (action.type === 'timeout') {
    result.arguments = { timeout: action.arguments.timeout || 1000 };
  } else if (action.type === 'debug') {
    result.arguments = { message: action.arguments.message || '' };
  }

  // Handle nested actions
  if (action.arguments.do) {
    if (Array.isArray(action.arguments.do)) {
      if (action.arguments.do.length === 1) {
        result.arguments.do = convertToJsonFormat(action.arguments.do[0]);
      } else {
        result.arguments.do = {
          type: 'sequence',
          arguments: {
            actions: action.arguments.do.map(convertToJsonFormat)
          }
        };
      }
    } else {
      result.arguments.do = convertToJsonFormat(action.arguments.do);
    }
  }

  return result;
}

// Main Component
export function Test() {
  // Start with empty action - user must select type first
  const [rootAction, setRootAction] = useState<Action>({
    id: 'root',
    type: '' as ActionType, // Empty initially
    arguments: {}
  });

  const handleRootChange = (newAction: Action) => {
    setRootAction(newAction);
  };

  const handleReset = () => {
    setRootAction({
      id: 'root',
      type: '' as ActionType,
      arguments: {}
    });
  };

  const generatedRule = rootAction.type ? convertToJsonFormat(rootAction) : null;

  // Hardcoded target rule in JSON format
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

      {/* Target Rule - JSON Format */}
      <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '15px', color: '#333' }}>
          Target Rule (Required Format)
        </h2>
        <pre style={{ 
          fontSize: '13px', 
          background: '#f8f9fa', 
          padding: '15px', 
          borderRadius: '8px', 
          overflow: 'auto',
          border: '1px solid #e9ecef'
        }}>
          {JSON.stringify(targetJsonRule, null, 2)}
        </pre>
      </div>

      {/* Rule Builder UI */}
      <div style={{ marginBottom: '30px', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '15px', color: '#333' }}>
          UI Builder
        </h2>
        <ActionEditor 
          action={rootAction} 
          onChange={handleRootChange}
          onDelete={handleReset}
          depth={0}
        />
      </div>

      {/* Generated Output */}
      <div style={{ padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '15px', color: '#333' }}>
          Generated Rule (JSON)
        </h2>
        <pre style={{ 
          fontSize: '13px', 
          background: generatedRule ? '#e3f2fd' : '#f5f5f5', 
          padding: '15px', 
          borderRadius: '8px', 
          overflow: 'auto',
          border: '1px solid ' + (generatedRule ? '#90caf9' : '#ddd')
        }}>
          {generatedRule ? JSON.stringify(generatedRule, null, 2) : 'Select action type to see generated JSON...'}
        </pre>
      </div>
    </div>
  );
}