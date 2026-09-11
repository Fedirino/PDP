/* Original-photo display plans. No OCR, remote calls, or generated document markup. */
window.PlanPhotos = (() => {
  const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const safeSource = s => typeof s === 'string' && /^data:image\/(jpeg|png);base64,[A-Za-z0-9+/=]+$/.test(s);
  function rect(r) {
    if (!r || !['x','y','w','h'].every(k => Number.isFinite(r[k]))) return null;
    const x = Math.max(0, Math.min(.99, r.x)), y = Math.max(0, Math.min(.99, r.y));
    return {x, y, w:Math.max(.01, Math.min(1-x, r.w)), h:Math.max(.01, Math.min(1-y, r.h))};
  }
  function card(s, images) {
    const p=s.photo, r=rect(p), src=p && images?.[p.source];
    if (!r || !safeSource(src) || !Number.isInteger(p.source) || !Number.isFinite(p.width) || !Number.isFinite(p.height) || !(p.width>0 && p.height>0)) return '<p role="alert">Source photo unavailable. Please rescan this box.</p>';
    return `<figure class="plan-photo"><figcaption>${escape(s.category || 'Photo box')} <small>Original photo · zoom below</small></figcaption><div class="plan-photo-window" style="aspect-ratio:${p.width*r.w}/${p.height*r.h}"><img alt="${escape(s.category || 'Display box')} — original photographed text" src="${src}" style="width:${100/r.w}%;left:${-100*r.x/r.w}%;top:${-100*r.y/r.h}%"></div><details><summary>Enlarge box</summary><div class="plan-photo-zoom"><div style="width:${Math.max(700,Math.round(p.width*r.w))}px;max-width:none;position:relative;overflow:hidden;aspect-ratio:${p.width*r.w}/${p.height*r.h}"><img alt="Enlarged original box" src="${src}" style="position:absolute;max-width:none;width:${100/r.w}%;left:${-100*r.x/r.w}%;top:${-100*r.y/r.h}%"></div></div></details></figure>`;
  }
  function load(src) { return new Promise((resolve,reject)=>{const im=new Image(); im.onload=()=>resolve(im); im.onerror=()=>reject(new Error('Cannot open this photo.')); im.src=src;}); }
  function mount(host, draft, callbacks) {
    let page=0, selection={x:0,y:0,w:1,h:1}, drawing=null, generation=0;
    const sections=draft.sections, images=draft.images;
    const say=message=>{const el=host.querySelector('[data-status]');if(el) el.textContent=message;};
    function render() {
      const ticket=++generation;
      host.innerHTML=`<div class="scan-step">Arrange original photo boxes</div><p class="hintline">No AI transcription. Select one complete bordered box, including its heading and notes. Add boxes in the order you want to read them. The full page stays available.</p><label>Page <select data-page>${images.map((_,i)=>`<option value="${i}" ${page===i?'selected':''}>${i+1}</option>`).join('')}</select></label><div class="plan-photo-tools"><button class="btn ghost" data-turn>Rotate 90°</button><button class="btn ghost" data-full>Whole page</button></div><canvas class="plan-crop" aria-label="Drag across the page to select a box; percentage controls below are also available"></canvas><div class="plan-coordinates">${[['x','Left'],['y','Top'],['w','Width'],['h','Height']].map(([k,label])=>`<label>${label} %<input data-coord="${k}" type="number" min="0" max="100" step="0.1" value="${+(selection[k]*100).toFixed(1)}"></label>`).join('')}</div><label class="plan-title">Box label (optional)<input data-title maxlength="120" placeholder="e.g. Refrigerated Promo Table"></label><button class="btn block" data-add>Add selected box</button><p role="status" data-status></p><h3>${sections.length} box${sections.length===1?'':'es'} ready</h3><div data-cards>${sections.map((s,i)=>`<div>${card(s,images)}<div class="plan-photo-tools"><button class="btn ghost" data-up="${i}" ${i===0?'disabled':''} aria-label="Move box ${i+1} up">↑ Up</button><button class="btn ghost" data-down="${i}" ${i===sections.length-1?'disabled':''} aria-label="Move box ${i+1} down">↓ Down</button><button class="btn ghost" data-remove="${i}" aria-label="Remove box ${i+1}">Remove</button></div></div>`).join('')}</div><label class="plan-title">Display week starts<input data-week type="date" value="${escape(draft.date)}"></label><div class="plan-photo-tools"><button class="btn ghost" data-back>Back</button><button class="btn" data-save ${sections.length?'':'disabled'}>Save photo plan</button></div><p class="hintline">Photo text is preserved, not searchable or editable. Labels can be changed by removing and adding a box. Perspective and blur remain as photographed.</p>`;
      const canvas=host.querySelector('canvas'), ctx=canvas.getContext('2d'); let im;
      function paint(){if(!im)return;ctx.drawImage(im,0,0,canvas.width,canvas.height);ctx.strokeStyle='#00ddbb';ctx.lineWidth=3;ctx.strokeRect(selection.x*canvas.width,selection.y*canvas.height,selection.w*canvas.width,selection.h*canvas.height);}
      function update(){selection=rect(selection);host.querySelectorAll('[data-coord]').forEach(el=>el.value=+(selection[el.dataset.coord]*100).toFixed(1));paint();}
      load(images[page]).then(image=>{if(ticket!==generation || !host.contains(canvas))return;im=image;canvas.width=Math.min(1200,im.width);canvas.height=Math.round(canvas.width*im.height/im.width);paint();}).catch(e=>say(e.message));
      host.querySelector('[data-page]').onchange=e=>{page=+e.target.value;selection={x:0,y:0,w:1,h:1};render();};
      host.querySelector('[data-full]').onclick=()=>{selection={x:0,y:0,w:1,h:1};update();};
      host.querySelectorAll('[data-coord]').forEach(el=>el.onchange=()=>{const n=Number(el.value);if(Number.isFinite(n))selection[el.dataset.coord]=n/100;update();});
      function point(e){const b=canvas.getBoundingClientRect();return {x:Math.max(0,Math.min(1,(e.clientX-b.left)/b.width)),y:Math.max(0,Math.min(1,(e.clientY-b.top)/b.height))};}
      canvas.onpointerdown=e=>{if(!im)return;drawing=point(e);canvas.setPointerCapture(e.pointerId);};
      canvas.onpointermove=e=>{if(!drawing)return;const p=point(e);selection={x:Math.min(drawing.x,p.x),y:Math.min(drawing.y,p.y),w:Math.abs(p.x-drawing.x),h:Math.abs(p.y-drawing.y)};update();};
      canvas.onpointerup=canvas.onpointercancel=()=>drawing=null;
      host.querySelector('[data-turn]').onclick=()=>{if(!im)return;if(sections.some(s=>s.photo.source===page)){say('Remove this page’s selected boxes before rotating it. Other pages are unchanged.');return;}const cv=document.createElement('canvas');cv.width=im.height;cv.height=im.width;const c=cv.getContext('2d');c.translate(cv.width,0);c.rotate(Math.PI/2);c.drawImage(im,0,0);images[page]=cv.toDataURL('image/jpeg',.92);selection={x:0,y:0,w:1,h:1};render();};
      host.querySelector('[data-add]').onclick=()=>{if(!im){say('Wait for the page to load.');return;}sections.push({category:host.querySelector('[data-title]').value.trim()||`Page ${page+1} · Box ${sections.length+1}`,bullets:[],tables:[],photo:{...rect(selection),source:page,width:im.width,height:im.height}});render();};
      host.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{sections.splice(+b.dataset.remove,1);render();});
      for(const [key,delta] of [['up',-1],['down',1]])host.querySelectorAll(`[data-${key}]`).forEach(b=>b.onclick=()=>{const i=+b.dataset[key],j=i+delta;if(j<0||j>=sections.length)return;[sections[i],sections[j]]=[sections[j],sections[i]];render();});
      host.querySelector('[data-week]').onchange=e=>{draft.date=e.target.value;};
      host.querySelector('[data-back]').onclick=callbacks.back;
      host.querySelector('[data-save]').onclick=async e=>{if(!draft.date || !sections.length){say('Choose a display week and add at least one box.');return;}e.target.disabled=true;try{await callbacks.save(draft);}catch(err){say(err.message);}finally{e.target.disabled=false;}};
    }
    render();
  }
  return {rect,card,mount,safeSource};
})();
