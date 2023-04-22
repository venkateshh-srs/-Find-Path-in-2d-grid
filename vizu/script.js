("use strict");
let addWeights = false;
let addWalls = false;
let remove = false;
let isDisabled = false;
let isFree = true;
let dragS = false;
let dragE = false;
let highSpeed = 1;
let algotypeColor = "rgb(29, 53, 71)";

let start, end;
let sId, eId;
let path = [];
let p = [];
let blocked = new Set();
let weighted = new Set();
let isMobile;

if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  isMobile = true;
} else {
  isMobile = false;
}

const rowSize = Math.round(window.innerHeight / 23) - 2;
const colSize = Math.round(window.innerWidth / 23) - 1;
document.querySelector(".grid").style.gridTemplateColumns =
  "repeat(" + colSize + ", 23px)";

//--------------------------------------------------------Disablebuttons-----------------------------------------------------------------

function disableButtons() {
  addWalls = false;
  addWeights = false;
  remove = false;
  dragE = false;
  dragS = false;
  document.querySelector(".select-algorithim").classList.remove("active");
  document.querySelector(".select-algorithim").classList.add("disabled");
  document.querySelector(".speed").classList.remove("active");
  document.querySelector(".speed").classList.add("disabled");
  document.querySelector(".BFS").classList.remove("active");
  document.querySelector(".BFS").classList.add("disabled");
  document.querySelector(".DFS").classList.remove("active");
  document.querySelector(".DFS").classList.add("disabled");
  document.querySelector(".Dijkstra").classList.remove("active");
  document.querySelector(".Dijkstra").classList.add("disabled");
  document.querySelector(".GBFS").classList.remove("active");
  document.querySelector(".GBFS").classList.add("disabled");
  document.querySelector(".AStar").classList.remove("active");
  document.querySelector(".AStar").classList.add("disabled");
  document.querySelector(".addWeights").classList.remove("active");
  document.querySelector(".addWeights").classList.add("disabled");
  document.querySelector(".addWalls").classList.remove("active");
  document.querySelector(".addWalls").classList.add("disabled");
  document.querySelector(".Remove").classList.remove("active");
  document.querySelector(".Remove").classList.add("disabled");
  document.querySelector(".clearPath").classList.remove("active");
  document.querySelector(".clearPath").classList.add("disabled");
  document.querySelector(".clearGrid").classList.remove("active");
  document.querySelector(".clearGrid").classList.add("disabled");
}
function enableButtons() {
  highSpeed = 1;
  document.querySelector(".speed").innerHTML = "Speed";
  document.querySelector(".select-algorithim").innerHTML = "Select Algorithim";
  document.querySelector(".select-algorithim").classList.add("active");
  document.querySelector(".select-algorithim").classList.remove("disabled");
  document.querySelector(".speed").classList.add("active");
  document.querySelector(".speed").classList.remove("disabled");
  document.querySelector(".BFS").classList.add("active");
  document.querySelector(".BFS").classList.remove("disabled");
  document.querySelector(".DFS").classList.add("active");
  document.querySelector(".DFS").classList.remove("disabled");
  document.querySelector(".Dijkstra").classList.add("active");
  document.querySelector(".Dijkstra").classList.remove("disabled");
  document.querySelector(".GBFS").classList.add("active");
  document.querySelector(".GBFS").classList.remove("disabled");
  document.querySelector(".AStar").classList.add("active");
  document.querySelector(".AStar").classList.remove("disabled");
  document.querySelector(".addWeights").classList.add("active");
  document.querySelector(".addWeights").classList.remove("disabled");
  document.querySelector(".addWalls").classList.add("active");
  document.querySelector(".addWalls").classList.remove("disabled");
  document.querySelector(".Remove").classList.add("active");
  document.querySelector(".Remove").classList.remove("disabled");
  document.querySelector(".clearPath").classList.add("active");
  document.querySelector(".clearPath").classList.remove("disabled");
  document.querySelector(".clearGrid").classList.add("active");
  document.querySelector(".clearGrid").classList.remove("disabled");
}

