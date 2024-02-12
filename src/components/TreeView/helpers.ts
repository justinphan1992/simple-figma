import { Node } from "@/types";
import { TreeNode } from "./TreeView";

export const assignNodeNames = (node: TreeNode, index: number, prefix = '', isRoot = false) => {
  if (isRoot) {
    node.name = "root";
  } else if (node.children.length > 0) {
    node.name = prefix ? `${prefix}-group-${index}` : `group-${index}`;
  } else {
    node.name = index.toString();
  }

  node.children.forEach((child, i) => assignNodeNames(child, i, !isRoot ? node.name: ''));
}

export const removeActiveNodes = (node: Node, activeNodeIds: string[]) => {  
  const isNode = (n: Node | undefined): n is Node => !!n
  if (activeNodeIds.includes(node.id)) {
    return undefined;
  } else {    
    node.children = node.children.map(child => removeActiveNodes(child, activeNodeIds)).filter(isNode);
  }
  return node
}

export const updateNode = (rootNode: Node, updatedNode: Node) => {  
  if (rootNode.id === updatedNode.id) {
    return updatedNode
  } else {
    rootNode.children = rootNode.children.map(child => updateNode(child, updatedNode))
  }
  return rootNode
}