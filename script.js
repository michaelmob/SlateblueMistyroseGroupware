const MikesTitle = "Mike's Toolkit";
const MikesToolkitWindowHTML = `
<style>
#mikes-toolkit {
  position: fixed;
  background: #C0C0C0;
  user-select: none;
  border: 1px solid #000000;
  box-shadow: 10px 10px #000000;
  font-family: 'MS Sans Serif', sans-serif;
  font-size: 12px;
  cursor: default;
}

.mtk-title {
  color: white;
  background: linear-gradient(135deg, #008080 0%, #000080 100%);
  padding: 5px 10px;
}

.mtk-content {
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  gap: 5px;
}

.mtk-button {
  background: #C0C0C0;
  border: 2px outset grey;
  padding: 5px 10px;
  text-align: center;
}

.mtk-button:hover { background-color: #C5C5C5; }
.mtk-button:active { border-style: inset; }
</style>

<div id="mikes-toolkit">
  <div class="mtk-title">${MikesTitle}</div>
  <div class="mtk-content"></div>
</div>
`;

function createMikesToolkitWindow(components) {
  document.body.insertAdjacentHTML("afterend", MikesToolkitWindowHTML);
  const div = document.querySelector("#mikes-toolkit");

  const restorePos = (localStorage.getItem("mtk") || ",").split(",");
  div.style.left = restorePos[0] || "300px";
  div.style.top = restorePos[1] || "30px";

  let x = 0,
    y = 0,
    mousedown = false;

  div.onmousedown = (e) => {
    if (e.target.value) return;
    mousedown = true;
    x = div.offsetLeft - e.clientX;
    y = div.offsetTop - e.clientY;
  };

  document.onmousemove = (e) => {
    if (!mousedown) return;
    e.preventDefault();
    div.style.left = x + e.clientX + "px";
    div.style.top = y + e.clientY + "px";
  };

  div.onmouseup = () => {
    mousedown = false;
    localStorage.setItem("mtk", div.style.left + "," + div.style.top);
  };

  for (let [, { label, text, button, html, func }] of Object.entries(
    components,
  )) {
    if (label) html = `<label>${label}</label>`;
    if (button) html = `<button class="mtk-button">${button}</button>`;
    if (text) html = `<input type="text" value="${text}"></input>`;

    const el = div.lastElementChild;
    el.insertAdjacentHTML("beforeend", html);
    if (func) func(el.lastElementChild);
  }
}

createMikesToolkitWindow({
  button1: {
    button: "Scroll to Top",
    func: (e) => {
      e.onclick = () => {
        window.scrollTo(0, 0);
      };
    },
  },
  button2: {
    text: "Scroll to Top",
    func: (e) => {
      e.onchange = function () {};
    },
  },
  button6: {
    html: `<input type="number"></input>`,
    func: (e) => {},
  },
});

let newValue = searchbox.value.replace(
  new RegExp(`\\s?${insert.split(":")[0]}:.*?(\\s|$)`),
  "",
);
