import t from"./browser";import e from"./domObjects";import*as o from"./domUtils";import n from"./hypot";import r from"./is";import i from"./pointerExtend";export function copyCoords(t,e){t.page=t.page||{},t.page.x=e.page.x,t.page.y=e.page.y,t.client=t.client||{},t.client.x=e.client.x,t.client.y=e.client.y,t.timeStamp=e.timeStamp}export function setCoordDeltas(t,e,o){t.page.x=o.page.x-e.page.x,t.page.y=o.page.y-e.page.y,t.client.x=o.client.x-e.client.x,t.client.y=o.client.y-e.client.y,t.timeStamp=o.timeStamp-e.timeStamp}export function setCoordVelocity(t,e){const o=Math.max(e.timeStamp/1e3,.001);t.page.x=e.page.x/o,t.page.y=e.page.y/o,t.client.x=e.client.x/o,t.client.y=e.client.y/o,t.timeStamp=o}export function setZeroCoords(t){t.page.x=0,t.page.y=0,t.client.x=0,t.client.y=0}export function isNativePointer(t){return t instanceof e.Event||t instanceof e.Touch}export function getXY(t,e,o){return t=t||"page",(o=o||{}).x=e[t+"X"],o.y=e[t+"Y"],o}export function getPageXY(e,o){return o=o||{x:0,y:0},t.isOperaMobile&&isNativePointer(e)?(getXY("screen",e,o),o.x+=window.scrollX,o.y+=window.scrollY):getXY("page",e,o),o}export function getClientXY(e,o){return o=o||{},t.isOperaMobile&&isNativePointer(e)?getXY("screen",e,o):getXY("client",e,o),o}export function getPointerId(t){return r.number(t.pointerId)?t.pointerId:t.identifier}export function setCoords(t,e,o){const n=e.length>1?pointerAverage(e):e[0];getPageXY(n,t.page),getClientXY(n,t.client),t.timeStamp=o}export function getTouchPair(t){const e=[];return r.array(t)?(e[0]=t[0],e[1]=t[1]):"touchend"===t.type?1===t.touches.length?(e[0]=t.touches[0],e[1]=t.changedTouches[0]):0===t.touches.length&&(e[0]=t.changedTouches[0],e[1]=t.changedTouches[1]):(e[0]=t.touches[0],e[1]=t.touches[1]),e}export function pointerAverage(t){const e={pageX:0,pageY:0,clientX:0,clientY:0,screenX:0,screenY:0};for(const o of t)for(const t in e)e[t]+=o[t];for(const o in e)e[o]/=t.length;return e}export function touchBBox(t){if(!t.length)return null;const e=getTouchPair(t),o=Math.min(e[0].pageX,e[1].pageX),n=Math.min(e[0].pageY,e[1].pageY),r=Math.max(e[0].pageX,e[1].pageX),i=Math.max(e[0].pageY,e[1].pageY);return{x:o,y:n,left:o,top:n,right:r,bottom:i,width:r-o,height:i-n}}export function touchDistance(t,e){const o=e+"X",r=e+"Y",i=getTouchPair(t),c=i[0][o]-i[1][o],p=i[0][r]-i[1][r];return n(c,p)}export function touchAngle(t,e){const o=e+"X",n=e+"Y",r=getTouchPair(t),i=r[1][o]-r[0][o],c=r[1][n]-r[0][n];return 180*Math.atan2(c,i)/Math.PI}export function getPointerType(t){return r.string(t.pointerType)?t.pointerType:r.number(t.pointerType)?[void 0,void 0,"touch","pen","mouse"][t.pointerType]:/touch/.test(t.type||"")||t instanceof e.Touch?"touch":"mouse"}export function getEventTargets(t){const e=r.func(t.composedPath)?t.composedPath():t.path;return[o.getActualElement(e?e[0]:t.target),o.getActualElement(t.currentTarget)]}export function newCoords(){return{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0}}export function coordsToEvent(t){return{coords:t,get page(){return this.coords.page},get client(){return this.coords.client},get timeStamp(){return this.coords.timeStamp},get pageX(){return this.coords.page.x},get pageY(){return this.coords.page.y},get clientX(){return this.coords.client.x},get clientY(){return this.coords.client.y},get pointerId(){return this.coords.pointerId},get target(){return this.coords.target},get type(){return this.coords.type},get pointerType(){return this.coords.pointerType},get buttons(){return this.coords.buttons},preventDefault(){}}}export{i as pointerExtend};
//# sourceMappingURL=pointerUtils.prod.js.map