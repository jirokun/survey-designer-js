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
        "id": "page1",
        "yaml": "title: 初めて触ったプログラミング言語についてお伺いします\nquestions:\n  - type: checkbox\n    labels:\n      - 選択肢1\n      - 選択肢2\n      - 選択肢3\n    values:\n      - 1\n      - 2\n      - 3\n  - type: checkbox\n    labels:\n      - 選択肢1\n      - 選択肢2\n      - 選択肢3\n    values:\n      - 1\n      - 2\n      - 3",
        "valid": true
      },
      {
        "id": "page2",
        "yaml": "title: 初めてパソコンについてお伺いします\nquestions:\n  - type: checkbox\n    labels:\n      - 選択肢1\n      - 選択肢2\n      - 選択肢3\n    values:\n      - 1\n      - 2\n      - 3\n  - type: checkbox\n    labels:\n      - 選択肢1\n      - 選択肢2\n      - 選択肢3\n    values:\n      - 1\n      - 2\n      - 3",
        "valid": true
      }
    ],
    "positionDefs": [
      {
        "flowId": "flow1",
        "x": 306.25,
        "y": 640.5
      },
      {
        "flowId": "flow2",
        "x": 306.25,
        "y": 854
      }
    ],
    "pageDefs": [
      {
        "id":"page1",
        "title":"初めて触ったプログラミング言語についてお伺いします",
        "questions":[
          {"type":"checkbox","labels":["選択肢1","選択肢2","選択肢3"],"values":[1,2,3]},
          {"type":"checkbox","labels":["選択肢1","選択肢2","選択肢3"],"values":[1,2,3]}
        ]
      },
      {
        "id": "page2",
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
        "id": "flow1",
        "type": "page",
        "pageId": "page1",
        "nextFlowId": "flow2"
      },
      {
        "id": "flow2",
        "type": "page",
        "pageId": "page2",
        "nextFlowId": null
      }
    ]
  },
  "values": {
    "currentFlowId": "flow1",
    "flowStack": [],
    "inputValues": {}
  }
};

