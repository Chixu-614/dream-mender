'use strict';
(() => {
  const $ = id => document.getElementById(id);
  const key = 'mian-dream-atelier-v1';
  let pending = null;
  window.initLocalTools = ({getState, toast}) => {
    const status = $('storage-status');
    try {
      const probe = 'atelier-storage-probe-' + Date.now();
      localStorage.setItem(probe, '1'); localStorage.removeItem(probe);
      status.textContent = '进度自动保存在当前浏览器。换浏览器、移动文件或清理数据前，请导出备份。';
    } catch (_) {
      status.textContent = '当前打开方式不允许自动保存：仍可交互，但关闭前请导出进度备份。';
      status.setAttribute('role', 'alert');
    }
    $('export-progress').onclick = () => {
      try {
        const backup = {format:'dream-mender-backup', version:1, exportedAt:new Date().toISOString(), state:{...getState(),version:1}};
        try { backup.audio = JSON.parse(localStorage.getItem('dream-audio-settings-v1') || 'null'); } catch (_) {}
        const url = URL.createObjectURL(new Blob([JSON.stringify(backup,null,2)], {type:'application/json'}));
        const a = document.createElement('a'); a.href=url; a.download='梦境织补屋-进度-'+new Date().toISOString().slice(0,10)+'.json';
        document.body.append(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),60000);
        toast('已请求下载备份，请确认文件已保存到下载目录。');
      } catch (_) { toast('导出失败，请换用支持下载的完整浏览器。'); }
    };
    $('import-progress').onclick = () => $('progress-file').click();
    $('progress-file').onchange = async e => {
      const file=e.target.files[0]; e.target.value=''; if(!file)return;
      try {
        if(file.size>5*1024*1024)throw Error('备份文件超过 5MB。');
        const data=JSON.parse(await file.text()), s=data.state;
        if(data.format!=='dream-mender-backup'||data.version!==1||!s||s.version!==1)throw Error('不是可识别的小店备份。');
        for(const k of ['coins','mood','fixed','profit','spent','order','daily'])if(!Number.isFinite(s[k])||s[k]<0)throw Error('备份数值不完整。');
        for(const k of ['cards','furniture','guests','reviews','visitors','seenDreams'])if(!Array.isArray(s[k]))throw Error('备份内容不完整。');
        if(!s.position||!Number.isFinite(s.position.x)||!Number.isFinite(s.position.y)||s.mood>100)throw Error('备份位置或心情无效。');
        for(const k of ['userName','petName','personality','image','day'])if(typeof s[k]!=='string')throw Error('备份文字信息无效。');
        if(!['gentle','lively','shy','cool'].includes(s.personality))throw Error('伙伴性格无效。');
        if(s.image&&!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(s.image))throw Error('伙伴图片格式无效。');
        if(s.cards.some(c=>!c||!Number.isInteger(c.type)||c.type<0||c.type>=15||typeof c.date!=='string'))throw Error('明信片信息无效。');
        if(s.task&&(!Number.isInteger(s.task.dream)||s.task.dream<0||s.task.dream>=15||!Array.isArray(s.task.collected)||s.task.collected.some(x=>![0,1,2].includes(x))))throw Error('修梦进度无效。');
        pending=JSON.parse(JSON.stringify(data));
        $('import-dialog').showModal(); $('cancel-import').focus();
      } catch(err) { pending=null; toast(err.message||'备份读取失败，当前进度未改变。'); }
    };
    const dialog=$('import-dialog');
    dialog.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();dialog.close('cancel');}});
    dialog.querySelector('form').addEventListener('submit',e=>{
      e.preventDefault();
      const data=pending; pending=null;
      const action=e.submitter?.value;
      dialog.close(action||'cancel');
      if(action!=='import'||!data)return;
      try {
        // 写入前保留当前值；失败时不切换页面，也不清空内存中的进度。
        const previous=localStorage.getItem(key);
        localStorage.setItem(key,JSON.stringify(data.state));
        try {
          const a=data.audio;
          if(a&&['music','effects','muted'].every(k=>typeof a[k]==='boolean')&&['musicVolume','effectsVolume'].every(k=>Number.isFinite(a[k])&&a[k]>=0&&a[k]<=100))localStorage.setItem('dream-audio-settings-v1',JSON.stringify(a));
        } catch (_) { if(previous===null)localStorage.removeItem(key);else localStorage.setItem(key,previous); throw Error('声音设置写入失败'); }
        location.reload();
      } catch (_) { toast('当前浏览器不能写入备份，原页面进度仍在。请使用允许本地存储的浏览器。'); }
    });
  };
})();
