import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import "./style.css"

const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()
const fontLoader = new FontLoader()
const textureLoader = new THREE.TextureLoader()

const matcapTexture = textureLoader.load("textures/matcaps/3.png")
const cloudTexture = textureLoader.load("textures/smoke.png")
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

fontLoader.load("/fonts/courgette_regular.json", (font) => {
  const cloudMaterial = new THREE.MeshLambertMaterial({
    map: cloudTexture,
    transparent: true,
  })

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

  /**
   * Cloud
   */
  const cloudGeometry = new THREE.PlaneBufferGeometry(10, 10)
  for (let i = 0; i < 25; i++) {
    const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial)
    cloud.position.set(
      Math.random() * -1.5,
      1.5 + Math.random(),
      1 + Math.random()
    )
    cloud.rotation.x = 1.15
    cloud.rotation.y = -0.25
    cloud.rotation.z = Math.random() * 360
    cloud.material.opacity = 0.6
    scene.add(cloud)
  }
})

/**
 * Rain
 */
const sphereGeometry = new THREE.SphereGeometry(0.03, 32, 16)
const spheres = []
for (let i = 0; i < 1000; i++) {
  const sphere = new THREE.Mesh(sphereGeometry, material)
  sphere.position.x = (Math.random() - 0.5) * 10
  sphere.position.y = (Math.random() - 0.5) * 10
  sphere.position.z = (Math.random() - 0.5) * 10
  const scale = Math.random()
  sphere.scale.set(scale, scale, scale)
  scene.add(sphere)
  spheres.push(sphere)
}

/**
 * Flashlight
 */
const flash = new THREE.PointLight(0xffffff, 3, 0, 1.7)
flash.position.set(2, 200, 10)
scene.add(flash)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
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

/**
 * Controls
 */
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

const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  for (let i = 0; i < 1000; i++) {
    spheres[i].position.y = Math.sin(elapsedTime * 0.5 + i * 0.1) * 1
  }

  if (Math.random() > 0.93 || flash.power > 100) {
    if (flash.power < 100)
      flash.position.set(Math.random() * 2, Math.random() - 1, 0)
    flash.power = Math.random() * 50
  }

  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
