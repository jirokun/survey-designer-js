export default {
  defs: {
    title: "sample enquete",
    creator: "Jiro Corporation",
    version: 1,
    choiceDefs: [
      { itemId: 'item1', label: '選択肢1-1', value: "hoge1" },
      { itemId: 'item1', label: '選択肢1-2', value: "hoge2" },
      { itemId: 'item2', label: '選択肢2-1', value: "hun1" },
      { itemId: 'item2', label: '選択肢2-2', value: "hun2" },
      { itemId: 'item4', label: '選択肢3-1', value: "fuga1" },
      { itemId: 'item4', label: '選択肢3-2', value: "fuga2" },
      { itemId: 'item5', label: '選択肢4-1', value: "piyo1" },
      { itemId: 'item5', label: '選択肢4-2', value: "piyo2" }
    ],
    itemDefs: [
      { id: 'item1', questionId: 'question1', itemType: 'RadioItem', itemTitle: "RadioItem1", itemName: "q1"},
      { id: 'item2', questionId: 'question1', itemType: 'CheckboxItem', itemTitle: "CheckboxItem2", itemName: "q2"},
      { id: 'item3', questionId: 'question1', itemType: 'TextItem', itemTitle: "TextItem2", itemName: "q3" },
      { id: 'item4', questionId: 'question2', itemType: 'RadioItem', itemTitle: "RadioItem4", itemName: "q4"},
      { id: 'item5', questionId: 'question2', itemType: 'CheckboxItem', itemTitle: "CheckboxItem5", itemName: "q5"},
      { id: 'item6', questionId: 'question2', itemType: 'TextItem', itemTitle: "TextItem6", itemName: "q6" }
    ],
    questionDefs: [
      {
        id: 'question1',
        pageId: 'page1',
        questionTitle: 'Q1. 質問1',
        questionType: 'default'
      },
      {
        id: 'question2',
        pageId: 'page2',
        questionTitle: 'Q2. 質問2',
        questionType: 'default'
      }
    ],
    pageDefs: [
      {
        id: 'page1',
        pageTitle: 'ページタイトル1'
      },
      {
        id: 'page2',
        pageTitle: 'ページタイトル2'
      },
      {
        id: 'page3',
        pageTitle: 'ページタイトル3'
      },
      {
        id: 'page4',
        pageTitle: 'ページタイトル4'
      }
    ],
    conditionDefs: [
      { flowId: 'flow3', type: 'if', question: 'q4', operator: '==', value: 'fuga1', nextFlowId: 'flow4' },
      { flowId: 'flow3', type: 'if', question: 'q4', operator: '==', value: 'fuga2', nextFlowId: 'flow5' },
      { flowId: 'flow3', type: 'else', nextFlowId: 'flow1'}
    ],
    flowDefs: [
      { id: 'flow1', type: 'page', pageId: 'page1', nextFlowId: 'flow2'},
      { id: 'flow2', type: 'page', pageId: 'page2', nextFlowId: 'flow3'},
      { id: "flow3", type: "branch"},
      { id: 'flow4', type: 'page', pageId: 'page3', nextFlowId: '__END__'},
      { id: 'flow5', type: 'page', pageId: 'page4', nextFlowId: '__END__'}
    ]
  },
};

