/*! For license information please see background.js.LICENSE.txt */
(()=>{function t(){"use strict";t=function(){return n};var e,n={},o=Object.prototype,i=o.hasOwnProperty,a=Object.defineProperty||function(t,e,r){t[e]=r.value},c="function"==typeof Symbol?Symbol:{},s=c.iterator||"@@iterator",u=c.asyncIterator||"@@asyncIterator",l=c.toStringTag||"@@toStringTag";function f(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{f({},"")}catch(e){f=function(t,e,r){return t[e]=r}}function h(t,e,r,n){var o=e&&e.prototype instanceof b?e:b,i=Object.create(o.prototype),c=new I(n||[]);return a(i,"_invoke",{value:k(t,r,c)}),i}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(t){return{type:"throw",arg:t}}}n.wrap=h;var v="suspendedStart",y="suspendedYield",m="executing",g="completed",d={};function b(){}function w(){}function O(){}var x={};f(x,s,(function(){return this}));var j=Object.getPrototypeOf,S=j&&j(j(M([])));S&&S!==o&&i.call(S,s)&&(x=S);var L=O.prototype=b.prototype=Object.create(x);function P(t){["next","throw","return"].forEach((function(e){f(t,e,(function(t){return this._invoke(e,t)}))}))}function E(t,e){function n(o,a,c,s){var u=p(t[o],t,a);if("throw"!==u.type){var l=u.arg,f=l.value;return f&&"object"==r(f)&&i.call(f,"__await")?e.resolve(f.__await).then((function(t){n("next",t,c,s)}),(function(t){n("throw",t,c,s)})):e.resolve(f).then((function(t){l.value=t,c(l)}),(function(t){return n("throw",t,c,s)}))}s(u.arg)}var o;a(this,"_invoke",{value:function(t,r){function i(){return new e((function(e,o){n(t,r,e,o)}))}return o=o?o.then(i,i):i()}})}function k(t,r,n){var o=v;return function(i,a){if(o===m)throw Error("Generator is already running");if(o===g){if("throw"===i)throw a;return{value:e,done:!0}}for(n.method=i,n.arg=a;;){var c=n.delegate;if(c){var s=T(c,n);if(s){if(s===d)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(o===v)throw o=g,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o=m;var u=p(t,r,n);if("normal"===u.type){if(o=n.done?g:y,u.arg===d)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(o=g,n.method="throw",n.arg=u.arg)}}}function T(t,r){var n=r.method,o=t.iterator[n];if(o===e)return r.delegate=null,"throw"===n&&t.iterator.return&&(r.method="return",r.arg=e,T(t,r),"throw"===r.method)||"return"!==n&&(r.method="throw",r.arg=new TypeError("The iterator does not provide a '"+n+"' method")),d;var i=p(o,t.iterator,r.arg);if("throw"===i.type)return r.method="throw",r.arg=i.arg,r.delegate=null,d;var a=i.arg;return a?a.done?(r[t.resultName]=a.value,r.next=t.nextLoc,"return"!==r.method&&(r.method="next",r.arg=e),r.delegate=null,d):a:(r.method="throw",r.arg=new TypeError("iterator result is not an object"),r.delegate=null,d)}function N(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function _(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function I(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(N,this),this.reset(!0)}function M(t){if(t||""===t){var n=t[s];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,a=function r(){for(;++o<t.length;)if(i.call(t,o))return r.value=t[o],r.done=!1,r;return r.value=e,r.done=!0,r};return a.next=a}}throw new TypeError(r(t)+" is not iterable")}return w.prototype=O,a(L,"constructor",{value:O,configurable:!0}),a(O,"constructor",{value:w,configurable:!0}),w.displayName=f(O,l,"GeneratorFunction"),n.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===w||"GeneratorFunction"===(e.displayName||e.name))},n.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,O):(t.__proto__=O,f(t,l,"GeneratorFunction")),t.prototype=Object.create(L),t},n.awrap=function(t){return{__await:t}},P(E.prototype),f(E.prototype,u,(function(){return this})),n.AsyncIterator=E,n.async=function(t,e,r,o,i){void 0===i&&(i=Promise);var a=new E(h(t,e,r,o),i);return n.isGeneratorFunction(e)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},P(L),f(L,l,"Generator"),f(L,s,(function(){return this})),f(L,"toString",(function(){return"[object Generator]"})),n.keys=function(t){var e=Object(t),r=[];for(var n in e)r.push(n);return r.reverse(),function t(){for(;r.length;){var n=r.pop();if(n in e)return t.value=n,t.done=!1,t}return t.done=!0,t}},n.values=M,I.prototype={constructor:I,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=e,this.done=!1,this.delegate=null,this.method="next",this.arg=e,this.tryEntries.forEach(_),!t)for(var r in this)"t"===r.charAt(0)&&i.call(this,r)&&!isNaN(+r.slice(1))&&(this[r]=e)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var r=this;function n(n,o){return c.type="throw",c.arg=t,r.next=n,o&&(r.method="next",r.arg=e),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],c=a.completion;if("root"===a.tryLoc)return n("end");if(a.tryLoc<=this.prev){var s=i.call(a,"catchLoc"),u=i.call(a,"finallyLoc");if(s&&u){if(this.prev<a.catchLoc)return n(a.catchLoc,!0);if(this.prev<a.finallyLoc)return n(a.finallyLoc)}else if(s){if(this.prev<a.catchLoc)return n(a.catchLoc,!0)}else{if(!u)throw Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return n(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var n=this.tryEntries[r];if(n.tryLoc<=this.prev&&i.call(n,"finallyLoc")&&this.prev<n.finallyLoc){var o=n;break}}o&&("break"===t||"continue"===t)&&o.tryLoc<=e&&e<=o.finallyLoc&&(o=null);var a=o?o.completion:{};return a.type=t,a.arg=e,o?(this.method="next",this.next=o.finallyLoc,d):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),d},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),_(r),d}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var n=r.completion;if("throw"===n.type){var o=n.arg;_(r)}return o}}throw Error("illegal catch attempt")},delegateYield:function(t,r,n){return this.delegate={iterator:M(t),resultName:r,nextLoc:n},"next"===this.method&&(this.arg=e),d}},n}function e(t,e,r,n,o,i,a){try{var c=t[i](a),s=c.value}catch(t){return void r(t)}c.done?e(s):Promise.resolve(s).then(n,o)}function r(t){return r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r(t)}function n(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,n)}return r}function o(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{};e%2?n(Object(o),!0).forEach((function(e){var n,i,a,c;n=t,i=e,a=o[e],c=function(t,e){if("object"!=r(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var o=n.call(t,"string");if("object"!=r(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(i),(i="symbol"==r(c)?c:c+"")in n?Object.defineProperty(n,i,{value:a,enumerable:!0,configurable:!0,writable:!0}):n[i]=a})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):n(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}var i="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuaXJ1ZGhqb3NoaTI4NUBnbWFpbC5jb20iLCJpYXQiOjE3MjE0NzUyMzMsImV4cCI6MTcyMTUxODQzM30.WTsWS0O8TjjJK90VT41mfp9kg-sNXqkAhS8NdHFkQNg";function a(t){console.log("creating bug report",t);var e=function(){"use strict";var t={options:[],header:[navigator.platform,navigator.userAgent,navigator.appVersion,navigator.vendor],dataos:[{name:"Windows Phone",value:"Windows Phone",version:"OS"},{name:"Windows",value:"Win",version:"NT"},{name:"iPhone",value:"iPhone",version:"OS"},{name:"iPad",value:"iPad",version:"OS"},{name:"Kindle",value:"Silk",version:"Silk"},{name:"Android",value:"Android",version:"Android"},{name:"PlayBook",value:"PlayBook",version:"OS"},{name:"BlackBerry",value:"BlackBerry",version:"/"},{name:"Macintosh",value:"Mac",version:"OS X"},{name:"Linux",value:"Linux",version:"rv"},{name:"Palm",value:"Palm",version:"PalmOS"}],databrowser:[{name:"Chrome",value:"Chrome",version:"Chrome"},{name:"Firefox",value:"Firefox",version:"Firefox"},{name:"Safari",value:"Safari",version:"Version"},{name:"Internet Explorer",value:"MSIE",version:"MSIE"},{name:"Opera",value:"Opera",version:"Opera"},{name:"BlackBerry",value:"CLDC",version:"CLDC"},{name:"Mozilla",value:"Mozilla",version:"Mozilla"}],init:function(){var t=this.header.join(" ");return{os:this.matchItem(t,this.dataos),browser:this.matchItem(t,this.databrowser)}},matchItem:function(t,e){var r,n,o,i=0,a=0;for(i=0;i<e.length;i+=1)if(new RegExp(e[i].value,"i").test(t)){if(r=new RegExp(e[i].version+"[- /:;]([\\d._]+)","i"),o="",(n=t.match(r))&&n[1]&&(n=n[1]),n)for(n=n.toString().split(/[._]+/),a=0;a<n.length;a+=1)o+=0===a?n[a]+".":n[a];else o="0";return{name:e[i].name,version:parseFloat(o)}}return{name:"unknown",version:0}}}.init(),e={os:t.os.name,osVersion:t.os.version,browser:t.browser.name,browserVersion:t.browser.version,userAgent:navigator.userAgent,appVersion:navigator.appVersion,platform:navigator.platform,vendor:navigator.vendor};return console.log("System Data",e),e}(),r={name:"New Bug Report #"+Math.floor(1e3*Math.random()),systemData:e};fetch("http://localhost:7001/api/flag",{method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(i)},body:JSON.stringify(o({},r))}).then((function(t){return t.json()})).then((function(e){console.log("bug report created data",e),c(e.id,t)})).catch((function(t){console.log("error",t)}))}var c=function(t,e){var n=new FormData,o=function(t,e){for(var r,n=t.split(","),o=(null===(r=n[0].match(/:(.*?);/))||void 0===r?void 0:r[1])||"",i=atob(n[n.length-1]),a=i.length,c=new Uint8Array(a);a--;)c[a]=i.charCodeAt(a);return new File([c],"screenshot.png",{type:o})}(e);n.append("document",o),console.log("uploading document",t,n,e,o,r(o)),fetch("http://localhost:7001/api/flag/uploadDocument/".concat(t),{method:"POST",headers:{Authorization:"Bearer ".concat(i)},body:n}).then((function(t){return t.json()})).then((function(t){console.log("Upload successful",t),chrome.runtime.sendMessage({type:"remove_iframe"})})).catch((function(t){console.log("Upload failed",t)}))};chrome.runtime.onMessage.addListener((function(r,n,o){if(console.log("Taking screenshot message recieved",r),"take_screenshot"===r.type&&null!=r.x&&null!=r.y&&r.width&&r.height)console.log("Taking Process",r),chrome.tabs.captureVisibleTab(null,{format:"png"},(function(t){console.log("Resp sent Nia",r,t),a(t)}));else if("upload_document"===r.type&&r.blob)console.log("upload_document",r),a(r.blob);else if("login"==r.type&&r.email&&r.password){console.log("Login Process",r);var i=r.email,c=r.password;fetch("http://localhost:7001/api/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:i,password:c})}).then((function(t){return t.json()})).then(function(){var r,n=(r=t().mark((function e(r){return t().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!r.error){t.next=4;break}o({error:r.error}),t.next=10;break;case 4:return console.log("Login successful",r),o({success:!0,data:r}),t.next=8,chrome.storage.local.set({token:r.token.toString()});case 8:return t.next=10,chrome.storage.local.set({user:JSON.stringify(r)});case 10:case"end":return t.stop()}}),e)})),function(){var t=this,n=arguments;return new Promise((function(o,i){var a=r.apply(t,n);function c(t){e(a,o,i,c,s,"next",t)}function s(t){e(a,o,i,c,s,"throw",t)}c(void 0)}))});return function(t){return n.apply(this,arguments)}}()).catch((function(t){console.log("login error",t)}))}return!0}))})();