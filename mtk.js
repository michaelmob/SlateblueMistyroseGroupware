function createMikesToolkitWindow(title, components) {
  const html = `
<style>
#mikes-toolkit {
  position: fixed;
  background: #C0C0C0;
  color: #000;
  user-select: none;
  border: 1px solid #000000;
  box-shadow: 10px 10px #000000;
  font-family: 'MS Sans Serif', sans-serif;
  font-size: 12px;
  cursor: default;
  z-index: 99999;
}

#mikes-toolkit header {
  color: white;
  background: linear-gradient(135deg, #008080 0%, #000080 100%);
  padding: 5px 10px;
}

#mikes-toolkit main {
  all: unset;
  padding: 5px 10px;
  display: flex;
  justify-content: space-between;
  gap: 5px;
}

#mikes-toolkit label {
  all: unset;
  display: flex;
  align-items: center;
}

#mikes-toolkit button {
  all: unset;
  border: 2px outset grey;
  padding: 5px 10px;
  text-align: center;
}
#mikes-toolkit button:hover { background-color: #C5C5C5; }
#mikes-toolkit button:active { border-style: inset; }

</style>

<div id="mikes-toolkit">
  <header>${title}</header>
  <main></main>
</div>
  `;
  document.body.insertAdjacentHTML("afterend", html);

  const div = document.querySelector("#mikes-toolkit");
  const pos = localStorage.getItem("mtk-pos") || "300px,30px";
  [div.style.left, div.style.top] = pos.split(",");

  let x = 0,
    y = 0,
    mousedown = false;

  div.onmouseup = () => {
    mousedown = false;
    if (div.style.left && div.style.top)
      localStorage.setItem("mtk-pos", div.style.left + "," + div.style.top);
  };

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

  for (let [, v] of Object.entries(components)) {
    if (v.button) v.html = `<button>${v.button}</button>`;
    if (v.text) v.html = `<input type="text" value="${v.text}"></input>`;
    if (v.label && !v.checkbox) v.html = `<label>${v.label}</label>`;
    if (v.checkbox)
      v.html = `<label for="${v.checkbox}">${v.label}</label><input type="checkbox" id="${v.checkbox}" />`;

    const el = div.lastElementChild;
    el.insertAdjacentHTML("beforeend", v.html);
    if (v.func) v.func(el.lastElementChild);
  }
}
