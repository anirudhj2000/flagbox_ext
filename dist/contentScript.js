chrome.runtime.onMessage.addListener((function(e,t,o){var n=document.createElement("div");n.style.position="fixed",n.style.left="0",n.style.top="0",n.style.width="100vw",n.style.height="100vh",n.style.border="1px dashed red",n.style.zIndex="9995",n.style.backgroundColor="transparent",n.style.cursor="crosshair",document.body.appendChild(n);var r=document.createElement("iframe");r.src=chrome.runtime.getURL("buttoncomponent.html"),r.style.position="fixed",r.style.right="0",r.style.bottom="0",r.style.width="100vw",r.style.height="100vh",r.style.border="none",r.style.zIndex="99999",r.style.backgroundColor="transparent",document.body.appendChild(r)}));