let canvasOutput;
let images = [];
let imagePositionsArr = [];
let imageAnglesArr = [];
let currentImageIndex = -1;

function onOpenCvReady() {
    cv['onRuntimeInitialized'] = () => {
        canvasOutput = new cv.Mat();
        document.getElementById('fileInput').addEventListener('change', handleFileSelect, false);
        document.getElementById('rotateLeft').addEventListener('click', () => rotateImage("Left"), false);
        document.getElementById('rotateRight').addEventListener('click', () => rotateImage("Right"), false);
  
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

        ctx.save();

        // Translate to the center of the image
        ctx.translate(x + imageSize / 2, y + imageSize / 2);

        ctx.rotate((angle * Math.PI) / 180); // Convert angle to radians and apply rotation

        ctx.drawImage(img, -imageSize / 2, -imageSize / 2, imageSize, imageSize);

        ctx.restore();
    });
}


function rotateImage(direction) {
    console.log(direction, 'rotateImage called');
    const angle = parseFloat(document.getElementById('angleInput').value) || 45;
    if (direction === "Right"){
        imageAnglesArr[currentImageIndex] += angle;
    }

    if (direction === "Left"){
        imageAnglesArr[currentImageIndex] -= angle;
    }
    console.log(direction, 'Rotate called with angle:', angle);
    console.log('New angle for image', currentImageIndex, ':', imageAnglesArr[currentImageIndex]);
    drawImages();
}
