var selectedBackpack = 0;
var selectedBack = 0;

var paddingTopDesktop = 140;
var paddingRightDesktop = 120;
var paddingBottomDesktop = 220;
var paddingLeftDesktop = 370;

var paddingTopMobile = 150;
var paddingRightMobile = 80;
var paddingBottomMobile = 140;
var paddingLeftMobile = 80;

var arrowPadding = 20;

var canvasWidth = 1024;
var canvasHeight = 1024;

var isMobile = window.innerWidth < 960;

if (isMobile) {
  document.body.classList.add("mobile");
}

var theImage = document.getElementById("the-image");
var theImageHD = document.getElementById("the-image-hd");
var theDownloadedImage = document.getElementById("the-downloaded-image");

var widthInput = document.getElementById("width-input");
var heightInput = document.getElementById("height-input");

widthInput.addEventListener("blur", (e) => {
  canvasWidth = e.target.value;
  updateImageSize();
});
heightInput.addEventListener("blur", (e) => {
  canvasHeight = e.target.value;
  updateImageSize();
});
var onEnterKey = (e) => {
  if (e.keyCode === 13) {
    e.target.blur();
  }
};
widthInput.addEventListener("keypress", onEnterKey);
heightInput.addEventListener("keypress", onEnterKey);

updateImageSize();

renderBackPackList();
renderBackList();
updateActiveItems();

document.querySelectorAll(".menu-trigger").forEach((elem) => {
  elem.addEventListener("click", (e) => {
    var menu = e.target.parentElement.querySelector(".menu");
    menu.style.display = "block";
    setTimeout(() => {
      var hideMenu = (e) => {
        menu.style.display = "none";
        document.removeEventListener("click", hideMenu);
      };
      document.addEventListener("click", hideMenu);
    }, 100);
  });
});

document.getElementById("dimensions-menu").addEventListener("click", (e) => {
  canvasWidth = parseInt(e.target.dataset.width);
  widthInput.value = canvasWidth;
  canvasHeight = parseInt(e.target.dataset.height);
  heightInput.value = canvasHeight;
  updateImageSize();
});

document.getElementById("license-button").addEventListener("click", () => {
  document.getElementById("modal").style.display = "flex";
});

document.getElementById("modal").addEventListener("click", () => {
  document.getElementById("modal").style.display = "none";
});

document.getElementById("download-button").addEventListener("click", () => {
  html2canvas(theDownloadedImage).then((canvas) => {
    var imageDataURL = canvas.toDataURL("image/png");
    downloadFromDataURL("download.png", imageDataURL);
  });
});

document.getElementById("back-packs").addEventListener("click", (e) => {
  if (!e.target.classList.contains("back-pack-wrapper")) {
    return;
  }
  selectedBackpack = Array.prototype.indexOf.call(
    e.target.parentElement.children,
    e.target
  );
  selectedBack = 0;
  renderBackList();
  updateActiveItems();
});

document.getElementById("backs").addEventListener("click", (e) => {
  if (!e.target.classList.contains("back-thumb")) {
    return;
  }
  selectedBack = Array.prototype.indexOf.call(
    e.target.parentElement.children,
    e.target
  );
  updateActiveItems();
});

document.getElementById("arrow-right").addEventListener("click", (e) => {
  selectedBack++;
  if (selectedBack > window.sources[selectedBackpack].files.length - 1) {
    selectedBack = 0;
  }
  updateActiveItems();
});

document.getElementById("arrow-left").addEventListener("click", (e) => {
  selectedBack--;
  if (selectedBack < 0) {
    selectedBack = window.sources[selectedBackpack].files.length - 1;
  }
  updateActiveItems();
});

function renderBackPackList() {
  var backpackList = "";
  window.sources.forEach((source) => {
    backpackList += `
<div class="back-pack-wrapper">
<div class="back-pack">
  <img src="${source.thumb}" loading="lazy" />
</div>
<div class="back-pack"></div>
</div>`;
  });
  document.getElementById("back-packs").innerHTML = backpackList;
}

