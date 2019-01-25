(function(io){
  const clientWidth = window.innerWidth;
  const clientHeight = window.innerHeight;

  // コンテンツの横幅の制限
  const contentWidth = 2000; // mm で表す

  // コンテンツの縦幅の制限
  const adjustHeight = 0; // mm
  const contentHeight = 2000; // mm

  let pointX = 0;
  let pointY = 0;
  const hostname = location.hostname;
  const socket = io.connect("http://" + hostname + ":3000");

  document.addEventListener("DOMContentLoaded", function(event) {
    socket.on("ping", (data)=>{
      console.log(data);
    });

    socket.on("sensor", (value)=>{
      const x = value.x;
      const y = Math.max(value.y - adjustHeight, 0);
      const distant = value.distant;

      // 縦横幅制限
      if (contentWidth / 2 < Math.abs(x) || contentHeight < y ) {
        return;
      }
      // 下の方は省いたほうが良さそう
      if (y < 100) {
        return;
      }

      // 左からの距離
      const pointW = Math.max(x + contentWidth / 2, 0);
      // 上からの距離
      const pointH = Math.max(contentHeight - y, 0);
      // 実数値の比率
      const ratioW = pointW / contentWidth;
      const ratioH = pointH / contentHeight;
      // point換算
      pointX = Math.round(clientWidth * ratioW) ;
      pointY = Math.round(clientHeight  * ratioH);
    });
  });

  window.onload = function() {
    Particles.init({
      speed: 0.5,
      selector: '.background',
      color: ['#DA0463', '#404B69', '#DBEDF3', '#BFFD4D'],
      sizeVariations: 30,
      connectParticles: false
    });
    Particles.init({
      speed: 0.5,
      selector: '.particle',
      color: ['#DA0463', '#404B69', '#DBEDF3', '#BFFD4D'],
      sizeVariations: 30,
      connectParticles: false
    });
  };

  let particleSystem = null;
  let stage = null;

  //  ウィンドウのロードが終わり次第、初期化コードを呼び出す。
  window.addEventListener('load', function () {
    // Stageオブジェクトを作成します。表示リストのルートになります。
    stage = new createjs.Stage('myCanvas');

    // パーティクルシステム作成します。
    particleSystem = new particlejs.ParticleSystem();

    // パーティクルシステムの描画コンテナーを表示リストに登録します。
    stage.addChild(particleSystem.container);

    particleSystem.startX = 6000;
    particleSystem.startY = 6000;

    // Particle Develop( http://ics-web.jp/projects/particle-develop/ ) から書きだしたパーティクルの設定を読み込む
    particleSystem.importFromJson(
      // パラメーターJSONのコピー＆ペースト ここから--
      {
        "bgColor": "#00000",
        "width": clientHeight,
        "height": clientHeight,
        "emitFrequency": 129,
        "startX": 351,
        "startXVariance": 73,
        "startY": 211,
        "startYVariance": 43,
        "initialDirection": 0,
        "initialDirectionVariance": "360",
        "initialSpeed": 18.8,
        "initialSpeedVariance": "3.7",
        "friction": 0.1165,
        "accelerationSpeed": 0.4705,
        "accelerationDirection": "360",
        "startScale": 0.88,
        "startScaleVariance": "1",
        "finishScale": 0.18,
        "finishScaleVariance": 0.68,
        "lifeSpan": 60,
        "lifeSpanVariance": 80,
        "startAlpha": "1",
        "startAlphaVariance": "0",
        "finishAlpha": 0.51,
        "finishAlphaVariance": 0.5,
        "shapeIdList": [
          "circle",
          "blur_circle"
        ],
        "startColor": {
          "hue": 195,
          "hueVariance": 21,
          "saturation": 70,
          "saturationVariance": "0",
          "luminance": 77,
          "luminanceVariance": 37
        },
        "blendMode": true,
        "alphaCurveType": "1",
        "VERSION": "1.0.0"
      }
      // パラメーターJSONのコピー＆ペースト ここまで---
    );

    // フレームレートの設定
    createjs.Ticker.framerate = 60;
    // requestAnimationFrameに従った呼び出し
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    // 定期的に呼ばれる関数を登録
    createjs.Ticker.addEventListener('tick', handleTick);
  });

  function handleTick() {
    //  マウス位置に従って、パーティクル発生位置を変更する
    // particleSystem.startX = stage.mouseX;
    // particleSystem.startY = stage.mouseY;
    // console.log("stage.mouseX", stage.mouseX);
    // console.log("stage.mouseY", stage.mouseY);
    if (pointX !== 6000 && pointY != 6000) {
      console.log("pointX", pointX);
      console.log("pointY", pointY);
      // stage.mouseXY はなぜか2倍の値である
      particleSystem.startX = pointX * 2;
      particleSystem.startY = pointY * 2;
      pointX = 6000;
      pointY = 6000;
    }

    // パーティクルの発生・更新
    particleSystem.update();

    // 描画を更新する
    stage.update();
  }
})(window.io);