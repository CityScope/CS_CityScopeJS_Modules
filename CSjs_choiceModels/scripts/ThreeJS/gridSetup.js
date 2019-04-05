import * as THREE from "three";
import { SpriteText2D, textAlign } from "three-text2d";
import OrbitControls from "three-orbitcontrols";
import { callAgents } from "./agents";
import "../Storage";
import { gridUpdate } from "./gridUpdate";
import * as texPath from "../sources/bg.png";

////////////////////////////////////////
export function gridSetup() {
  let cityIOdata = Storage.cityIOdata;
  //build threejs initial grid on load

  //get table dims
  var gridX = cityIOdata.header.spatial.ncols;
  var gridY = cityIOdata.header.spatial.nrows;

  //three vars
  var camera;
  var scene;
  var renderer;
  var controls;

  //could be edited
  // var CANVAS_WIDTH = window.innerWidth;
  // var CANVAS_HEIGHT = window.innerHeight;
  //fixed resolution for canvas
  var CANVAS_WIDTH = 1000;
  var CANVAS_HEIGHT = 1000;

  ///////////////SETUP SCENE///////////////////////
  let threeDiv = document.createElement("div");
  document.body.appendChild(threeDiv);
  threeDiv.id = "threeDiv";
  threeDiv.className = "threeDiv";
  // add prjmaping
  scene = new THREE.Scene();
  // set up the renderer
  renderer = window.renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
  renderer.domElement.id = "THREEcanvas";

  //put to div
  threeDiv.appendChild(renderer.domElement);
  /////////////// CAMERA ///////////////////////
  if (camera === undefined) {
    var frustumSize = 125;
    var aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
    var zoomFactor = 12;
    camera = new THREE.OrthographicCamera(
      (frustumSize * aspect) / -zoomFactor,
      (frustumSize * aspect) / zoomFactor,
      frustumSize / zoomFactor,
      frustumSize / -zoomFactor,
      0,
      1000
    );
  }
  //set camera in accordance to grid
  camera.position.set(gridX / 2, 10, gridY / 2);
  //
  //rotate camera around axis if needed
  camera.up.set(-1, 1, 0);
  //
  //IMPORTANT: renderer.domElement solves DAT.GUI
  //issue with drop down-menu not responding
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(gridX / 2, 0, gridY / 2);

  ///////

  // var size = 10;
  // var divisions = 10;
  // var gridHelper = new THREE.GridHelper(size, divisions);
  // scene.add(gridHelper);
  // var axesHelper = new THREE.AxesHelper(5);
  // scene.add(axesHelper);

  /////////////// LIGHTS ///////////////////////
  var hemiLight = new THREE.HemisphereLight(
    "rgb(255,255,255)",
    "rgb(255,255,255)",
    0.3
  );
  hemiLight.color.setHSL(1, 1, 1);
  hemiLight.groundColor.setHSL(1, 1, 1);
  hemiLight.position.set(0, 10, 0);
  scene.add(hemiLight);
  // var hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
  // scene.add(hemiLightHelper);
  var dirLight = new THREE.DirectionalLight("rgb(255,255,255)", 0.5);
  dirLight.color.setHSL(1, 1, 0.95);
  dirLight.position.set(gridX / 2, 20, -gridY / 2);
  // dirLight.position.multiplyScalar(3);
  scene.add(dirLight);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2000;
  dirLight.shadow.mapSize.height = 2000;
  var d = 30;
  dirLight.shadow.camera.left = -d;
  dirLight.shadow.camera.right = d;
  dirLight.shadow.camera.top = d;
  dirLight.shadow.camera.bottom = -d;
  dirLight.shadow.camera.far = 300;
  dirLight.shadow.bias = 0.000001;

  //make grid geom
  let makeGridAndText = makeGrid(gridX, gridY);
  let grid = makeGridAndText[0];
  let textHolder = makeGridAndText[1];

  scene.add(grid, textHolder, makeBackground(gridX, gridY));
  //call loop when done
  animate();
  //loop
  function animate() {
    render();
    requestAnimationFrame(animate);
  }
  //render
  function render() {
    renderer.render(scene, camera);
    controls.update();
  }
  gridUpdate(grid, textHolder);

  //add agents to scene
  callAgents(scene, gridX, gridY);
}

/////////////// GEOMETRY  ///////////////////////

function makeBackground(x, y) {
  let cellSize = 1;
  let geo = new THREE.BoxGeometry(cellSize * x, 0.5, cellSize * y);
  var texture = new THREE.TextureLoader().load(texPath.default);

  let m = new THREE.MeshPhongMaterial({
    color: "white",
    map: texture
  });
  let background_mesh = new THREE.Mesh(geo, m);
  background_mesh.position.x = (cellSize * x) / 2;
  background_mesh.position.z = (cellSize * y) / 2;
  background_mesh.rotation.y = 1.5708;
  return background_mesh;
}

/////////////// GEOMETRY  ///////////////////////
function makeGrid(sizeX, sizeY) {
  var cellSize = 1;
  var cellScale = 0.95;
  var mesh = null;
  var grid = new THREE.Object3D();
  var textHolder = new THREE.Object3D();
  var geometry = null;
  var material = null;

  //loop through grid making
  for (var y = sizeY; y > 0; y--) {
    for (var x = 0; x < sizeX; x++) {
      geometry = new THREE.BoxBufferGeometry(
        cellSize * cellScale,
        0.1,
        cellSize * cellScale
      );
      //make material for each cell
      material = new THREE.MeshPhongMaterial({
        color: "black"
      });
      //make mesh for cell
      mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.position.set(x * cellSize, -0.5, y * cellSize);
      grid.add(mesh);

      // make text over cell
      let text = textMaker("null", "white");
      text.name = "text";
      text.scale.set(0.005, 0.005, 0.005);
      text.position.set(x * cellSize, 6, y * cellSize);
      textHolder.add(text);
    }
  }
  Storage.threeGrid = grid;
  Storage.threeText = textHolder;
  return [grid, textHolder];
}

/////////////// TEXT OVER  ///////////////////////
function textMaker(string, thisCol) {
  var text = new SpriteText2D(string, {
    align: textAlign.center,
    font: "30px helvetica",
    fillStyle: thisCol,
    antialias: true
  });
  return text;
}
