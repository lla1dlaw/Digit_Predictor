// Author: Liam Laidlaw
// Filename: index.js
// Date: 03/17/2024
// Purpose: Allows user to draw on included canvas element
// Note: This is an introductory javascript project; comments may be verbose/redundant and are intended to emphasize understanding of functionality
//       rather than to serve as pure documentation.


// make sure window is loaded
window.addEventListener('load', () => {
    resize();
    window.addEventListener('resize', resize);
});

// -------------------------vars & objects----------------------

let mouseCoordinates = {x:0, y:0};
let draw = false; // draw lines to canvas

const canvas = document.querySelector('#canvas');
const context = canvas.getContext('2d', { willReadFrequently: true }); // context for 2d canvas operations
const clearButton = document.querySelector('#clear-button');
const predictButton = document.querySelector('#predict-button');

let canvasData;
let grayScaleImage;
let imageObject;
let reconnecting = false;
let serverReconnectDelay = 1000;
let savedWidth;
let savedHeight;

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', drawCanvas);
clearButton.addEventListener('click', clearCanvas);
predictButton.addEventListener('click', () => {
    canvasData = context.getImageData(0, 0, canvas.width, canvas.height).data;
    console.log(canvasData);
    grayScaleImage = processImageVector(canvasData);
    imageObject = {"vector": grayScaleImage, "width": canvas.width, "height": canvas.height};
    console.log(imageObject);
    sendImageVector(JSON.stringify(imageObject));
});

// let hostname = window.location.hostname;
let hostname = "localhost";
let url = `ws://${hostname}:8002`;
let websocket = new WebSocket(url);

websocket.addEventListener("open", () => {
    console.log("Connection to server established.");
    reconnecting = false;
});

websocket.addEventListener("close", () => {
    console.log("Connection to server closed.");
    // if (!reconnecting) {
    //     attemptReconnection();
    // }
});

websocket.addEventListener("message", (event) => {
    printIncommingMessage(event.data);
});

//connectWebSocket(); // establish initial connection to server

// ------------- functions --------------

function connectWebSocket() {
    // re-create websocket
    websocket = new WebSocket(url);
}

// async function attemptReconnection() {
//     reconnecting = true;
//     console.log("Attempting to reconnect...");
//     while (websocket.readyState != WebSocket.OPEN && websocket.readyState != WebSocket.CONNECTING) {
//         try{
//             connectWebSocket(); // attempt to re-establish connection
//             await new Promise(resolve => setTimeout(resolve, serverReconnectDelay));
//         } catch (error) {
//             console.log("Error: " + error);
//         }
//     }
//     reconnecting = false;
// }

function printIncommingMessage(data) {
    const message = JSON.parse(data);
    console.log(message);
}


function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    initCanvas();
}

function initCanvas() {
    context.fillStyle = '#FFFFFF';
    context.fill();
}


// Ensure relative canvas size
function resize() {
    const savedCanvas = document.createElement('canvas');
    const savedContext = savedCanvas.getContext('2d');
    savedCanvas.width = canvas.width;
    savedCanvas.height = canvas.height;

    // Save the current canvas content
    savedContext.drawImage(canvas, 0, 0);

    // Resize the canvas
    canvas.width = window.innerHeight * 0.3;
    canvas.height = canvas.width;

    // Restore the saved content
    context.drawImage(savedCanvas, 0, 0, savedCanvas.width, savedCanvas.height, 0, 0, canvas.width, canvas.height);
}


function getMouseCoordinates(mouseEvent) {
    mouseCoordinates.x = mouseEvent.clientX - canvas.offsetLeft;
    mouseCoordinates.y = mouseEvent.clientY - canvas.offsetTop;
}


function startDrawing(mouseEvent) {
    draw = true;
    getMouseCoordinates(mouseEvent);
}


function stopDrawing() {
    draw = false;
}


function drawCanvas(mouseEvent) {
    if (!draw) return;

    initCanvas();
    context.beginPath();
    // ensure that line parameters are correct
    context.lineWidth = context.canvas.width*.10; // line width relative to canvas size
    context.lineCap = 'round';
    context.lineStyle = 'black';

    // draw line
    context.moveTo(mouseCoordinates.x, mouseCoordinates.y);
    getMouseCoordinates(mouseEvent); // update position as cursor moves
    context.lineTo(mouseCoordinates.x, mouseCoordinates.y);
    context.stroke(); // draw the stroke
}


function sendImageVector(message) {
    if (websocket.readyState == 0) {
        console.log("Server not connected at this time.");
    } else {
        websocket.send(message);
    }
    
}

function processImageVector(imageVector) { // removes the rgb values from the image data and returns only the alpha values (0: white - 255: black)
    let processedImageVector = [];
    for (let i = 0; i < imageVector.length; i += 4) {
        processedImageVector.push(imageVector[i + 3]);
    }
    return processedImageVector;
}