//----------------------------------------------------------clearGrid---------------------------------------------------------------------
document.querySelector(".clearGrid").addEventListener("click", () => {
  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      document.getElementById(`${i}-${j}`).classList.remove("visiting");
      document.getElementById(`${i}-${j}`).classList.remove("visited");
      document.getElementById(`${i}-${j}`).classList.remove("yellow");
      document.getElementById(`${i}-${j}`).classList.remove("block");
      document.getElementById(`${i}-${j}`).classList.remove("weight");
      blocked.clear();
      weighted.clear();
    }
  }
  document.querySelector(".algotype").style.display = "none";
});
//----------------------------------------------------------clearPath---------------------------------------------------------------------

function clearPath() {
  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      document.getElementById(`${i}-${j}`).classList.remove("visiting");
      document.getElementById(`${i}-${j}`).classList.remove("visited");
      document.getElementById(`${i}-${j}`).classList.remove("yellow");
    }
  }
}
document.querySelector(".clearPath").addEventListener("click", () => {
  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      document.getElementById(`${i}-${j}`).classList.remove("visiting");
      document.getElementById(`${i}-${j}`).classList.remove("visited");
      document.getElementById(`${i}-${j}`).classList.remove("yellow");
    }
  }

  document.querySelector(".algotype").style.display = "none";
});
//----------------------------------------------------------constructGrid----------------------------------------------------------------

for (let i = 0; i < rowSize; i++) {
  for (let j = 0; j < colSize; j++) {
    let grid = document.querySelector(".grid");
    let div = document.createElement("id", `${i}-${j}`);
    div.setAttribute("id", `${i}-${j}`);
    div.setAttribute("class", "cell");
    grid.append(div);
  }
}

//place start and target nodes

start = { i: Math.round(rowSize / 2) - 1, j: Math.round(colSize / 2) - 6 };
sId = generateId(start);
document
  .getElementById(
    `${Math.round(rowSize / 2) - 1}-${Math.round(colSize / 2 - 6)}`
  )
  .classList.add("green");
end = { i: Math.round(rowSize / 2) - 1, j: Math.round(colSize / 2) + 6 };
eId = generateId(end);
document
  .getElementById(
    `${Math.round(rowSize / 2) - 1}-${Math.round(colSize / 2 + 6)}`
  )
  .classList.add("red");
let click = isMobile ? "touchstart" : "mousedown";
let up = isMobile ? "touchend" : "mouseup";
let move = isMobile ? "touchstart" : "mousemove";

