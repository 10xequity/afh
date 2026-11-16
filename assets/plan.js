/* FieldhouseUSA floor plan: one geometry, two drawings.
   FHPLAN.flat()  top-down plan (loads first, cheapest)
   FHPLAN.iso()   3D view: room boxes, standing nets, raised mezzanine (static SVG, no animation cost)
   viewBox 0 0 820 650, from Exhibit A "Facility Site Map" (owner, 2026-10-14). Schematic, not to scale.
   Every clickable shape carries data-el (its own id) and data-spot (the tour stop it belongs to). */
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
    {id:'studio1',x:533,y:221,w:166,h:79,label:['Dance / Yoga','Studio 1']},
    {id:'rest2',x:703,y:221,w:80,h:79,label:['Restroom','2']},
    {id:'odaup',x:438,y:341,w:91,h:66,label:['Bar /','Kitchen']},
    {id:'studio2',x:533,y:304,w:71,h:103,label:['Studio 2']},
  ];
  const ZONES={
    1:{box:[22,195,172,199],courts:[[36,209,144,84],[36,303,144,84]],desc:['2 volleyball courts','or 1 basketball court']},
    3:{box:[199,195,184,199],courts:[[215,209,152,84],[215,303,152,84]],desc:['2 volleyball courts','or 1 basketball court']},
    2:{box:[22,398,172,208],courts:[[36,416,144,84],[36,510,144,84]],desc:['2 volleyball courts','or 1 basketball court']},
    4:{box:[199,398,184,208],courts:[[215,416,152,84],[215,510,152,84]],desc:['2 volleyball courts','or 1 basketball court']},
    5:{box:[438,51,345,104],courts:[[452,60,150,86],[618,60,150,86]],desc:['2 volleyball courts']},
    6:{box:[438,413,166,193],courts:[[452,427,138,80],[452,517,138,80]],desc:['2 volleyball courts']},
    7:{box:[609,308,182,298],courts:[[623,322,154,86],[623,418,154,86],[623,514,154,86]],desc:['3 volleyball courts','or 1 futsal arena']}
  };
  /* tour stops: where the pin sits, and which shapes light up */
  const SPOTS=[
    {id:'entrance',pin:[408,62],on:['office']},
    {id:'shoot360',pin:[358,68],on:['shoot360']},
    {id:'hall13',pin:[196,295],on:['z1','z3']},
    {id:'socialden',pin:[512,240],on:['socialden']},
    {id:'odaup',pin:[453,356],on:['odaup']},
    {id:'studio2',pin:[568,326],on:['studio2']},
    {id:'studio1',pin:[682,238],on:['studio1']},
    {id:'mezz',pin:[514,356],on:['mezzdeck']},
    {id:'court6',pin:[521,468],on:['z6']},
    {id:'court7',pin:[700,366],on:['z7']}
  ];
  const spotOf=el=>{const s=SPOTS.find(s=>s.on.includes(el));return s?s.id:'';};
  const attrs=(el,label)=>{const sp=spotOf(el);return `data-el="${el}"`+(sp?` data-spot="${sp}" tabindex="0" role="button" aria-label="${esc(label)}"`:'');};

  function court(x,y,w,h,net){const mx=x+w/2,a=w/6;return `<rect class="court" x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/>
    <line class="attack" x1="${mx-a}" y1="${y}" x2="${mx-a}" y2="${y+h}"/><line class="attack" x1="${mx+a}" y1="${y}" x2="${mx+a}" y2="${y+h}"/>`+
    (net?`<line class="net" x1="${mx}" y1="${y-4}" x2="${mx}" y2="${y+h+4}"/><circle class="post" cx="${mx}" cy="${y-4}" r="3"/><circle class="post" cx="${mx}" cy="${y+h+4}" r="3"/>`:'');}
  /* the floor: shared by both views. o.nets draws nets as lines (flat view); o.rooms draws rooms as outlines (flat view) */
  function floor(o){
    let s=`<rect class="shell" x="15" y="35" width="785" height="574" rx="4"/><rect class="lot" x="205" y="4" width="420" height="24" rx="3"/><text class="lbl" x="520" y="21">Parking lot</text>
      <rect class="door" x="384" y="31" width="48" height="8"/><path class="arrow" d="M408 14 v22 m-6 -7 l6 7 l6 -7"/><text class="lbl-s" x="408" y="50">Main entrance</text>`;
    for(const [n,z] of Object.entries(ZONES)){
      const [bx,by,bw,bh]=z.box,cy=by+bh/2;
      s+=`<g ${attrs('z'+n,'Zone '+n+', '+z.desc.join(' '))}><rect class="zbox" x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="3"/>`;
      z.courts.forEach(c=>s+=court(...c,o.nets));
      s+=`<text class="znum" x="${bx+bw/2}" y="${cy+2}">${n}</text>`;
      z.desc.forEach((t,i)=>s+=`<text class="zdesc" x="${bx+bw/2}" y="${cy+20+i*13}">${esc(t)}</text>`);
      s+=`<rect class="hit" x="${bx}" y="${by}" width="${bw}" height="${bh}"/></g>`;
    }
    if(o.rooms)for(const r of ROOMS)s+=`<g ${attrs(r.id,r.label.join(' '))}><rect class="room" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="2"/>${roomLabel(r)}<rect class="hit" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"/></g>`;
    return s;
  }
  function roomLabel(r){const n=r.label.length,lh=r.small?11:14,y0=r.y+r.h/2+5-(n-1)*lh/2;
    return r.label.map((t,i)=>`<text class="${r.small?'lbl-s':'lbl'}" x="${r.x+r.w/2}" y="${y0+i*lh}">${esc(t)}</text>`).join('');}
  const pinFlat=s=>`<g class="pin" data-spot="${s.id}" data-pin tabindex="0" role="button" aria-label="${esc(s.name||s.id)}"><circle class="halo" cx="${s.pin[0]}" cy="${s.pin[1]}" r="13"/><circle class="dot" cx="${s.pin[0]}" cy="${s.pin[1]}" r="7"/></g>`;
  const named=o=>SPOTS.map(s=>({...s,name:(o.spots||[]).find(x=>x.id===s.id)?.name}));

  function flat(o={}){
    return `<svg class="plan" viewBox="0 0 820 650" role="group" aria-label="Facility map, top-down">${floor({nets:true,rooms:true})}
      <text class="lbl-s foot" x="22" y="632" style="text-anchor:start">Zones 1–4 convert: 8 volleyball / 4 basketball / 12 pickleball courts. Schematic, not to scale.</text>
      ${named(o).map(pinFlat).join('')}</svg>`;
  }

  /* ---- 3D: isometric projection. x runs down-right, y runs down-left, z is up. ---- */
  const C=.866,S=.5,P=(x,y,z=0)=>[+((x-y)*C).toFixed(1),+((x+y)*S-z).toFixed(1)];
  const poly=(cls,pts)=>`<polygon class="${cls}" points="${pts.map(p=>p.join(',')).join(' ')}"/>`;
  const onFloor=(z,inner)=>`<g transform="matrix(${C} ${S} ${-C} ${S} 0 ${-z})">${inner}</g>`;
  function box(x,y,w,h,z0,z1){ /* top, then the two faces that look at the viewer */
    return poly('sl',[P(x,y+h,z0),P(x+w,y+h,z0),P(x+w,y+h,z1),P(x,y+h,z1)])+poly('sr',[P(x+w,y,z0),P(x+w,y+h,z0),P(x+w,y+h,z1),P(x+w,y,z1)])+
           poly('top',[P(x,y,z1),P(x+w,y,z1),P(x+w,y+h,z1),P(x,y+h,z1)]);}
  function net3d(x,y,w,h){const mx=x+w/2,a=y-4,b=y+h+4,line=(p,q,c)=>`<line class="${c}" x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/>`;
    return poly('netq',[P(mx,a,9),P(mx,b,9),P(mx,b,24),P(mx,a,24)])+line(P(mx,a,24),P(mx,b,24),'tape')+line(P(mx,a,0),P(mx,a,27),'pole')+line(P(mx,b,0),P(mx,b,27),'pole');}
  function iso(o={}){
    const H=30,parts=[];
    for(const r of ROOMS)parts.push({d:r.x+r.w+r.y+r.h,s:`<g ${attrs(r.id,r.label.join(' '))}>${box(r.x,r.y,r.w,r.h,0,H)}${onFloor(H,roomLabel(r))}</g>`});
    for(const z of Object.values(ZONES))for(const c of z.courts)parts.push({d:c[0]+c[2]/2+c[1]+c[3]+4,s:net3d(...c)});
    const od=ROOMS.find(r=>r.id==='odaup'); /* the mezzanine is a deck above the bar */
    parts.push({d:od.x+od.w+od.y+od.h+1,s:`<g data-el="mezzdeck" data-spot="mezz" tabindex="0" role="button" aria-label="Mezzanine">${box(od.x,od.y,od.w,od.h,50,55)}${onFloor(55,`<text class="lbl-s" x="${od.x+od.w/2}" y="${od.y+od.h/2+4}">Mezzanine</text>`)}</g>`});
    parts.sort((a,b)=>a.d-b.d);
    const pin=s=>{const z=s.id==='mezz'?55:s.on.some(e=>/^z/.test(e))||s.id==='entrance'?0:H,a=P(s.pin[0],s.pin[1],z),b=[a[0],a[1]-26];
      return `<g class="pin" data-spot="${s.id}" data-pin tabindex="0" role="button" aria-label="${esc(s.name||s.id)}"><line class="stem" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/><circle class="halo" cx="${b[0]}" cy="${b[1]}" r="13"/><circle class="dot" cx="${b[0]}" cy="${b[1]}" r="7"/></g>`;};
    return `<svg class="plan iso" viewBox="-560 -70 1265 800" role="group" aria-label="Facility map, 3D view">
      ${poly('slab',[P(15,35,-10),P(800,35,-10),P(800,609,-10),P(15,609,-10)])}${poly('wall',[P(15,35,0),P(800,35,0),P(800,35,46),P(15,35,46)])}${poly('wall',[P(15,35,0),P(15,609,0),P(15,609,46),P(15,35,46)])}
      ${onFloor(0,floor({nets:false,rooms:false}))}${parts.map(p=>p.s).join('')}${named(o).map(pin).join('')}</svg>`;
  }
  window.FHPLAN={ROOMS,ZONES,SPOTS,flat,iso};
})();
