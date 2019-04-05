/////////////// landUseGrid  ///////////////////////
export function gridUpdate() {
  let cityIOdata = Storage.cityIOdata;
  let grid = Storage.threeGrid;
  let textHolder = Storage.threeText;
  //array for spwaning agents from
  let agentSpawnArr = [];
  var typesArr = [
    {
      type: "empty",
      color: "rgb(0,0,0)"
    },
    {
      type: "LIVE A",
      color: "rgb(50,150,255)"
    },
    {
      type: "LIVE B",
      color: "rgb(0, 50, 170)"
    },
    {
      type: "WORK A",
      color: "rgb(244,0,255)"
    },
    {
      type: "WORK B",
      color: "rgb(255,0,150)"
    }
  ];

  for (let i = 0; i < grid.children.length; i++) {
    //cell edit
    let thisCell = grid.children[i];

    //clear the text obj
    textHolder.children[i].text = " ";

    if (cityIOdata.grid[i][0] !== -1) {
      if (cityIOdata.grid[i][0] !== 0) {
        //text edit
        textHolder.children[i].text = typesArr[cityIOdata.grid[i][0]].type;
        // slider visuals
        switch (i) {
          case 251:
          case 252:
          case 253:
          case 254:
          case 255:
            thisCell.material.color.set(typesArr[cityIOdata.grid[i][0]].color);
            //set storgae with slider location
            Storage.slider = { position: i, type: cityIOdata.grid[i] };
            textHolder.children[i].text = "slider" + cityIOdata.grid[i];
            break;
        }

        //add this cell location to arr for agents spwaning later
        agentSpawnArr.push({
          type: cityIOdata.grid[i],
          x: thisCell.position.x,
          z: thisCell.position.z
        });
      }

      thisCell.material.color.set(typesArr[cityIOdata.grid[i][0]].color);
      thisCell.scale.y = cityIOdata.grid[i][0] + 0.1;
      thisCell.position.y = [cityIOdata.grid[i][0] + 0.1] / 2;

      if (cityIOdata.grid[i][0] === 0) {
        thisCell.material.opacity = 0;
      } else {
        thisCell.material.opacity = 0.9;
      }
    }
  }

  //add arr for agents spwaning
  Storage.agentSpawnArr = agentSpawnArr;
}
