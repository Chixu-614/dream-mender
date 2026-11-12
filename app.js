'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const KEY = 'mian-dream-atelier-v1';
  const day = () => new Date().toLocaleDateString('sv-SE');
  const fresh = () => ({userName:'',petName:'小眠',personality:'gentle',coins:128,mood:86,fixed:0,profit:0,spent:0,decor:false,cards:[],order:0,task:null,image:'',position:{x:38,y:47},businessOpen:false,furniture:[],day:day(),daily:0});
  let state=fresh(), storageWarned=false;
  try {const saved=JSON.parse(localStorage.getItem(KEY));if(saved && saved.version===1){state={...fresh(),...saved};if(!Array.isArray(state.cards))state.cards=[];if(!Number.isFinite(state.coins)||state.coins<0)state=fresh();}} catch(e){}
  const dreams=window.ATELIER_DREAMS;
  let extras=null,shop=null; let toastTimer,careTime=0;
  const current=()=>shop?shop.current():dreams[state.task?.dream??state.order%3];
  function save(){try{localStorage.setItem(KEY,JSON.stringify({...state,version:1}));}catch(e){if(!storageWarned){storageWarned=true;toast('当前浏览器无法保存进度，请勿关闭页面。');}}}
  function toast(text){$('toast').textContent=text;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2600);}
  function say(text){$('speech').textContent=text;const anchor=$('pet-anchor');anchor.classList.remove('bounce');void anchor.offsetWidth;anchor.classList.add('bounce');followSpeech();}
  function switchPage(name){document.querySelectorAll('.page').forEach(el=>el.classList.toggle('active',el.id==='page-'+name));document.querySelectorAll('[data-page]').forEach(el=>{const active=el.dataset.page===name;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','page');else el.removeAttribute('aria-current');});render();window.scrollTo({top:0,behavior:'instant'});}
  function render(){
    if(extras)extras.render();
    renderProfile();
    if(state.day!==day()){state.day=day();state.daily=0;save();}
    $('coins').textContent=state.coins;$('mood-value').textContent=state.mood;$('mood-fill').style.width=state.mood+'%';
    $('pet-status').textContent=state.mood>=95?'有你在，连梦都变甜了':state.mood>=75?'今天也是软乎乎的一天':'想和你一起坐一小会儿';
    $('today-fixed').textContent=state.daily;$('stat-fixed').innerHTML=state.fixed+'<small> 场</small>';$('stat-profit').innerHTML=state.profit+'<small> 梦砂</small>';$('stat-spent').textContent=state.spent;
    $('decor-star').hidden=!state.decor;$('buy-decor').textContent=state.decor?'已挂在小店':'35 梦砂';$('buy-decor').disabled=state.decor;
    if(shop)shop.render();
    const d=current();$('order-thumb').src='assets/'+d.image+'.svg';
    $('postcard-count').textContent=state.cards.length+' 张珍藏';
    $('postcards').replaceChildren();
    if(!state.cards.length){$('postcards').innerHTML='<div class="empty-state"><svg><use href="#i-moon"/></svg><span>第一场修好的梦，会被珍藏在这里。<br>去接一份小小的委托吧。</span></div>';}
    else state.cards.slice().reverse().forEach(card=>{const d=dreams[card.type];if(!d)return;const article=document.createElement('article');article.className='postcard';const img=document.createElement('img');img.src='assets/'+d.image+'.svg';img.alt=d.title;const title=document.createElement('h3');title.textContent=d.title;const date=document.createElement('p');date.textContent=card.date+' · 修复留念';article.append(img,title,date);$('postcards').append(article);});
  }
  document.querySelectorAll('[data-page]').forEach(el=>el.addEventListener('click',()=>switchPage(el.dataset.page)));
  document.querySelector('.brand').addEventListener('click',e=>{e.preventDefault();switchPage('home');});
  $('start-order').onclick=()=>switchPage('dream');
  $('wallet').onclick=()=>toast('梦砂用于修梦、点心和装饰。修复梦境可以赚取。');
  function care(type){if(Date.now()-careTime<700)return;if(extras){if(type==='feed'){extras.snacks();return;}if(type==='play'){extras.play();return;}extras.animate('touch');}careTime=Date.now();const lines={touch:['摸摸头，烦恼就飞走一点。','再摸一下也不是不可以。','你的手心，是暖的。'],feed:['是云朵味的小饼干！','给你留了半块，藏在口袋里。'],play:['接住！是一颗不会烫手的小星星。','今天的快乐，也存进梦里。']};if(type==='feed'){if(state.coins<3)return toast('梦砂不够了，先一起修一场梦吧。');state.coins-=3;state.spent+=3;}state.mood=Math.min(100,state.mood+(type==='feed'?6:3));const choices=(voices[state.personality]||voices.gentle)[type]||lines[type];say((state.userName?state.userName+'，':'')+choices[Math.floor(Math.random()*choices.length)]);save();render();}
  document.querySelectorAll('[data-care]').forEach(el=>el.onclick=()=>care(el.dataset.care));
  $('pet').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();care('touch');}});
  let drag=null;const pet=$('pet'),stage=$('room-stage');
  function placePet(){const anchor=$('pet-anchor');anchor.style.left=state.position.x+'%';anchor.style.top=state.position.y+'%';followSpeech();}
  pet.addEventListener('pointerdown',e=>{if(e.button!==0)return;const box=pet.getBoundingClientRect();drag={id:e.pointerId,x:e.clientX,y:e.clientY,dx:e.clientX-box.left,dy:e.clientY-box.top,moved:false};pet.setPointerCapture(e.pointerId);$('pet-anchor').classList.remove('bounce');});
  pet.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;if(Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>6)drag.moved=true;if(!drag.moved)return;pet.classList.add('dragging');const b=stage.getBoundingClientRect();state.position={x:Math.max(0,Math.min(76,100*(e.clientX-b.left-drag.dx)/b.width)),y:Math.max(24,Math.min(62,100*(e.clientY-b.top-drag.dy)/b.height))};placePet();});
  function endDrag(e){if(!drag||e.pointerId!==drag.id)return;const moved=drag.moved;drag=null;pet.classList.remove('dragging');if(pet.hasPointerCapture(e.pointerId))pet.releasePointerCapture(e.pointerId);if(moved){speak('drag');save();}else if(e.type==='pointerup')care('touch');}
  pet.addEventListener('pointerup',endDrag);pet.addEventListener('pointercancel',endDrag);
  $('buy-decor').onclick=()=>{if(state.decor)return;if(state.coins<35)return toast('还差 '+(35-state.coins)+' 梦砂，修梦后再来看看。');state.coins-=35;state.spent+=35;state.decor=true;save();render();say('以后晚归，也有星星等我们。');toast('星星灯已经挂在小店里了。');};
  const modal=$('appearance-dialog');$('appearance').onclick=()=>modal.showModal();$('close-appearance').onclick=()=>modal.close();modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)modal.close();}});
  $('upload-image').onclick=()=>$('image-input').click();
  $('default-image').onclick=()=>{state.image='';$('pet-img').src='assets/pet.svg';save();render();modal.close();toast('熟悉的小眠回来了。');};
  $('image-input').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(!['image/png','image/jpeg','image/webp','image/gif'].includes(file.type))throw Error('请选择 PNG、JPG、WebP 或 GIF 图片。');if(file.size>10*1024*1024)throw Error('图片太大了，请选择小于 10MB 的图片。');const bitmap=await createImageBitmap(file);const canvas=document.createElement('canvas');const scale=Math.min(1,256/Math.max(bitmap.width,bitmap.height));canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));canvas.getContext('2d').drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();state.image=canvas.toDataURL('image/png');$('pet-img').src=state.image;save();render();modal.close();toast('新模样已保存。动图会保留为静态形象。');}catch(err){toast(err.message||'图片读取失败，请换一张试试。');}e.target.value='';};
  const restartDialog=$('restart-dialog');
  $('reset-data').onclick=()=>{restartDialog.returnValue='';if(!restartDialog.open)restartDialog.showModal();$('cancel-restart').focus();};
  restartDialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();restartDialog.close('cancel');}});
  restartDialog.addEventListener('close',()=>{if(restartDialog.returnValue!=='restart')return;restartDialog.returnValue='';state=fresh();$('pet-img').src='assets/pet.svg';placePet();save();render();say('重新出发，也要一起。');toast('小店重新开张了。');});

  const voices={
    gentle:{touch:['把今天的疲惫放在这里吧。','不急，我会一直陪着你。'],feed:['谢谢你的点心，给你留一半。','这份甜甜的心意，我收到了。','我们一人一口，慢慢吃。'],play:['我们把快乐藏进明天的梦里。'],hello:'今天也一起，慢慢把好梦补好。',whisper:'不用每一天都很厉害。好好休息，也是在照顾未来的自己。'},
    lively:{touch:['收到摸摸！今天的能量满格！','嘿嘿，再摸一下就出发！'],feed:['点心补给收到！好梦小队集合！','甜度满分！今天又是快乐营业的一天！','等一下！最好吃的第一口留给你！'],play:['抓到一颗星星！送你啦！'],hello:'好梦小队集合，今天也要收集快乐！',whisper:'今天的小任务：找一件让你开心的小事，哪怕只是喝到一口温水！'},
    shy:{touch:['嗯……你的手，好暖。','可以……再陪我坐一会儿吗？'],feed:['我偷偷给你留了最好吃的一块。','是给我的……？谢谢，我很喜欢。','你也尝尝吧……一起吃会更甜。'],play:['有你在，我就敢往前一点点。'],hello:'你来了……我给你留了靠窗的位置。',whisper:'有句话想悄悄告诉你：你出现的时候，这间小店就亮了一点。'},
    cool:{touch:['就、就允许你摸一下。','别误会，我只是刚好站在这里。'],feed:['你的那份我留好了，别忘了。','还不错。下次……也可以一起吃。','别光顾着喂我，你也得好好吃东西。'],play:['跟紧一点，我会替你看着路。'],hello:'你来得正好，小店我已经替你照看好了。',whisper:'累了就歇着。小店有我，不用什么事都自己撑着。'}
  };
  function followSpeech(){
    const anchor=$('pet-anchor'),bubble=$('speech'),stage=$('room-stage');
    if(!stage.clientWidth)return;
    const center=anchor.offsetLeft+anchor.offsetWidth/2;
    bubble.style.maxWidth=Math.min(200,stage.clientWidth-24)+'px';
    const minimumTop=bubble.offsetHeight+21; if(anchor.offsetTop<minimumTop){anchor.style.top=minimumTop+'px';state.position.y=100*minimumTop/stage.clientHeight;} const half=bubble.offsetWidth/2;
    const shift=Math.max(12+half,Math.min(stage.clientWidth-12-half,center))-center;
    bubble.style.left=(anchor.offsetWidth/2+shift)+'px';
    bubble.style.setProperty('--tail',(bubble.offsetWidth/2-shift)+'px');
  }
  function renderProfile(){
    const name=state.petName||'小眠';
    $('partner-display').textContent=name;
    $('pet').setAttribute('aria-label','戳戳或拖动'+name);
    $('pet-img').alt=name+'，你的修梦伙伴';
    document.querySelector('.intro .subline').textContent=(state.userName||'店长')+'，和'+name+'一起收留每一场未完的梦。';
    requestAnimationFrame(followSpeech);
  }
  const settings=$('settings-dialog');
  $('open-settings').onclick=()=>{
    $('user-name').value=state.userName||'';$('pet-name').value=state.petName||'小眠';
    document.querySelector('input[name=personality][value='+ (Object.hasOwn(voices,state.personality)?state.personality:'gentle') +']').checked=true;updatePreview();settings.showModal();
  };
  $('close-settings').onclick=()=>settings.close();
  $('settings-form').onsubmit=e=>{e.preventDefault();state.userName=$('user-name').value.trim().slice(0,16);state.petName=$('pet-name').value.trim().slice(0,12)||'小眠';state.personality=document.querySelector('input[name=personality]:checked').value;save();render();settings.close();say((state.userName?state.userName+'，':'')+voices[state.personality].hello);toast('我们的设定已保存。');};
  $('daily-whisper').onclick=()=>say((state.userName?state.userName+'，':'')+(voices[state.personality]||voices.gentle).whisper);
  new ResizeObserver(followSpeech).observe(stage);


  const sceneVoices={
    gentle:{start:['慢慢来，我们先把梦里的光找回来。','这场梦有些凉，一起替它暖一暖。'],finish:['又有人能安心入睡了，辛苦你。','我们一起，把这场梦温柔地补好了。'],drag:['这里的月光，好像更软一些。','你在哪里，我就陪你在哪里。'],open:['把灯点亮吧，我们一起等客人。'],close:['今天就到这里，剩下的梦明天再补。'],furniture:['我们的小店，又多了一处温暖。'],win:['你接住了五颗星光，也接住了今天的快乐。']},
    lively:{start:['第一位客人来啦！好梦小队开工！','碎片搜寻开始！我负责给你加油！'],finish:['配合满分！快把好消息告诉客人！','好梦交付！我们的招牌又亮了一点！'],drag:['换个位置！这里适合发现新星星！'],open:['开门啦！今天也要闪闪发光！'],close:['收工收工！现在是我们的休息时间！'],furniture:['新家具就位！快来看看我们的新角落！'],win:['五颗全接住！你就是接星星冠军！']},
    shy:{start:['我把工具准备好了……我们一起试试？'],finish:['真的修好了……和你一起，我就不怕了。'],drag:['这里离你……是不是更近一点？'],open:['客人会喜欢这里吗……有你在应该会的。'],close:['关门以后……可以再陪我坐一会儿吗？'],furniture:['这个角落……以后可以一起坐吗？'],win:['你好厉害……这五颗星星，我会好好收着。']},
    cool:{start:['工具检查过了。你找碎片，我来搭把手。'],finish:['做得不错。酬劳记得领，别又忙忘了。'],drag:['这个位置还行。我只是顺便陪你。'],open:['招牌我擦好了。走吧，该营业了。'],close:['好了，今天不加班。我陪你休息。'],furniture:['位置我量过了，放在这里正合适。'],win:['接得挺准。不是夸你……好吧，是在夸你。']}
  };
  const lastLine={};
  function speak(event){const list=(sceneVoices[state.personality]||sceneVoices.gentle)[event]||(voices[state.personality]||voices.gentle)[event]||['我在这里，陪着你。'];let index=Math.floor(Math.random()*list.length);if(list.length>1&&lastLine[event]===index)index=(index+1)%list.length;lastLine[event]=index;const line=(state.userName?state.userName+'，':'')+list[index];say(line);document.dispatchEvent(new CustomEvent('atelier-shop-speech',{detail:{event,text:line}}));}
  function updatePreview(){const value=document.querySelector('input[name=personality]:checked').value;$('personality-preview').textContent='“'+voices[value].hello+'”';}
  document.querySelectorAll('input[name=personality]').forEach(el=>el.onchange=updatePreview);
  extras=window.initAtelier({$: $,getState:()=>state,save,render,say,speak,toast,followSpeech});

  shop=window.initDreamShop({$,getState:()=>state,save,render,toast,speak,switchPage});
  $('today').textContent=new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit'}).toUpperCase().replace(' ','.');
  if(state.image&&state.image.startsWith('data:image/png;base64,'))$('pet-img').src=state.image;
  window.initLocalTools({getState:()=>state,toast});
  placePet();render();say((state.userName?state.userName+'，':'')+(voices[state.personality]||voices.gentle).hello);
})();
