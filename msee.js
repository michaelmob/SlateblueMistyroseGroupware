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
