function handleButtonClick(e, subsequentSections) {
  console.log("handleButtonClick");
  e.preventDefault();

  subsequentSections.forEach(function (subsequentSection) {
    var sectionIsHidden =
      subsequentSection.classList.contains("hidden-section");
    if (sectionIsHidden) {
      subsequentSection.classList.remove("hidden-section");
    } else {
      subsequentSection.classList.add("hidden-section");
    }
  });
}

function initialiseButtonBehaviour(subsequentSections, button) {
  console.log("initialiseButtonBehaviour");
  button.addEventListener("click", function (e) {
    handleButtonClick(e, subsequentSections);
  });
}

function getSubsequentSections(
  themeSections,
  currentSection,
  additionalSectionCount
) {
  console.log("getSubsequentSections");
  var additionalCount = additionalSectionCount;
  var currentId = currentSection.getAttribute("id");
  var subsequentSections = [];

  for (let i = 0; i < themeSections.length; i++) {
    var sectionId = themeSections[i].getAttribute("id");
    if (currentId === sectionId && themeSections[i + 1]) {
      subsequentSections.push(themeSections[i + 1]);

      if (!additionalCount) {
        break;
      } else {
        currentId = themeSections[i + 1].getAttribute("id");
        additionalCount--;
      }
    }
  }

  return subsequentSections;
}

function getCurrentSection(passwordSection) {
  console.log("getCurrentSection");
  var parent = passwordSection.parentNode;

  while (!parent.classList.contains("Theme-Section")) {
    parent = parent.parentNode;
  }

  return parent;
}

function activateButton(themeSections, button) {
  console.log("activateButtons");
  var currentSection = getCurrentSection(button);

  var additionalSectionCount;

  for (var i = 0; i < button.classList.length; ++i) {
    var classname = button.classList[i];
    if (/^next-/.test(classname)) {
      additionalSectionCount = parseInt(classname.replace("next-", ""), 10);
    }
  }

  var subsequentSections = getSubsequentSections(
    themeSections,
    currentSection,
    additionalSectionCount
  );

  if (subsequentSections && subsequentSections.length) {
    subsequentSections.forEach(function (subsequentSection) {
      subsequentSection.classList.add("hidden-section");
    });
    initialiseButtonBehaviour(subsequentSections, button);
  }
}

function activateButtons() {
  console.log("activateButtons");
  var buttons = document.querySelectorAll(".reveal-button");
  var themeSections = document.querySelectorAll(".Theme-Section");

  buttons.forEach(function (button) {
    activateButton(themeSections, button);
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
