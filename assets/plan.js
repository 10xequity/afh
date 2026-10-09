/* FieldhouseUSA Aurora floor plan — one geometry, drawn by both the walk-in (index.html) and the site page (site.html).
   viewBox 0 0 820 650, traced from the owner's plan (2026-10-06). Zones 1–8 from the entrance; courts drawn as volleyball courts. */
(function(){
  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const ROOMS=[
    {id:'restroomsL',x:15,y:35,w:80,h:100,label:['Restrooms']},
    {id:'office',x:97,y:35,w:103,h:100,label:['Office'],area:'office'},
    {id:'shoot360',x:202,y:35,w:165,h:100,label:['Shoot 360'],area:'shoot360'},
    {id:'entrance',x:367,y:35,w:103,h:27,label:['Entrance']},
    {id:'restroomsR',x:646,y:155,w:152,h:95,label:['Restrooms']},
    {id:'socialden',x:468,y:155,w:85,h:95,label:['Social-Den'],area:'socialden'},
    {id:'studioA',x:553,y:155,w:93,h:95,label:['Dance-Den'],area:'danceden'},
    {id:'odaup',x:468,y:297,w:85,h:100,label:['Oda Up'],area:'odaup'},
    {id:'studioB',x:553,y:297,w:93,h:100,label:['Yoga-Den'],area:'yogaden'},
  ];
  const ZONES={
    1:[[33,205,128,70],[33,300,128,70]],2:[[33,420,128,70],[33,515,128,70]],
    3:[[240,205,128,70],[240,300,128,70]],4:[[240,420,128,70],[240,515,128,70]],
    5:[[482,48,145,94],[640,48,145,94]],6:[[490,420,128,70],[490,515,128,70]],
    7:[[667,275,113,70],[667,370,113,70],[667,465,113,70]]
  };
  function court(x,y,w,h){const mx=x+w/2,a=w/6;return `<rect class="court" x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/>
    <line class="attack" x1="${mx-a}" y1="${y}" x2="${mx-a}" y2="${y+h}"/><line class="attack" x1="${mx+a}" y1="${y}" x2="${mx+a}" y2="${y+h}"/>
    <line class="net" x1="${mx}" y1="${y-4}" x2="${mx}" y2="${y+h+4}"/><circle class="post" cx="${mx}" cy="${y-4}" r="3"/><circle class="post" cx="${mx}" cy="${y+h+4}" r="3"/>`;}
  /* o.mini: compact (no labels) · o.areas: the areas array, to name zones · o.you: draw the position marker · o.route: draw the entrance-to-mall route */
  function svg(o={}){
    const mini=!!o.mini,areas=o.areas||[],tab=mini?-1:0;
    let s=`<svg class="plan${mini?' mini':''}" viewBox="0 0 820 650" role="group" aria-label="Floor plan"><rect class="shell" x="15" y="35" width="785" height="570"/>`;
    s+=`<line class="aisle" x1="200" y1="190" x2="200" y2="590"/><line class="aisle" x1="30" y1="395" x2="370" y2="395"/><line class="aisle" x1="30" y1="178" x2="370" y2="178"/><line class="aisle" x1="395" y1="60" x2="395" y2="590"/><line class="aisle" x1="640" y1="400" x2="640" y2="590"/>`;
    for(const r of ROOMS){
      s+=`<g ${r.area?`data-area="${r.area}" tabindex="${tab}" role="button" aria-label="${esc(r.label.join(' '))}"`:''}><rect class="room" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"/>`;
      r.label.forEach((t,i)=>s+=`<text x="${r.x+r.w/2}" y="${r.y+r.h/2+5+i*14}">${esc(t)}</text>`);
      if(r.area)s+=`<rect class="hit" x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}"/>`;s+='</g>';
    }
    for(const [n,cs] of Object.entries(ZONES)){
      const a=areas.find(a=>a.zone==n);const xs=cs.map(c=>c[0]),ys=cs.map(c=>c[1]),x2=cs.map(c=>c[0]+c[2]),y2=cs.map(c=>c[1]+c[3]);
      const bx=Math.min(...xs)-8,by=Math.min(...ys)-8,bw=Math.max(...x2)-bx+8,bh=Math.max(...y2)-by+8;
      s+=`<g data-area="${a?a.id:''}" data-zone="${n}" tabindex="${tab}" role="button" aria-label="Zone ${n}${a?', '+esc(a.courts):''}">`;
      cs.forEach(c=>s+=court(...c));
      s+=`<text class="znum" x="${bx+bw/2}" y="${by+bh/2+13}">${n}</text><rect class="hit" x="${bx}" y="${by}" width="${bw}" height="${bh}"/></g>`;
    }
    s+=`<text class="znum z8" x="599" y="290" dy="-6">8</text>`;
    s+=`<text x="418" y="632">Exit to mall</text><text x="418" y="26">Parking</text>`;
    if(o.route)s+=`<path id="route" d="M418 62 C 418 120, 412 160, 418 200 S 424 330, 418 400 S 414 520, 418 585"/><path id="route-head" d="M418 605 l -9 -16 h 18 z"/>`;
    if(o.you!==false)s+=`<g class="youg"><path class="cone" d="M0 0 L-34 70 L34 70 Z"/><circle class="you" r="9"/></g>`;
    return s+'</svg>';
  }
  function areaPos(a){
    if(a.zone){const cs=ZONES[a.zone];const xs=cs.map(c=>c[0]+c[2]/2),ys=cs.map(c=>c[1]+c[3]/2);return [xs.reduce((p,c)=>p+c)/xs.length,ys.reduce((p,c)=>p+c)/ys.length,0];}
    const r=ROOMS.find(r=>r.id===a.map);return r?[r.x+r.w/2,r.y+r.h/2,0]:[418,120,0];
  }
  window.FHPLAN={ROOMS,ZONES,svg,areaPos};
})();
