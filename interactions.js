'use strict';
window.initAtelier = function(api){
  const {$,getState,save,render,speak,toast}=api;
  const svg=body=>'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" shape-rendering="crispEdges">'+body+'</svg>';
  const art={
    cake:svg('<path d="M12 31h40v23H12Z" fill="#d7b9aa"/><path d="M12 32h40v9H12M12 48h40v5H12" fill="#f5e9ce"/><path d="M9 26h46v10H9" fill="#f8eedb"/><path d="M26 17h12v12H26" fill="#ce9b9d"/><path d="M30 12h4v7h-4" fill="#94aa83"/>'),
    tea:svg('<path d="M18 19h29l-4 38H22Z" fill="#d4bca1"/><path d="M20 26h25l-2 25H22Z" fill="#ead8bb"/><path d="M15 16h35v7H15" fill="#c0cfbc"/><path d="M36 5h5v16h-5" fill="#a294b5"/><path d="M25 43h4v4h-4M35 47h4v4h-4M29 51h4v4h-4" fill="#93806e"/>'),
    biscuit:svg('<path d="M19 12h26v5h7v32h-7v5H19v-5h-7V17h7Z" fill="#dfc48e"/><path d="M22 23h5v5h-5M38 19h5v5h-5M35 37h5v5h-5M22 43h5v5h-5" fill="#a58d70"/>'),
    hand:svg('<path d="M23 7h8v20h4V11h8v20h4V19h7v24h-5v9H22v-6h-7v-6H9V29h8v5h6Z" fill="#b2a18f"/><path d="M25 9h4v23h8V13h4v23h8V21h3v21h-5v8H24v-6h-7v-6h-6v-7h4v5h10Z" fill="#f1dcc0"/><path d="M23 50h26v8H23" fill="#b8a8ce"/>'),
    rug:svg('<path d="M4 29h56v24H4" fill="#b8cbd0"/><path d="M9 33h46v16H9" fill="#dce6df"/><path d="M26 36h12v10H26M4 34H0v4h4M60 34h4v4h-4M4 45H0v4h4M60 45h4v4h-4" fill="#a8bec5"/>'),
    plant:svg('<path d="M28 17h7v27h-7" fill="#8d9e7a"/><path d="M11 16h15v7h7v9H19v-7h-8M35 9h17v13H41v8h-8" fill="#afbf94"/><path d="M18 40h29v7h-4v14H22V47h-4" fill="#c9b0a6"/><path d="M25 46h5v10h-5" fill="#dfc9ba"/>'),
    shelf:svg('<path d="M5 9h54v5H5M8 14h4v46H8M53 14h4v46h-4M8 36h49v5H8M8 56h49v5H8" fill="#b4a18b"/><path d="M16 19h7v17h-7" fill="#acbfad"/><path d="M25 23h7v13h-7" fill="#c6bbd4"/><path d="M35 18h12v18H35" fill="#d9cba6"/><path d="M18 46h25v10H18" fill="#bdd0d3"/>'),
    cushion:svg('<path d="M7 26h50v6h5v20h-5v6H7v-6H2V32h5" fill="#b2a4c5"/><path d="M10 29h44v22H10" fill="#dfd3e8"/><path d="M19 38h26v4H19" fill="#c9bbd5"/>'),
    sign:svg('<path d="M13 4h3v18h-3M48 4h3v18h-3" fill="#9f9883"/><path d="M5 20h54v28H5" fill="#c6baa1"/><path d="M9 24h46v20H9" fill="#eae4ca"/><path d="M20 30h5v9h-5M30 29h14v4H30M30 36h10v4H30" fill="#97a88b"/>')
  };
  const items=[
    {id:'rug',name:'湖蓝编织地毯',desc:'留一块并肩坐下的位置',cost:28,need:0,x:31,y:44,w:36},
    {id:'plant',name:'月光小盆栽',desc:'一场好梦，长出一片新叶',cost:40,need:1,x:2,y:66,w:15},
    {id:'cushion',name:'软云坐垫',desc:'休息也是一起经营的一部分',cost:48,need:2,x:65,y:69,w:19},
    {id:'sign',name:'手写晚安木牌',desc:'把晚安挂在我们的小店',cost:58,need:3,x:42,y:11,w:17},
    {id:'shelf',name:'好梦收藏架',desc:'收藏每一次共同完成的小事',cost:75,need:5,x:82,y:36,w:16}
  ];
  const snacks=[{id:'cake',name:'云朵小蛋糕',cost:5,mood:9},{id:'tea',name:'温温小奶茶',cost:4,mood:7},{id:'biscuit',name:'黄油小饼干',cost:3,mood:6}];
  let animationTimer,score=0,playing=false;
  const effect=document.createElement('div');effect.className='interaction-effect';effect.setAttribute('aria-hidden','true');$('pet-anchor').append(effect);
  const normalPet='assets/pet.svg',happyPet='assets/pet-happy.svg';
  function animate(type,food){
    clearTimeout(animationTimer);
    effect.innerHTML=type==='touch'?'<div class="pixel-hand">'+art.hand+'</div>':'<div class="offered-snack">'+art[food]+'</div>';
    effect.className='interaction-effect '+type;
    if(!getState().image)$('pet-img').src=happyPet;
    $('pet').classList.add('delighted');
    animationTimer=setTimeout(()=>{effect.innerHTML='';$('pet').classList.remove('delighted');if(!getState().image)$('pet-img').src=normalPet;},2100);
  }
  function renderExtras(){
    const s=getState();if(!Array.isArray(s.furniture))s.furniture=[];
    const label=document.querySelector('.open-label');label.innerHTML='<i></i>'+(s.businessOpen?' 小店营业中':' 小店休息中');label.classList.toggle('resting',!s.businessOpen);
    $('legacy-decor').hidden=false;
    $('furniture-layer').innerHTML=items.filter(item=>s.furniture.includes(item.id)).map(item=>'<div class="placed-furniture" data-furniture="'+item.id+'" style="left:'+item.x+'%;top:'+item.y+'%;width:'+item.w+'%" title="'+item.name+'">'+art[item.id]+'</div>').join('');
    $('furniture-catalog').replaceChildren();
    items.forEach(item=>{
      const owned=s.furniture.includes(item.id),locked=s.fixed<item.need;
      const card=document.createElement('article');card.className='furniture-card';
      card.innerHTML='<div class="furniture-preview">'+art[item.id]+'</div><div><h3>'+item.name+'</h3><p>'+item.desc+'</p><small>'+(owned?'已摆在预设位置':locked?'修好 '+item.need+' 场梦后解锁':'已解锁 · 固定位置摆放')+'</small></div>';
      const button=document.createElement('button');button.className='buy-button';button.textContent=owned?'已添置':locked?'未解锁':item.cost+' 梦砂';button.disabled=owned||locked;
      button.onclick=()=>{const current=getState();if(current.furniture.includes(item.id)||current.fixed<item.need)return;if(current.coins<item.cost)return toast('还差 '+(item.cost-current.coins)+' 梦砂，再修几场梦吧。');current.coins-=item.cost;current.spent+=item.cost;current.furniture.push(item.id);save();render();speak('furniture');toast(item.name+'已摆好，回小店看看吧。');};
      card.append(button);$('furniture-catalog').append(card);
    });
  }
  $('snack-grid').innerHTML=snacks.map(snack=>'<button class="snack-card" data-snack="'+snack.id+'">'+art[snack.id]+'<b>'+snack.name+'</b><small>'+snack.cost+' 梦砂 · 心情 +'+snack.mood+'</small></button>').join('');
  document.querySelectorAll('[data-snack]').forEach(button=>button.onclick=()=>{const snack=snacks.find(x=>x.id===button.dataset.snack),s=getState();if(s.coins<snack.cost)return toast('梦砂不够了，先一起修一场梦吧。');s.coins-=snack.cost;s.spent+=snack.cost;s.mood=Math.min(100,s.mood+snack.mood);save();render();$('snack-dialog').close();animate('feed',snack.id);speak('feed');toast('递上了'+snack.name+'。');});
  $('close-snacks').onclick=()=>$('snack-dialog').close();
  function moveStar(){const star=$('catch-star');star.style.left=(8+Math.random()*65)+'%';star.style.top=(8+Math.random()*60)+'%';}
  $('catch-star').onclick=()=>{if(!playing)return;score++;$('play-score').textContent=score+' / 5';if(score<5){moveStar();return;}playing=false;$('catch-star').hidden=true;const s=getState();s.mood=Math.min(100,s.mood+5);save();render();speak('win');$('play-note').textContent='五颗星光都接住了。谢谢你陪我玩！心情 +5';};
  $('close-play').onclick=()=>$('play-dialog').close();$('play-dialog').addEventListener('close',()=>{playing=false;});
  return {render:renderExtras,animate,snacks:()=>$('snack-dialog').showModal(),play:()=>{score=0;playing=true;$('play-note').textContent='点亮五次小星星，把星光装进口袋。不计时。';$('play-score').textContent='0 / 5';$('catch-star').hidden=false;$('play-dialog').showModal();moveStar();}};
};
