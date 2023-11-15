(function () {
  function extractLinks() {
    const links = [];
    const currentUrl = window.location.href;

    function dfs(node) {
      if (node.tagName === "A") {
        const href = node.getAttribute("href");
        const label = node.textContent.trim();
        const isCurrent = href === currentUrl;

        links.push({ href, label, current: isCurrent });
      }

      Array.from(node.children).forEach((child) => dfs(child));
    }

    const rootUl = document.querySelector(
      ".Layout.Navigation__itemList.Theme-Navigation-ItemList"
    );
    dfs(rootUl);

    return links;
  }

  function fetchSrcset(url) {
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const imageElement = doc.querySelector(
          ".Theme-TitleSection .Theme-BackgroundImage .Theme-Item-InstantImage source"
        );
        const srcset = imageElement
          ? imageElement.getAttribute("srcset")
          : null;
        console.log(srcset);
        return srcset;
      })
      .catch((error) => {
        console.error("Error fetching srcset:", error);
        return null;
      });
  }

  function createImageElement(srcset) {
    const imgDiv = document.createElement("div");
    imgDiv.classList.add("image_div");

    const img = new Image();
    img.srcset = srcset;

    img.onload = () => {
      imgDiv.style.opacity = "1";
    };

    imgDiv.appendChild(img);
    return imgDiv;
  }

  function createButtonWithImage(text, url, isPrevious) {
    const buttonContainer = document.createElement("div");
    const button = document.createElement("div");
    const arrow = document.createElement("div");
    buttonContainer.classList.add("button_container");
    button.classList.add("button");
    arrow.classList.add("arrow");
    arrow.innerHTML = isPrevious ? "&#8592;" : "&#8594;";
    button.textContent = text;

    buttonContainer.appendChild(button);
    buttonContainer.appendChild(arrow);

    buttonContainer.addEventListener("click", () => {
      if (url) window.location.href = url;
    });

    if (url) {
      fetchSrcset(url).then((srcset) => {
        if (srcset) {
          const imgDiv = createImageElement(srcset);
          buttonContainer.appendChild(imgDiv);
        }
      });
    }

    return buttonContainer;
  }

  function renderCustomNavigation(links) {
    const currentIndex = links.findIndex((link) => link.current);

    const navContainer = document.createElement("div");
    navContainer.classList.add("nav_container");

    const prevUrl = currentIndex > 0 ? links[currentIndex - 1].href : null;
    const prevText = currentIndex > 0 ? links[currentIndex - 1].label : null;

    const prevButton = createButtonWithImage(prevText, prevUrl, true);
    navContainer.appendChild(prevButton);

    const nextUrl =
      currentIndex < links.length - 1 ? links[currentIndex + 1].href : null;
    const nextText =
      currentIndex < links.length - 1 ? links[currentIndex + 1].label : null;

    const nextButton = createButtonWithImage(nextText, nextUrl);
    navContainer.appendChild(nextButton);

    document.body.appendChild(navContainer);
  }

  const links = extractLinks();
  renderCustomNavigation(links);
})();
