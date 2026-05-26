import React, { PureComponent } from "react";
import { _isReorderingTree } from "./SortableContainer";
import classNames from "classnames";


interface DraggableProps {
  isDraggingTempo?: boolean;
  isDraggingMe?: boolean;
  onDragStart?: any;
  dragging?: any;
  isLocked?: boolean;
  isTrueLocked?: boolean;
  id?: any;
  lev?: any;
}

export default (className: any): any => (GroupOrRule: any): any =>
  class Draggable extends PureComponent<DraggableProps> {
    wrapper: React.RefObject<HTMLDivElement>;

    constructor(props: DraggableProps) {
      super(props);
      this.wrapper = React.createRef();
    }

    handleDraggerMouseDown = (e: any): void => {
      var nodeId = this.props.id;
      var dom = this.wrapper.current;
        
      if (this.props.onDragStart) {
        this.props.onDragStart(nodeId, dom, e);
      }
    };

    render (): React.ReactElement {
      const {
        isDraggingTempo,
        isDraggingMe,
        dragging,
        ...otherProps
      } = this.props;
      const {
        isTrueLocked,
      } = otherProps;

      let styles: any = {};
      if (isDraggingMe && isDraggingTempo) {
        if (_isReorderingTree) {
          // don't apply old styles for dragging tempo during reorder
        } else {
          styles = {
            top: dragging.y,
            left: dragging.x,
            width: dragging.w
          };
        }
      }

      const cn = classNames(className, "group-or-rule",
        isDraggingMe && isDraggingTempo ? "qb-draggable" : null,
        isDraggingMe && !isDraggingTempo ? "qb-placeholder" : null,
        isTrueLocked ? "locked" : null,
        "level-" + this.props.lev
      );

      return (
        <div
          className={cn}
          style={styles}
          ref={this.wrapper}
          data-id={this.props.id}
        >
          <GroupOrRule
            handleDraggerMouseDown={this.handleDraggerMouseDown}
            isDraggingMe={isDraggingMe}
            isDraggingTempo={isDraggingTempo}
            {...otherProps}
          />
        </div>
      );
    }

  };