{
  document.querySelector(".grid").addEventListener(click, (e) => {
    if (e.target.id === sId) {
      dragS = true;
    }
    if (e.target.id === eId) {
      dragE = true;
    }
  });
  document.querySelector(".grid").addEventListener(up, (e) => {
    dragE = false;
    dragS = false;
  });
  document.querySelector(".grid").addEventListener(move, (e) => {
    //so when s or e  activated disable walls and weights ;
    const newId = e.target.id;
    if (dragE || dragS) {
      let block = document.getElementById(newId).classList.contains("block");
      let weight = document.getElementById(newId).classList.contains("weight");
      if (dragS && newId != eId && !block && !weight && isFree) {
        document.getElementById(sId).classList.remove("green");
        document.getElementById(newId).classList.add("green");

        sId = newId;
        let [i, j] = sId.split("-").map((str) => parseInt(str));
        start = { i: i, j: j };

        //If weights or blocks are there in new start position then remove them(eraser bug)
      }
      if (dragE && newId != sId && !block && !weight && isFree) {
        document.getElementById(eId).classList.remove("red");
        document.getElementById(newId).classList.add("red");
        eId = newId;
        let [i, j] = eId.split("-").map((str) => parseInt(str));
        end = { i: i, j: j };
        //If weights or blocks are there in new end position then remove them(bro then this becomes eraser (bad idea));
      }
    }
  });

  //After target is selected add mouse event listener to the grid:}
  // addMouseEventListener();
  // Add a mouse up event listener to the grid
  document.querySelector(".speed-low").addEventListener(`${click}`, () => {
    highSpeed = 50;
    document.querySelector(".speed").innerHTML = "Low";
  });
  document.querySelector(".speed-high").addEventListener(`${click}`, () => {
    document.querySelector(".speed").innerHTML = "High";
    highSpeed = 1;
  });
  document.querySelector(".addWeights").addEventListener(`${click}`, () => {
    addWeights = true;
    remove = false;
    addWalls = false;
  });
  document.querySelector(".addWalls").addEventListener(`${click}`, () => {
    addWalls = true;
    remove = false;
    addWeights = false;
  });
  document.querySelector(".addWeights").addEventListener(`${click}`, () => {
    addWeights = true;
    remove = false;
    addWalls = false;
  });
  document.querySelector(".Remove").addEventListener(`${click}`, () => {
    addWeights = false;
    addWalls = false;
    remove = true;
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "b" && isFree) {
      addWalls = true;
      remove = false;
      addWeights = false;
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "w" && isFree) {
      addWalls = false;
      remove = false;
      addWeights = true;
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "r" && isFree) {
      addWalls = false;
      remove = true;
      addWeights = false;
    }
  });

  let isDragging = false;
  document.querySelector(".grid").addEventListener(`${click}`, function () {
    isDragging = true;
  });

  document.querySelector(".grid").addEventListener(`${up}`, function () {
    isDragging = false;
  });

  document.querySelector(".grid").addEventListener(`${move}`, function (event) {
    if (isDragging && !dragE && !dragS) {
      // Get the cell that the mouse is currently over
      const cell = event.target;
      let s = `${start.i}-${start.j}`;
      let e = `${end.i}-${end.j}`;
      if (cell.classList.contains("cell")) {
        // Add the "block" class to the cell

        if (cell.id != s && cell.id != e && addWalls) {
          //if the cell is weighted and user tries to add wall then remove the cell from weigted set and remove its weight class
          if (weighted.has(cell.id)) {
            cell.classList.remove("weight");
            weighted.delete(cell.id);
          }
          // Add the cell's ID to the blocked set
          cell.classList.add("block");
          const id = cell.id;
          blocked.add(id);
        } else if (cell.id != s && cell.id != e && remove) {
          if (weighted.has(cell.id)) {
            cell.classList.remove("weight");
            weighted.delete(cell.id);
          }
          if (blocked.has(cell.id)) {
            cell.classList.remove("block");
            blocked.delete(cell.id);
          }
        }

        if (cell.id != s && cell.id != e && addWeights) {
          //if the cell is blocked and user tries to add weight then remove the cell from blocked set and remove its block class

          if (blocked.has(cell.id)) {
            cell.classList.remove("block");
            blocked.delete(cell.id);
          }
          cell.classList.add("weight");
          // Add the cell's ID to the blocked set
          const id = cell.id;
          weighted.add(id);
          // }
        }
      }
    }
  });

  document.querySelector(".BFS").addEventListener(`${click}`, () => {
    document.querySelector(".algotype").style.display = "flex";
    document.querySelector(".algotype").style.fontWeight = "300";
    document.querySelector(".algotype").style.fontSize = "20px";
    document.querySelector(".algotype").style.backgroundColor = "white";
    document.querySelector(".algotype").style.color = "black";
    document.querySelector(
      ".algotype span"
    ).innerHTML = `Breadth First Search(BFS) Algorithim is <strong><em>not weighted</em></strong> and <strong><em>finds the shortest path!</em></strong>`;
    document.querySelector(".select-algorithim").innerHTML = "BFS";

    disableButtons();
    clearPath();
    isFree = false;
    let element = document.querySelector(".algotype");
    element.scrollIntoView({ behavior: "smooth" });

    findBFS(start, end, blocked);
  });
  document.querySelector(".DFS").addEventListener(`${click}`, () => {
    document.querySelector(".algotype").style.display = "flex";
    document.querySelector(".algotype").style.fontWeight = "300";
    document.querySelector(".algotype").style.fontSize = "20px";
    document.querySelector(".algotype").style.backgroundColor = "white";
    document.querySelector(".algotype").style.color = "black";
    document.querySelector(".algotype span").innerHTML =
      "Depth First Search(DFS) Algorithim is <strong><em>not weighted</em></strong> and <strong><em>may not find the shortest path!</em></strong>";
    document.querySelector(".select-algorithim").innerHTML = "DFS";

    let element = document.querySelector(".algotype");
    element.scrollIntoView({ behavior: "smooth" });
    isFree = false;

    disableButtons();
    clearPath();
    findDFS(start, end, blocked);
  });

  document.querySelector(".Dijkstra").addEventListener(`${click}`, () => {
    document.querySelector(".algotype").style.display = "flex";
    document.querySelector(".algotype").style.fontWeight = "300";
    document.querySelector(".algotype").style.fontSize = "20px";
    document.querySelector(".algotype").style.backgroundColor = "white";
    document.querySelector(".algotype").style.color = "black";
    document.querySelector(".algotype span").innerHTML =
      "Dijkstra's Algorithim is <strong><em>weighted</em></strong> and <strong><em>finds the shortest path!</em></strong>";
    document.querySelector(".select-algorithim").innerHTML = "Dijkstra's";

    let element = document.querySelector(".algotype");
    element.scrollIntoView({ behavior: "smooth" });
    disableButtons();
    isFree = false;
    clearPath();
    findDijkstra(start, end, blocked, weighted);
  });
  document.querySelector(".GBFS").addEventListener(`${click}`, () => {
    document.querySelector(".algotype").style.display = "flex";
    document.querySelector(".algotype").style.fontWeight = "300";
    document.querySelector(".algotype").style.fontSize = "20px";
    document.querySelector(".algotype").style.backgroundColor = "white";
    document.querySelector(".algotype").style.color = "black";
    document.querySelector(".algotype span").innerHTML =
      "Greedy Best First Search(GBFS) Algorithim is <strong><em>weighted</em></strong> and <strong><em>may not find the shortest path!</em></strong>";
    document.querySelector(".select-algorithim").innerHTML = "GBFS";

    let element = document.querySelector(".algotype");
    element.scrollIntoView({ behavior: "smooth" });
    isFree = false;
    disableButtons();
    clearPath();
    findGBFS(start, end, blocked, weighted);
  });
  document.querySelector(".AStar").addEventListener(`${click}`, () => {
    document.querySelector(".algotype").style.display = "flex";
    document.querySelector(".algotype").style.fontWeight = "300";
    document.querySelector(".algotype").style.fontSize = "20px";
    document.querySelector(".algotype").style.backgroundColor = "white";
    document.querySelector(".algotype").style.color = "black";
    document.querySelector(".algotype span").innerHTML =
      "Astar(A*) Algorithim is  <strong><em>weighted</em></strong> and  <strong><em>finds the shortest path!</em></strong>";
    document.querySelector(".select-algorithim").innerHTML = "A*";

    let element = document.querySelector(".algotype");
    element.scrollIntoView({ behavior: "smooth" });
    isFree = false;
    disableButtons();
    clearPath();
    findAStar(start, end, blocked, weighted);
  });
}

