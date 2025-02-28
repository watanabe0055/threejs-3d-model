import { useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import SceneModel from "./SceneModel";
import Bird from "./Bird";
import Dinosaurs from "./Dinosaurs";

function App() {
  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    const sizes = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // 🎨 Scene
    const scene: THREE.Scene = new THREE.Scene();

    // 📷 Camera
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.set(-6, 0, 32);

    // 🎞️ Renderer
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    // 💡 Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);
    const spotLight = new THREE.SpotLight(0xffffff, 30);
    spotLight.position.set(-5, 10, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);

    // 🔍 Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // 🎬 アニメーション管理用ミキサー
    const mixers: THREE.AnimationMixer[] = [];

    const updateLoopCallbacks: ((
      deltaTime: number,
      elapsedTime: number
    ) => void)[] = [];

    // ⏳ 毎フレーム更新する処理のリスト
    const updateCallbacks: ((deltaTime: number) => void)[] = [];

    // 🚀 モデルの読み込み
    SceneModel(scene, mixers, updateCallbacks);
    Dinosaurs(scene, mixers, updateLoopCallbacks);
    Bird(scene, mixers);

    // ⏳ アニメーションループ
    const clock = new THREE.Clock();
    const tick = () => {
      const deltaTime = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      renderer.render(scene, camera);
      mixers.forEach((mixer) => mixer.update(deltaTime));
      // モデルのカスタムアニメーションを更新（円運動）
      updateLoopCallbacks.forEach((update) => update(deltaTime, elapsedTime));

      // 各オブジェクトの更新処理を実行
      updateCallbacks.forEach((callback) => callback(deltaTime));

      requestAnimationFrame(tick);
    };
    tick();
  }, []);

  return (
    <>
      <canvas id="canvas" />
      <div className="mainContent">
        <h3>Shiba Dog</h3>
      </div>
    </>
  );
}

export default App;