function renderBackList() {
  var backList = "";
  window.sources[selectedBackpack].files.forEach((file) => {
    backList += `
    <div
    class="back-thumb button"
    style="background-image: url('${file}.jpg');"></div>
  `;
  });
  document.getElementById("backs").innerHTML = backList;
}

function renderTheImage() {
  const file = window.sources[selectedBackpack].files[selectedBack];

  theImage.style.backgroundImage = `url(${file}.jpg)`;
  theImageHD.style.backgroundImage = `url(${file}.png)`;
  theDownloadedImage.style.backgroundImage = `url(${file}.png)`;
}

function updateActiveItems() {
  const activeBackpack = document.querySelector(".back-pack-wrapper.active");
  if (activeBackpack) {
    activeBackpack.classList.remove("active");
  }
  document
    .querySelectorAll(".back-pack-wrapper")
    [selectedBackpack].classList.add("active");

  const activeBack = document.querySelector(".back-thumb.active");
  if (activeBack) {
    activeBack.classList.remove("active");
  }
  document
    .querySelectorAll(".back-thumb")
    [selectedBack].classList.add("active");

  renderTheImage();
}

function updateImageSize() {
  var scaleToFullyFit = getScaleToFullyFit();

  theImage.style.width = `${canvasWidth}px`;
  theImage.style.height = `${canvasHeight}px`;
  theImage.style.transform = `scale(${scaleToFullyFit})`;

  theDownloadedImage.style.width = `${canvasWidth}px`;
  theDownloadedImage.style.height = `${canvasHeight}px`;
  theDownloadedImage.classList.remove("bigger-width", "bigger-height");
  theDownloadedImage.classList.add(
    canvasWidth > canvasHeight ? "bigger-width" : "bigger-height"
  );
}

function getScaleToFullyFit() {
  let canvasMaxWidth =
    window.innerWidth -
    (isMobile
      ? paddingRightMobile + paddingLeftMobile
      : paddingRightDesktop + paddingLeftDesktop);
  let canvasMaxHeight =
    window.innerHeight -
    (isMobile
      ? paddingTopMobile + paddingBottomMobile
      : paddingTopDesktop + paddingBottomDesktop);

  let scaleToFitWidth = 1;
  let scaleToFitHeight = 1;
  if (canvasWidth && canvasWidth > canvasMaxWidth) {
    scaleToFitWidth = canvasMaxWidth / canvasWidth;
  }
  if (canvasHeight && canvasHeight > canvasMaxHeight) {
    scaleToFitHeight = canvasMaxHeight / canvasHeight;
  }
  const scaleToFullyFit = Math.min(scaleToFitWidth, scaleToFitHeight);
  return scaleToFullyFit;
}

function downloadFromDataURL(filename, dataUrl) {
  var element = document.createElement("a");

  var dataBlob = dataURLtoBlob(dataUrl);
  element.setAttribute("href", URL.createObjectURL(dataBlob));
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  var clickHandler;
  element.addEventListener(
    "click",
    (clickHandler = function () {
      // ..and to wait a frame
      requestAnimationFrame(function () {
        URL.revokeObjectURL(element.href);
      });

      element.removeAttribute("href");
      element.removeEventListener("click", clickHandler);
    })
  );

  document.body.removeChild(element);
}

// from Abhinav's answer at  https://stackoverflow.com/questions/37135417/download-canvas-as-png-in-fabric-js-giving-network-error/
function dataURLtoBlob(dataurl) {
  var parts = dataurl.split(","),
    mime = parts[0].match(/:(.*?);/)[1];
  if (parts[0].indexOf("base64") !== -1) {
    var bstr = atob(parts[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
  } else {
    var raw = decodeURIComponent(parts[1]);
    return new Blob([raw], { type: mime });
  }
}
