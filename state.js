export default {
  title: "sample enquete",
  creator: "Jiro Corporation",
  version: 1,
  currentPage: 'page1',
  pageDefs: [
    {
      id: 'page1',
      pageTitle: 'ページタイトル',
      questions: [
        {
          key: 'uuid-1',
          questionTitle: 'Q1. 質問1',
          questionType: 'default',
          items: [
            { itemType: 'RadioItem', itemTitle: "RadioItem1", itemName: "q1", choices: [
              { key: 'uuid-1-1', label: '選択肢1-1', value: "1" },
              { key: 'uuid-1-2', label: '選択肢1-2', value: "2" },
            ]},
            { itemType: 'CheckboxItem', itemTitle: "CheckboxItem2", itemName: "q2", choices: [
              { key: 'uuid-1-1', label: '選択肢2-1', value: "1" },
              { key: 'uuid-2-2', label: '選択肢2-2', value: "2" },
            ]},
            { itemType: 'TextItem', itemTitle: "TextItem2", itemName: "q3" }
          ]
        },
        {
          key: 'uuid-2',
          questionTitle: 'Q2. 質問1',
          questionType: 'default',
          items: [
            { itemType: 'RadioItem', itemTitle: "RadioItem1", itemName: "q4", choices: [
              { key: 'uuid-3-1', label: '選択肢3-1', value: "1" },
              { key: 'uuid-3-2', label: '選択肢3-2', value: "2" },
            ]},
            { itemType: 'CheckboxItem', itemTitle: "CheckboxItem2", itemName: "q5", choices: [
              { key: 'uuid-4-1', label: '選択肢4-1', value: "1" },
              { key: 'uuid-4-2', label: '選択肢4-2', value: "2" },
            ]},
            { itemType: 'TextItem', itemTitle: "TextItem2", itemName: "q6" }
          ]
        }
      ]
    }
  ]
};

