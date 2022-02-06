import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import { FlyControls } from 'three/examples/jsm/controls/FlyControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// scene.background = new THREE.Color( 0xffffff );
// scene.fog = new THREE.Fog( 0xffffff, 0, 2000 );

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = -3
camera.position.y = 3
camera.position.z = 10
scene.add(camera)

// Controls
const controls = new FlyControls(camera, canvas)
controls.rollSpeed = 0.2;
controls.dragToLook = true;

/**
 * Cube
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshLambertMaterial({ color: 0xff0000 })
// )
// scene.add(cube);

const torusLoader = new GLTFLoader();

torusLoader.load('./torus.gltf', (torus) => {
    scene.add(torus.scene);
})

const particles = [];

for (let i = 0; i < 5000; i++) {
    let particle = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.03, 0.03),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    )

    particle.position.x = Math.random() * 40 - 20;
    particle.position.y = Math.random() * 40 - 20;
    particle.position.z = Math.random() * 40 - 20;

    particles.push(particle);

    scene.add(particle);
}

/**
 * Lighting
 */

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.z = 100;
directionalLight.position.x = 0;
directionalLight.position.y = 0;
scene.add(directionalLight);


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    controls.update(deltaTime)

    for (let i = 0; i < particles.length; i++) {
        particles[i].position.z += 0.001;
    }

    directionalLight.position.x += 1;
    directionalLight.position.y += 1;

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick()