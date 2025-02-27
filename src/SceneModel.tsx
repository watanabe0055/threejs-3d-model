import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

function SceneModel(scene: THREE.Scene, mixers: THREE.AnimationMixer[]) {
  const gltfLoader = new GLTFLoader();

  gltfLoader.load("./animation/scene.gltf", (gltf) => {
    const model = gltf.scene;
    model.scale.set(0.001, 0.001, 0.001);
    model.position.set(0, -5, -10);
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
      console.warn("SceneModel: アニメーションが見つかりませんでした");
    }
  });

  return null;
}

export default SceneModel;
