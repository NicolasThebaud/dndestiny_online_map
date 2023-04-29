window.oncontextmenu = (e) => {
  createElement(e, false);
  return false;
};

let n = 0;
const tokenSize = 50;
const trashSize = 75;
const playerLimit = 3;
const pColors = ["#FFD93D", "#654E92", "#ED2B2A"];
const pNames = ["Oriks", "Galio-10", "Vatoc"];

const canvas = document.querySelector("#canvas");
const input = document.querySelector("#url");

const dragElement = (element) => {
  const canvas = document.querySelector("#canvas");
  let xOffset = 0;
  let yOffset = 0;
  let xPos = 0;
  let yPos = 0;
  
  element.onmousedown = (e) => {
    e.preventDefault();
    
    if (e.ctrlKey && !element.id.includes("p")) {
      const cList = e.srcElement.className.split(" ");
      if (cList.includes("c")) {
        e.srcElement.classList.remove("c");
        e.srcElement.classList.add("a");
      } else if (cList.includes("b")) {
        e.srcElement.classList.remove("b");
        e.srcElement.classList.add("c");
      } else if (cList.includes("a")) {
        e.srcElement.classList.remove("a");
        e.srcElement.classList.add("b");
      } else {
        e.srcElement.classList.add("a");
      }
    }
    
    const tether = document.querySelector("#tether>line");
    
    xPos = e.clientX;
    yPos = e.clientY;
    tether.attributes.x1.value = xPos;
    tether.attributes.y1.value = yPos;
    tether.attributes.x2.value = xPos;
    tether.attributes.y2.value = yPos;
    
    canvas.onmouseup = (e) => {
      canvas.onmouseup = null;
      canvas.onmousemove = null;
      tether.attributes.x1.value = e.clientX;
      tether.attributes.y1.value = e.clientY;
      tether.attributes.x2.value = e.clientX;
      tether.attributes.y2.value = e.clientY;
    };
    canvas.onmousemove = (e) => {
      e.preventDefault();
      xOffset = xPos - e.clientX;
      yOffset = yPos - e.clientY;
      xPos = e.clientX;
      yPos = e.clientY;
      let x = (element.offsetLeft - xOffset);
      let y = (element.offsetTop - yOffset);
      
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      
      tether.attributes.x2.value = x + Math.floor(tokenSize / 2);
      tether.attributes.y2.value = y + Math.floor(tokenSize / 2);
      if (x < trashSize && y < trashSize && !element.id.includes("p")) {
        element.remove(); // trash
      }
    };
  };
};
const createElement = (e, isPlayer) => {
  const creature = document.createElement("div");

  if (isPlayer) { n++; }
  creature.id = `${isPlayer ? "p" : "e"}${n}`;
  creature.classList.add("movable");
  if (!isPlayer) { creature.classList.add("a"); }
  creature.style.background = isPlayer ? pColors[n - 1] : "#A0A0A0";
  creature.style.left = `${e.clientX - Math.floor(tokenSize / 2)}px`;
  creature.style.top = `${e.clientY - Math.floor(tokenSize / 2)}px`;

  if (isPlayer) {
    creature.innerHTML = `<span>${pNames[n - 1]}</span>`;
  }

  dragElement(creature);
  canvas.appendChild(creature);
};
canvas.onclick = (e) => {
  if (e.srcElement !== canvas
    || (e.clientX < trashSize && e.clientY < trashSize)) {
    return;
  }
  
  e.preventDefault();
  if (n < playerLimit) { createElement(e, true); }
};
input.onchange = (e) => {
  console.warn(">", e.srcElement.value);
  document.querySelector("#bg").src = e.srcElement.value;
};