//------------------------------------------------------Algorithims--------------------------------------------------------------------
//PQ
class PriorityQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(element) {
    if (this.isEmpty()) {
      this.queue.push(element);
    } else {
      let added = false;
      for (let i = 0; i < this.queue.length; i++) {
        if (element[1] < this.queue[i][1]) {
          this.queue.splice(i, 0, element);
          added = true;
          break;
        }
      }
      if (!added) {
        this.queue.push(element);
      }
    }
  }

  dequeue() {
    return this.isEmpty() ? null : this.queue.shift();
  }

  front() {
    return this.isEmpty() ? null : this.queue[0];
  }

  size() {
    return this.queue.length;
  }

  isEmpty() {
    return this.size() === 0;
  }
}
//----------------------------------------------------------BFS--------------------------------------------------------------------------
function findBFS(start, end, blocked) {
  //If any weights are added remove them

  for (let i of weighted) {
    document.getElementById(i).classList.remove("weight");
    weighted.delete(i);
  }

  let visited = new Set(); //visited cells not blocked cells
  let prev = {};
  let queue = [];
  let rrr = [0, 1, 0, -1, 0];

  queue.push(start);
  visited.add(`${start.i}-${start.j}`);

  while (queue.length > 0) {
    let curr = queue.shift();
    for (let k = 0; k <= 3; k++) {
      let newRow = curr.i + rrr[k];
      let newCol = curr.j + rrr[k + 1];
      let id = `${newRow}-${newCol}`;
      if (blocked.has(id)) continue;
      if (
        newRow >= 0 &&
        newCol >= 0 &&
        newRow < rowSize &&
        newCol < colSize &&
        !visited.has(id)
      ) {
        queue.push({ i: newRow, j: newCol });
        prev[id] = curr;
        if (newRow == end.i && newCol == end.j) {
          setTimeout(() => {
            highlightPath(end, prev);
          }, visited.size * 7 * highSpeed + 270);
          return;
        }

        let div = document.getElementById(id);
        setTimeout(() => {
          div.classList.add("visiting");
        }, visited.size * 7 * highSpeed); // add delay based on the number of visited cells
        setTimeout(() => {
          div.classList.add("visited");
        }, visited.size * 7 * highSpeed + 270);
        visited.add(id);
      }
    }
  }
  if (queue.length == 0) {
    setTimeout(() => {
      enableButtons();
      document.querySelector(".algotype").style.backgroundColor = algotypeColor;
      document.querySelector(".algotype").style.color = "white";
      isFree = true;
    }, visited.size * 7 * highSpeed + 270);
  }
}

