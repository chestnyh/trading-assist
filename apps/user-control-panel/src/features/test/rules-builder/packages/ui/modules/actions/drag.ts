import * as constants from "../stores/constants";


/**
 * @param {Object} mousePos
 * @param {Object} dragging
 */
export const setDragProgress = (mousePos: any, dragging: any) => ({
  type: constants.SET_DRAG_PROGRESS,
  mousePos: mousePos,
  dragging: dragging,
});

/**
 * @param {Object} dragStart
 * @param {Object} dragging
 * @param {Object} mousePos
 */
export const setDragStart = (dragStart: any, dragging: any, mousePos: any) => ({
  type: constants.SET_DRAG_START,
  dragStart: dragStart,
  dragging: dragging,
  mousePos: mousePos,
});

/**
 *
 */
export const setDragEnd = () => ({
  type: constants.SET_DRAG_END,
});
