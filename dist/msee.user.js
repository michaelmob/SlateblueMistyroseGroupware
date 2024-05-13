// ==UserScript==
// @name        Mike's Search Engine Enhancements
// @namespace   Violentmonkey Scripts
// @match       https://www.google.com/*
// @match       https://search.brave.com/*
// @grant       none
// @version     1.0
// @author      https://github.com/michaelmob
// @description 5/10/2024, 10:58:58 PM
// ==/UserScript==
/**
 * MTK 0.1
 * Mike's Toolkit for Quick UI
 */
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
    if (v.text) v.html = `<input type="text" value="${v.text}" />`;
    if (v.label && !v.checkbox) v.html = `<label>${v.label}</label>`;
    if (v.checkbox)
      v.html = `<label for="${v.checkbox}">${v.label}</label><input type="checkbox" id="${v.checkbox}" />`;

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

// Components
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
  label: "&nbsp;Submit",
  func: (el) => {
    el.checked = true;
  },
};

createMikesToolkitWindow("MSEE", components);
