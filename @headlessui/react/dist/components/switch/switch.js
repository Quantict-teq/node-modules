import l,{Fragment as D,createContext as k,useCallback as c,useContext as L,useMemo as b,useState as R,useRef as C}from"react";import{forwardRefWithAs as A,render as y,compact as G}from"../../utils/render.js";import{useId as K}from"../../hooks/use-id.js";import{Keys as T}from"../keyboard.js";import{isDisabledReactIssue7711 as M}from"../../utils/bugs.js";import{Label as H,useLabels as x}from"../label/label.js";import{Description as U,useDescriptions as _}from"../description/description.js";import{useResolveButtonType as B}from"../../hooks/use-resolve-button-type.js";import{useSyncRefs as I}from"../../hooks/use-sync-refs.js";import{VisuallyHidden as F}from"../../internal/visually-hidden.js";import{attemptSubmit as W}from"../../utils/form.js";let m=k(null);m.displayName="GroupContext";let O=D;function j(f){let[n,i]=R(null),[e,a]=x(),[o,d]=_(),u=b(()=>({switch:n,setSwitch:i,labelledby:e,describedby:o}),[n,i,e,o]),p={},t=f;return l.createElement(d,{name:"Switch.Description"},l.createElement(a,{name:"Switch.Label",props:{onClick(){!n||(n.click(),n.focus({preventScroll:!0}))}}},l.createElement(m.Provider,{value:u},y({ourProps:p,theirProps:t,defaultTag:O,name:"Switch.Group"}))))}let N="button",V=A(function(n,i){let{checked:e,onChange:a,name:o,value:d,...u}=n,p=`headlessui-switch-${K()}`,t=L(m),h=C(null),S=I(h,i,t===null?null:t.setSwitch),s=c(()=>a(!e),[a,e]),w=c(r=>{if(M(r.currentTarget))return r.preventDefault();r.preventDefault(),s()},[s]),E=c(r=>{r.key===T.Space?(r.preventDefault(),s()):r.key===T.Enter&&W(r.currentTarget)},[s]),P=c(r=>r.preventDefault(),[]),v=b(()=>({checked:e}),[e]),g={id:p,ref:S,role:"switch",type:B(n,h),tabIndex:0,"aria-checked":e,"aria-labelledby":t==null?void 0:t.labelledby,"aria-describedby":t==null?void 0:t.describedby,onClick:w,onKeyUp:E,onKeyPress:P};return l.createElement(l.Fragment,null,o!=null&&e&&l.createElement(F,{...G({as:"input",type:"checkbox",hidden:!0,readOnly:!0,checked:e,name:o,value:d})}),y({ourProps:g,theirProps:u,slot:v,defaultTag:N,name:"Switch"}))}),ce=Object.assign(V,{Group:j,Label:H,Description:U});export{ce as Switch};