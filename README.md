# mediasoup_sample_v2
Examples for WebRTC SFU mediasoup v2 with node.js (Multiple participants)

* mediasoup GitHub [https://github.com/versatica/mediasoup](https://github.com/versatica/mediasoup)
* mediasoup Web site [https://mediasoup.org](https://mediasoup.org)
* based on [mediasoup-sample by footnik](https://github.com/footniko/mediasoup-sample)
* This sample is build for mediasoup v2.6. This does not work with mediasoup v1.x.
* This sample is check on macOS 10.13 High Sierra.
* samples:
  * multi-party with WebSocket
  * multi-party with Socket.io
  * multi-room, multi-party with Socket.io
  * multi-room, 1 way sample (talk/watch) with Socket.io
* TODO: TLS sample with WebSocket. 
* TODO: TLS sample with socket.io.

Node.jsで動くWebRTC SFU mediasoup v2のサンプルです。

* v2.x用に作り直しました。v1.xでは動作しません。
* [footnikさんのmediasoup-sample](https://github.com/footniko/mediasoup-sample) を参考にしています
* macOS 10.13 High Sierraで動作確認しています




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
$ npm install socket.io
```
or
```
$ npm install
```

Python 2, make, g++ or clang are required for installing mediasoup.

npmモジュールをインストールします。mediasoupのインストールにはPython 2, make, g++かclangが必要です。

### Tips

While npm install, if you got WARNING such as:

```
npm WARN lifecycle mediasoup@2.6.9~postinstall: cannot run in wd %s %s (wd=%s) mediasoup@2.6.9 make Release -C worker 
```

then go to worker directory and make directly.

```
$ cd node_modules/mediasoup/worker/
$ make
```

npm install中にworkerのビルドに失敗したワーニングが出た場合は、workerのディレクトリに移動して直接makeしてください。


# How to use

## WebSocket sample

### run server app

Start server which include Web server and WebSocket server, SFU server.

```
$ node mediasoup_sample_v2.js
```
or
```
$ npm start
```

サーバーを起動します。Webサーバー、WebSocketによるシグナリングサーバー、SFUサーバーを兼ねています。


### access with browser

* open [http://localhost:3000/](http://localhost:3000/) with Chrome or Firefox.
* click [Start Video] button, then [Connect] button

* ブラウザ（ChromeかFirefox）で [http://localhost:3000/](http://localhost:3000/) にアクセスします。
* [Start Video] ボタンをクリックしてカメラとマイクを取得し、 [Connect] ボタンで通信を開始します

## Socket.io sample

### run server app

Start server which include Web server and socket.io server, SFU server.

```
$ node mediasoup_sample_v2_socketio.js
```
or
```
$ npm run socketio
```

サーバーを起動します。Webサーバー、Socket.ioによるシグナリングサーバー、SFUサーバーを兼ねています。

### access with browser

* open [http://localhost:3000/index_socketio.html](http://localhost:3000/index_socketio.html) with Chrome or Firefox.
* click [Start Video] button, then [Connect] button

* ブラウザ（ChromeかFirefox）で [http://localhost:3000/index_socketio.html](http://localhost:3000/index_socketio.html) にアクセスします。
* [Start Video] ボタンをクリックしてカメラとマイクを取得し、 [Connect] ボタンで通信を開始します

## Multi-room sample with Socket.io

### run server app

Start server which include Web server and socket.io server, SFU server.

```
$ node mediasoup_sample_v2_socketio_room.js
```
or
```
$ npm run room
```

サーバーを起動します。Webサーバー、Socket.ioによるシグナリングサーバー、SFUサーバーを兼ねています。

### access with browser

* open [http://localhost:3000/index_socketio_room.html](http://localhost:3000/index_socketio_room.html) with Chrome or Firefox.
* click [Start Video] button, type room name, then [Connect] button

* ブラウザ（ChromeかFirefox）で [http://localhost:3000/index_socketio_room.html](http://localhost:3000/index_socketio_room.html) にアクセスします。
* [Start Video] ボタンをクリックしてカメラとマイクを取得し、 room名を入力してから、[Connect] ボタンで通信を開始します

## Multi-room 1 way sample with Socket.io

### run server app

Start server which include Web server and socket.io server, SFU server.

```
$ node mediasoup_sample_v2_socketio_room.js
```
or
```
$ npm run room
```

サーバーを起動します。Webサーバー、Socket.ioによるシグナリングサーバー、SFUサーバーを兼ねています。

### access with browser, talk side (up-stream)

* open [http://localhost:3000/talk_socketio_room.html](http://localhost:3000/talk_socketio_room.html) with Chrome or Firefox.
* click [Start Video] button, type room name, then [Connect] button

* ブラウザ（ChromeかFirefox）で [http://localhost:3000/talk_socketio_room.html](http://localhost:3000/talk_socketio.html) にアクセスします。
* [Start Video] ボタンをクリックしてカメラとマイクを取得し、 room名を入力してから、[Connect] ボタンで送信を開始します

### access with browser, watch side (down-stream)

* open [http://localhost:3000/watch_socketio_room.html](http://localhost:3000/talk_socketio_room.html) with Chrome or Firefox.
* type room name, then click [Connect] button

* ブラウザ（ChromeかFirefox）で [http://localhost:3000/watch_socketio_room.html](http://localhost:3000/watch_socketio_room.html) にアクセスします。
* room名を入力してから、[Connect] ボタンをクリックして受信を開始します

# use https / wss

* copy options_default.js to options.js
* edit options.js
  * useHttps: true
  * httpsKeyFile: _set path to your key file_
  * httpsCertFile: _set path to your certificate and chain file_
* then, start server

```
  useHttps : true,
  httpsKeyFile: 'SET_PATH_TO_YOUR_KEY_FILE',
  httpsCertFile: 'SET_PATH_TO_YOUR_CERTIFICATE_AND_CHAIN_FILE', 
```

https / wssを使うためには

* options_default.jsをoptions.jsにコピーし
* options.jsを編集
  * useHttps: true
  * httpsKeyFile: keyファイルのパス
  * httpsCertFile: certfファイルのパス
* サーバーを起動

# License / ライセンス

* This samples are under the MIT license
* このサンプルはMITランセンスで提供されます
