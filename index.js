var paddingTopDesktop = 140;
var paddingRightDesktop = 70;
var paddingBottomDesktop = 220;
var paddingLeftDesktop = 300;

var arrowPadding = 20;

var canvasWidth = 1024;
var canvasHeight = 1024;

var isMobile = window.innerWidth < 960;

if (isMobile) {
  document.body.classList.add("mobile");
} else {
}

var scaleToFullyFit = getScaleToFullyFit();

var theImage = document.getElementById("the-image");
theImage.style.width = `${canvasWidth}px`;
theImage.style.height = `${canvasHeight}px`;
theImage.style.transform = `scale(${scaleToFullyFit})`;

var spaceLeftForArrow =
  (window.innerWidth -
    canvasWidth * scaleToFullyFit -
    paddingRightDesktop -
    paddingLeftDesktop) /
  2;

document.getElementById("arrow-left").style.left = `${
  spaceLeftForArrow / 3 + paddingLeftDesktop - arrowPadding
}px`;
document.getElementById("arrow-right").style.right = `${
  spaceLeftForArrow / 3 + paddingRightDesktop - arrowPadding
}px`;

function getScaleToFullyFit() {
  let canvasMaxWidth =
    window.innerWidth - paddingRightDesktop - paddingLeftDesktop;
  let canvasMaxHeight =
    window.innerHeight - paddingTopDesktop - paddingBottomDesktop;

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
