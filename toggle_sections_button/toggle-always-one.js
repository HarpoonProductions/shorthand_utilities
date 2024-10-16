function handleButtonClick(e, subsequentSections, i) {
  console.log("handleButtonClick");
  e.preventDefault();
  var subsequentSection = subsequentSections[i];
  var sectionIsHidden = subsequentSection.classList.contains("hidden-section");
  if (sectionIsHidden) {
    subsequentSections.forEach(function (section) {
      section.classList.add("hidden-section");
    });
    subsequentSection.classList.remove("hidden-section");
  }
}

function initialiseButtonBehaviour(button, subsequentSections, i) {
  console.log("initialiseButtonBehaviour");
  button.addEventListener("click", function (e) {
    handleButtonClick(e, subsequentSections, i);
  });
}

function activateButton(button, subsequentSections, i) {
  console.log("activateButtons");
  if (subsequentSections[i]) {
    if (i > 0) subsequentSections[i].classList.add("hidden-section");
    initialiseButtonBehaviour(button, subsequentSections, i);
  }
}

function getSubsequentSection(themeSections, currentSection, index) {
  console.log("getSubsequentSection");
  var currentId = currentSection.getAttribute("id");
  var subsequentSection;

  for (let i = 0; i < themeSections.length; i++) {
    var sectionId = themeSections[i].getAttribute("id");
    var newIndex = i + index + 1;
    if (currentId === sectionId && themeSections[newIndex]) {
      subsequentSection = themeSections[newIndex];
      break;
    }
  }

  return subsequentSection;
}

function getCurrentSection(section) {
  console.log("getCurrentSection");
  var parent = section.parentNode;

  while (!parent.classList.contains("Theme-Section")) {
    parent = parent.parentNode;
  }

  return parent;
}

function activateButtons() {
  console.log("activateButtons");
  var buttons = document.querySelectorAll(".reveal-button16, .reveal-button17");
  var themeSections = document.querySelectorAll(".Theme-Section");
  var subsequentSections = [];
  buttons.forEach(function (button, i) {
    var currentSection = getCurrentSection(button);
    subsequentSections.push(
      getSubsequentSection(themeSections, currentSection, i)
    );
  });
  buttons.forEach(function (button, i) {
    activateButton(button, subsequentSections, i);
  });
}

function ready(callback) {
  console.log("ready");
  if (document.readyState !== "loading") {
    callback();
  } else if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    document.attachEvent("onreadystatechange", function () {
      if (document.readyState === "complete") {
        callback();
      }
    });
  }
}

ready(activateButtons);
