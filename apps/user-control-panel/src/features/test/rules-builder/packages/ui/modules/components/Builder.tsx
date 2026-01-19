import { Utils } from "../../../core/modules";
import React, { Component } from "react";
import { Item } from "./item/Item";
import SortableContainer from "./containers/SortableContainer";
import {pureShouldComponentUpdate} from "../utils/reactUtils";
const { getTotalReordableNodesCountInTree, getTotalRulesCountInTree } = Utils.TreeUtils;
const { createListWithOneElement, emptyProperties } = Utils.DefaultUtils;

interface BuilderProps {
  tree: any; // Immutable.Map
  config: any;
  actions: any;
  onDragStart?: any;
}

class Builder extends Component<BuilderProps> {
  path: any;
  pureShouldComponentUpdate: any;

  shouldComponentUpdate(nextProps: BuilderProps, nextState: any): boolean {
    const should = this.pureShouldComponentUpdate(nextProps, nextState);
    return should;
  }

  constructor(props: BuilderProps) {
    super(props);
    this.pureShouldComponentUpdate = pureShouldComponentUpdate(this);

    this._updPath(props);
  }

  _updPath (props: BuilderProps): void {
    const id = props.tree.get("id");
    this.path = createListWithOneElement(id);
  }

  render(): React.ReactElement {
    const {
      tree, config, actions, onDragStart,
    } = this.props;
    const rootType = tree.get("type");
    const isTernary = rootType == "switch_group";
    const reordableNodesCnt = isTernary ? undefined : getTotalReordableNodesCountInTree(tree);
    const totalRulesCnt = isTernary ? undefined : getTotalRulesCountInTree(tree);
    const id = tree.get("id");
    return (
      <Item 
        key={id}
        id={id}
        path={this.path}
        type={rootType}
        properties={tree.get("properties") || emptyProperties()}
        config={config}
        actions={actions}
        children1={tree.get("children1") || emptyProperties()}
        reordableNodesCnt={reordableNodesCnt}
        totalRulesCnt={totalRulesCnt}
        parentReordableNodesCnt={0}
        onDragStart={onDragStart}
      />
    );
  }
}

export default SortableContainer(Builder);