//Highlit path for bfs gbfs and dijkstra
function highlightPath(end, prev) {
  let path = constructPath(prev, end, start);
  highlightpath(path);
}

//-----------------------------------------------------------DFS-------------------------------------------------------------------
function findDFS(start, end, blocked) {
  //If any weights are added remove them
  highSpeed === 50 ? (highSpeed -= 30) : 1;

  for (let i of weighted) {
    document.getElementById(i).classList.remove("weight");
    weighted.delete(i);
  }
  let found = false;
  let visited = new Set();
  let path = [];
  let c = 0;
  dfs(start.i, start.j);
  if (!found) {
    setTimeout(() => {
      document.querySelector(".algotype").style.backgroundColor = algotypeColor;
      document.querySelector(".algotype").style.color = "white";
      enableButtons();

      isFree = true;
    }, visited.size * 20 * highSpeed + 270);
  }
  function dfs(i, j) {
    let id = `${i}-${j}`;

    if (
      found ||
      i < 0 ||
      j < 0 ||
      i == rowSize ||
      j == colSize ||
      visited.has(id) ||
      blocked.has(id)
    ) {
      return;
    }
    visited.add(id);
    path.push({ i: i, j: j }); // add current cell to path
    if (i == end.i && j == end.j) {
      found = true;
      setTimeout(
        (path) => {
          highlightpathDFS(path);
        },
        visited.size * 20 * highSpeed + 270,
        [...path]
      ); // create a copy of path using the spread operator(?)
      return;
    }
    let div = document.getElementById(id);
    setTimeout(() => {
      div.classList.add("visiting");
    }, visited.size * 20 * highSpeed);
    setTimeout(() => {
      div.classList.add("visited");
    }, visited.size * 20 * highSpeed + 270);
    dfs(i - 1, j);
    dfs(i, j + 1);
    dfs(i + 1, j);
    dfs(i, j - 1);
    path.pop(); // remove current cell from path
  }
}

