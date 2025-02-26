import { useEffect } from "react";
import "./App.css";

import * as THREE from "three";
import { GLTFLoader, OrbitControls } from "three/examples/jsm/Addons.js";

function App() {
  useEffect(() => {
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;

    const sizes = {
      width: innerWidth,
      height: innerHeight,
    };
    //scene
    const scene: THREE.Scene = new THREE.Scene();

    //camera
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      75,
      sizes.width / sizes.height,
      0.1,
      1000
    );
    camera.position.set(-6, 0, 32);

    //renderer
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);

    // 3d model import
    const glftLoder = new GLTFLoader();
    let model: THREE.Group;
    let mixer: THREE.AnimationMixer;

    glftLoder.load("./animation/scene.gltf", (gltf) => {
      model = gltf.scene;
      model.scale.set(0.001, 0.001, 0.001);
      model.rotateY(-Math.PI / 3);
      scene.add(model);

      mixer = new THREE.AnimationMixer(model);
      const clips = gltf.animations;
      clips.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.play();
      });
    });

    // light
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);
    const spotLight = new THREE.SpotLight(0xffffff, 30);
    spotLight.position.set(-5, 10, 0);
    spotLight.castShadow = true;
    scene.add(spotLight);
    const spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper);

    //orbit control
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    //animation
    const tick = () => {
      renderer.render(scene, camera);
      if (mixer) {
        mixer.update(0.01);
      }

      requestAnimationFrame(tick);
    };
    tick();
  }, []);

  return (
    <>
      <canvas id="canvas"></canvas>
      <div className="mainContent">
        <h3>Shiba Dog</h3>
      </div>
    </>
  );
}

export default App;
