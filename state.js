import uuid from 'node-uuid'

export default {
  defs: {
    title: "sample enquete",
    creator: "Jiro Corporation",
    version: 1,
    questionDefs: [
      {
        id: 'question1',
        questionTitle: 'Q1. 質問1',
        questionType: 'default',
        items: [
          { id: uuid.v4(), itemType: 'RadioItem', itemTitle: "RadioItem1", itemName: "q1", choices: [
            { id: uuid.v4(), label: '選択肢1-1', value: "hoge1" },
            { id: uuid.v4(), label: '選択肢1-2', value: "hoge2" },
          ]},
          { id: 'checkbox1', itemType: 'CheckboxItem', itemTitle: "CheckboxItem2", itemName: "q2", choices: [
            { id: uuid.v4(), label: '選択肢2-1', value: "hun1" },
            { id: uuid.v4(), label: '選択肢2-2', value: "hun2" },
          ]},
          { itemType: 'TextItem', itemTitle: "TextItem2", itemName: "q3" }
        ]
      },
      {
        id: 'question2',
        questionTitle: 'Q2. 質問2',
        questionType: 'default',
        items: [
          { id: uuid.v4(), itemType: 'RadioItem', itemTitle: "RadioItem1", itemName: "q4", choices: [
            { id: uuid.v4(), label: '選択肢3-1', value: "fuga1" },
            { id: uuid.v4(), label: '選択肢3-2', value: "fuga2" },
          ]},
          { id: 'checkbox2', itemType: 'CheckboxItem', itemTitle: "CheckboxItem2", itemName: "q5", choices: [
            { id: uuid.v4(), label: '選択肢4-1', value: "piyo1" },
            { id: uuid.v4(), label: '選択肢4-2', value: "piyo2" },
          ]},
          { id: uuid.v4(), itemType: 'TextItem', itemTitle: "TextItem2", itemName: "q6" }
        ]
      }
    ],
    pageDefs: [
      {
        id: 'page1',
        pageTitle: 'ページタイトル1',
        questions: [
          'question1',
          'question2'
        ]
      },
      {
        id: 'page2',
        pageTitle: 'ページタイトル2',
        questions: [
          'question2'
        ]
      }
    ],
    flowDefs: [
      { id: 'flow1', type: 'page', pageId: 'page1', nextFlowId: 'flow2'},
      { id: 'flow2', type: 'page', pageId: 'page2', nextFlowId: 'flow3'},
      { id: "flow3", type: "branch", conditinos: [
      ]},
      { id: "end", type: "system" }
    ]
  },
  values: {
    currentFlowId: 'flow1',
    flowStack: [],
    inputValues: {}
  }
};

