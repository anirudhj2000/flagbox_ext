!function(){var e,n=0,o=0,t=0,i=0,l=!1;console.log("Button component loaded"),document.getElementById("main-button");var a=document.getElementById("rollout");null===(e=document.getElementById("main-button"))||void 0===e||e.addEventListener("click",(function(){console.log("abcd",a,null==a?void 0:a.style.animationName),!l&&a?(a.style.animationName="animate",a.style.animationDuration="2s",a.style.transform="translateX(0)"):l&&a&&(a.style.animationName="",a.style.transform="translateX(30vw)"),l=!l})),document.addEventListener("mousedown",(function(e){e.shiftKey&&(console.log("startDrawing",e),n=e.clientX,o=e.clientY,console.log("startDrawing",e,n,o))})),document.addEventListener("mouseup",(function(e){if(e.shiftKey){console.log("stopDrawing",e),t=e.clientX,i=e.clientY;var l=document.createElement("div");l.style.position="fixed",l.style.left=n+"px",l.style.top=o+"px",l.style.width=t-n+"px",l.style.height=i-o+"px",l.style.border="1px dashed #cc6262",l.style.zIndex="1202",l.style.backgroundColor="transparent",document.body.appendChild(l),console.log("stopDrawing",e,l)}}));var d=document.getElementById("capture-image");null==d||d.addEventListener("click",(function e(l){d.removeEventListener("click",e),console.log("capture-image",a),l.preventDefault(),chrome.runtime.sendMessage({type:"take_screenshot",x:0,y:0,width:window.innerWidth,height:window.innerHeight},(function(e){var l,a,d,s,c,r;console.log("called"),console.log("pricess images called",e),e&&e.response&&(l=e.response,a=n,d=o,s=t-n,c=i-o,(r=new Image).src=l,r.onload=function(){console.log("Image loaded with dimensions:",r.width,r.height),console.log("Specified coordinates and dimensions:",a,d,s,c);var e=r.width/window.innerWidth,n=r.height/window.innerHeight,o=a*e,t=d*n,i=s*e,l=c*n;if(console.log("Scaled coordinates and dimensions:",o,t,i,l),o+i>r.width||t+l>r.height)console.error("Specified coordinates and dimensions are out of bounds.");else{var m=document.createElement("canvas");m.width=i,m.height=l;var u=m.getContext("2d");null==u||u.drawImage(r,o,t,i,l,0,0,i,l),m.toBlob((function(e){console.log("blob",e),e&&(console.log("blob and new data url",e),function(e,n){var o=new FileReader;o.onload=function(e){var n;!function(e){console.log("blob and new data url",e),chrome.runtime.sendMessage({type:"upload_document",dataUrl:e})}((null===(n=e.target)||void 0===n||null===(n=n.result)||void 0===n?void 0:n.toString())||"")},o.readAsDataURL(e)}(e))}),"image/jpeg")}})}))}),{once:!0})}();