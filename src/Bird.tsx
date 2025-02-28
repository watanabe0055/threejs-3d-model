import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

function Bird(scene: THREE.Scene, mixers: THREE.AnimationMixer[]) {
  const gltfLoader = new GLTFLoader();

  gltfLoader.load("./magic/scene.gltf", (gltf) => {
    const model = gltf.scene;
    model.scale.set(10, 10, 10);
    model.position.set(0, 3, 0); // Y座標を SceneModel に合わせる
    model.rotateY(-Math.PI / 3);
    scene.add(model);

    if (gltf.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(model);
      mixers.push(mixer);

      gltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.setEffectiveWeight(1).play();
      });
    } else {
      console.warn("Bird: アニメーションが見つかりませんでした");
    }
  });

  return null;
}

export default Bird;
