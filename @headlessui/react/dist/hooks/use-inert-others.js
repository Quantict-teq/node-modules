import{getOwnerDocument as s}from"../utils/owner.js";import{useIsoMorphicEffect as d}from"./use-iso-morphic-effect.js";let i=new Set,r=new Map;function u(t){t.setAttribute("aria-hidden","true"),t.inert=!0}function l(t){let n=r.get(t);!n||(n["aria-hidden"]===null?t.removeAttribute("aria-hidden"):t.setAttribute("aria-hidden",n["aria-hidden"]),t.inert=n.inert)}function M(t,n=!0){d(()=>{if(!n||!t.current)return;let o=t.current,a=s(o);if(!!a){i.add(o);for(let e of r.keys())e.contains(o)&&(l(e),r.delete(e));return a.querySelectorAll("body > *").forEach(e=>{if(e instanceof HTMLElement){for(let f of i)if(e.contains(f))return;i.size===1&&(r.set(e,{"aria-hidden":e.getAttribute("aria-hidden"),inert:e.inert}),u(e))}}),()=>{if(i.delete(o),i.size>0)a.querySelectorAll("body > *").forEach(e=>{if(e instanceof HTMLElement&&!r.has(e)){for(let f of i)if(e.contains(f))return;r.set(e,{"aria-hidden":e.getAttribute("aria-hidden"),inert:e.inert}),u(e)}});else for(let e of r.keys())l(e),r.delete(e)}}},[n])}export{M as useInertOthers};
