var paddingTopDesktop = 140;
var paddingRightDesktop = 70;
var paddingBottomDesktop = 220;
var paddingLeftDesktop = 300;

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
var theDownloadedImage = document.getElementById("the-downloaded-image");

var widthInput = document.getElementById("width-input");
var heightInput = document.getElementById("height-input");

widthInput.addEventListener("blur", (e) => {
  canvasWidth = e.target.value;
  updateImageSizeAndArrows();
});
heightInput.addEventListener("blur", (e) => {
  canvasHeight = e.target.value;
  updateImageSizeAndArrows();
});
var onEnterKey = (e) => {
  if (e.keyCode === 13) {
    e.target.blur();
  }
};
widthInput.addEventListener("keypress", onEnterKey);
heightInput.addEventListener("keypress", onEnterKey);

updateImageSizeAndArrows();

document.querySelectorAll(".menu-trigger").forEach((elem) => {
  elem.addEventListener("click", (e) => {
    var menu = e.target.parentElement.querySelector(".menu");
    menu.style.display = "block";
    setTimeout(() => {
      var hideMenu = (e) => {
        // if (menu.contains(e.target) || menu === e.target) {
        //     return;
        // }
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
  updateImageSizeAndArrows();
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

function updateImageSizeAndArrows() {
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

  var spaceLeftForArrow =
    (window.innerWidth -
      canvasWidth * scaleToFullyFit -
      (isMobile
        ? paddingRightDesktop + paddingLeftDesktop
        : paddingRightMobile + paddingLeftMobile)) /
    2;

  document.getElementById("arrow-left").style.left = `${
    spaceLeftForArrow / 3 +
    (isMobile ? paddingLeftMobile - 10 : paddingLeftDesktop) -
    arrowPadding
  }px`;
  document.getElementById("arrow-right").style.right = `${
    spaceLeftForArrow / 3 +
    (isMobile ? paddingRightMobile - 10 : paddingRightDesktop) -
    arrowPadding
  }px`;
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
