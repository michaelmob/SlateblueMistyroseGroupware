// ==UserScript==
// @name        Mike's Search Engine Enhancements
// @namespace   Violentmonkey Scripts
// @match       https://www.google.com/*
// @match       https://search.brave.com/*
// @grant       none
// @version     0.2
// @author      https://github.com/michaelmob
// @description 5/10/2024, 10:58:58 PM
// @updateURL   https://github.com/michaelmob/SlateblueMistyroseGroupware/raw/main/dist/msee.user.js
// ==/UserScript==
/**
 * MTK 0.2
 * Mike's Toolkit for Quick UI
 */
function createMikesToolkitWindow(title, components) {
  const pos = (localStorage.getItem("mtk-pos") || "5,10").split(",");
  const opacity = localStorage.getItem("mtk-o") || "0.8";
  const html = `
<style>
@keyframes fade-in { 0% { opacity: 0 } 100% { opacity: ${opacity} } }

#mikes-toolkit {
  z-index: 99999;
  position: fixed;
  background: #C0C0C0;
  color: #000;
  user-select: none;
  border: 1px solid #000000;
  box-shadow: 10px 10px #000000;
  font-family: 'MS Sans Serif', sans-serif;
  font-size: 12px;
  cursor: default;
  min-width: 125px;
  animation: fade-in 0.5s;
  opacity: ${opacity};
  left: ${pos[0] || "5"}%;
  top: ${pos[1] || "15"}%;
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
  flex-direction: column;
  justify-content: space-between;
  gap: 5px;
}

#mikes-toolkit checkbox {
  all: unset;
}

#mikes-toolkit label {
  display: flex;
  justify-content: center;
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

  let [x, y, mousedown] = [0, 0, false];
  div.onmouseup = () => {
    mousedown = false;
    const wx = (parseInt(div.style.left) / window.innerWidth) * 100;
    const wy = (parseInt(div.style.top) / window.innerHeight) * 100;
    localStorage.setItem("mtk-pos", `${wx},${wy}`);
  };

  const titleBar = div.firstElementChild;
  titleBar.onmousedown = (e) => {
    if (e.target.value) return;
    mousedown = true;
    x = div.offsetLeft - e.clientX;
    y = div.offsetTop - e.clientY;
  };

  titleBar.onwheel = (e) => {
    e.preventDefault();
    const incr = e.deltaY > 0 ? -0.2 : 0.2;
    const opacity = parseFloat(div.style.opacity) || 1;
    div.style.opacity = Math.min(1, Math.max(0.2, opacity + incr));
    localStorage.setItem("mtk-o", div.style.opacity);
  };

  document.onmousemove = (e) => {
    if (!mousedown) return;
    e.preventDefault();
    div.style.left = x + e.clientX + "px";
    div.style.top = y + e.clientY + "px";
  };

  for (let [, v] of Object.entries(components)) {
    if (v.button) v.html = `<button>${v.button}</button>`;
    if (v.text) v.html = `<input type="text" value="${v.text}" />`;
    if (v.label && !v.checkbox) v.html = `<label>${v.label}</label>`;
    if (v.checkbox)
      v.html = `<label for="${v.checkbox}">${v.label} <input type="checkbox" id="${v.checkbox}" /></label>`;

    const el = div.lastElementChild;
    el.insertAdjacentHTML("beforeend", v.html);
    if (v.func) v.func(el.lastElementChild);
  }
}
/**
 * MSEE 0.1
 * Mike's Search Engine Enhancements
 */
const searchBox = document.querySelector(
  "textarea[spellcheck=false],input[spellcheck=false]",
);

function submitForm() {
  if (document.getElementById("autosubmit").checked)
    searchBox.closest("form")?.submit();
}

function onSearchChange(event, func) {
  searchBox.addEventListener(event, func);
  searchBox.dispatchEvent(new Event(event));
}

function toggleSubstr(el, insert, on, off) {
  if (typeof off == "undefined") off = el.textContent;

  onSearchChange("change", function () {
    el.textContent = searchBox.value.includes(insert) ? on : off;
  });

  el.onclick = function () {
    let value = searchBox.value.trim();

    if (value.includes(insert)) {
      value = value.replace(insert, "");
    } else {
      const sp = insert.split(":");
      if (sp.length > 1)
        value = value.replace(RegExp(sp[0] + "(:.*?)?(\\s|$)", "g"), "");
      value += " " + insert;
    }

    searchBox.value = value.replace("  ", " ").trim();
    searchBox.dispatchEvent(new Event("change"));

    submitForm();
  };
}

const components = {};

// Brave Search Bangs
if (window.location.hostname === "search.brave.com") {
  components["braveGoogle"] = {
    button: "!g",
    func: (el) => toggleSubstr(el, "!g", "-!g"),
  };

  components["braveRYM"] = {
    button: "!rym",
    func: (el) => toggleSubstr(el, "!rym", "-!rym"),
  };
}

// Site Operators
components["reddit"] = {
  button: "reddit",
  func: (el) => toggleSubstr(el, "site:reddit.com", "-reddit"),
};

components["rateYourMusic"] = {
  button: "rym",
  func: (el) => toggleSubstr(el, "site:rateyourmusic.com", "-rym"),
};

// Date Operators
const monthsAgo = (m = 1) =>
  new Date(new Date().setMonth(new Date().getMonth() - m))
    .toJSON()
    .slice(0, 10);
components["year"] = {
  button: "year",
  func: (el) => toggleSubstr(el, "after:" + monthsAgo(12), "-year"),
};

components["halfyear"] = {
  button: "6 months",
  func: (el) => toggleSubstr(el, "after:" + monthsAgo(6), "-6 months"),
};

components["month"] = {
  button: "month",
  func: (el) => toggleSubstr(el, "after:" + monthsAgo(1), "-month"),
};

// Filetype Operators
components["pdf"] = {
  button: "pdf",
  func: (el) => toggleSubstr(el, "filetype:pdf", "-pdf"),
};

// Misc.
components["autosubmit"] = {
  checkbox: "autosubmit",
  label: "Submit",
  func: (el) => {
    el.lastElementChild.checked = true;
  },
};

createMikesToolkitWindow("MSEE", components);
