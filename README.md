# survey-designer-js <a href="https://travis-ci.org/m3dev/survey-designer-js"><img src="https://travis-ci.org/m3dev/survey-designer-js.svg?branch=develop"/></a> [![codecov](https://codecov.io/gh/jirokun/survey-designer-js/branch/develop/graph/badge.svg)](https://codecov.io/gh/m3dev/survey-designer-js)

アンケートデザインのためのJavaScript

# 環境構築
## Node.jsのインストール
動作確認は7.4.0で行っています。nodebrewなどでインストールしてください。

インストールの例
```bash
brew install nodebrew
mkdir -p ~/.nodebrew/src/v7.4.0 
nodebrew install-binary v7.4.0
echo 'export PATH=$HOME/.nodebrew/current/bin:$PATH' >> .bashrc
```

## yarnのインストール

```
npm install -g yarn
```

## 必要なライブラリのインストール

```
yarn
```

## 環境変数の設定
runtimeに必要なCSSを設定する必要があります。PJに合わせた設定をしてください

```
cat RUNTIME_CSS_URL=<css_url1>,[css_url2] > $PJ_ROOT/.env
```

## 開発用の起動方法

```
yarn start
```

## その他の起動コマンド
|コマンド           |説明                                        |
|:-----------------|-------------------------------------------|
| yarn start       | 開発用サーバの起動。ファイルは出力しない         |
| yarn build       | ビルド。distにファイルを出力する               |
| yarn build:watch | ビルド。変更を検知して自動テストを行う           |
| yarn test        | テスト                                     |
| yarn test:watch  | テスト。変更を検知して自動テストを行う           |
