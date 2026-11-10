/* Auto-tour: walks through the demo using the 3 preset roles,
   with English narration captions. Used to record a hands-free demo video.
   Triggered only when the URL contains ?tour=1 */

function goNav(v){
  const b=document.querySelector('nav button[data-v='+v+']');
  if(b)b.click();
}
function setInput(id,val){
  const el=document.getElementById(id);
  if(el){el.value=val;}
}

async function runTour(){
  if(!/[?&]tour(=|$)/.test(location.search)) return;
  // fresh, clean state so the video is deterministic
  app.tts=false; app.memories=[]; app.chats={}; setLang('en'); save();

  const cap=document.getElementById('capbar');
  if(cap)cap.classList.add('show');
  const nEl=document.getElementById('capnum');
  const cEl=document.getElementById('captext');
  const step=(n,txt)=>{ if(nEl)nEl.textContent='Step '+n; if(cEl)cEl.textContent=txt; };
  const wait=ms=>new Promise(r=>setTimeout(r,ms));

  try{
    // 1. Roles library
    goNav('roles');
    step(1,'Welcome. This is a concept prototype of a multi-role, user-cultivated AI companion. Three demo roles are preloaded - no sign-up or role creation needed to explore.');
    await wait(5200);

    // 2. Chat with the Confidant (warm, casual persona)
    goChat('friend');
    step(2,'Each role has its own persona, voice and memory. Here the Confidant (Ayumi-type) replies in a warm, casual tone.');
    await wait(1900);
    setInput('chatInput','I will tell you a secret: I have a big interview next week and I am nervous.');
    sendChat();
    await wait(2100);
    step(2,'The Confidant responds with empathy and encouragement.');
    await wait(3600);

    // 3. Save a private memory with that role
    app.memories.push({id:'m'+Date.now(),content:'I have a big interview next week and I am nervous.',owner:'friend',shared:[],created:Date.now()});
    save();
    step(3,'A user can save a private memory with one role. By default, only that role can access it.');
    await wait(4100);

    // 4. Multi-role collaboration
    goNav('collab');
    step(4,'Under the users authorization, multiple roles answer the same question from their own perspectives.');
    setInput('collabInput','I would like to hear what all three of you think: should I change jobs?');
    runCollab();
    await wait(4600);

    // 5. Memory access control (the differentiator)
    goNav('memory');
    step(5,'Key differentiator: the user grants the Mentor access to a private memory that belongs to the Confidant; the Mentor can then recall it.');
    const mem=app.memories[app.memories.length-1];
    if(mem)toggleShare(mem.id,'mentor');
    await wait(4100);

    // 6. Mentor recalls the shared memory
    goChat('mentor');
    step(6,'The Mentor, just granted access, recalls the shared memory and responds in a calm, guiding tone.');
    await wait(1900);
    setInput('chatInput','Do you still remember what I told the Confidant?');
    sendChat();
    await wait(2100);
    step(6,'The Mentor recalls the private memory across roles.');
    await wait(3600);

    // 7. Image mode (multimodal)
    goNav('image');
    step(7,'Image mode: upload a photo, pick a role, get persona-conditioned copy (echoing mood_pipeline: image to affect to persona text).');
    const sd=document.createElement('div');
    sd.className='samplephoto';
    sd.innerHTML='Sample<br>photo';
    document.getElementById('imgWrap').appendChild(sd);
    const ir=document.getElementById('imgRole');
    if(ir)ir.value='mentor';
    const ibox=document.getElementById('imgBox');
    const rr=app.roles.find(x=>x.id==='mentor');
    const copy=pick((IMGCOPIES[rr.id]||IMGCOPIES.default).map(x=>x[lang]));
    addMsg(ibox,'me',t('img_me'),t('who_me'));
    addMsg(ibox,'bot','('+roleName('mentor')+' - '+(lang==='zh'?'图像模式示意':'image mode demo')+') '+copy,roleName('mentor'));
    await wait(4600);

    // 8. Closing
    step(8,'This prototype embodies the thesis: User-Curated and Role-Adaptive AI Companions with personalised memory and long-term human-AI relationships. Thank you!');
    await wait(5600);
  }catch(e){
    console.error('tour error',e);
  }
  if(cap)cap.classList.remove('show');
  window.__tourDone=true;
}

if(/[?&]tour(=|$)/.test(location.search)){
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',runTour);
  }else{
    runTour();
  }
}
