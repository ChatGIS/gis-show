import{d as ne,r as te,x as le,c as N,p as ie,y as ae,z as ue,o as f,a as F,l as $,u as n,m as B,ac as y,b as T,w as G,g as E,ad as se,ae as oe,C as H,af as pe,ag as de,L as D,X as ce}from"./index.f1e08138.js";import{i as w,E as me}from"./el-input.43be7bee.js";import{b as k,E as R}from"./index.5b18f7c5.js";import{b as be,a as c,u as fe,_ as _e,w as he}from"./plugin-vue_export-helper.7c799f0f.js";import{u as ve,a as ge,b as Ne}from"./index.1a9c9c7c.js";import{C as we,I as xe,U as Ve}from"./event.776e7e11.js";import{u as Ie}from"./index.035eab81.js";import{u as ye}from"./index.2a4cd1cd.js";import{d as Y}from"./error.7e8331f1.js";const j={beforeMount(l,_){let s=null,t=!1;const v=()=>_.value&&_.value(),d=()=>{clearInterval(s),s=null,t||v(),t=!1};l.addEventListener("mousedown",b=>{b.button===0&&(document.addEventListener("mouseup",d,{once:!0}),clearInterval(s),s=setInterval(()=>{t=!0,v()},100))})}},Ee=be({id:{type:String,default:void 0},step:{type:Number,default:1},stepStrictly:Boolean,max:{type:Number,default:Number.POSITIVE_INFINITY},min:{type:Number,default:Number.NEGATIVE_INFINITY},modelValue:Number,disabled:Boolean,size:ve,controls:{type:Boolean,default:!0},controlsPosition:{type:String,default:"",values:["","right"]},valueOnClear:{type:[String,Number,null],validator:l=>l===null||c(l)||["min","max"].includes(l),default:null},name:String,label:String,placeholder:String,precision:{type:Number,validator:l=>l>=0&&l===Number.parseInt(`${l}`,10)},validateEvent:{type:Boolean,default:!0}}),ke={[we]:(l,_)=>l!==_,blur:l=>l instanceof FocusEvent,focus:l=>l instanceof FocusEvent,[xe]:l=>c(l)||w(l),[Ve]:l=>c(l)||w(l)},Se=["aria-label","onKeydown"],Pe=["aria-label","onKeydown"],ze={name:"ElInputNumber"},Ce=ne({...ze,props:Ee,emits:ke,setup(l,{expose:_,emit:s}){const t=l,{t:v}=Ie(),d=fe("input-number"),b=te(),u=le({currentValue:t.modelValue,userInput:null}),{formItem:h}=ye(),M=N(()=>c(t.modelValue)&&x(t.modelValue,-1)<t.min),K=N(()=>c(t.modelValue)&&x(t.modelValue)>t.max),W=N(()=>{const e=L(t.step);return k(t.precision)?Math.max(L(t.modelValue),e):(e>t.precision,t.precision)}),S=N(()=>t.controls&&t.controlsPosition==="right"),O=ge(),g=Ne(),X=N(()=>{if(u.userInput!==null)return u.userInput;let e=u.currentValue;if(w(e))return"";if(c(e)){if(Number.isNaN(e))return"";k(t.precision)||(e=e.toFixed(t.precision))}return e}),P=(e,r)=>{if(k(r)&&(r=W.value),r===0)return Math.round(e);let i=String(e);const a=i.indexOf(".");if(a===-1||!i.replace(".","").split("")[a+r])return e;const V=i.length;return i.charAt(V-1)==="5"&&(i=`${i.slice(0,Math.max(0,V-1))}6`),Number.parseFloat(Number(i).toFixed(r))},L=e=>{if(w(e))return 0;const r=e.toString(),i=r.indexOf(".");let a=0;return i!==-1&&(a=r.length-i-1),a},x=(e,r=1)=>c(e)?P(e+t.step*r):u.currentValue,z=()=>{if(g.value||K.value)return;const e=t.modelValue||0,r=x(e);A(r)},C=()=>{if(g.value||M.value)return;const e=t.modelValue||0,r=x(e,-1);A(r)},U=(e,r)=>{const{max:i,min:a,step:o,precision:m,stepStrictly:V,valueOnClear:I}=t;let p=Number(e);if(w(e)||Number.isNaN(p))return null;if(e===""){if(I===null)return null;p=ce(I)?{min:a,max:i}[I]:I}return V&&(p=P(Math.round(p/o)*o,m)),k(m)||(p=P(p,m)),(p>i||p<a)&&(p=p>i?i:a,r&&s("update:modelValue",p)),p},A=e=>{var r;const i=u.currentValue,a=U(e);i!==a&&(u.userInput=null,s("update:modelValue",a),s("input",a),s("change",a,i),t.validateEvent&&((r=h==null?void 0:h.validate)==null||r.call(h,"change").catch(o=>Y())),u.currentValue=a)},q=e=>u.userInput=e,J=e=>{const r=e!==""?Number(e):"";(c(r)&&!Number.isNaN(r)||e==="")&&A(r),u.userInput=null},Q=()=>{var e,r;(r=(e=b.value)==null?void 0:e.focus)==null||r.call(e)},Z=()=>{var e,r;(r=(e=b.value)==null?void 0:e.blur)==null||r.call(e)},ee=e=>{s("focus",e)},re=e=>{var r;s("blur",e),t.validateEvent&&((r=h==null?void 0:h.validate)==null||r.call(h,"blur").catch(i=>Y()))};return ie(()=>t.modelValue,e=>{u.currentValue=U(e,!0),u.userInput=null},{immediate:!0}),ae(()=>{var e;const{min:r,max:i,modelValue:a}=t,o=(e=b.value)==null?void 0:e.input;if(o.setAttribute("role","spinbutton"),Number.isFinite(i)?o.setAttribute("aria-valuemax",String(i)):o.removeAttribute("aria-valuemax"),Number.isFinite(r)?o.setAttribute("aria-valuemin",String(r)):o.removeAttribute("aria-valuemin"),o.setAttribute("aria-valuenow",String(u.currentValue)),o.setAttribute("aria-disabled",String(g.value)),!c(a)&&a!=null){let m=Number(a);Number.isNaN(m)&&(m=null),s("update:modelValue",m)}}),ue(()=>{var e;const r=(e=b.value)==null?void 0:e.input;r==null||r.setAttribute("aria-valuenow",`${u.currentValue}`)}),_({focus:Q,blur:Z}),(e,r)=>(f(),F("div",{class:B([n(d).b(),n(d).m(n(O)),n(d).is("disabled",n(g)),n(d).is("without-controls",!e.controls),n(d).is("controls-right",n(S))]),onDragstart:r[0]||(r[0]=D(()=>{},["prevent"]))},[e.controls?$((f(),F("span",{key:0,role:"button","aria-label":n(v)("el.inputNumber.decrease"),class:B([n(d).e("decrease"),n(d).is("disabled",n(M))]),onKeydown:y(C,["enter"])},[T(n(R),null,{default:G(()=>[n(S)?(f(),E(n(se),{key:0})):(f(),E(n(oe),{key:1}))]),_:1})],42,Se)),[[n(j),C]]):H("v-if",!0),e.controls?$((f(),F("span",{key:1,role:"button","aria-label":n(v)("el.inputNumber.increase"),class:B([n(d).e("increase"),n(d).is("disabled",n(K))]),onKeydown:y(z,["enter"])},[T(n(R),null,{default:G(()=>[n(S)?(f(),E(n(pe),{key:0})):(f(),E(n(de),{key:1}))]),_:1})],42,Pe)),[[n(j),z]]):H("v-if",!0),T(n(me),{id:e.id,ref_key:"input",ref:b,type:"number",step:e.step,"model-value":n(X),placeholder:e.placeholder,disabled:n(g),size:n(O),max:e.max,min:e.min,name:e.name,label:e.label,"validate-event":!1,onKeydown:[y(D(z,["prevent"]),["up"]),y(D(C,["prevent"]),["down"])],onBlur:re,onFocus:ee,onInput:q,onChange:J},null,8,["id","step","model-value","placeholder","disabled","size","max","min","name","label","onKeydown"])],34))}});var Ae=_e(Ce,[["__file","/home/runner/work/element-plus/element-plus/packages/components/input-number/src/input-number.vue"]]);const $e=he(Ae);export{$e as E};
