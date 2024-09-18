import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const A4_PAPER_DIMENSIONS = {
  width: 210,
  height: 297,
};

const A4_PAPER_RATIO = A4_PAPER_DIMENSIONS.width / A4_PAPER_DIMENSIONS.height;

const imageDimensionsOnA4 = (dimensions) => {
  const isLandscapeImage = dimensions.width >= dimensions.height;

  // If the image is in landscape, the full width of A4 is used.
  if (isLandscapeImage) {
    return {
      width: A4_PAPER_DIMENSIONS.width,
      height:
        A4_PAPER_DIMENSIONS.width / (dimensions.width / dimensions.height),
    };
  }

  // If the image is in portrait and the full height of A4 would skew
  // the image ratio, we scale the image dimensions.
  const imageRatio = dimensions.width / dimensions.height;
  if (imageRatio > A4_PAPER_RATIO) {
    const imageScaleFactor =
      (A4_PAPER_RATIO * dimensions.height) / dimensions.width;

    const scaledImageHeight = A4_PAPER_DIMENSIONS.height * imageScaleFactor;

    return {
      height: scaledImageHeight,
      width: scaledImageHeight * imageRatio,
    };
  }

  // The full height of A4 can be used without skewing the image ratio.
  return {
    width: A4_PAPER_DIMENSIONS.height / (dimensions.height / dimensions.width),
    height: A4_PAPER_DIMENSIONS.height,
  };
};

const exportAsImage = async (element, imageFileName) => {
  //console.log(element);
  const canvas = await html2canvas(element);
  const image = canvas.toDataURL("image/png", 1.0);

  const newImage = new Image();
  newImage.src = image;
  //console.log(newImage);

  setTimeout(() => {
    // console.log(newImage.width);
    // console.log(newImage.height);

    generatePdf(newImage);
  }, 1000)


  // console.log(newImage);
  // console.log(newImage.width);
  //downloadImage(image, imageFileName);
};


const generatePdf = (image) => {

  const doc = new jsPDF();
  const imageDimensions = imageDimensionsOnA4({
    width: image.width,
    height: image.height,
  });

  //doc.addPage();
  // doc.addImage(
  //   image.src,
  //   image.imageType,
  //   // Images are vertically and horizontally centered on the page.
  //   (A4_PAPER_DIMENSIONS.width - imageDimensions.width) / 2,
  //   (A4_PAPER_DIMENSIONS.height - imageDimensions.height) / 2,
  //   imageDimensions.width,
  //   imageDimensions.height
  // );

  doc.addImage(
    image.src,
    image.imageType,
    // Images are vertically and horizontally centered on the page.
    (A4_PAPER_DIMENSIONS.width - imageDimensions.width) / 2,
    10,
    imageDimensions.width,
    imageDimensions.height
  );



  const pdfURL = doc.output("bloburl");
  window.open(pdfURL, "_blank");


};

const downloadImage = (blob, fileName) => {
  const fakeLink = window.document.createElement("a");
  fakeLink.style = "display:none;";
  fakeLink.download = fileName;
  
  fakeLink.href = blob;
  
  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);
  
  fakeLink.remove();
};

export default exportAsImage;