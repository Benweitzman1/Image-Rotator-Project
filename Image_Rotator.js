// let canvasOutput;
// let images = [];
// let imagePositionsArr = [];
// let imageAnglesArr = [];
// let currentImageIndex = -1;

// function onOpenCvReady() {
//     cv['onRuntimeInitialized'] = () => {
//         canvasOutput = new cv.Mat();
//         document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
//         document.getElementById('rotateLeft').addEventListener('click', () => rotateImage("Left"), false);
//         document.getElementById('rotateRight').addEventListener('click', () => rotateImage("Right"), false);
  
//         drawImages();
//     };
// }

// function handleFileSelect(event) {
//     console.log('handleFileSelect called');
//     const files = event.target.files;
//     for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         const reader = new FileReader();
        
//         reader.onload = (e) => {
//             const img = new Image();
//             img.src = e.target.result;;
//             img.onload = () => {
//                 images.push(img);
//                 // For each new image, generate a random position and store it in the imagePositionsArr array
//                 imagePositionsArr.push({
//                     x: getRandomOffset(window.innerWidth - 100),
//                     y: getRandomOffset(window.innerHeight - 100)
//                 });

//                 imageAnglesArr.push(0); // Initialize rotation angle to 0
                
//                 drawImages();

//                 currentImageIndex = images.length - 1; // Set the currentImageIndex to the index of the last added image
//             };
            
//             // Set the image index as an attribute on the image element
//             img.setAttribute('data-index', i);
//         };

//         reader.readAsDataURL(file);
//     }
// }

// function getRandomOffset(maxValue) {
//     return Math.floor(Math.random() * maxValue);
// }

// function drawImages() {
//     console.log('drawImages called');
//     const targetCanvas = document.getElementById('canvasOutput');
//     targetCanvas.width = window.innerWidth;
//     targetCanvas.height = window.innerHeight;

//     const ctx = targetCanvas.getContext('2d');
//     ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

//     images.forEach((img, i) => {
//         const imageSize = 100;
//         const { x, y } = imagePositionsArr[i];
//         const angle = imageAnglesArr[i];

//         ctx.save();

//         // Translate to the center of the image
//         ctx.translate(x + imageSize / 2, y + imageSize / 2);

//         ctx.rotate((angle * Math.PI) / 180); // Convert angle to radians and apply rotation

//         ctx.drawImage(img, -imageSize / 2, -imageSize / 2, imageSize, imageSize);

//         ctx.restore();
//     });
// }


// function rotateImage(direction) {
//     console.log(direction, 'rotateImage called');
//     const angle = parseFloat(document.getElementById('angleInput').value) || 45;
//     if (direction === "Right"){
//         imageAnglesArr[currentImageIndex] += angle;
//     }

//     if (direction === "Left"){
//         imageAnglesArr[currentImageIndex] -= angle;
//     }
//     console.log(direction, 'Rotate called with angle:', angle);
//     console.log('New angle for image', currentImageIndex, ':', imageAnglesArr[currentImageIndex]);
//     drawImages();
// }




let canvasOutput;
let images = [];
let imagePositionsArr = [];
let imageAnglesArr = [];
let imageScalesArr = [];
let imageFiltersArr = [];
let currentImageIndex = -1;

function onOpenCvReady() {
    cv['onRuntimeInitialized'] = () => {
        canvasOutput = new cv.Mat();
        document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
        document.getElementById('rotateLeft').addEventListener('click', () => rotateImage("Left"), false);
        document.getElementById('rotateRight').addEventListener('click', () => rotateImage("Right"), false);
        document.getElementById('scaleInput').addEventListener('input', applyImageScale, false);
        document.getElementById('filterSelect').addEventListener('change', applyImageFilter, false);
        document.getElementById('bringToFront').addEventListener('click', bringImageToFront, false);
        document.getElementById('sendToBack').addEventListener('click', sendImageToBack, false);
        document.getElementById('saveImage').addEventListener('click', saveImage, false);
  
        drawImages();
    };
}

function handleFileSelect(event) {
    console.log('handleFileSelect called');
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target.result;;
            img.onload = () => {
                images.push(img);
                // For each new image, generate a random position and store it in the imagePositionsArr array
                imagePositionsArr.push({
                    x: getRandomOffset(window.innerWidth - 100),
                    y: getRandomOffset(window.innerHeight - 100)
                });
                imageAnglesArr.push(0); // Initialize rotation angle to 0
                imageScalesArr.push(1); // Initialize scale to 1
                imageFiltersArr.push('none'); // Initialize filter to none
                
                drawImages();
                currentImageIndex = images.length - 1; // Set the currentImageIndex to the index of the last added image
            };
            
            // Set the image index as an attribute on the image element
            img.setAttribute('data-index', i);
        };

        reader.readAsDataURL(file);
    }
}

