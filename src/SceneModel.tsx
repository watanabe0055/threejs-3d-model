import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

type KeyState = { [key: string]: boolean };

function SceneModel(
  scene: THREE.Scene,
  mixers: THREE.AnimationMixer[],
  updateCallbacks: ((deltaTime: number) => void)[]
) {
  const gltfLoader = new GLTFLoader();
  let model: THREE.Object3D | null = null;

  // 🚀 キーボードの入力状態を管理
  const keyState: KeyState = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
  };

  // 🎮 キー入力イベントを設定
  window.addEventListener("keydown", (event) => {
    if (keyState.hasOwnProperty(event.key)) keyState[event.key] = true;
  });

  window.addEventListener("keyup", (event) => {
    if (keyState.hasOwnProperty(event.key)) keyState[event.key] = false;
  });

  gltfLoader.load("./animation/scene.gltf", (gltf) => {
    model = gltf.scene;
    model.scale.set(0.001, 0.001, 0.001);
    model.position.set(0, -2, 0);
    scene.add(model);

    if (gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(model);
      mixers.push(mixer);

      gltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.setEffectiveWeight(1).play();
      });
    } else {
      console.warn("SceneModel: アニメーションが見つかりませんでした");
    }

    // 🎯 キーボードで移動する処理
    updateCallbacks.push((deltaTime) => {
      if (!model) return;

      const speed = 5 * deltaTime; // 移動スピード
      const rotationSpeed = 2 * deltaTime; // 回転スピード

      const moveDirection = new THREE.Vector3();

      if (keyState["ArrowUp"]) moveDirection.z += speed;
      if (keyState["ArrowDown"]) moveDirection.z -= speed;
      if (keyState["ArrowLeft"]) model.rotation.y += rotationSpeed;
      if (keyState["ArrowRight"]) model.rotation.y -= rotationSpeed;

      model.translateZ(moveDirection.z);
    });
  });

  return null;
}

export default SceneModel;
