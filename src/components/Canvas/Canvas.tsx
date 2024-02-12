import { useEffect, useLayoutEffect, useRef } from "react"
import Box from '@mui/material/Box'
import { convertGroupToNode, handleGroupSelection, handleMouseDown, handleObjectMoving, initFabric, renderObjectSelection, renderObjects } from "./helpers";
import { ICustomObject } from "@/types";
import { useCanvasContext } from "@/context/CanvasContext";
import { fabric } from "fabric";


const Canvas = () => {
  const { node } = useCanvasContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const { activeNodes, onReset, onSetActiveNodes, isGrouping, setIsGrouping, onCreatedGroup, onUpdateNode } = useCanvasContext();

  /**
   * Set canvas size based on container
  */
  useLayoutEffect(() => {
    if (containerRef.current && canvasRef.current) {
      canvasRef.current.width = containerRef.current.offsetWidth
      canvasRef.current.height = containerRef.current.offsetHeight
    }
  }, [])

  /**
   * Initialize fabric
  */
  useEffect(() => {
    fabricRef.current = initFabric(canvasRef)
    // Render Objects from Node
    renderObjects(fabricRef.current, node.children)

    fabricRef.current.on('mouse:down', (e) => {
      handleMouseDown(e.target, () => {
        onReset();
        e.target && onSetActiveNodes([(e.target as ICustomObject).id]);
      })
    })

    fabricRef.current.on('object:moving', (e) => {
      handleObjectMoving(e.target, (updatedNode) => onUpdateNode(updatedNode))
    })

    return () => {
      fabricRef.current?.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.on('selection:created', (e) => {
        const ids = e.selected?.filter(o => !activeNodes.includes((o as ICustomObject).id)).map(o => (o as ICustomObject).id);
        onSetActiveNodes(ids || []);
      })
      // Render object selection from selecting nodes
      renderObjectSelection(fabricRef.current, activeNodes)
    }
  }, [activeNodes, onSetActiveNodes])

  useEffect(() => {
    if (!isGrouping || !fabricRef.current) return;
    handleGroupSelection(fabricRef.current, (newGroup: fabric.Group) => {
      const groupNode = convertGroupToNode(newGroup);
      onCreatedGroup(groupNode)
    })
  }, [isGrouping, setIsGrouping, onCreatedGroup])


  return (
    <Box ref={containerRef} height={'100%'}>
      <canvas ref={canvasRef} />
    </Box>
  )
}

export default Canvas;