import { ICustomGroup, ICustomObject, ICustomRect, Node } from "@/types";
import { fabric } from "fabric";
import { v4 } from "uuid";


export const initFabric = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  fabric.Object.prototype.set({
    transparentCorners: false,
    cornerStyle: 'circle',
    cornerColor: '#3880ff',
    cornerSize: 12,
  })

  return new fabric.Canvas(canvasRef.current, {
    width: canvasRef.current?.width,
    height: canvasRef.current?.height,
    selectionKey: 'shiftKey',
    backgroundColor: 'pink',
  })
}

export const createObject = (node: Node) => {
  return new fabric.Rect({
    id: node.id,
    left: node.x,
    top: node.y,
    fill: node.background,
    width: node.width,
    height: node.height,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true,
    lockUniScaling: true,
    lockSkewingX: true,
    lockSkewingY: true,
    lockScalingFlip: true
  } as ICustomRect);
}

export const createGroup = (groupNode: Node) => {
  const objects: fabric.Object[] = groupNode.children.map(childObject => {
    if (childObject.children.length > 0) {
      return createGroup(childObject)
    } else {
      return createObject(childObject)
    }
  });

  return new fabric.Group(objects, {
    id: groupNode.id,
    left: groupNode.x,
    top: groupNode.y,
    width: groupNode.width,
    height: groupNode.height,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true,
    lockUniScaling: true,
    lockSkewingX: true,
    lockSkewingY: true,
    lockScalingFlip: true
  } as ICustomGroup);
}

export const renderObjects = (fabricRef: fabric.Canvas, nodes: Node[]) => {
  const objects = nodes.map(
    childObject => childObject.children.length > 0
      ? createGroup(childObject)
      : createObject(childObject))
  fabricRef.add(...objects)
}

export const renderObjectSelection = (fabricRef: fabric.Canvas, activeNodeIds: string[]) => {
  const objects = fabricRef.getObjects(); // get objects in canvas
  const selectedObjects = objects.filter((o) => activeNodeIds.includes((o as ICustomObject).id));
  fabricRef.discardActiveObject();

  if (selectedObjects.length === 1) {
    fabricRef.setActiveObject(selectedObjects[0]);
  } else {
    const sel = new fabric.ActiveSelection(selectedObjects, {
      canvas: fabricRef,
      lockRotation: true,
      lockScalingX: true,
      lockScalingY: true,
      lockUniScaling: true,
      lockSkewingX: true,
      lockSkewingY: true,
      lockScalingFlip: true
    } as ICustomObject);
    fabricRef.setActiveObject(sel);
  }
  fabricRef.requestRenderAll();
}

export const handleMouseDown = (object: fabric.Object | undefined, callback: () => void) => {
  if (object instanceof fabric.ActiveSelection) return
  callback();

}

export const handleGroupSelection = (fabricRef: fabric.Canvas, callback: (newGroup: fabric.Group) => void) => {
  const object = fabricRef.getActiveObject();

  if (!object || !(object instanceof fabric.ActiveSelection)) {
    return
  }

  const group = (object as fabric.ActiveSelection).toGroup() as ICustomGroup
  group.set('id', v4())
  fabricRef.requestRenderAll();
  callback(group);
}

export const handleObjectMoving = (object: fabric.Object | undefined, callback: (updatedNode: Node) => void) => {
  if (!object) {
    return
  }
  const updatedNode = object instanceof fabric.Group ? convertGroupToNode(object) : convertObjectToNode(object);
  callback(updatedNode);
}

export const convertGroupToNode = (group: fabric.Group): Node => {
  return {
    id: (group as ICustomGroup).id || v4(),
    x: group.left || 0,
    y: group.top || 0,
    width: group.width || 0,
    height: group.height || 0,
    background: group.fill?.toString() || '#fff',
    children: group.getObjects()?.map(o => ({
      id: (o as ICustomObject).id,
      x: o.left || 0,
      y: o.top || 0,
      width: o.width || 0,
      height: o.height || 0,
      background: o.fill?.toString() || '#fff',
      children: []
    }))
  }
}

export const convertObjectToNode = (object: fabric.Object): Node => {
  return {
    id: (object as ICustomObject).id || v4(),
    x: object.left || 0,
    y: object.top || 0,
    width: object.width || 0,
    height: object.height || 0,
    background: object.fill?.toString() || '#fff',
    children: []
  }
}

