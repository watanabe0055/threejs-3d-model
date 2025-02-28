import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

function Dinosaurs(
  scene: THREE.Scene,
  mixers: THREE.AnimationMixer[],
  updateCallbacks: ((deltaTime: number, elapsedTime: number) => void)[]
) {
  const gltfLoader = new GLTFLoader();

  gltfLoader.load("./dinosaurs/scene.gltf", (gltf) => {
    const model = gltf.scene;
    model.scale.set(2, 2, 2);
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

    // 🌍 円運動を行うアップデート関数を登録
    const radius = 10;
    const speed = 1;

    updateCallbacks.push((_, elapsedTime) => {
      const angle = elapsedTime * speed;
      const nextAngle = (elapsedTime + 0.01) * speed;

      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      const nextX = radius * Math.cos(nextAngle);
      const nextZ = radius * Math.sin(nextAngle);

      model.position.set(x, -2, z); // Y座標を統一
      model.lookAt(nextX, -2, nextZ);
    });
  });

  return null;
}

export default Dinosaurs;