function getRandomOffset(maxValue) {
    return Math.floor(Math.random() * maxValue);
}

function drawImages() {
    console.log('drawImages called');
    const targetCanvas = document.getElementById('canvasOutput');
    targetCanvas.width = window.innerWidth;
    targetCanvas.height = window.innerHeight;

    const ctx = targetCanvas.getContext('2d');
    ctx.clearRect(0, 0, targetCanvas.width, targetCanvas.height);

    images.forEach((img, i) => {
        const imageSize = 100;
        const { x, y } = imagePositionsArr[i];
        const angle = imageAnglesArr[i];
        const scale = imageScalesArr[i];
        const filter = imageFiltersArr[i];

        ctx.save();

        // Translate to the center of the image
        ctx.translate(x + imageSize / 2, y + imageSize / 2);

        ctx.rotate((angle * Math.PI) / 180); // Convert angle to radians and apply rotation
        ctx.scale(scale, scale); // Apply image scaling

        if (filter === 'grayscale') {
            ctx.filter = 'grayscale(100%)';
        } else if (filter === 'sepia') {
            ctx.filter = 'sepia(100%)';
        } else {
            ctx.filter = 'none';
        }

        ctx.drawImage(img, -imageSize / 2, -imageSize / 2, imageSize, imageSize);

        ctx.restore();
    });
}

function rotateImage(direction) {
    console.log(direction, 'rotateImage called');
    const angle = parseFloat(document.getElementById('angleInput').value) || 45;
    if (currentImageIndex >= 0 && currentImageIndex < images.length) {
        if (direction === "Right"){
            imageAnglesArr[currentImageIndex] += angle;
        } else {
            imageAnglesArr[currentImageIndex] -= angle;
        }
        console.log(direction, 'Rotate called with angle:', angle);
        console.log('New angle for image', currentImageIndex, ':', imageAnglesArr[currentImageIndex]);
        drawImages();
    }
}

function applyImageScale() {
    const scale = parseFloat(document.getElementById('scaleInput').value);
    if (currentImageIndex >= 0 && currentImageIndex < images.length) {
        imageScalesArr[currentImageIndex] = scale;
        drawImages();
    }
}

function applyImageFilter() {
    const filter = document.getElementById('filterSelect').value;
    if (currentImageIndex >= 0 && currentImageIndex < images.length) {
        imageFiltersArr[currentImageIndex] = filter;
        drawImages();
    }
}

function bringImageToFront() {
    if (currentImageIndex >= 0 && currentImageIndex < images.length) {
        const currentImage = images[currentImageIndex];
        const currentPosition = imagePositionsArr[currentImageIndex];
        const currentAngle = imageAnglesArr[currentImageIndex];
        const currentScale = imageScalesArr[currentImageIndex];
        const currentFilter = imageFiltersArr[currentImageIndex];
        
        images.splice(currentImageIndex, 1);
        imagePositionsArr.splice(currentImageIndex, 1);
        imageAnglesArr.splice(currentImageIndex, 1);
        imageScalesArr.splice(currentImageIndex, 1);
        imageFiltersArr.splice(currentImageIndex, 1);

        images.push(currentImage);
        imagePositionsArr.push(currentPosition);
        imageAnglesArr.push(currentAngle);
        imageScalesArr.push(currentScale);
        imageFiltersArr.push(currentFilter);

        currentImageIndex = images.length - 1;
        drawImages();
    }
}

function sendImageToBack() {
    if (currentImageIndex >= 0 && currentImageIndex < images.length) {
        const currentImage = images[currentImageIndex];
        const currentPosition = imagePositionsArr[currentImageIndex];
        const currentAngle = imageAnglesArr[currentImageIndex];
        const currentScale = imageScalesArr[currentImageIndex];
        const currentFilter = imageFiltersArr[currentImageIndex];

        images.splice(currentImageIndex, 1);
        imagePositionsArr.splice(currentImageIndex, 1);
        imageAnglesArr.splice(currentImageIndex, 1);
        imageScalesArr.splice(currentImageIndex, 1);
        imageFiltersArr.splice(currentImageIndex, 1);

        images.unshift(currentImage);
        imagePositionsArr.unshift(currentPosition);
        imageAnglesArr.unshift(currentAngle);
        imageScalesArr.unshift(currentScale);
        imageFiltersArr.unshift(currentFilter);

        currentImageIndex = 0;
        drawImages();
    }
}

function saveImage() {
    const targetCanvas = document.getElementById('canvasOutput');
    const image = targetCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'image_rotator_output.png';
    link.click();
}