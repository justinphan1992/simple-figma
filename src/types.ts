export type Node = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  background: string;
  children: Node[];
}

export type ICustomObject = fabric.Object & {
  id: string
}

export type ICustomRect = fabric.Rect & {
  id: string
}

export type ICustomGroup = fabric.Group & {
  id: string
}