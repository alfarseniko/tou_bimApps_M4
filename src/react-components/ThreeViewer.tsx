/** ################################################### */
/*--------------------IMPORTS-------------------------- */
/** ################################################### */
import * as React from "react";
import * as THREE from "three";
import { useEffect } from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";

/** ################################################### */
/*--------------------REACT FUNCTION------------------- */
/** ################################################### */
export default function ThreeViewer() {
  /** ################################################### */
  /*--------------INITIALIZING VARIABLES----------------- */
  /** ################################################### */
  let scene: THREE.Scene | null;
  let mesh: THREE.Object3D | null;
  let renderer: THREE.WebGLRenderer | null;
  let cameraControls: OrbitControls | null;
  let camera: THREE.PerspectiveCamera | null;
  let axes: THREE.AxesHelper | null;
  let grid: THREE.GridHelper | null;
  let directionalLightTop: THREE.DirectionalLight | null;
  let ambientLight: THREE.AmbientLight | null;
  let objLoader: OBJLoader | null;
  let mtlLoader: MTLLoader | null;

  /** ################################################### */
  /*-------------------SET VIEWER------------------------ */
  /** ################################################### */
  function setViewer() {
    scene = new THREE.Scene();

    const viewerContainer = document.getElementById(
      "viewer-container"
    ) as HTMLDivElement;
    if (!viewerContainer) {
      console.error("Viewer container not found!");
    }
    const containerDimensions = viewerContainer.getBoundingClientRect();

    const fov = 75;
    camera = new THREE.PerspectiveCamera(fov);
    camera.position.z = 5;
    camera.near = 0.0001;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    function resizeViewer() {
      if (!camera) {
        return;
      }
      const containerDimensions = viewerContainer.getBoundingClientRect();
      renderer?.setSize(containerDimensions.width, containerDimensions.height);
      camera.aspect = containerDimensions.width / containerDimensions.height;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", () => resizeViewer());
    resizeViewer();
    viewerContainer.append(renderer.domElement);
    renderer.setSize(containerDimensions.width, containerDimensions.height);

    directionalLightTop = new THREE.DirectionalLight();
    directionalLightTop.position.y = -10;
    ambientLight = new THREE.AmbientLight();
    ambientLight.intensity = 0.4;

    scene.add(ambientLight, directionalLightTop);

    cameraControls = new OrbitControls(camera, viewerContainer);

    function renderScene() {
      if (!scene) {
        return;
      }
      if (!camera) {
        return;
      }
      renderer?.render(scene, camera);
      requestAnimationFrame(renderScene);
    }

    renderScene();

    axes = new THREE.AxesHelper();
    grid = new THREE.GridHelper();
    grid.material.transparent = true;
    grid.material.opacity = 0.5;
    grid.material.color = new THREE.Color("#fff");

    scene.add(axes, grid);

    objLoader = new OBJLoader();
    mtlLoader = new MTLLoader();

    mtlLoader.load("../assets/3dModel/skull.mtl", (materials) => {
      materials.preload();
      objLoader?.setMaterials(materials);
      objLoader?.load("../assets/3dModel/skull.obj", (object) => {
        if (!scene) {
          return;
        }
        scene.add(object);
        mesh = object;
      });
    });
  }

  /** ################################################### */
  /*--------------USE EFFECT CLEANUP--------------------- */
  /** ################################################### */
  useEffect(
    () => {
      // Calls the setViewer function when the component mounts
      setViewer();

      return () => {
        // Cleanup function: runs when the component unmounts

        // Removes the mesh from its parent in the scene, detaching it
        mesh?.removeFromParent();

        // Traverses through all child objects of the mesh (if any)
        mesh?.traverse((child) => {
          // If the child is a THREE.Mesh instance, dispose of its geometry and material
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose(); // Frees up memory by disposing of geometry
            child.material.dispose(); // Frees up memory by disposing of material
          }
        });

        // Sets the mesh reference to null to avoid memory leaks
        mesh = null;
      };
    } /* The empty dependency array means this effect runs only once when the component mounts*/,
    []
  );

  /** ################################################### */
  /*--------------JSX RETURN VALUE----------------------- */
  /** ################################################### */
  return (
    <div
      id="viewer-container"
      className="dashboard-card"
      style={{ minWidth: 0 }}
    />
  );
}
