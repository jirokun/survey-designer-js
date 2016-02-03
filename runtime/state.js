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
        questionIds: [
          'question1',
        ]
      },
      {
        id: 'page2',
        pageTitle: 'ページタイトル2',
        questionIds: [
          'question2',
        ]
      },
      {
        id: 'page3',
        pageTitle: 'ページタイトル3',
        questionIds: [ ]
      },
      {
        id: 'page4',
        pageTitle: 'ページタイトル4',
        questionIds: [ ]
      }
    ],
    flowDefs: [
      { id: 'flow1', type: 'page', pageId: 'page1', nextFlowId: 'flow2'},
      { id: 'flow2', type: 'page', pageId: 'page2', nextFlowId: 'flow3'},
      { id: "flow3", type: "branch",
        /*
        condition: {
          type: 'javascript',
          formula: "var value = state.values.inputValues.q4; return value == 'fuga1' ? 'flow4' : 'flow5';"
        }
        */
        condition: {
          type: 'simple',
          ifs: [
            { question: 'q4', operator: '==', value: 'fuga1', nextFlowId: 'flow4' },
            { question: 'q4', operator: '==', value: 'fuga2', nextFlowId: 'flow5' }
          ],
          "else": 'flow1'
        }
      },
      { id: 'flow4', type: 'page', pageId: 'page3', nextFlowId: '__END__'},
      { id: 'flow5', type: 'page', pageId: 'page4', nextFlowId: '__END__'}
    ]
  },
  values: {
    currentFlowId: 'flow1',
    flowStack: [],
    inputValues: {}
  }
};

