import React, {Component} from 'react';
import {Query, Builder, BasicConfig, Utils as QbUtils} from './rules-builder';

// Type Utils as any to avoid TypeScript errors with dynamic methods
const Utils: any = QbUtils;

import './rules-builder/packages/ui/styles/styles.scss';
// Choose your skin (ant/material/vanilla):
const InitialConfig = BasicConfig;

// You need to provide your own config. See below 'Config format'
const config: any = {
  ...InitialConfig,
  fields: {
    qty: {
        label: 'Qty',
        type: 'number',
        fieldSettings: {
            min: 0,
        },
        valueSources: ['value'],
        preferWidgets: ['number'],
    },
    price: {
        label: 'Price',
        type: 'number',
        valueSources: ['value'],
        fieldSettings: {
            min: 10,
            max: 100,
        },
        preferWidgets: ['slider', 'rangeslider'],
    },
    color: {
        label: 'Color',
        type: 'select',
        valueSources: ['value'],
        fieldSettings: {
          listValues: [
            { value: 'yellow', title: 'Yellow' },
            { value: 'green', title: 'Green' },
            { value: 'orange', title: 'Orange' }
          ],
        }
    },
    is_promotion: {
        label: 'Promo?',
        type: 'boolean',
        operators: ['equal'],
        valueSources: ['value'],
    },
  }
};

// You can load query value from your backend storage (for saving see `Query.onChange()`)
const queryValue: any = {"id": Utils.uuid(), "type": "group"};


export class Test extends Component {
    state = {
      tree: Utils.checkTree(Utils.loadTree(queryValue), config),
      config: config
    };
    
    render = () => (
      <div>
        <Query
            {...config} 
            value={this.state.tree}
            onChange={this.onChange}
            renderBuilder={this.renderBuilder}
        />
        {this.renderResult(this.state)}
      </div>
    )

    renderBuilder = (props: any) => (
      <div className="query-builder-container" style={{padding: '10px'}}>
        <div className="query-builder qb-lite">
            <Builder {...props} />
        </div>
      </div>
    )

    renderResult = ({tree: immutableTree, config}: {tree: any, config: any}) => (
      <div className="query-builder-result">
          <div>JsonLogic: <pre>{JSON.stringify(Utils.jsonLogicFormat(immutableTree, config))}</pre></div>
      </div>
    )
    
    onChange = (immutableTree: any, config: any) => {
      // Tip: for better performance you can apply `throttle` - see `examples/demo`
      this.setState({tree: immutableTree, config: config});

      const jsonTree = Utils.getTree(immutableTree);
      console.log(jsonTree);
      // `jsonTree` can be saved to backend, and later loaded to `queryValue`
    }
}