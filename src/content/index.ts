
// Add a message listener
document.addEventListener('mousedown', startDrawing);
document.addEventListener('mouseup', stopDrawing);

let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;

chrome.runtime.onMessage.addListener(function(message ,sender ,sendResponse){
    // Handle the received message
    console.log('Received message:', message, sender);

    const box = document.createElement("div");
    box.style.position = "fixed";
    box.style.left = `0`;
    box.style.top = `0`;
    box.style.width = `100vw`;
    box.style.height = `100vh`;
    box.style.border = "1px dashed red";
    box.style.zIndex = "1200";
    box.style.backgroundColor = "transparent";
    document.body.appendChild(box);

    document.body.appendChild(box);

    const button = document.createElement("button");
    button.innerText = "Click me";
    button.style.position = "fixed";
    button.style.bottom = "10px";
    button.style.right = "10px";
    button.style.cursor = "pointer";
    button.style.zIndex = "1203";
    document.body.appendChild(button);

    button.addEventListener("click", () => {
        // Call your background function here
        backgroundFunction();
    });

    function backgroundFunction() {
        // Send a message to the background script
        chrome.runtime.sendMessage({ type: "take_screenshot"});
    }
    

    // Add your logic here to handle the message
});

function startDrawing(e: any) {
    if (e.shiftKey) {
        console.log('startDrawing', e);
        startX = e.clientX;
        startY = e.clientY;
        console.log('startDrawing', e, startX, startY)
    }    
}

function stopDrawing(e: any) {
    if (e.shiftKey) {
        console.log('stopDrawing', e);
        endX = e.clientX;
        endY = e.clientY;
        const box = document.createElement("div");
        box.style.position = "fixed";
        box.style.left = startX + 'px';
        box.style.top = startY + 'px';
        box.style.width =   (endX - startX) + 'px';
        box.style.height = (endY - startY) + 'px';
        box.style.border = "1px dashed yellow";
        box.style.zIndex = "1202";
        box.style.backgroundColor = "transparent";
        document.body.appendChild(box);
        console.log('stopDrawing', e, box)
    }
}