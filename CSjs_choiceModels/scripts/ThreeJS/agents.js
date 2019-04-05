import * as THREE from "three";
import * as texPath from "../sources/flare.png";

export function callAgents(scene, sizeX, sizeY) {
  //add pedestrians per grid object
  let agents = makeAgents(sizeX, sizeY, [0.2, 0.5, 0.1, 0.2], 2000, 10, 1, 300);
  scene.add(agents);
}
function makeAgents(
  sizeX,
  sizeY,
  colorRatioArr,
  maxparticles,
  particleSize,
  buffer,
  speed
) {
  var colors = [[50, 200, 0], [50, 150, 255], [255, 0, 150], [0, 50, 190]];

  var agents;
  var geometry = new THREE.BufferGeometry();
  var posArr = [];
  var colArr = [];
  var typesArr = [];
  var distanceArr = [];
  var texture = new THREE.TextureLoader().load(texPath.default);
  //ratio of particles to num of neighbors
  var particles = maxparticles;

  // define agents start point
  let starting_points_per_mode = [
    [0, 0],
    [0, sizeY],
    [sizeX, sizeY / 2],
    [sizeX / 2, sizeY],
    [sizeX, sizeY]
  ];

  for (var i = 0; i < particles; i++) {
    let colListRnd = Math.floor(Math.random() * colors.length);
    //push color number to array as flag for agent type
    typesArr.push(colListRnd);
    //colors from array
    let rndCol = colors[colListRnd];
    //MUST BE REMAPPED to 0-1 range!!
    let colR = rndCol[0] / 255;
    let colG = rndCol[1] / 255;
    let colB = rndCol[2] / 255;
    distanceArr.push(0);
    colArr.push(colR, colG, colB);
    // positions
    var x = Math.random() * sizeX;
    var z = Math.random() * sizeY;

    posArr.push(x, 0.5, z);
  }
  //
  let posBuffer = new THREE.Float32BufferAttribute(posArr, 3).setDynamic(true);
  let colBuffer = new THREE.Float32BufferAttribute(colArr, 3).setDynamic(true);
  let typesBuffer = new THREE.Float32BufferAttribute(typesArr, 1);

  //
  geometry.addAttribute("position", posBuffer);
  geometry.addAttribute("color", colBuffer);
  geometry.addAttribute("type", typesBuffer);

  //
  var material = new THREE.PointsMaterial({
    size: particleSize,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    map: texture,
    depthTest: true,
    vertexColors: THREE.VertexColors
  });
  agents = new THREE.Points(geometry, material);
  //set name for agents to delete after
  agents.name = "agents";

  //grab the agents pos array for animation
  var posArr = posBuffer.array;
  var typesBufferArr = typesBuffer.array;

  //call anim looper
  animate();

  // return agents for adding to scene
  return agents;
  // animate

  function animate() {
    requestAnimationFrame(animate);
    updateAgentsPositions();
    agents.geometry.attributes.position.needsUpdate = true;
    agents.geometry.attributes.color.needsUpdate = true;
  }

  ////////////////////////////////////////

  // find random pos to spawn out of active cells array
  function updateAgentsPositions() {
    let counter = 0;

    //run through location array [x,y,z,x,y,z..]
    //of all agents in this cell

    for (let i = 0; i < posArr.length; i = i + 3) {
      // where should this agent go
      let destPnt = Storage.agentSpawnArr[counter];

      // what is the type of this agent
      let agent_type = typesBufferArr[counter];

      // console.log(i, counter, agent_type);

      //set bounderies for restart
      if (
        posArr[i] <= destPnt.x + buffer &&
        posArr[i] >= destPnt.x - buffer &&
        posArr[i + 2] <= destPnt.z + buffer &&
        posArr[i + 2] >= destPnt.z - buffer
      ) {
        //renew position after spwan at random position

        posArr[i] = starting_points_per_mode[agent_type][0];
        posArr[i + 2] = starting_points_per_mode[agent_type][1];
      } else {
        //speed and dir of move
        let angleDeg =
          (Math.atan2(destPnt.x - posArr[i], destPnt.z - posArr[i + 2]) * 180) /
          Math.PI;

        posArr[i] += (Math.sin(angleDeg) / speed) * (1 + typesBufferArr[i]);
        posArr[i + 2] += (Math.cos(angleDeg) / speed) * (1 + typesBufferArr[i]);
      }
      //count through the Storage.agentSpawnArr for random locations
      if (counter < Storage.agentSpawnArr.length - 1) {
        counter++;
      } else {
        counter = 0;
      }
    }
  }
}
