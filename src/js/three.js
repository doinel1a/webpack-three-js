import * as T from 'three';

import aoMap from '../assets/textures/ao-map.jpg';
import metalnessMap from '../assets/textures/metalness-map.jpg';
import normalMap from '../assets/textures/normal-map.jpg';
import roughnessMap from '../assets/textures/roughness-map.jpg';

const device = {
  width: window.innerWidth,
  height: window.innerHeight,
  pixelRatio: window.devicePixelRatio
};

const rootStyle = document.querySelector(':root');

export default class Three {
  constructor(canvas, loader) {
    rootStyle.style.setProperty('--bg-size', '5%');

    this.canvas = canvas;
    this.loader = loader;

    this.scene = new T.Scene();

    this.camera = new T.PerspectiveCamera(
      75,
      device.width / device.height,
      0.1,
      100
    );
    this.camera.position.set(0, 0, 3);
    this.scene.add(this.camera);

    this.renderer = new T.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(device.width, device.height);
    this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));

    this.textureLoadingManager = new T.LoadingManager();
    this.textureLoader = new T.TextureLoader(this.textureLoadingManager);

    this.clock = new T.Clock();

    rootStyle.style.setProperty('--bg-size', '10%');

    this.setLights();
    this.setGeometry();
    this.render();
    this.setResize();
  }

  setLights() {
    this.topPointLight = new T.PointLight(0x7000ff, 2);
    this.topPointLight.position.set(0, 2.5, -0.5);
    this.scene.add(this.topPointLight);

    this.middlePointLight = new T.PointLight(0xffffff, 0.025);
    this.middlePointLight.position.set(0, 0, 2);
    this.scene.add(this.middlePointLight);

    this.bottomPointLight = new T.PointLight(0xb2ff, 2);
    this.bottomPointLight.position.set(0, -2.5, -0.5);
    this.scene.add(this.bottomPointLight);

    rootStyle.style.setProperty('--bg-size', '10%');
  }

  setGeometry() {
    this.sphereGeometry = new T.SphereGeometry(1, 64, 64);

    this.sphereMaterial = new T.MeshStandardMaterial({
      color: new T.Color(0xffffff)
    });
    this.sphereMaterial.aoMapIntensity = 1;
    this.sphereMaterial.aoMap = this.textureLoader.load(aoMap);
    this.sphereMaterial.roughness = 5;
    this.sphereMaterial.roughnessMap = this.textureLoader.load(roughnessMap);
    this.sphereMaterial.metalness = 2;
    this.sphereMaterial.metalnessMap = this.textureLoader.load(metalnessMap);
    this.sphereMaterial.normalMap = this.textureLoader.load(normalMap);

    this.textureLoadingManager.onProgress = (
      urlOfLastItemLoaded,
      itemsLoaded,
      itemsTotal
    ) => {
      const progress = (itemsLoaded / itemsTotal) * 100;
      rootStyle.style.setProperty('--bg-size', `${progress}%`);
    };

    this.textureLoadingManager.onLoad = () => {
      setTimeout(() => {
        this.loader.style.display = 'none';
      }, 500);
    };

    this.sphereMesh = new T.Mesh(this.sphereGeometry, this.sphereMaterial);
    this.scene.add(this.sphereMesh);
  }

  render() {
    const elapsedTime = this.clock.getElapsedTime();

    this.sphereMesh.rotation.x = 0.3 * elapsedTime;
    this.sphereMesh.rotation.y = 0.6 * elapsedTime;

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render.bind(this));
  }

  setResize() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    device.width = window.innerWidth;
    device.height = window.innerHeight;

    this.camera.aspect = device.width / device.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(device.width, device.height);
    this.renderer.setPixelRatio(Math.min(device.pixelRatio, 2));
  }
}
