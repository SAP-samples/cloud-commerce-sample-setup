import './polyfills.server.mjs';
import{z as a}from"./chunk-B45L5KU2.mjs";import{Ac as c,K as r}from"./chunk-HIT2747W.mjs";import{Fa as n,Ga as i,Sa as s}from"./chunk-PGJP43LT.mjs";var d="cartWishList",f="cartWishListCore",p="addToWishList",T=(()=>{let t=class t{};t.\u0275fac=function(o){return new(o||t)},t.\u0275prov=n({token:t,factory:()=>c({facade:t,feature:f,methods:["createWishList","getWishList","loadWishList","addEntry","removeEntry","getWishListLoading"],async:!0}),providedIn:"root"});let e=t;return e})();function u(){return{featureModules:{[d]:{cmsComponents:["WishListComponent"],dependencies:[a]},[p]:{cmsComponents:["AddToWishListComponent"]},[f]:d}}}var E=(()=>{let t=class t{};t.\u0275fac=function(o){return new(o||t)},t.\u0275mod=s({type:t}),t.\u0275inj=i({providers:[r(u)]});let e=t;return e})();export{d as a,p as b,T as c,E as d};