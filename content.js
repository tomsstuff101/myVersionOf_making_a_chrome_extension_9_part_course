/****************************************************
 * NOTE: Cannot use 'import' as Chrome Extensions is ES5 ??
 * Also can't enable nodejs easily, so can't use require commonjs either
 * Re-doing using 'Chrome Extension CLI'
 */

// import Graph from "graphology";
// import Sigma from "sigma";

const head = document.querySelector("head");

const style = document.getElementsByTagName("style")[0];

const originalStyles = style.innerHTML;

const GEFXstyles = `

#sigma-container {
  // width: 100%;
  // height: 100%;
  // margin: 0;
  // padding: 0;
  // overflow: hidden;
}

.hidden {
  display: none !important;
}

.GEXF-wrapper{
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  background-color: #aaaadd;
  // height: 75vh;
  overflow: hidden;
    }

    #wrapper{
      background-color: antiquewhite;
      padding: 3vh;
    }

.canvas {
    width: 90%;
    height: 80%;
    background-color:#dddddd;
    margin-bottom: 50px;
}
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
    margin-left: 90%;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}`;

const body = document.querySelector("body");

style.innerHTML = originalStyles + GEFXstyles;

const theScript = document.querySelector("body > script:nth-child(4)");
const wrapper = document.createElement("div");
wrapper.id = "wrapper";

const GEXFwrapper = document.createElement("div");
GEXFwrapper.id = "GEXFwrapper";

wrapper.appendChild(GEXFwrapper);
body.insertBefore(wrapper, theScript);

// const bundleScript = document.createElement("script");
// bundleScript.src = "build/bundle.js";
// body.insertBefore(bundleScript, theScript);

const fileSelector = document.createElement("input");
fileSelector.id = "file-selector";
fileSelector.type = "file";
fileSelector.setAttribute("multiple", "");

wrapper.appendChild(fileSelector);

const listTitle = document.createElement("h3");
listTitle.textContent = "List of files to display";
listTitle.id = "listTitle";
wrapper.appendChild(listTitle);
const listOfFiles = document.createElement("ul");
listOfFiles.id = "list-of-files";
wrapper.appendChild(listOfFiles);

const theSwitch = document.createElement("label");
theSwitch.className = "switch";
wrapper.appendChild(theSwitch);

const theInput = document.createElement("input");
theInput.type = "checkbox";
theSwitch.appendChild(theInput);

const theSpan = document.createElement("span");

theSpan.className = "slider round";
theSwitch.appendChild(theSpan);

const theTable = document.getElementsByTagName("table")[0];
const theHeading = document.querySelector("#header");
const theDirectory = document.querySelector("#parentDirLinkBox");

theInput.addEventListener("change", () => {
  GEXFwrapper.classList.toggle("GEXF-wrapper");
  theTable.classList.toggle("hidden");
  theHeading.classList.toggle("hidden");
  theDirectory.classList.toggle("hidden");
});

fileSelector.addEventListener("change", (event) => {
  const fileList = event.target.files;
  let filenameArray = [];

  for (let index = 0; index < fileList.length; index++) {
    console.log(fileList[index].name);
    filenameArray.push(fileList[index].name);

    let li = document.createElement("li");
    li.innerText = fileList[index].name;
    listOfFiles.appendChild(li);
  }

  //   console.table(filenameArray);

  chrome.runtime.sendMessage(
    { filenameArray: filenameArray },
    function (responce) {
      console.log(responce.gotList);
    }
  );
});

// SEND a message from the body of the web page to **background.js**
// When comes back from background.js log the responce to the browser console

chrome.runtime.sendMessage(
  { greeting: "hello background, love from Content" },
  function (responce) {
    console.log(responce.farewell);
  }
);

/**********************************************************
 * This is a minimal example of sigma
 ***************************************************************/

//const container = document.getElementById("sigma-container") as HTMLElement;

const graph = new Graph();

graph.addNode("John", { x: 0, y: 10, size: 5, label: "John", color: "blue" });
graph.addNode("Mary", { x: 10, y: 0, size: 3, label: "Mary", color: "red" });

graph.addEdge("John", "Mary");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
//const renderer = new Sigma(graph, container);
const renderer = new Sigma(graph, GEXFwrapper);
