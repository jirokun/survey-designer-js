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
        "yaml": "title: 初めて触ったプログラミング言語についてお伺いします\nquestions:\n  - type: checkbox\n    labels:\n      - 選択肢1\n      - 選択肢2\n      - 選択肢3\n    values:\n      - 1\n      - 2\n      - 3\n  - type: checkbox\n    labels:\n      - 選択肢1\n      - 選択肢2\n      - 選択肢3\n    values:\n      - 1\n      - 2\n      - 3"
      }
    ],
    "customPageDefs": [
      {
        "id": "custom1",
        "html": "<h1>custom page</h1>"
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
      },
      {
        "flowId": "flow3",
        "x": 199.5,
        "y": 1067.5
      },
      {
        "flowId": "flow4",
        "x": -14,
        "y": 1281
      },
      {
        "flowId": "flow5",
        "x": 199.5,
        "y": 1281
      },
      {
        "flowId": "flow6",
        "x": 413,
        "y": 1281
      },
      {
        "flowId": "flow7",
        "x": 199.5,
        "y": 1494.5
      },
      {
        "flowId": "flow0",
        "x": 92.75,
        "y": 854
      },
      {
        "flowId": "flow8",
        "x": 92.75,
        "y": 640.5
      },
      {
        "flowId": "flow9",
        "x": 199.5,
        "y": 213.5
      },
      {
        "flowId": "flow10",
        "x": 199.5,
        "y": 427
      },
      {
        "flowId": "ele224"
      },
      {
        "flowId": "ele225"
      },
      {
        "flowId": "ele226"
      },
      {
        "flowId": "ele227"
      },
      {
        "flowId": "ele228"
      },
      {
        "flowId": "ele229"
      },
      {
        "flowId": "ele230"
      },
      {
        "flowId": "ele231"
      },
      {
        "flowId": "ele233"
      },
      {
        "flowId": "ele234"
      },
      {
        "flowId": "ele235"
      },
      {
        "flowId": "ele236"
      },
      {
        "flowId": "ele237"
      }
    ],
    "choiceDefs": [
      {
        "itemId": "item1",
        "label": "選択肢1-1",
        "value": "hoge1"
      },
      {
        "itemId": "item1",
        "label": "選択肢1-2",
        "value": "hoge2"
      },
      {
        "itemId": "item2",
        "label": "選択肢2-1",
        "value": "hun1"
      },
      {
        "itemId": "item2",
        "label": "選択肢2-2",
        "value": "hun2"
      },
      {
        "itemId": "item4",
        "label": "選択肢3-1",
        "value": "fuga1"
      },
      {
        "itemId": "item4",
        "label": "選択肢3-2",
        "value": "fuga2"
      },
      {
        "itemId": "item5",
        "label": "選択肢4-1",
        "value": "piyo1"
      },
      {
        "itemId": "item5",
        "label": "選択肢4-2",
        "value": "piyo2"
      }
    ],
    "itemDefs": [
      {
        "id": "item1",
        "questionId": "question1",
        "itemType": "H-Radio",
        "itemTitle": "RadioItem1",
        "itemName": "q1"
      },
      {
        "id": "item2",
        "questionId": "question1",
        "itemType": "H-Checkbox",
        "itemTitle": "CheckboxItem2",
        "itemName": "q2"
      },
      {
        "id": "item3",
        "questionId": "question1",
        "itemType": "Text",
        "itemTitle": "TextItem2",
        "itemName": "q3"
      },
      {
        "id": "item4",
        "questionId": "question2",
        "itemType": "H-Radio",
        "itemTitle": "RadioItem4",
        "itemName": "q4"
      },
      {
        "id": "item5",
        "questionId": "question2",
        "itemType": "H-Checkbox",
        "itemTitle": "CheckboxItem5",
        "itemName": "q5"
      },
      {
        "id": "item6",
        "questionId": "question2",
        "itemType": "Text",
        "itemTitle": "TextItem6",
        "itemName": "q6"
      }
    ],
    "questionDefs": [
      {
        "id": "question1",
        "pageId": "page1",
        "questionTitle": "Q1. 質問1",
        "questionType": "default"
      },
      {
        "id": "question2",
        "pageId": "page2",
        "questionTitle": "Q2. 質問2",
        "questionType": "default"
      }
    ],
    "pageDefs": [
      {
        "id": "page1",
        "pageTitle": "ページタイトル1",
        "pageType": "default",
        "customPageId": ""
      },
      {
        "id": "page2",
        "pageTitle": "ページタイトル2",
        "pageType": "default",
        "customPageId": ""
      },
      {
        "id": "page3",
        "pageTitle": "ページタイトル3",
        "pageType": "default",
        "customPageId": ""
      },
      {
        "id": "page4",
        "pageTitle": "ページタイトル4",
        "pageType": "custom",
        "customPageId": "custom1"
      }
    ],
    "conditionDefs": [
      {
        "flowId": "flow3",
        "type": "if",
        "question": "q4",
        "operator": "==",
        "value": "fuga1",
        "nextFlowId": "flow4"
      },
      {
        "flowId": "flow3",
        "type": "if",
        "question": "q4",
        "operator": "==",
        "value": "fuga2",
        "nextFlowId": "flow5"
      },
      {
        "flowId": "flow3",
        "type": "if",
        "question": "q4",
        "operator": "==",
        "value": "fuga3",
        "nextFlowId": "flow6"
      },
      {
        "flowId": "",
        "type": "",
        "question": "",
        "operator": "",
        "value": "",
        "nextFlowId": ""
      },
      {
        "flowId": "flow10",
        "type": "if",
        "nextFlowId": "flow8"
      },
      {
        "flowId": "flow10",
        "type": "if",
        "nextFlowId": "flow1"
      }
    ],
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
        "nextFlowId": "flow3"
      },
      {
        "id": "flow3",
        "type": "branch",
        "pageId": null,
        "nextFlowId": null
      },
      {
        "id": "flow4",
        "type": "page",
        "pageId": "page3",
        "nextFlowId": "flow5"
      },
      {
        "id": "flow5",
        "type": "page",
        "pageId": "page4",
        "nextFlowId": "flow6"
      },
      {
        "id": "flow6",
        "type": "page",
        "pageId": "page4",
        "nextFlowId": "flow7"
      },
      {
        "id": "flow7",
        "type": "page",
        "pageId": "page4",
        "nextFlowId": "__END__"
      },
      {
        "id": "flow0",
        "type": "page",
        "nextFlowId": "flow2"
      },
      {
        "id": "flow8",
        "type": "page",
        "nextFlowId": "flow0"
      },
      {
        "id": "flow9",
        "type": "page",
        "nextFlowId": "flow10"
      },
      {
        "id": "flow10",
        "type": "branch"
      }
    ]
  },
  "values": {
    "currentFlowId": "flow1",
    "flowStack": [],
    "inputValues": {}
  }
};

