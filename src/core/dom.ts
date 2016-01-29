
/**
 * Helper function to wrap a node with container element
 *
 * @param node
 * @param cssClassName
 */

export function wrapWithContainer(node: Node, cssClassName: string): void {
  let nodeList = Array.prototype.slice.call(node.parentElement.children);
  let nodeIndex = nodeList.indexOf(node);
  let container = document.createElement('div');
  container.classList.add(cssClassName);

  node.parentNode.insertBefore(container, node.parentElement.children[nodeIndex  + 1]);
  container.appendChild(node);
}

/**
 * Helper function to check if element has container or not
 *
 * @param node
 * @param cssClassName
 * @returns {boolean}
 */
export function isContainerDefined(node: Node, cssClassName: string): boolean {
  return node.parentElement.classList.contains(cssClassName);
}
