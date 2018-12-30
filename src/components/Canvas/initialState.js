export const initialState = {
  elements: {
    byId: {
      0: {
        id: 0,
        name: "Test",
        page: 0,
        frame: { x: 300, y: 100, width: 100, height: 60 },
        angle: 20
      },
      1: {
        id: 1,
        name: "Image",
        page: 0,
        frame: { x: 430, y: 230, width: 200, height: 200 },
        angle: 0,
        imageUrl:
          "https://laurenconrad.com/wp-content/uploads/2014/01/zesjtikiwIb1rG2gAICdt_6FYmyh9-M-VcFAoEwa_I4.jpg",
        imageFrame: { x: 0, y: 0, width: 640, height: 640 },
        isCropping: false
      },
      2: {
        id: 2,
        name: "Test",
        page: 0,
        frame: { x: 130, y: 130, width: 20, height: 90 },
        angle: 0
      }
    },
    allIds: [0, 1, 2]
  },
  pages: {
    byId: {
      0: {
        width: 500,
        height: 500
      }
    },
    allIds: [0]
  },
  selections: [],
  raise: [],
  controlBox: {
    show: true,
    angle: 0,
    frame: {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    }
  },
  selectionBox: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  }
};
