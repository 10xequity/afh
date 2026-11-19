/* FieldhouseUSA floor plan: one geometry, two drawings, one controller.
   FHPLAN.flat(o)        top-down plan (loads first, cheapest)
   FHPLAN.iso(o)         3D view at any rotation (o.rot, degrees): room boxes, standing nets, raised mezzanine
   FHPLAN.mount(box,o)   puts a map in a container: flat/3D switch, drag or arrow buttons to rotate, click to pick
   viewBox 0 0 820 650, from Exhibit A "Facility Site Map" (owner, 2026-10-14). Schematic, not to scale.
   Clickable shapes carry data-el (own id), data-zone (zones) and data-spot (tour stop). Pins are numbered 1-10. */
(function(){
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ROOMS=[
    {id:'rest1',x:34,y:48,w:61,h:104,label:['Restroom','1']},
    {id:'office',x:100,y:48,w:88,h:104,label:['Admin']},
    {id:'shoot360',x:193,y:48,w:183,h:104,label:['S360','Basketball']},
    {id:'therapy',x:438,y:158,w:45,h:59,label:['Therapy','/ Spa'],small:true},
    {id:'admin2',x:486,y:158,w:213,h:59,label:['Admin']},
    {id:'storage',x:703,y:158,w:80,h:59,label:['Storage /','Dock']},
    {id:'socialden',x:438,y:221,w:91,h:116,label:['Social','Den']},
    {id:'studio2',x:533,y:221,w:166,h:79,label:['Studio 2']},
    {id:'rest2',x:703,y:221,w:80,h:79,label:['Restroom','2']},
    {id:'odaup',x:438,y:341,w:91,h:66,label:['Bar /','Kitchen']},
    {id:'studio1',x:533,y:304,w:71,h:103,label:['Studio 1']},
  ];
  const MEZZ={x:387,y:510,w:47,h:96}; /* raised deck against the south wall, between zones 4 and 6, about one court long */
  const HW=['Hardwood courts','2 volleyball or 1 basketball'];
  const ZONES={
    1:{box:[22,195,172,199],courts:[[36,209,144,84],[36,303,144,84]],desc:HW},
    3:{box:[199,195,184,199],courts:[[215,209,152,84],[215,303,152,84]],desc:HW},
    2:{box:[22,398,172,208],courts:[[36,416,144,84],[36,510,144,84]],desc:HW},
    4:{box:[199,398,184,208],courts:[[215,416,152,84],[215,510,152,84]],desc:HW},
    5:{box:[438,51,345,104],courts:[[452,60,150,86],[618,60,150,86]],desc:['2 volleyball courts']},
    6:{box:[438,413,166,193],courts:[[452,427,138,80],[452,517,138,80]],desc:['Sports court','2 volleyball courts']},
    7:{box:[609,308,182,298],courts:[[623,322,154,86],[623,418,154,86],[623,514,154,86]],desc:['Sports court','and futsal arena']}
  };
  /* tour stops in order: where the numbered pin sits, and which shapes light up */
  const SPOTS=[
    {id:'entrance',pin:[408,64],on:['office']},
    {id:'shoot360',pin:[358,68],on:['shoot360']},
    {id:'hall13',pin:[196,295],on:['z1','z3']},
    {id:'socialden',pin:[512,240],on:['socialden']},
    {id:'odaup',pin:[453,357],on:['odaup']},
    {id:'studio1',pin:[568,326],on:['studio1']},
    {id:'studio2',pin:[682,238],on:['studio2']},
    {id:'mezz',pin:[410,529],on:['mezzdeck']},
    {id:'court6',pin:[521,468],on:['z6']},
    {id:'court7',pin:[700,366],on:['z7']}
  ];
  const spotOf=el=>{const s=SPOTS.find(s=>s.on.includes(el));return s?s.id:'';};
  const attrs=(el,label)=>{const sp=spotOf(el),z=/^z\d$/.test(el);
    return `data-el="${el}"`+(z?` data-zone="${el.slice(1)}"`:'')+(sp?` data-spot="${sp}"`:'')+(sp||z?` tabindex="0" role="button" aria-label="${esc(label)}"`:'');};
  const names=o=>SPOTS.map((s,i)=>({...s,n:i+1,name:(o.spots||[]).find(x=>x.id===s.id)?.name||s.id}));

  function court(x,y,w,h,net){const mx=x+w/2,a=w/6;return `<rect class="court" x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/>
    <line class="attack" x1="${mx-a}" y1="${y}" x2="${mx-a}" y2="${y+h}"/><line class="attack" x1="${mx+a}" y1="${y}" x2="${mx+a}" y2="${y+h}"/>`+
    (net?`<line class="net" x1="${mx}" y1="${y-4}" x2="${mx}" y2="${y+h+4}"/><circle class="post" cx="${mx}" cy="${y-4}" r="3"/><circle class="post" cx="${mx}" cy="${y+h+4}" r="3"/>`:'');}
  const lines=(a,x,y,lh,cls)=>a.map((t,i)=>`<text class="${cls}" x="${x}" y="${(y+5-(a.length-1)*lh/2+i*lh).toFixed(1)}">${esc(t)}</text>`).join('');
  /* the floor, shared by both views. o.flat adds nets as lines, room outlines and all the text */
  function floor(o){
    let s=`<rect class="shell" x="15" y="35" width="785" height="574" rx="4"/><rect class="lot" x="205" y="4" width="420" height="24" rx="3"/><rect class="door" x="384" y="31" width="48" height="8"/><path class="arrow" d="M408 12 v22 m-6 -7 l6 7 l6 -7"/>`;
    if(o.flat)s+=`<text class="lbl" x="520" y="21">Parking lot</text><text class="lbl-s" x="408" y="50">Main entrance</text>`;
    for(const [n,z] of Object.entries(ZONES)){
      const [bx,by,bw,bh]=z.box,cy=by+bh/2;
      s+=`<g ${attrs('z'+n,'Zone '+n+', '+z.desc.join(', '))}><rect class="zbox" x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="3"/>`;
      z.courts.forEach(c=>s+=court(...c,o.flat));
      if(o.flat)s+=`<text class="znum" x="${bx+bw/2}" y="${cy+2}">${n}</text>`+z.desc.map((t,i)=>`<text class="zdesc" x="${bx+bw/2}" y="${cy+20+i*13}">${esc(t)}</text>`).join('');
      s+=`<rect class="hit" x="${bx}" y="${by}" width="${bw}" height="${bh}"/></g>`;
    }
    if(o.flat)s+=`<g data-el="mezzdeck" data-spot="mezz" tabindex="0" role="button" aria-label="Mezzanine"><rect class="room" x="${MEZZ.x}" y="${MEZZ.y}" width="${MEZZ.w}" height="${MEZZ.h}" rx="2"/><text class="lbl-s" transform="rotate(-90 ${MEZZ.x+MEZZ.w/2} ${MEZZ.y+MEZZ.h/2+14})" x="${MEZZ.x+MEZZ.w/2}" y="${MEZZ.y+MEZZ.h/2+18}">Mezzanine</text><rect class="hit" x="${MEZZ.x}" y="${MEZZ.y}" width="${MEZZ.w}" height="${MEZZ.h}"/></g>`;
    if(o.flat)for(const r of ROOMS)s+=`<g ${attrs(r.id,r.label.join(' '))}><rect class="room" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="2"/>${lines(r.label,r.x+r.w/2,r.y+r.h/2,r.small?11:14,r.small?'lbl-s':'lbl')}<rect class="hit" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"/></g>`;
    return s;
  }
  const pinSvg=(s,x,y,stem,k=1)=>`<g class="pin" data-spot="${s.id}" data-pin tabindex="0" role="button" aria-label="${s.n}. ${esc(s.name)}">${stem||''}<circle class="halo" cx="${x}" cy="${y}" r="${15*k}"/><circle class="dot" cx="${x}" cy="${y}" r="${10.5*k}"/><text class="pnum" x="${x}" y="${y+4.6*k}" style="font-size:${13*k}px">${s.n}</text></g>`;

  function flat(o={}){
    return `<svg class="plan" viewBox="0 0 820 650" role="group" aria-label="Floor plan">${floor({flat:true})}
      <text class="lbl-s foot" x="22" y="632" style="text-anchor:start">Zones 1 to 4 convert: 8 volleyball, 4 basketball or 12 pickleball courts. Schematic, not to scale.</text>
      ${names(o).map(s=>pinSvg(s,s.pin[0],s.pin[1])).join('')}</svg>`;
  }

  /* ---- 3D. The plan turns about its centre by o.rot degrees, then is drawn isometric: x' down-right, y' down-left, z up. ---- */
  const C=.866,S=.5,CX=408,CY=322;
  function iso(o={}){
    const t=(o.rot||0)*Math.PI/180,co=Math.cos(t),si=Math.sin(t);
    const R=(x,y)=>[(x-CX)*co-(y-CY)*si,(x-CX)*si+(y-CY)*co];
    const depth=(x,y)=>{const r=R(x,y);return r[0]+r[1];};
    const P=(x,y,z=0)=>{const r=R(x,y);return [+((r[0]-r[1])*C).toFixed(1),+((r[0]+r[1])*S-z).toFixed(1)];};
    const poly=(cls,pts)=>`<polygon class="${cls}" points="${pts.map(p=>p.join(',')).join(' ')}"/>`;
    /* the two side faces that look at the viewer, then the top */
    function box(x,y,w,h,z0,z1){
      const f=[[x,y+h,x+w,y+h],[x+w,y,x+w,y+h],[x,y,x+w,y],[x,y,x,y+h]].map(e=>({e,d:depth((e[0]+e[2])/2,(e[1]+e[3])/2)})).sort((a,b)=>b.d-a.d).slice(0,2);
      return f.map(({e})=>{const a=P(e[0],e[1],z0),b=P(e[2],e[3],z0);return poly((a[0]+b[0])/2<P(x+w/2,y+h/2,z0)[0]?'sl':'sr',[a,b,P(e[2],e[3],z1),P(e[0],e[1],z1)]);}).join('')+
        poly('top',[P(x,y,z1),P(x+w,y,z1),P(x+w,y+h,z1),P(x,y+h,z1)]);
    }
    const ln=(p,q,c)=>`<line class="${c}" x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/>`;
    const net=(x,y,w,h)=>{const mx=x+w/2,a=y-4,b=y+h+4;return poly('netq',[P(mx,a,9),P(mx,b,9),P(mx,b,24),P(mx,a,24)])+ln(P(mx,a,24),P(mx,b,24),'tape')+ln(P(mx,a,0),P(mx,a,27),'pole')+ln(P(mx,b,0),P(mx,b,27),'pole');};
    const tag=(a,x,y,z,cls,lh)=>{const p=P(x,y,z);return lines(a,p[0],p[1],lh,cls);};
    const H=30,parts=[];
    for(const r of ROOMS)parts.push({d:depth(r.x+r.w/2,r.y+r.h/2),s:`<g ${attrs(r.id,r.label.join(' '))}>${box(r.x,r.y,r.w,r.h,0,H)}${tag(r.label,r.x+r.w/2,r.y+r.h/2,H,r.small?'lbl-s':'lbl',r.small?11:13)}</g>`});
    for(const z of Object.values(ZONES))for(const c of z.courts)parts.push({d:depth(c[0]+c[2]/2,c[1]+c[3]/2),s:net(...c)});
    parts.push({d:depth(MEZZ.x+MEZZ.w/2,MEZZ.y+MEZZ.h/2)+.5,s:`<g data-el="mezzdeck" data-spot="mezz" tabindex="0" role="button" aria-label="Mezzanine">${box(MEZZ.x,MEZZ.y,MEZZ.w,MEZZ.h,52,57)}${tag(['Mezzanine'],MEZZ.x+MEZZ.w/2,MEZZ.y+MEZZ.h/2,57,'lbl-s',11)}</g>`});
    parts.sort((a,b)=>a.d-b.d);
    const walls=[[15,35,800,35],[800,35,800,609],[15,609,800,609],[15,35,15,609]].map(e=>({e,d:depth((e[0]+e[2])/2,(e[1]+e[3])/2)})).sort((a,b)=>a.d-b.d).slice(0,2)
      .map(({e})=>poly('wall',[P(e[0],e[1]),P(e[2],e[3]),P(e[2],e[3],46),P(e[0],e[1],46)])).join('');
    const m=[C*(co-si),S*(co+si),-C*(si+co),S*(co-si)],e=-m[0]*CX-m[2]*CY,f=-m[1]*CX-m[3]*CY;
    const znums=Object.entries(ZONES).map(([n,z])=>tag([n],z.box[0]+z.box[2]/2,z.box[1]+z.box[3]/2,0,'znum',0)).join('');
    const pins=names(o).map(s=>{const z=s.id==='mezz'?57:s.on.some(e=>/^z/.test(e))||s.id==='entrance'?0:H,a=P(s.pin[0],s.pin[1],z);return {y:a[1],s:pinSvg(s,a[0],a[1]-34,ln(a,[a[0],a[1]-34],'stem'),1.5)};}).sort((a,b)=>a.y-b.y).map(p=>p.s).join('');
    return `<svg class="plan iso" viewBox="-610 -420 1220 780" role="group" aria-label="3D map of the building">
      ${poly('slab',[P(15,35,-10),P(800,35,-10),P(800,609,-10),P(15,609,-10)])}${walls}
      <g transform="matrix(${m.map(v=>v.toFixed(4)).join(' ')} ${e.toFixed(2)} ${f.toFixed(2)})">${floor({flat:false})}</g>${znums}${parts.map(p=>p.s).join('')}${tag(['Main entrance'],408,10,0,'lbl-s',0)}${pins}</svg>`;
  }

  /* ---- controller: one map in a container. o.pick(kind,id,el) is called with ('spot'|'zone', id). ---- */
  function mount(box,o={}){
    let view=o.view||'flat',rot=o.rot??0,on=[],pin=null,raf=0;
    box.classList.add('fhmap');
    box.innerHTML=`<div class="stage"></div><div class="rotbar" hidden><button type="button" data-rot="-45" aria-label="Rotate left">⟲</button><span>Drag the map to rotate</span><button type="button" data-rot="45" aria-label="Rotate right">⟳</button></div>`;
    const stage=box.firstChild,bar=box.lastChild;
    const paint=()=>{raf=0;stage.innerHTML=view==='3d'?iso({spots:o.spots,rot}):flat({spots:o.spots});bar.hidden=view!=='3d';stage.classList.toggle('grab',view==='3d');mark();};
    function mark(a,p){if(a)on=a;if(p!==undefined)pin=p;
      stage.querySelectorAll('[data-el]').forEach(g=>g.classList.toggle('on',on.includes(g.dataset.el)));
      stage.querySelectorAll('.pin').forEach(g=>g.classList.toggle('on',g.dataset.spot===pin));}
    const turn=d=>{rot=(rot+d)%360;if(!raf)raf=requestAnimationFrame(paint);};
    bar.addEventListener('click',e=>{const b=e.target.closest('[data-rot]');if(b)turn(+b.dataset.rot);});
    /* drag to rotate; a press that barely moves is a click */
    let x0=null,moved=0;
    stage.addEventListener('pointerdown',e=>{if(view!=='3d')return;x0=e.clientX;moved=0;});
    addEventListener('pointermove',e=>{if(x0===null)return;const dx=e.clientX-x0;if(Math.abs(dx)<3)return;moved+=Math.abs(dx);x0=e.clientX;turn(-dx*.35);});
    addEventListener('pointerup',()=>{x0=null;});
    /* the browser took the gesture (a vertical scroll, say): end the drag so the map stops following the pointer and the next tap still counts */
    addEventListener('pointercancel',()=>{x0=null;moved=0;});
    const pick=e=>{if(moved>6){moved=0;return;}const p=e.target.closest('.pin,[data-zone],[data-spot]');if(!p||!o.pick)return;
      if(p.classList.contains('pin')||!p.dataset.zone)o.pick('spot',p.dataset.spot,p);else o.pick('zone',p.dataset.zone,p);};
    stage.addEventListener('click',pick);
    stage.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(e);}});
    paint();
    return {mark,setView(v){view=v;paint();},get view(){return view;}};
  }
  window.FHPLAN={ROOMS,ZONES,SPOTS,flat,iso,mount};
})();
