import React, { useState, useCallback } from 'react';
import { Query, Builder, BasicConfig, Utils as QbUtils } from './rules-builder';
import './rules-builder/packages/ui/styles/styles.scss';

const Utils: any = QbUtils;
const InitialConfig = BasicConfig;

/**
 * Simple test rule from task 86c9wc65k:
 * {
 *   "name": "Test simple config",
 *   "description": "TODO add description",
 *   "type": "interval",
 *   "arguments": {
 *     "do": {
 *       "type": "log",
 *       "arguments": {
 *         "message": "Some message"
 *       }
 *     },
 *     "interval": 1000
 *   }
 * }
 */

// Simple rule config for UI builder - representing the structure above
const config = {
  ...InitialConfig,
  fields: {
    ruleType: {
      label: 'Rule Type',
      type: 'select',
      valueSources: ['value'],
      fieldSettings: {
        listValues: [
          { value: 'interval', title: 'Interval' },
          { value: 'cron', title: 'Cron' },
          { value: 'webhook', title: 'Webhook' },
        ],
      },
    },
    actionType: {
      label: 'Action Type',
      type: 'select',
      valueSources: ['value'],
      fieldSettings: {
        listValues: [
          { value: 'log', title: 'Log' },
          { value: 'debug', title: 'Debug' },
          { value: 'telegram_send_message', title: 'Telegram Send' },
        ],
      },
    },
    interval: {
      label: 'Interval (ms)',
      type: 'number',
      fieldSettings: {
        min: 100,
        step: 100,
      },
      valueSources: ['value'],
    },
    message: {
      label: 'Message',
      type: 'text',
      valueSources: ['value'],
    },
    isActive: {
      label: 'Active?',
      type: 'boolean',
      operators: ['equal'],
      valueSources: ['value'],
    },
  },
};

// Initial query representing: interval = 1000 AND action = log
const initialQuery = {
  id: Utils.uuid(),
  type: 'group',
  children1: [
    {
      id: Utils.uuid(),
      type: 'rule',
      properties: {
        field: 'ruleType',
        operator: 'equal',
        value: ['interval'],
        valueSrc: ['value'],
      },
    },
    {
      id: Utils.uuid(),
      type: 'rule',
      properties: {
        field: 'interval',
        operator: 'equal',
        value: [1000],
        valueSrc: ['value'],
      },
    },
    {
      id: Utils.uuid(),
      type: 'rule',
      properties: {
        field: 'actionType',
        operator: 'equal',
        value: ['log'],
        valueSrc: ['value'],
      },
    },
  ],
};

// Hardcoded target rule in JSON format
const targetJsonRule = {
  name: 'Test simple config',
  description: 'TODO add description',
  type: 'interval',
  arguments: {
    do: {
      type: 'log',
      arguments: {
        message: 'Some message',
      },
    },
    interval: 1000,
  },
};

export function Test() {
  const [tree, setTree] = useState(() =>
    Utils.checkTree(Utils.loadTree(initialQuery), config)
  );
  const [generatedJson, setGeneratedJson] = useState<any>(null);

  const onChange = useCallback((immutableTree: any, currentConfig: any) => {
    setTree(immutableTree);

    // Convert tree to various formats
    const jsonTree = Utils.getTree(immutableTree);
    const jsonLogic = Utils.jsonLogicFormat(immutableTree, currentConfig);

    // Build our custom rule format
    const ruleFromBuilder = buildRuleFromTree(jsonTree);

    setGeneratedJson({
      uiTree: jsonTree,
      jsonLogic,
      ruleFromBuilder,
    });
  }, []);

  const renderBuilder = useCallback(
    (props: any) => (
      <div className="query-builder-container" style={{ padding: '10px' }}>
        <div className="query-builder qb-lite">
          <Builder {...props} />
        </div>
      </div>
    ),
    []
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        Rule Builder Test (Task 86c9wc65k)
      </h1>

      {/* Target Rule - JSON Format */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg border">
        <h2 className="text-lg font-semibold mb-2">
          Target Rule (JSON Format - Hardcoded)
        </h2>
        <pre className="text-sm bg-white p-3 rounded border overflow-auto">
          {JSON.stringify(targetJsonRule, null, 2)}
        </pre>
      </div>

      {/* Rule Builder UI */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">
          Rule Builder (UI Format)
        </h2>
        <Query
          {...config}
          value={tree}
          onChange={onChange}
          renderBuilder={renderBuilder}
        />
      </div>

      {/* Generated Output */}
      {generatedJson && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Generated Rule JSON */}
          <div className="p-4 bg-blue-50 rounded-lg border">
            <h3 className="font-semibold mb-2 text-blue-800">
              Generated Rule (Our Format)
            </h3>
            <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-60">
              {JSON.stringify(generatedJson.ruleFromBuilder, null, 2)}
            </pre>
          </div>

          {/* JSON Logic */}
          <div className="p-4 bg-green-50 rounded-lg border">
            <h3 className="font-semibold mb-2 text-green-800">JSON Logic</h3>
            <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-60">
              {JSON.stringify(generatedJson.jsonLogic, null, 2)}
            </pre>
          </div>

          {/* UI Tree */}
          <div className="p-4 bg-purple-50 rounded-lg border">
            <h3 className="font-semibold mb-2 text-purple-800">UI Tree (Internal)</h3>
            <pre className="text-xs bg-white p-3 rounded border overflow-auto max-h-60">
              {JSON.stringify(generatedJson.uiTree, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Comparison */}
      <div className="mt-8 p-4 bg-yellow-50 rounded-lg border">
        <h2 className="text-lg font-semibold mb-2">Comparison</h2>
        <p className="text-sm text-gray-700">
          This test page demonstrates the conversion between UI builder format
          and our JSON rule format. The goal is to prove that
          react-awesome-query-builder can be used as the foundation for our rule
          builder.
        </p>
      </div>
    </div>
  );
}

// Helper function to convert UI tree to our rule format
function buildRuleFromTree(tree: any): any {
  if (!tree || !tree.children1) {
    return null;
  }

  const rule: any = {
    name: 'Generated from UI',
    description: 'Auto-generated rule',
    type: 'interval',
    arguments: {
      do: {
        type: 'log',
        arguments: {
          message: 'Default message',
        },
      },
      interval: 1000,
    },
  };

  // Extract values from tree
  tree.children1.forEach((child: any) => {
    if (child.properties) {
      const field = child.properties.field;
      const value = child.properties.value?.[0];

      switch (field) {
        case 'ruleType':
          rule.type = value;
          break;
        case 'interval':
          rule.arguments.interval = value;
          break;
        case 'actionType':
          rule.arguments.do.type = value;
          break;
        case 'message':
          rule.arguments.do.arguments.message = value;
          break;
      }
    }
  });

  return rule;
}