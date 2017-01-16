export default {
  values: {
    currentFlowId: 'F003',
    flowStack: [],
    inputValues: {
      'P001-1': '1',
      'P001-2': {
        1: false,
        3: false,
        4: false,
        ABC: false,
      },
    },
  },
  defs: {
    title: 'sample enquete',
    creator: 'Jiro Corporation',
    version: 1,
    draftDefs: [
      {
        pageId: 'P001',
        yaml: "title: Checkbox\nquestions:\n- type: checkbox\n  choices:\n  - 通常の選択肢\n  - label: 選択肢2                                    # label以外の値を指定する老婆はobject型で指定する必要がある\n    value: ABC                                       # valueを指定するとチェックボックスの値を変更することができる。通常はindexの順序が値となる\n  - '<span style=\"color: red;\">HTML</span> hogehoge' # コロンを含む文字列を指定する場合\n  - |                                                # 複数行記載する場合\n    1行目\n    2行目\n- type: checkbox\n  vertical: false                                      # 横並びにするときはvertical: falseをつける\n  choices:\n  - 通常の選択肢\n  - label: 選択肢2                                    # label以外の値を指定する老婆はobject型で指定する必要がある\n    value: ABC                                       # valueを指定するとチェックボックスの値を変更することができる。通常はindexの順序が値となる\n  - '<span style=\"color: red;\">HTML</span> hogehoge' # コロンを含む文字列を指定する場合\n  - |                                                # 複数行記載する場合\n    1行目\n    2行目\n",
        valid: true,
      },
      {
        pageId: 'P002',
        yaml: "title: matrix\nquestions:\n- type: matrix\n  direction: horizontal                                                 # 入力のグループを縦でグループ化するか横でグループ化するか。default: horizontal, 指定可能な値: horizontal, vertical\n  cellType: text                                                        # セルのタイプ。デフォルト: radio 指定可能な値： checkbox, radio, text, textarea\n  questions:                                                            # 縦の選択肢\n  - '<span style=\"color: red;\">選択</span>肢1'\n  - 選択肢2\n  values:                                                               # 横の選択肢\n  - '<span style=\"color: red;\">値</span>1'\n  - label: 値2\n    prefix: '<span style=\"font-weight: bold; color: green\">前</span>'\n    postfix: 後\n",
        valid: true,
      },
      {
        pageId: 'P003',
        valid: true,
        yaml: "title: Radio\nquestions:\n- type: radio\n  choices:\n  - 通常の選択肢\n  - label: 選択肢2                                    # label以外の値を指定する老婆はobject型で指定する必要がある\n    value: ABC                                       # valueを指定するとチェックボックスの値を変更することができる。通常はindexの順序が値となる\n  - '<span style=\"color: red;\">HTML</span> hogehoge' # コロンを含む文字列を指定する場合\n  - |                                                # 複数行記載する場合\n    1行目\n    2行目\n- type: radio\n  vertical: false                                      # 横並びにするときはvertical: falseをつける\n  choices:\n  - 通常の選択肢\n  - label: 選択肢2                                    # label以外の値を指定する老婆はobject型で指定する必要がある\n    value: ABC                                       # valueを指定するとチェックボックスの値を変更することができる。通常はindexの順序が値となる\n  - '<span style=\"color: red;\">HTML</span> hogehoge' # コロンを含む文字列を指定する場合\n  - |                                                # 複数行記載する場合\n    1行目\n    2行目\n",
      },
    ],
    positionDefs: [
      {
        flowId: 'F001',
        x: 200,
        y: 239.33333333333334,
      },
      {
        flowId: 'F002',
        x: 200,
        y: 478.6666666666667,
      },
      {
        flowId: 'ele1',
      },
      {
        flowId: 'F003',
        x: 200.58710562414268,
        y: 337.4965706447189,
      },
      {
        flowId: 'F003',
        x: 200,
        y: 318.122085048011,
      },
    ],
    pageDefs: [
      {
        title: 'matrix',
        questions: [
          {
            id: 'P002-1',
            type: 'matrix',
            direction: 'horizontal',
            cellType: 'text',
            questions: [
              '<span style="color: red;">選択</span>肢1',
              '選択肢2',
            ],
            values: [
              '<span style="color: red;">値</span>1',
              {
                label: '値2',
                prefix: '<span style="font-weight: bold; color: green">前</span>',
                postfix: '後',
              },
            ],
          },
        ],
        id: 'P002',
      },
      {
        title: 'Checkbox',
        questions: [
          {
            id: 'P001-1',
            type: 'checkbox',
            choices: [
              '通常の選択肢',
              {
                label: '選択肢2',
                value: 'ABC',
              },
              '<span style="color: red;">HTML</span> hogehoge',
              '1行目\n2行目\n',
            ],
          },
          {
            id: 'P001-2',
            type: 'checkbox',
            vertical: false,
            choices: [
              '通常の選択肢',
              {
                label: '選択肢2',
                value: 'ABC',
              },
              '<span style="color: red;">HTML</span> hogehoge',
              '1行目\n2行目\n',
            ],
          },
        ],
        id: 'P001',
      },
      {
        title: 'Radio',
        questions: [
          {
            id: 'P003-1',
            type: 'radio',
            choices: [
              '通常の選択肢',
              {
                label: '選択肢2',
                value: 'ABC',
              },
              '<span style="color: red;">HTML</span> hogehoge',
              '1行目\n2行目\n',
            ],
          },
          {
            id: 'P003-2',
            type: 'radio',
            vertical: false,
            choices: [
              '通常の選択肢',
              {
                label: '選択肢2',
                value: 'ABC',
              },
              '<span style="color: red;">HTML</span> hogehoge',
              '1行目\n2行目\n',
            ],
          },
        ],
        id: 'P003',
      },
    ],
    conditionDefs: [],
    flowDefs: [
      {
        id: 'F001',
        type: 'page',
        pageId: 'P001',
        nextFlowId: 'F003',
      },
      {
        id: 'F002',
        type: 'page',
        pageId: 'P002',
        nextFlowId: null,
      },
      {
        id: 'F003',
        type: 'page',
        pageId: 'P003',
        nextFlowId: 'F002',
      },
    ],
  },
  viewSettings: {
    graphWidth: 706,
    hotHeight: 400,
  },
};
