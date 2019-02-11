# mediasoup_sample_v2
Examples for WebRTC SFU mediasoup v2 with node.js (Multiple participants)

* mediasoup GitHub [https://github.com/versatica/mediasoup](https://github.com/versatica/mediasoup)
* mediasoup Web site [https://mediasoup.org](https://mediasoup.org)
* based on [mediasoup-sample by footnik](https://github.com/footniko/mediasoup-sample)
* This sample is build for mediasoup v2.6. This does not work with mediasoup v1.x.
* TODO: samples for 1 way realtime streaming. 
* TODO: TLS sample with WebSocket. 
* TODO: socket.io sample, also socket.io with SSL.

Node.jsで動くWebRTC SFU mediasoup v2のサンプルです。

* v2.x用に作り直しました。v1.xでは動作しません。
* [mediasoup-sample by footnikさんのmediasoup-sample](https://github.com/footniko/mediasoup-sample) を参考にしています



# Installation

## git clone
```
git clone https://github.com/mganeko/mediasoup_sample_v2.git
cd mediasoup_sample/
```
git cloneします。

## install npm modules

```
$ npm install ws
$ npm install express
$ npm install mediasoup
```
or
```
$ npm install
```

Python 2, make, g++ or clang are required for installing mediasoup.

npmモジュールをインストールします。mediasoupのインストールにはPython 2, make, g++かclangが必要です。


# How to use

## run server app
```
$ node mediasoup_sample_v2.js
```
or
```
$ npm start
```

サーバーを起動します。Webサーバー、WebSocketによるシグナリングサーバー、SFUサーバーを兼ねています。


## access with browser

### bidirectional video chat  

* open [http://localhost:3000/](http://localhost:3000/) with Chrome or Firefox.
* click [Start Video] button, then [Connect] button

### 双方向ビデオチャット

* ブラウザ（ChromeかFirefox）で [http://localhost:3000/](http://localhost:3000/) にアクセスします。
* [Start Video] ボタンをクリックしてカメラとマイクを取得し、 [Connect] ボタンで通信を開始します


# License / ライセンス

* This samples are under the MIT license
* このサンプルはMITランセンスで提供されます
