const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {chromium}=require(process.env.PDP_PLAYWRIGHT || 'playwright');
const root=path.resolve(__dirname,'..');
(async()=>{
  const server=http.createServer((req,res)=>{
    const pathname=new URL(req.url,'http://localhost').pathname;
    const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
    try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.html')?'text/html':'application/octet-stream');res.end(fs.readFileSync(file));}catch{res.writeHead(404).end();}
  });
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  let browser;
  try{
    browser=await chromium.launch({headless:true,channel:process.env.PDP_BROWSER_CHANNEL||'chrome'});
    const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[],modelCalls=[];
    page.on('request',req=>{if(/openrouter|atlascloud/.test(req.url()))modelCalls.push(req.url());});
    page.on('pageerror',e=>errors.push(e.message));
    // No remote services or real accounts during regression tests.
    await page.route('**/*',route=>route.request().url().startsWith('http://127.0.0.1:')?route.continue():route.abort());
    await page.goto(`http://127.0.0.1:${server.address().port}/`);
    await page.evaluate(()=>{openScanOverlay('salesplan');});
    const example=process.env.PDP_EXAMPLE;
    if(example) await page.locator('#scanFileInput').setInputFiles(example);
    else {
      const png=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=1200;c.height=800;const x=c.getContext('2d');x.fillStyle='white';x.fillRect(0,0,1200,800);x.fillStyle='black';x.font='32px sans-serif';x.strokeRect(50,50,500,300);x.fillText('Shelf: Grapes / TPR',70,120);x.strokeRect(600,50,500,300);x.fillText('Well: Blueberries',620,120);return c.toDataURL('image/png').split(',')[1];});
      await page.locator('#scanFileInput').setInputFiles({name:'plan.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')});
    }
    await page.getByRole('button',{name:'Arrange photo boxes'}).click();
    await page.waitForFunction(()=>document.querySelector('.plan-crop')?.height>150);
    if(example){for(let n=0;n<3;n++){await page.getByRole('button',{name:'Rotate 90°'}).click();await page.waitForTimeout(200);}}
    const sourceDimensions=await page.locator('.plan-crop').evaluate(c=>[c.width,c.height]);
    assert(sourceDimensions[0]>sourceDimensions[1],'Upright landscape source');
    const bounds=await page.locator('.plan-crop').boundingBox();
    await page.mouse.move(bounds.x+bounds.width*.1,bounds.y+bounds.height*.1);await page.mouse.down();
    await page.mouse.move(bounds.x+bounds.width*.4,bounds.y+bounds.height*.5);await page.mouse.up();
    assert(Math.abs(Number(await page.locator('[data-coord="w"]').inputValue())-30)<1,'Pointer crop selection');
    for(const [key,value] of (example?[['x','1'],['y','14'],['w','33'],['h','31']]:[['x','5'],['y','5'],['w','28'],['h','31']])){await page.locator(`[data-coord="${key}"]`).fill(value);await page.locator(`[data-coord="${key}"]`).dispatchEvent('change');}
    await page.locator('[data-title]').fill('First box <test>');
    await page.getByRole('button',{name:'Add selected box'}).click();
    await page.waitForFunction(()=>document.querySelector('.plan-crop')?.height>150);
    await page.locator('[data-title]').fill('Second box');
    await page.getByRole('button',{name:'Add selected box'}).click();
    await page.locator('[data-up="1"]').click();
    assert((await page.locator('figcaption').first().textContent()).startsWith('Second box'));
    await page.getByRole('button',{name:'Rotate 90°'}).click();
    assert((await page.locator('[data-status]').textContent()).includes('Remove this page'));
    for(const width of [390,1440]){
      await page.setViewportSize({width,height:900});
      assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'No viewport overflow');
      await page.screenshot({path:path.join(root,`backups/photo-editor-${width}.png`),fullPage:true});
    }
    await page.getByRole('button',{name:'Save photo plan'}).click();
    await page.waitForFunction(()=>!document.querySelector('#scanOverlay').classList.contains('open'));
    assert.equal(await page.locator('.plan-photo:visible').count(),2);
    await page.evaluate(()=>{window.testPhotoId=docActiveId.salesplan;});
    await page.reload();
    await page.evaluate(()=>{tab='docs';docView='salesplan';render();});
    assert.equal(await page.locator('.plan-photo:visible').count(),2,'Photo cards persist after reload');
    await page.setViewportSize({width:390,height:844});
    await page.locator('.plan-photo summary').first().click();
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Zoom scroll stays inside card');
    await page.screenshot({path:path.join(root,'backups/photo-viewer-mobile.png'),fullPage:true});
    await page.getByRole('button',{name:'Edit',exact:true}).click();
    await page.locator('[data-remove="1"]').click();
    await page.getByRole('button',{name:'Save photo plan'}).click();
    assert.equal(await page.locator('.plan-photo:visible').count(),1,'Edit saved crop removal');
    await page.getByRole('button',{name:'Edit',exact:true}).click();
    await page.locator('#scanClose').click();
    assert.equal(await page.locator('#view .plan-photo').count(),1,'Cancel edit restores viewer');
    const checks=await page.evaluate(async()=>{
      const results=[];
      const oldWrite=writeK,oldDb=firebaseDb,oldReady=cloudReady;
      const original=JSON.stringify(docStore),draft=JSON.parse(JSON.stringify(docStore.salesplan[0]));
      try{
        writeK=()=>false;
        try{await savePhotoPlan(draft);throw Error('expected failure');}catch(e){results.push(e.message.includes('storage is full') && JSON.stringify(docStore)===original);}
        writeK=oldWrite;
        firebaseDb={collection:()=>({doc:()=>({set:async()=>{throw Error('offline');}})})};cloudReady=true;
        try{await savePhotoPlan(draft);}catch(e){results.push(e.message.includes('Saved on this device'));}
        const count=docStore.salesplan.length,id=draft.savedId;
        firebaseDb={collection:()=>({doc:()=>({set:async()=>{}})})};
        await savePhotoPlan(draft);results.push(docStore.salesplan.length===count && draft.savedId===id);
        const large={...draft,images:['x'.repeat(900000)]};
        try{await savePhotoPlan(large);throw Error('expected failure');}catch(e){results.push(e.message.includes('too large'));}
        results.push(!PlanPhotos.card({photo:{x:0,y:0,w:1,h:1,source:0,width:100,height:100}},['javascript:alert(1)']).includes('<img'));
        results.push(PlanPhotos.rect({x:NaN,y:0,w:1,h:1})===null);
      }finally{writeK=oldWrite;firebaseDb=oldDb;cloudReady=oldReady;}
      return results;
    });
    assert(checks.every(Boolean),JSON.stringify(checks));
    assert.deepEqual(errors,[],'No uncaught app errors');
    assert.deepEqual(modelCalls,[],'Photo flow makes no model requests');
    console.log('Photo plan browser checks passed: upload, rotation, crops, reorder, phone/desktop, zoom, reload, edit, quota rollback, cloud retry, payload bound, unsafe source rejection.');
  }finally{if(browser)await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
