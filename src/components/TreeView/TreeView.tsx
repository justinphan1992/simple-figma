import { styled } from '@mui/material/styles';
import { Node } from '@/types';
import { TreeView as MuiTreeView } from '@mui/x-tree-view/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from './TreeItem';
import { useMemo } from 'react';
import { assignNodeNames } from './helpers';
import { useCanvasContext } from '@/context/CanvasContext';
import { Box, Button } from '@mui/material';

const Container = styled('div')`
  height: 100vh;
  overflow: auto;
`

export type TreeNode = Omit<Node, 'children'> & {
  name?: string
  children: TreeNode[]
}

const TreeView = () => {
  const { node } = useCanvasContext();
  const nodeWithName: TreeNode = useMemo(() => {
    const clone = structuredClone(node);
    assignNodeNames(clone, 0, '', true);
    return clone;
  }, [node]);

  const { activeNodes, onSetActiveNodes, onClearActiveNodes, setIsGrouping } = useCanvasContext();

  const handleSelectNode = (nodeId: string, isSelected: boolean) => {
    isSelected ? onSetActiveNodes([nodeId]) : onClearActiveNodes(nodeId)
  }

  const renderTree = (node: TreeNode) => (
    <TreeItem
      key={node.id}
      nodeId={node.id}
      label={node.name}
      ContentProps={{
        selected: activeNodes.includes(node.id),
        onSelectNode: handleSelectNode
      }}
    >
      {Array.isArray(node.children)
        ? node.children.map((child) => renderTree(child))
        : null}
    </TreeItem>
  );

  return (
    <Container>
      <Box marginY={2} display={'flex'} justifyContent={'flex-end'}>
        <Button onClick={() => setIsGrouping(true)} disabled={activeNodes.length < 2} size='small' variant='contained' >Group Selection</Button>
      </Box>
      <MuiTreeView
        aria-label="multi-select"
        defaultExpanded={['root']}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {renderTree(nodeWithName)}
      </MuiTreeView>

    </Container>
  )
}

export default TreeView