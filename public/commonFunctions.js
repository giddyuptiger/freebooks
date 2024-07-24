// FREQUENTLY USED FUNCTIONS

let body = document.body;

export function elt(type, props, ...children) {
  let element = document.createElement(type);
  // if (props) Object.assign(element, props);
  if (props && Array.isArray(props)) {
    // let atts = props[1]
    //  let props = props[0]/tera
    for (let att of Object.keys(props[1])) {
      element.setAttribute(att, props[1][att]);
    }
    Object.assign(element, props[0]);
  } else Object.assign(element, props);

  children.forEach((child) => {
    element.appendChild(
      typeof child === "string" ? document.createTextNode(child) : child
    );
  });

  return element;
}

export function div(props, ...children) {
  return elt("div", props, ...children);
}

export function show(element) {
  element.classList.remove("hidden");
  // element.style.display = "block";
}

export function hide(element) {
  element.classList.add("hidden");
  // element.style.display = "none";
}

export function addLoading() {
  let loadingDiv = document.getElementById("load");
  if (loadingDiv) {
    body.append(loadingDiv);
  }
}

export function removeLoading() {
  let loadingDiv = document.getElementById("load");
  if (loadingDiv) {
    loadingDiv.remove();
  }
}

// export
//   const pageElements = document.getElementsByClassName("page");
//   while (pageElements.length > 0) {
//     pageElements[0].remove(); // Remove the first element until the collection is empty
//   }
export function removePages() {
  const childrenArray = Array.from(body.children);
  for (const child of childrenArray) {
    if (child.classList.contains("page")) {
      body.removeChild(child); // Use removeChild for better compatibility
    }
  }
}

//SILLY TESTING THINGS

export function rainbowDivs() {
  const colors = ["#A8E6CF", "#DCEDC1", "#FFD3B6", "#FFAAA5", "#FF8B94"];
  let colorIndex = 0;

  setInterval(() => {
    const divs = document.querySelectorAll("div");
    divs.forEach((div, index) => {
      div.style.border = `5% solid ${
        colors[(index + colorIndex) % colors.length]
      }`;
      //   div.style.backgroundImage = `linear-gradient(to bottom, #FFFFFF 0%, #FFFFFF 100%), linear-gradient(to bottom, ${
      //     colors[(index + colorIndex) % colors.length]
      //   } 0%, ${colors[(index + colorIndex) % colors.length]} 100%)`;
      //   div.style.backgroundClip = "content-box, padding-box";
    });
    colorIndex = (colorIndex + 1) % colors.length;
  }, 500);
}
