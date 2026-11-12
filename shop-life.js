'use strict';
// Presentation only: never writes progress, rewards, or customer records.
window.initShopLife=function({getState,blocked}){
 const $=id=>document.getElementById(id),actor=document.querySelector('.counter-partner');
 let timer=null,active=false,target=null,last=Date.now(),pending=false,first=true;
 const talks=[['你的梦里，也有软软的云吗？','有呀，还会下棉花糖一样的雪。','……有点想去看看。'],['要不要先坐一会儿？','好呀，这里的灯光很让人安心。','那就慢慢来，不着急。'],['刚刚捡到了一小片月光。','可以把它缝进我的梦里吗？','嗯，留在最柔软的地方。']];
 const names=['栗栗','小麦','阿桃','松松','小雨','团团','阿蓝','小芽'];
 const visible=()=>!document.hidden&&$('page-dream').classList.contains('active');
 const allowed=()=>getState().businessOpen&&visible()&&!getState().task&&!blocked();
 function status(){
  const button=$('preview-shop-life'),note=$('shop-life-status');
  button.disabled=!allowed()||active;
  note.textContent=!getState().businessOpen?'开门后，搭档会偶尔出来走走。':!visible()?'回到门店后，再一起散步。':getState().task?'搭档正在陪你修梦，完成后再散步。':blocked()?'先收起接待面板，搭档才会出来走走。':active?'搭档正在散步，轻点客人就会回柜台。':first?'搭档稍后会出来走走，也可以现在看看。':'搭档在柜台歇一会儿，稍后再出来走走。';
 }
 function position(x,y){actor.style.left=x+'%';actor.style.top=y+'%';}
 function reset(){clearTimeout(timer);timer=null;pending=false;target=null;
  if(active){active=false;last=Date.now();actor.classList.add('no-travel');actor.classList.remove('is-roaming');actor.style.removeProperty('left');actor.style.removeProperty('top');$('partner-chat').hidden=true;void actor.offsetWidth;actor.classList.remove('no-travel');}
  status();
 }
 function later(fn,ms){clearTimeout(timer);timer=setTimeout(()=>{timer=null;
  if(!allowed()||(target&&!getState().guests.some(g=>g.id===target))){reset();sync();return;}fn();
 },ms);}
 function home(){
  $('partner-chat').hidden=true;position(80,52);
  later(()=>{position(80,25);later(()=>{actor.classList.remove('is-roaming');position(40,25);later(()=>{reset();sync();},1900);},1900);},1900);
 }
 function start(){
  clearTimeout(timer);timer=null;pending=false;if(!allowed()){reset();sync();return;}
  active=true;first=false;status();const guests=getState().guests||[],g=guests[Math.floor(Math.random()*guests.length)];target=g?.id||null;
  const stops=[[27,52],[58,52],[58,61],[25,68],[59,68]],stop=g?stops[guests.indexOf(g)]:[64,57],talk=talks[Math.floor(Math.random()*talks.length)];
  position(80,25);
  later(()=>{actor.classList.add('is-roaming');position(80,52);later(()=>{position(...stop);later(()=>{
   const chat=$('partner-chat');chat.hidden=false;chat.textContent=(getState().petName||'小眠')+'：'+(g?talk[0]:'地毯平平的，星星也好好待着。');
   later(()=>{if(!g){home();return;}chat.textContent=names[g.kind]+'：'+talk[1];later(()=>{chat.textContent=(getState().petName||'小眠')+'：'+talk[2];later(home,4000);},4500);},4500);
  },1900);},1900);},1900);
 }
 function sync(){
  $('counter-name').textContent=getState().petName||'小眠';$('counter-mood').textContent='心情 '+getState().mood;
  if(!allowed()){reset();return;}
  if(active||pending){status();return;}
  pending=true;const delay=first?18000+Math.random()*10000:Math.max(5000,70000+Math.random()*30000-(Date.now()-last));
  timer=setTimeout(()=>{timer=null;start();},delay);status();
 }
 $('preview-shop-life').addEventListener('click',()=>{if(allowed()&&!active)start();else status();});
 document.addEventListener('visibilitychange',()=>{reset();last=Date.now();if(!document.hidden)sync();});
 window.addEventListener('pagehide',reset);
 window.addEventListener('pageshow',e=>{if(e.persisted){last=Date.now();sync();}});
 document.addEventListener('atelier-shop-speech',e=>{
  if(!['open','start','finish','close'].includes(e.detail?.event))return;
  reset();last=Date.now();
  if(e.detail.event==='open'){
   const chime=document.querySelector('.shop-chime');chime.classList.remove('is-ringing');void chime.offsetWidth;chime.classList.add('is-ringing');
   document.dispatchEvent(new CustomEvent('atelier-sound',{detail:'chime'}));
  }
  if(e.detail.event!=='close')sync();
 });
 return {sync,cancel:reset,isActive:()=>active};
};
