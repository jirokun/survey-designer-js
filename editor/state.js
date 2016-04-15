export default {
  "viewSettings": {
    "graphWidth": 400,
    "hotHeight": 400
  },
  "defs": {
    "title": "sample enquete",
    "creator": "Jiro Corporation",
    "version": 1,
    "draftDefs": [
      {
        "pageId": "P001",
        "yaml": "title: 初めて触ったプログラミング言語についてお伺いします\nquestions:\n  - type: checkbox\n    labels:\n      - 選択肢1\n      - 選択肢2\n      - 選択肢3\n    values:\n      - 1\n      - 2\n      - 3\n  - type: checkbox\n    labels:\n      - 選択肢1\n      - 選択肢2\n      - 選択肢3\n    values:\n      - 1\n      - 2\n      - 3",
        "valid": true
      },
      {
        "pageId": "P002",
        "yaml": "title: 初めてパソコンについてお伺いします\nquestions:\n  - type: checkbox\n    labels:\n      - 選択肢1\n      - 選択肢2\n      - 選択肢3\n    values:\n      - 1\n      - 2\n      - 3\n  - type: checkbox\n    labels:\n      - 選択肢1\n      - 選択肢2\n      - 選択肢3\n    values:\n      - 1\n      - 2\n      - 3",
        "valid": true
      }
    ],
    "positionDefs": [
      {
        "flowId": "F001",
        "x": 306.25,
        "y": 640.5
      },
      {
        "flowId": "F002",
        "x": 306.25,
        "y": 854
      }
    ],
    "pageDefs": [
      {
        "id":"P001",
        "title":"初めて触ったプログラミング言語についてお伺いします",
        "questions":[
          {"type":"checkbox","labels":["選択肢1","選択肢2","選択肢3"],"values":[1,2,3]},
          {"type":"checkbox","labels":["選択肢1","選択肢2","選択肢3"],"values":[1,2,3]}
        ]
      },
      {
        "id": "P002",
        "title":"初めてパソコンについてお伺いします",
        "questions":[
          {"type":"checkbox","labels":["選択肢1","選択肢2","選択肢3"],"values":[1,2,3]},
          {"type":"checkbox","labels":["選択肢1","選択肢2","選択肢3"],"values":[1,2,3]}
        ]
      }
    ],
    "conditionDefs": [],
    "flowDefs": [
      {
        "id": "F001",
        "type": "page",
        "pageId": "P001",
        "nextFlowId": "F002"
      },
      {
        "id": "F002",
        "type": "page",
        "pageId": "P002",
        "nextFlowId": null
      }
    ]
  },
  "values": {
    "currentFlowId": "F001",
    "flowStack": [],
    "inputValues": {}
  }
};

