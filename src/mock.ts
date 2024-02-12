import { Node } from '@/types';
import { v4 } from 'uuid'

const colors = ['blue', 'red', 'yellow', 'black'];

const randomColor = () => colors[Math.floor(Math.random() * colors.length)];


export const mockData: Node = {
  id: "root",
  x: 10,
  y: 20,
  width: 1000,
  height: 800,
  background: "white",
  children: Array.from({ length: 10 }).map((_, index) => ({
    id: v4(),
    x: 15 + (index * 125),
    y: 100,
    width: 100,
    height: 100,
    background: randomColor(),
    children: [],
  }))
};