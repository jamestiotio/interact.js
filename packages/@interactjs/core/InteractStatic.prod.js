import t from"../utils/browser.prod.js";import*as e from"../utils/domUtils.prod.js";import o from"../utils/is.prod.js";import{warnOnce as s}from"../utils/misc.prod.js";import*as n from"../utils/pointerUtils.prod.js";import i from"./isNonNativeEvent";export function createInteractStatic(r){const c=(t,e)=>{let o=r.interactables.get(t,e);return o||(o=r.interactables.new(t,e),o.events.global=c.globalEvents),o};return c.getPointerAverage=n.pointerAverage,c.getTouchBBox=n.touchBBox,c.getTouchDistance=n.touchDistance,c.getTouchAngle=n.touchAngle,c.getElementRect=e.getElementRect,c.getElementClientRect=e.getElementClientRect,c.matchesSelector=e.matchesSelector,c.closest=e.closest,c.globalEvents={},c.version="1.10.19",c.scope=r,c.use=function(t,e){return this.scope.usePlugin(t,e),this},c.isSet=function(t,e){return!!this.scope.interactables.get(t,e&&e.context)},c.on=s((function(t,e,s){if(o.string(t)&&-1!==t.search(" ")&&(t=t.trim().split(/ +/)),o.array(t)){for(const o of t)this.on(o,e,s);return this}if(o.object(t)){for(const o in t)this.on(o,t[o],e);return this}return i(t,this.scope.actions)?this.globalEvents[t]?this.globalEvents[t].push(e):this.globalEvents[t]=[e]:this.scope.events.add(this.scope.document,t,e,{options:s}),this}),"The interact.on() method is being deprecated"),c.off=s((function(t,e,s){if(o.string(t)&&-1!==t.search(" ")&&(t=t.trim().split(/ +/)),o.array(t)){for(const o of t)this.off(o,e,s);return this}if(o.object(t)){for(const o in t)this.off(o,t[o],e);return this}if(i(t,this.scope.actions)){let o;t in this.globalEvents&&-1!==(o=this.globalEvents[t].indexOf(e))&&this.globalEvents[t].splice(o,1)}else this.scope.events.remove(this.scope.document,t,e,s);return this}),"The interact.off() method is being deprecated"),c.debug=function(){return this.scope},c.supportsTouch=()=>t.supportsTouch,c.supportsPointerEvent=()=>t.supportsPointerEvent,c.stop=function(){for(const t of this.scope.interactions.list)t.stop();return this},c.pointerMoveTolerance=function(t){return o.number(t)?(this.scope.interactions.pointerMoveTolerance=t,this):this.scope.interactions.pointerMoveTolerance},c.addDocument=function(t,e){this.scope.addDocument(t,e)},c.removeDocument=function(t){this.scope.removeDocument(t)},c}
//# sourceMappingURL=InteractStatic.prod.js.map