//Highlight path for DFS
function highlightpathDFS(path) {
  //how to do it using for loop
  let i = 0;
  for (let item of path) {
    setTimeout(() => {
      let itemId = `${item.i}-${item.j}`;
      let div = document.getElementById(itemId);
      div.classList.add("yellow");
    }, 20 * i);
    i++;
  }
  // setInterval(() => {
  //   if (i == path.length) {
  //infinte loop
  //     return;
  //   }
  //   let curr = path[i];
  //   let id = `${curr.i}-${curr.j}`;
  //   let div = document.getElementById(id);
  //   div.classList.add("yellow");
  //   i++;
  // }, 30);
  setTimeout(() => {
    enableButtons();
    isFree = true;
    document.querySelector(".algotype").style.backgroundColor = algotypeColor;
    document.querySelector(".algotype").style.color = "white";
  }, 20 * i);
}
//--------------------------------------------------------Dijkstra------------------------------------------------------------------------
function findDijkstra(start, end, blocked, weighted) {
  //f(x)=g(x);

  let visited = new Set();
  let distance = {};
  let prev = {};
  let nodeWeight = {};
  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      let id = `${i}-${j}`;
      distance[id] = Infinity;
      if (blocked.has(id)) continue;
      if (weighted.has(id)) nodeWeight[id] = 15;
      else nodeWeight[id] = 1;
    }
  }
  distance[start] = 0;
  let pq = new PriorityQueue();
  pq.enqueue([start, 0]);
  while (!pq.isEmpty()) {
    let currNode = pq.dequeue();
    let rrr = [0, 1, 0, -1, 0];
    let i = currNode[0].i;
    let j = currNode[0].j;
    let currNodeDist = currNode[1];

    for (let k = 0; k < 4; k++) {
      let newRow = i + rrr[k];
      let newCol = j + rrr[k + 1];
      let newNodeId = `${newRow}-${newCol}`;
      if (
        i < 0 ||
        j < 0 ||
        i === rowSize ||
        j === colSize ||
        visited.has(newNodeId) ||
        blocked.has(newNodeId)
      )
        continue;
      let newId = { i: newRow, j: newCol };
      if (currNodeDist + nodeWeight[newNodeId] < distance[newNodeId]) {
        visited.add(newNodeId);
        prev[newNodeId] = { i: i, j: j };
        let div = document.getElementById(newNodeId);
        setTimeout(() => {
          div.classList.add("visiting");
        }, visited.size * 7 * highSpeed); // add delay based on the number of visited cells
        setTimeout(() => {
          div.classList.add("visited");
        }, visited.size * 7 * highSpeed + 270);
        distance[newNodeId] = currNodeDist + nodeWeight[newNodeId];
        pq.enqueue([newId, distance[newNodeId]]);
      }
      if (newNodeId === `${end.i}-${end.j}`) {
        setTimeout(() => {
          highlightPath(end, prev);
        }, visited.size * 7 * highSpeed + 270);
        return;
      }
    }
  }
  if (pq.size() == 0) {
    setTimeout(() => {
      enableButtons();
      isFree = true;
      document.querySelector(".algotype").style.backgroundColor = algotypeColor;
      document.querySelector(".algotype").style.color = "white";
    }, visited.size * 7 * highSpeed);
  }
}

function findGBFS(start, target, blocked, weighted) {
  //f(x)=h(x);
  highSpeed === 50 ? (highSpeed -= 20) : 1;

  let pq = new PriorityQueue();
  let visited = new Set();
  let prev = {};
  pq.enqueue([start, 0]);
  while (!pq.isEmpty()) {
    let node = pq.dequeue();
    let i = node[0].i;
    let j = node[0].j;
    let currNode = { i: i, j: j };
    let currNodeId = `${i}-${j}`;
    visited.add(currNodeId);
    //currNode === target; why  this is not working?
    if (currNodeId === `${target.i}-${target.j}`) {
      setTimeout(() => {
        let path = constructPath(prev, target, start);
        highlightpath(path);
      }, 7 * visited.size * highSpeed + 270);
      return;
    }
    setTimeout(() => {
      let div = document.getElementById(currNodeId);
      div.classList.add("visiting");
    }, 7 * visited.size * highSpeed);
    setTimeout(() => {
      let div = document.getElementById(currNodeId);
      div.classList.add("visited");
    }, 7 * visited.size * highSpeed + 270);
    let validNeighbours = getValidNeighbors(currNode, visited, blocked);
    for (let item of validNeighbours) {
      prev[`${item.i}-${item.j}`] = currNode;
      //when item is given as object its not working why?
      pq.enqueue([item, heuristic(item, target, weighted)]);
    }
  }
  //If target is not found
  if (pq.size() == 0) {
    setTimeout(() => {
      document.querySelector(".algotype").style.backgroundColor = algotypeColor;
      document.querySelector(".algotype").style.color = "white";
      enableButtons();
      isFree = true;
    }, visited.size * 7 * highSpeed + 270);
  }
}

