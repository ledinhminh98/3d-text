import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import "./style.css"

const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load("textures/matcaps/3.png")
const fontLoader = new FontLoader()

fontLoader.load("/fonts/courgette_regular.json", (font) => {
  // Material
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

  // Text
  const textGeometry = new TextGeometry("Hasagi", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  })
  textGeometry.center()
  const text = new THREE.Mesh(textGeometry, material)
  scene.add(text)

  // Sphere
  const sphereGeometry = new THREE.SphereGeometry(0.5, 36, 16)

  for (let i = 0; i < 50; i++) {
    const sphere = new THREE.Mesh(sphereGeometry, material)
    sphere.position.x = (Math.random() - 0.5) * 10
    sphere.position.y = (Math.random() - 0.5) * 10
    sphere.position.z = (Math.random() - 0.5) * 10
    sphere.rotation.x = Math.random() * Math.PI
    sphere.rotation.y = Math.random() * Math.PI
    const scale = Math.random()
    sphere.scale.set(scale, scale, scale)
    scene.add(sphere)
  }
})

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
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
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.x = 0.5
camera.position.y = 0.25
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}
tick()
