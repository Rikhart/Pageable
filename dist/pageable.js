/*
 Pageable 0.3.0
 http://mobius.ovh/

 Released under the MIT license
*/
var Pageable=function(a,b){var c=this;b=void 0===b?{}:b;if(void 0===a)return console.error("Pageable:","No container defined.");var e={pips:!0,interval:300,delay:0,throttle:50,orientation:"vertical",easing:function(a,b,c,f,e){return-c*(a/=f)*(a-2)+b},onInit:function(){},onUpdate:function(){},onBeforeStart:function(){},onStart:function(){},onScroll:function(){},onFinish:function(){},swipeThreshold:50,freeScroll:!1,events:{wheel:!0,mouse:!0,touch:!0}};this.container="string"===typeof a?document.querySelector(a):
a;if(!this.container)return console.error("Pageable:","The container could not be found.");this.config=Object.assign({},e,b);this.events=Object.assign({},e.events,b.events);if(this.config.anchors&&Array.isArray(this.config.anchors)){var f=document.createDocumentFragment();this.config.anchors.forEach(function(a){var b=document.createElement("div");b.dataset.anchor=a;f.appendChild(b)});this.container.appendChild(f)}this.pages=Array.from(this.container.querySelectorAll("[data-anchor]"));if(!this.pages.length)return console.error("Pageable:",
"No child nodes with the [data-anchor] attribute could be found.");this.horizontal="horizontal"===this.config.orientation;this.anchors=[];this.pages.forEach(function(a,b){var d=a.dataset.anchor.replace(/\s+/,"-");a.id!==d&&(a.id=d);c.anchors.push("#"+d);a.classList.add("pg-page");a.classList.toggle("pg-active",0==b)});this.axis=this.horizontal?"x":"y";this.mouseAxis={x:"clientX",y:"clientY"};this.scrollAxis={x:"scrollLeft",y:"scrollTop"};this.size={x:"width",y:"height"};this.bar=this.getScrollBarWidth();
this.index=0;this.initialised=!1;this.touch="ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch;this.init()};
Pageable.prototype.init=function(){if(!this.initialised){var a=this.config;this.wrapper=document.createElement("div");this.container.parentNode.insertBefore(this.wrapper,this.container);this.wrapper.appendChild(this.container);this.wrapper.classList.add("pg-wrapper","pg-"+a.orientation);this.wrapper.classList.add("pg-wrapper");this.container.classList.add("pg-container");document.body.style.margin=0;document.body.style.overflow="hidden";this.container.style.display="inline-block";a.navPrevEl&&("string"===
typeof a.navPrevEl?(this.navPrevEl=document.querySelector(a.navPrevEl),console.log(this.navPrevEl)):a.navPrevEl instanceof Element&&(this.navPrevEl=a.navPrevEl),this.navPrevEl&&(this.navPrevEl.classList.add("pg-nav"),this.navPrevEl.onclick=this.prev.bind(this)));a.navNextEl&&("string"===typeof a.navNextEl?this.navNextEl=document.querySelector(a.navNextEl):a.navNextEl instanceof Element&&(this.navNextEl=a.navNextEl),this.navNextEl&&(this.navPrevEl.classList.add("pg-nav"),this.navNextEl.onclick=this.next.bind(this)));
if(a.pips){a=document.createElement("nav");var b=document.createElement("ul");this.pages.forEach(function(a,e){var c=document.createElement("li"),d=document.createElement("a"),g=document.createElement("span");d.href="#"+a.id;0==e&&d.classList.add("active");d.appendChild(g);c.appendChild(d);b.appendChild(c)});a.appendChild(b);this.wrapper.appendChild(a);this.pips=Array.from(b.children)}this.bind();this.update();this.initialised=!0}};
Pageable.prototype.bind=function(){var a=arguments,b=this;this.callbacks={wheel:this.wheel.bind(this),update:function(c,e,f){var d;return function(){f=f||b;if(!d)return c.apply(f,a),d=!0,setTimeout(function(){d=!1},e)}}(this.update.bind(this),this.config.throttle),load:this.load.bind(this),start:this.start.bind(this),stop:this.stop.bind(this),click:this.click.bind(this)};this.config.freeScroll&&(this.callbacks.drag=this.drag.bind(this));this.wrapper.addEventListener("wheel",this.callbacks.wheel,!1);
window.addEventListener("resize",this.callbacks.update,!1);this.wrapper.addEventListener(this.touch?"touchstart":"mousedown",this.callbacks.start,!1);this.config.freeScroll&&window.addEventListener(this.touch?"touchmove":"mousemove",this.callbacks.drag,!1);window.addEventListener(this.touch?"touchend":"mouseup",this.callbacks.stop,!1);document.addEventListener("DOMContentLoaded",this.callbacks.load,!1);document.addEventListener("click",this.callbacks.click,!1)};
Pageable.prototype.unbind=function(){this.wrapper.removeEventListener("wheel",this.callbacks.wheel);window.removeEventListener("resize",this.callbacks.update);this.wrapper.removeEventListener(this.touch?"touchstart":"mousedown",this.callbacks.start);window.addEventListener(this.touch?"touchmove":"mousemove",this.callbacks.drag);window.removeEventListener(this.touch?"touchend":"mouseup",this.callbacks.stop);document.removeEventListener("DOMContentLoaded",this.callbacks.load);document.removeEventListener("click",
this.callbacks.click)};Pageable.prototype.click=function(a){if(a.target.closest){var b=a.target.closest("a");b&&-1<this.anchors.indexOf(b.hash)&&(a.preventDefault(),this.scrollToAnchor(b.hash))}};
Pageable.prototype.start=function(a){if(this.scrolling||"touchstart"===a.type&&!this.events.touch)return!1;if("mousedown"===a.type&&!this.events.mouse)return 1===a.button&&a.preventDefault(),!1;a.preventDefault();a.stopPropagation();a=this.touch?a.touches[0]:a;if(!a.target.closest("[data-anchor]"))return!1;this.dragging=this.config.freeScroll;this.down={x:a.clientX,y:a.clientY};this.config.onBeforeStart.call(this,this.index)};
Pageable.prototype.drag=function(a){if(this.dragging&&!this.scrolling){a=(this.touch&&"touchmove"===a.type?a.touches[0]:a)[this.mouseAxis[this.axis]]-this.down[this.axis];var b=this.getData();this.container.style.transform=this.horizontal?"translate3d("+a+"px, 0, 0)":"translate3d(0, "+a+"px, 0)";b.scrolled-=a;this.config.onScroll.call(this,b);this.emit("scroll",b)}};
Pageable.prototype.stop=function(a){var b=this,c=this.touch?a.touches[0]:a,e=function(){return b.index<b.pages.length-1&&b.index++},f=function(){return 0<b.index&&b.index--};if(this.dragging&&!this.scrolling){a=c[this.mouseAxis[this.axis]]-this.down[this.axis];var d=this.index;c=Math.abs(c[this.mouseAxis[this.axis]]-this.down[this.axis])>=this.config.swipeThreshold;this.dragging=a;c&&(0<a?f():e());this.scrollBy(this.getScrollAmount(d)-a);this.down=!1}else this.down&&!this.scrolling&&(c=this.index,
Math.abs((this.touch?a.changedTouches[0]:a)[this.mouseAxis[this.axis]]-this.down[this.axis])>=this.config.swipeThreshold&&(this.touch?a.changedTouches[0][this.mouseAxis[this.axis]]<this.down[this.axis]?e():a.changedTouches[0][this.mouseAxis[this.axis]]>this.down[this.axis]&&f():a[this.mouseAxis[this.axis]]<this.down[this.axis]?1===a.button?f():e():a[this.mouseAxis[this.axis]]>this.down[this.axis]&&(1===a.button?e():f())),c===this.index?this.config.onFinish.call(this,this.getData()):(this.oldIndex=
c,this.scrollBy(this.getScrollAmount(c))),this.down=!1)};Pageable.prototype.wheel=function(a){a.preventDefault();if(this.events.wheel&&!this.scrolling){var b=this.index;0<a.deltaY?this.index<this.pages.length-1&&this.index++:0<this.index&&this.index--;this.index!==b&&(this.oldIndex=b,this.scrollBy(this.getScrollAmount(b)))}};
Pageable.prototype.load=function(a){var b=this;if(a=location.hash)if(a=this.anchors.indexOf(a),-1<a){this.scrollPosition=this.data.window[this.size[this.axis]]*a;var c=this.getData();this.index=a;this.setPips();this.pages.forEach(function(a,c){a.classList.toggle("pg-active",c===b.index)});this.navPrevEl&&this.navPrevEl.classList.toggle("active",0<this.index);this.navNextEl&&this.navNextEl.classList.toggle("active",this.index<this.pages.length-1);this.config.onScroll.call(this,c);this.config.onFinish.call(this,
c);this.emit("scroll",c)}this.update();a=this.getData();this.config.onInit.call(this,a);this.emit("init",a)};Pageable.prototype.setPips=function(a){this.config.pips&&(void 0===a&&(a=this.index),this.pips.forEach(function(b,c){b.firstElementChild.classList.toggle("active",c==a)}))};Pageable.prototype.getScrollAmount=function(a,b){void 0===b&&(b=this.index);var c=this.data.window[this.size[this.axis]];return c*a-c*b};
Pageable.prototype.scrollBy=function(a){var b=this;if(this.scrolling)return!1;this.scrolling=!0;this.config.onBeforeStart.call(this,this.oldIndex);this.emit("scroll.before",this.getData());this.timer=setTimeout(function(){var c=Date.now(),e=b.getScrollOffset();b.setPips();var f=function(){var d=Date.now()-c;if(d>b.config.interval)return cancelAnimationFrame(b.frame),b.container.style.transform="",b.frame=!1,b.scrolling=!1,b.dragging=!1,window.location.hash=b.pages[b.index].id,b.pages.forEach(function(a,
c){a.classList.toggle("pg-active",c===b.index)}),b.navPrevEl&&b.navPrevEl.classList.toggle("active",0<b.index),b.navNextEl&&b.navNextEl.classList.toggle("active",b.index<b.pages.length-1),d=b.getData(),b.config.onFinish.call(b,d),b.emit("scroll.end",d),!1;d=b.config.easing(d,b.dragging?b.dragging:0,a,b.config.interval);b.container.style.transform=b.horizontal?"translate3d("+d+"px, 0, 0)":"translate3d(0, "+d+"px, 0)";b.scrollPosition=e[b.axis]-d;d=b.getData();b.config.onScroll.call(b,d);b.emit("scroll",
d);b.frame=requestAnimationFrame(f)};b.config.onStart.call(b,b.pages[b.index].id);b.emit("scroll.start",b.getData());b.frame=requestAnimationFrame(f)},this.config.delay)};Pageable.prototype.scrollToPage=function(a){this.scrollToIndex(a-1)};Pageable.prototype.scrollToAnchor=function(a){this.scrollToIndex(this.anchors.indexOf(a))};Pageable.prototype.next=function(){this.scrollToIndex(this.index+1)};Pageable.prototype.prev=function(){this.scrollToIndex(this.index-1)};
Pageable.prototype.scrollToIndex=function(a){if(!this.scrolling&&0<=a&&a<=this.pages.length-1){var b=this.index;this.index=a;this.oldIndex=b;this.scrollBy(this.getScrollAmount(b))}};
Pageable.prototype.update=function(){var a=this;clearTimeout(this.timer);this.data={window:{width:window.innerWidth,height:window.innerHeight},container:{height:this.wrapper.scrollHeight,width:this.wrapper.scrollWidth}};var b=this.size[this.axis],c=this.horizontal?this.size.y:this.size.x;this.wrapper.style["overflow-"+this.axis]="scroll";this.wrapper.style[b]=this.data.window[b]+"px";this.wrapper.style[c]=this.data.window[c]+this.bar+"px";this.container.style[b]=this.pages.length*this.data.window[b]+
"px";this.wrapper.style["padding-"+(this.horizontal?"bottom":"right")]=this.bar+"px";this.wrapper[this.scrollAxis[this.axis]]=this.index*this.data.window[b];this.scrollSize=this.pages.length*this.data.window[b]-this.data.window[b];this.scrollPosition=this.data.window[b]*this.index;this.pages.forEach(function(e,f){a.horizontal&&(e.style["float"]="left");e.style[b]=a.data.window[b]+"px";e.style[c]=a.data.window[c]+"px"});this.config.onUpdate.call(this,this.getData());this.emit("update",this.getData())};
Pageable.prototype.getData=function(){return{index:this.index,scrolled:this.scrollPosition,max:this.scrollSize}};Pageable.prototype.getScrollOffset=function(){return{x:this.wrapper.scrollLeft,y:this.wrapper.scrollTop}};
Pageable.prototype.orientate=function(a){switch(a){case "vertical":this.horizontal=!1;this.axis="y";this.container.style.width="";break;case "horizontal":this.horizontal=!0;this.axis="x";this.container.style.height="";break;default:return!1}this.wrapper.classList.toggle("pg-vertical",!this.horizontal);this.wrapper.classList.toggle("pg-horizontal",this.horizontal);this.config.orientation=a;this.update()};
Pageable.prototype.on=function(a,b){this.listeners=this.listeners||{};this.listeners[a]=this.listeners[a]||[];this.listeners[a].push(b)};Pageable.prototype.off=function(a,b){this.listeners=this.listeners||{};!1!==a in this.listeners&&this.listeners[a].splice(this.listeners[a].indexOf(b),1)};
Pageable.prototype.emit=function(a){this.listeners=this.listeners||{};if(!1!==a in this.listeners)for(var b=0;b<this.listeners[a].length;b++)this.listeners[a][b].apply(this,Array.prototype.slice.call(arguments,1))};
Pageable.prototype.destroy=function(){this.initialised&&(this.emit("destroy"),this.unbind(),document.body.style.margin="",document.body.style.overflow="",this.container.style.display="",this.container.style.height="",this.container.style.width="",this.container.classList.remove("pg-container"),this.wrapper.parentNode.replaceChild(this.container,this.wrapper),this.pages.forEach(function(a){a.style.height="";a.style.width="";a.classList.remove("pg-page");a.classList.remove("pg-active")}),this.navPrevEl&&
(this.navPrevEl.classList.remove("active"),this.navPrevEl.classList.remove("pg-nav"),this.navPrevEl.onclick=function(){}),this.navNextEl&&(this.navNextEl.classList.remove("active"),this.navNextEl.classList.remove("pg-nav"),this.navNextEl.onclick=function(){}),this.initialised=!1)};
Pageable.prototype.getScrollBarWidth=function(){var a=document.createElement("div"),b=0;return a.style.cssText="width: 100; height: 100; overflow: scroll; position: absolute; top: -9999;",document.body.appendChild(a),b=a.offsetWidth-a.clientWidth,document.body.removeChild(a),b};