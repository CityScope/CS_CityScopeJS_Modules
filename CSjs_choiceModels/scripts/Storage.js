// https://www.sitepoint.com/javascript-design-patterns-singleton/
//https://gist.github.com/dmnsgn/4a6ad76de1b5928f13f68f406c70bb09

class Storage {
  constructor() {
    this._cityIOurl = "";
  }

  //cityIO url
  get cityIOurl() {
    return this._cityIOurl;
  }
  set cityIOurl(value) {
    this._cityIOurl = value;
  }

  //cityIO url
  get slider() {
    return this._slider;
  }
  set slider(value) {
    this._slider = value;
  }

  //map obj
  get map() {
    return this._map;
  }
  set map(value) {
    this._map = value;
  }

  //cityIO data
  get cityIOdata() {
    return this._cityIOdata;
  }
  set cityIOdata(value) {
    this._cityIOdata = value;
  }

  //threeJs grid
  get threeGrid() {
    return this._threeGrid;
  }
  set threeGrid(value) {
    this._threeGrid = value;
  }

  //threeJs text
  get threeText() {
    return this._threeText;
  }
  set threeText(value) {
    this._threeText = value;
  }

  //agentSpawnArr
  get agentSpawnArr() {
    return this._agentSpawnArr;
  }
  set agentSpawnArr(value) {
    this._agentSpawnArr = value;
  }
}

export default new Storage();