function heuristic(currNode, target, weighted) {
  let x1 = currNode.i;
  let y1 = currNode.j;
  let x2 = target.i;
  let y2 = target.j;
  let currNodeId = `${x1}-${y1}`;
  if (weighted.has(currNodeId))
    return 15 + Math.abs(x2 - x1) + Math.abs(y2 - y1);
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}
function getValidNeighbors(currNode, visited, blocked) {
  let rrr = [0, 1, 0, -1, 0];
  let validNeighbours = [];
  for (let k = 0; k <= 3; k++) {
    let newRow = currNode.i + rrr[k];
    let newCol = currNode.j + rrr[k + 1];
    let neighbourNodeId = `${newRow}-${newCol}`;
    if (
      newRow >= 0 &&
      newCol >= 0 &&
      newRow < rowSize &&
      newCol < colSize &&
      !blocked.has(neighbourNodeId) &&
      !visited.has(neighbourNodeId)
    ) {
      visited.add(neighbourNodeId);
      validNeighbours.push({ i: newRow, j: newCol });
    }
  }
  return validNeighbours;
}
function constructPath(prev, target, start) {
  let path = [];
  let currNode = target;
  let totalWeight = 0;
  while (currNode.i != start.i || currNode.j != start.j) {
    totalWeight += weighted.has(`${currNode.i}-${currNode.j}`) ? 15 : 1;
    path.unshift(currNode);
    let prevNode = prev[`${currNode.i}-${currNode.j}`];
    currNode = prevNode;
  }
  return path;
}
//same for BFS,Dijkstra,A*,GBFS
function highlightpath(path) {
  let i = 0;
  for (let item of path) {
    setTimeout(() => {
      let itemId = `${item.i}-${item.j}`;
      let div = document.getElementById(itemId);
      div.classList.add("yellow");
    }, 40 * i);
    i++;
  }
  setTimeout(() => {
    document.querySelector(".algotype").style.backgroundColor = algotypeColor;
    document.querySelector(".algotype").style.color = "white";
    enableButtons();
    isFree = true;
  }, 40 * i);
}
function generateId(obj) {
  return `${obj.i}-${obj.j}`;
}
function findAStar(start, target, blocked, weighted) {
  //f(x)=g(x)+h(x);
  highSpeed === 50 ? (highSpeed -= 20) : 1;

  let visited = new Set();
  let distance = {};
  let prev = {};
  let nodeWeight = {};
  for (let i = 0; i < rowSize; i++) {
    for (let j = 0; j < colSize; j++) {
      let id = `${i}-${j}`;
      distance[id] = Infinity;
      if (blocked.has(id)) continue;
      if (weighted.has(id)) nodeWeight[id] = 15;
      else nodeWeight[id] = 1;
    }
  }
  let startId = generateId(start);
  distance[startId] = 0;
  let pq = new PriorityQueue();
  pq.enqueue([start, 0]);
  while (!pq.isEmpty()) {
    let currNode = pq.dequeue();
    let rrr = [0, 1, 0, -1, 0];
    let i = currNode[0].i;
    let j = currNode[0].j;
    let currNodeId = `${i}-${j}`;

    let div = document.getElementById(currNodeId);
    setTimeout(() => {
      div.classList.add("visiting");
    }, visited.size * 7 * highSpeed); // add delay based on the n umber of visited cells
    setTimeout(() => {
      div.classList.add("visited");
    }, visited.size * 7 * highSpeed + 270);
    for (let k = 0; k < 4; k++) {
      let newRow = i + rrr[k];
      let newCol = j + rrr[k + 1];
      let newNodeId = `${newRow}-${newCol}`;

      if (
        i < 0 ||
        j < 0 ||
        i === rowSize ||
        j === colSize ||
        blocked.has(newNodeId)
      )
        continue;

      let newId = { i: newRow, j: newCol };
      if (distance[currNodeId] + nodeWeight[newNodeId] < distance[newNodeId]) {
        prev[newNodeId] = { i: i, j: j };
        visited.add(newNodeId);
        if (newNodeId === `${end.i}-${end.j}`) {
          setTimeout(() => {
            highlightPath(end, prev);
          }, visited.size * 7 * highSpeed + 270);
          return;
        }
        distance[newNodeId] = distance[currNodeId] + nodeWeight[newNodeId];
        pq.enqueue([newId, distance[newNodeId] + hx(newId, target)]);
      }
    }
  }
  if (pq.size() == 0) {
    setTimeout(() => {
      enableButtons();
      document.querySelector(".algotype").style.backgroundColor = algotypeColor;
      document.querySelector(".algotype").style.color = "white";
      isFree = true;
    }, visited.size * 7 * highSpeed);
  }
}
function hx(currNode, target) {
  let x1 = currNode.i;
  let y1 = currNode.j;
  let x2 = target.i;
  let y2 = target.j;
  return Math.abs(x2 - x1) + Math.abs(y2 - y1);
}
