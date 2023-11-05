import t from"../modifiers/Modification.prod.js";import"../modifiers/base.prod.js";import"../offset/plugin.prod.js";import*as i from"../modifiers/base.prod.js";import e from"../offset/plugin.prod.js";import*as s from"../utils/domUtils.prod.js";import o from"../utils/hypot.prod.js";import r from"../utils/is.prod.js";import{copyCoords as n}from"../utils/pointerUtils.prod.js";import a from"../utils/raf.prod.js";export class InertiaState{active=!1;isModified=!1;smoothEnd=!1;allowResume=!1;modification;modifierCount=0;modifierArg;startCoords;t0=0;v0=0;te=0;targetOffset;modifiedOffset;currentOffset;lambda_v0=0;one_ve_v0=0;timeout;interaction;constructor(t){this.interaction=t}start(i){const{interaction:e}=this,s=f(e);if(!s||!s.enabled)return!1;const{client:r}=e.coords.velocity,n=o(r.x,r.y),a=this.modification||(this.modification=new t(e));if(a.copyFrom(e.modification),this.t0=e._now(),this.allowResume=s.allowResume,this.v0=n,this.currentOffset={x:0,y:0},this.startCoords=e.coords.cur.page,this.modifierArg=a.fillArg({pageCoords:this.startCoords,preEnd:!0,phase:"inertiastart"}),this.t0-e.coords.cur.timeStamp<50&&n>s.minSpeed&&n>s.endSpeed)this.startInertia();else{if(a.result=a.setAll(this.modifierArg),!a.result.changed)return!1;this.startSmoothEnd()}return e.modification.result.rect=null,e.offsetBy(this.targetOffset),e._doPhase({interaction:e,event:i,phase:"inertiastart"}),e.offsetBy({x:-this.targetOffset.x,y:-this.targetOffset.y}),e.modification.result.rect=null,this.active=!0,e.simulation=this,!0}startInertia(){const t=this.interaction.coords.velocity.client,i=f(this.interaction),e=i.resistance,s=-Math.log(i.endSpeed/this.v0)/e;this.targetOffset={x:(t.x-s)/e,y:(t.y-s)/e},this.te=s,this.lambda_v0=e/this.v0,this.one_ve_v0=1-i.endSpeed/this.v0;const{modification:o,modifierArg:r}=this;r.pageCoords={x:this.startCoords.x+this.targetOffset.x,y:this.startCoords.y+this.targetOffset.y},o.result=o.setAll(r),o.result.changed&&(this.isModified=!0,this.modifiedOffset={x:this.targetOffset.x+o.result.delta.x,y:this.targetOffset.y+o.result.delta.y}),this.onNextFrame((()=>this.inertiaTick()))}startSmoothEnd(){this.smoothEnd=!0,this.isModified=!0,this.targetOffset={x:this.modification.result.delta.x,y:this.modification.result.delta.y},this.onNextFrame((()=>this.smoothEndTick()))}onNextFrame(t){this.timeout=a.request((()=>{this.active&&t()}))}inertiaTick(){const{interaction:t}=this,i=f(t).resistance,e=(t._now()-this.t0)/1e3;if(e<this.te){const f=1-(Math.exp(-i*e)-this.lambda_v0)/this.one_ve_v0;let c;this.isModified?(0,0,s=this.targetOffset.x,o=this.targetOffset.y,r=this.modifiedOffset.x,n=this.modifiedOffset.y,c={x:d(a=f,0,s,r),y:d(a,0,o,n)}):c={x:this.targetOffset.x*f,y:this.targetOffset.y*f};const h={x:c.x-this.currentOffset.x,y:c.y-this.currentOffset.y};this.currentOffset.x+=h.x,this.currentOffset.y+=h.y,t.offsetBy(h),t.move(),this.onNextFrame((()=>this.inertiaTick()))}else t.offsetBy({x:this.modifiedOffset.x-this.currentOffset.x,y:this.modifiedOffset.y-this.currentOffset.y}),this.end();var s,o,r,n,a}smoothEndTick(){const{interaction:t}=this,i=t._now()-this.t0,{smoothEndDuration:e}=f(t);if(i<e){const s={x:h(i,0,this.targetOffset.x,e),y:h(i,0,this.targetOffset.y,e)},o={x:s.x-this.currentOffset.x,y:s.y-this.currentOffset.y};this.currentOffset.x+=o.x,this.currentOffset.y+=o.y,t.offsetBy(o),t.move({skipModifiers:this.modifierCount}),this.onNextFrame((()=>this.smoothEndTick()))}else t.offsetBy({x:this.targetOffset.x-this.currentOffset.x,y:this.targetOffset.y-this.currentOffset.y}),this.end()}resume({pointer:t,event:i,eventTarget:e}){const{interaction:s}=this;s.offsetBy({x:-this.currentOffset.x,y:-this.currentOffset.y}),s.updatePointer(t,i,e,!0),s._doPhase({interaction:s,event:i,phase:"resume"}),n(s.coords.prev,s.coords.cur),this.stop()}end(){this.interaction.move(),this.interaction.end(),this.stop()}stop(){this.active=this.smoothEnd=!1,this.interaction.simulation=null,a.cancel(this.timeout)}}function f({interactable:t,prepared:i}){return t&&t.options&&i.name&&t.options[i.name].inertia}const c={id:"inertia",before:["modifiers","actions"],install(t){const{defaults:s}=t;t.usePlugin(e),t.usePlugin(i.default),t.actions.phases.inertiastart=!0,t.actions.phases.resume=!0,s.perAction.inertia={enabled:!1,resistance:10,minSpeed:100,endSpeed:10,allowResume:!0,smoothEndDuration:300}},listeners:{"interactions:new"({interaction:t}){t.inertia=new InertiaState(t)},"interactions:before-action-end":({interaction:t,event:i})=>(!t._interacting||t.simulation||!t.inertia.start(i))&&null,"interactions:down"(t){const{interaction:i,eventTarget:e}=t,o=i.inertia;if(!o.active)return;let n=e;for(;r.element(n);){if(n===i.element){o.resume(t);break}n=s.parentNode(n)}},"interactions:stop"({interaction:t}){const i=t.inertia;i.active&&i.stop()},"interactions:before-action-resume"(t){const{modification:i}=t.interaction;i.stop(t),i.start(t,t.interaction.coords.cur.page),i.applyToInteraction(t)},"interactions:before-action-inertiastart":t=>t.interaction.modification.setAndApply(t),"interactions:action-resume":i.addEventModifiers,"interactions:action-inertiastart":i.addEventModifiers,"interactions:after-action-inertiastart":t=>t.interaction.modification.restoreInteractionCoords(t),"interactions:after-action-resume":t=>t.interaction.modification.restoreInteractionCoords(t)}};function d(t,i,e,s){const o=1-t;return o*o*i+2*o*t*e+t*t*s}function h(t,i,e,s){return-e*(t/=s)*(t-2)+i}export default c;
//# sourceMappingURL=plugin.prod.js.map