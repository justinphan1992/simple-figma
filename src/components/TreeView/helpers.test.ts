import { assignNodeNames, removeActiveNodes } from './helpers'

describe('assignNodeNames', () => (  
  it('should parse tree data from node correctly', () => {
    const node = {
      id: "1",
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      background: "white",
      children: [
        {
          id: "2",
          x: 15,
          y: 25,
          width: 50,
          height: 30,
          background: "white",
          children: [
            {
              id: "3",
              x: 15,
              y: 25,
              width: 50,
              height: 30,
              background: "white",
              children: [
                {
                  id: "4",
                  x: 15,
                  y: 25,
                  width: 50,
                  height: 30,
                  background: "white",
                  children: []
                }
              ]
            }
          ],
        },
      ]
    }
    assignNodeNames(node, 0, '', true)
    expect(node).toEqual({
      id: "1",
      name: 'root',
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      background: "white",
      children: [
        {
          id: "2",
          name: "group-0",
          x: 15,
          y: 25,
          width: 50,
          height: 30,
          background: "white",
          children: [
            {
              id: "3",
              name: 'group-0-group-0',
              x: 15,
              y: 25,
              width: 50,
              height: 30,
              background: "white",
              children: [
                {
                  id: "4",
                  name: "0",
                  x: 15,
                  y: 25,
                  width: 50,
                  height: 30,
                  background: "white",
                  children: []
                }
              ]
            }
          ],
        }
      ]
    })
  })
))

describe('removeActiveNodes', () => {
  it('should remove active nodes correctly', () => {
    const node = {
      id: "1",
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      background: "white",
      children: [
        {
          id: "2",
          x: 15,
          y: 25,
          width: 50,
          height: 30,
          background: "white",
          children: [
            {
              id: "3",
              x: 15,
              y: 25,
              width: 50,
              height: 30,
              background: "white",
              children: [
                {
                  id: "4",
                  x: 15,
                  y: 25,
                  width: 50,
                  height: 30,
                  background: "white",
                  children: []
                }
              ]
            }
          ],
        },
      ]
    }

    const activeNodesIds = ['3']

    const newNode = removeActiveNodes(node, activeNodesIds);

    expect(newNode).toEqual({
      id: "1",
      x: 10,
      y: 20,
      width: 100,
      height: 50,
      background: "white",
      children: [
        {
          id: "2",
          x: 15,
          y: 25,
          width: 50,
          height: 30,
          background: "white",
          children: [],
        },
      ]
    })
  })
})