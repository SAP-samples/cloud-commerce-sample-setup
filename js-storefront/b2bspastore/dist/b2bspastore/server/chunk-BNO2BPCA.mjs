import './polyfills.server.mjs';
import{d as O}from"./chunk-7XNR6YBG.mjs";import{a as m}from"./chunk-B45L5KU2.mjs";import{ga as n,ha as i}from"./chunk-A7Q3BSDL.mjs";import{A as l,Ac as p,J as u,K as f,Wa as o}from"./chunk-HIT2747W.mjs";import{Fa as a,Ga as d,Ia as s,Sa as c}from"./chunk-PGJP43LT.mjs";var v="organizationUnitOrder";function D(){return p({facade:C,feature:v,methods:["getOrderHistoryList","getOrderHistoryListLoaded","loadOrderList","clearOrderList","getOrderDetails","loadOrderDetails","clearOrderDetails"],async:!0})}var C=(()=>{let e=class e{};e.\u0275fac=function(r){return new(r||e)},e.\u0275prov=a({token:e,factory:()=>D(),providedIn:"root"});let t=e;return t})(),y=new s("OrderDetailsOrderEntriesContext");function L(){return{featureModules:{[v]:{cmsComponents:["UnitLevelOrderHistoryComponent","UnitLevelOrderDetailsOverviewComponent","UnitLevelOrderDetailsItemsComponent","UnitLevelOrderDetailsTotalsComponent"],dependencies:[O]}}}}var N=(()=>{let e=class e{};e.\u0275fac=function(r){return new(r||e)},e.\u0275mod=c({type:e}),e.\u0275inj=d({providers:[f(L),u({routing:{routes:{unitLevelOrders:{paths:["my-account/unitLevelOrders"]},unitLevelOrderDetail:{paths:["my-account/unitLevelOrderDetails/:orderCode"],paramsMapping:{orderCode:"code"}}}}})],imports:[l.forChild([{path:null,canActivate:[o,i],component:n,data:{cxRoute:"unitLevelOrders"}},{path:null,canActivate:[o,i],component:n,data:{cxRoute:"unitLevelOrderDetail",cxContext:{[m]:y}}}])]});let t=e;return t})();export{v as a,C as b,y as c,N as d};