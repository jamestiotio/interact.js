import{closest as t,getElementRect as o,parentNode as e}from"./domUtils";import i from"./extend";import r from"./is";export function getStringOptionResult(o,i,r){return"parent"===o?e(r):"self"===o?i.getRect(r):t(r,o)}export function resolveRectLike(t,e,i,n){let h=t;return r.string(h)?h=getStringOptionResult(h,e,i):r.func(h)&&(h=h(...n)),r.element(h)&&(h=o(h)),h}export function rectToXY(t){return t&&{x:"x"in t?t.x:t.left,y:"y"in t?t.y:t.top}}export function xywhToTlbr(t){return!t||"left"in t&&"top"in t||((t=i({},t)).left=t.x||0,t.top=t.y||0,t.right=t.right||t.left+t.width,t.bottom=t.bottom||t.top+t.height),t}export function tlbrToXywh(t){return!t||"x"in t&&"y"in t||((t=i({},t)).x=t.left||0,t.y=t.top||0,t.width=t.width||(t.right||0)-t.x,t.height=t.height||(t.bottom||0)-t.y),t}export function addEdges(t,o,e){t.left&&(o.left+=e.x),t.right&&(o.right+=e.x),t.top&&(o.top+=e.y),t.bottom&&(o.bottom+=e.y),o.width=o.right-o.left,o.height=o.bottom-o.top}
//# sourceMappingURL=rect.prod.js.map