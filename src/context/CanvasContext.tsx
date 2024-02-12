import { createContext, useCallback, useContext, useState } from 'react';
import { mockData as rootNode } from '@/mock';
import { Node } from '@/types';
import { removeActiveNodes, updateNode } from '@/components/TreeView/helpers';

export type CanvasContextValue = {
  node: Node
  activeNodes: string[]
  onSetActiveNodes: (nodeIds: string[]) => void
  onClearActiveNodes: (nodeId: string) => void
  onReset: () => void

  onUpdateNode: (updatedNode: Node) => void

  isGrouping: boolean;
  setIsGrouping: (isGrouping: boolean) => void
  onCreatedGroup: (groupNode: Node) => void
}

export const CanvasContext = createContext<CanvasContextValue | null>(null)

const CanvasContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [node, setNode] = useState(rootNode);
  const [activeNodes, setActiveNodes] = useState<string[]>([])
  const [isGrouping, setIsGrouping] = useState(false)

  const onSetActiveNodes = useCallback((nodeIds: string[]) => {
    if (!nodeIds.length) return;
    setActiveNodes(prev => {
      const newIds = nodeIds.filter(id => !prev.includes(id));
      return newIds.length > 0 ? [...prev, ...newIds] : prev
    });
  }, [])

  const onClearActiveNodes = useCallback((nodeId: string) => {
    setActiveNodes(prev => prev.filter(id => id !== nodeId));
  }, [])

  const onCreatedGroup = useCallback((groupNode: Node) => {
    setNode(prevNode => {
      const clonedNode = structuredClone(prevNode);
      removeActiveNodes(clonedNode, activeNodes);
      clonedNode.children.push(groupNode)
      return clonedNode
    })
    setActiveNodes([groupNode.id]);
    setIsGrouping(false);
  }, [activeNodes])

  const onUpdateNode = (updatedNode: Node) => {
    setNode(prevNode => {
      const rootNode = structuredClone(prevNode);
      updateNode(rootNode, updatedNode);
      return rootNode
    })
  }

  const onReset = () => setActiveNodes([])

  return (
    <CanvasContext.Provider value={{ activeNodes, onSetActiveNodes, onClearActiveNodes, onReset, isGrouping, setIsGrouping, node, onCreatedGroup, onUpdateNode }}>
      {children}
    </CanvasContext.Provider>
  )
}


// eslint-disable-next-line react-refresh/only-export-components
export const useCanvasContext = () => {
  const context = useContext(CanvasContext)

  if (!context) {
    throw new Error('useCanvasContext must be used within a CanvasContextProvider')
  }

  return context
}

export default CanvasContextProvider
