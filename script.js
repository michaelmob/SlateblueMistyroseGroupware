const savedPos = localStorage.getItem("mtk").split(",");
const title = "Mike's Toolkit";
const template = `
<style>
#mikes-toolkit {
  left: ${savedPos[0] || "200px"};
  top: ${savedPos[1] || "20px"};
  position: fixed;
  background-color: #C0C0C0;
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

.mtk-button {
  display: inline-block;
  background-color: #C0C0C0;
  border: 2px outset grey;
  padding: 5px 10px;
  text-align: center;
  cursor: pointer;
}

.mtk-content {
  padding: 5px 10px;
}

.mtk-button:hover {
  background-color: #C5C5C5;
}

.mtk-button:active {
  border-style: inset;
}
</style>

<div id="mikes-toolkit">
  <div class="mtk-title">${title}</div>
  <div class="mtk-content">
    <button class="mtk-button" title="Scroll to Top">⬆️</button>
    <div class="mtk-button">Down</div>
    <input type="text" placeholder="Search...">
    <label>Sup</label>
    <select>
      <option value="Arial">Arial</option>
      <option value="Verdana">Verdana</option>
      <option value="Helvetica">Helvetica</option>
      <option value="Times New Roman">Times New Roman</option>
      <option value="Courier New">Courier New</option>
      <option value="Georgia">Georgia</option>
      <option value="Palatino">Palatino</option>
      <option value="Garamond">Garamond</option>
      <option value="Bookman">Bookman</option>
      <option value="Avant Garde">Avant Garde</option>
    </select>
  </div>
</div>
`;

function createMikesToolkitWindow(components) {
  for (const [key, value] of Object.entries(components)) {
    value.
  }
  // /{ button, html, func }
  if (button) {
    html = `<button>${button}</button>`;
  }

  document.body.insertAdjacentHTML("afterbegin", template);
  const div = document.querySelector("#mikes-toolkit");

  console.log(button);
  div.insertAdjacentHTML("beforeend", html);
  //func(div.lastChild);

  let x = 0,
    y = 0,
    mousedown = false;

  div.onmousedown = (e) => {
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
}

createMikesToolkitWindow({
  scrollToTop: {
    button: "Scroll to Top",
    func: (e) => {
      //window.scrollTo(0, 0);
      console.log(e);
    },
  },
});
