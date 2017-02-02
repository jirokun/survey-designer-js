# survey-designer-js <a href="https://travis-ci.org/jirokun/survey-designer-js"><img src="https://travis-ci.org/jirokun/survey-designer-js.svg?branch=master"/></a>

アンケートデザインのためのJavaScript

# 環境構築
## Node.jsのインストール
動作確認は7.3.0で行っています。nodebrewなどでインストールしてください。

## yarnのインストール

```
npm install -g yarn
```

## 必要なライブラリのインストール

```
yarn
```

## 環境変数の設定
runtimeに必要なCSSを設定する必要があります

```
cat RUNTIME_CSS_URL=<css_url1>,[css_url2] > $PJ_ROOT/.env
```

## 開発用の起動方法

```
yarn start
```
