/* FieldhouseUSA party builder (events.html): live price estimate, routing of big events to Event-Den, and the request email.
   Prices are the owner's list (2026-11-20). Nothing a visitor types is written into the page as HTML; it only goes into the email text. */
const P={room:400,court:150,bb:200,pb:200,z7:400,social:600,s360:400,corral:250,inflatables:150,kid:15,adult:25,outsideFood:250};
const ROUTE={maxGuests:75}; // ponytail: one headcount line; tune it here when the party room's real capacity is set
const PRESET={sports:{room:1,courts:1,z7:0,social:0,s360:0},gathering:{room:1,courts:0,z7:0,social:0,s360:0},
  zone7:{room:1,courts:0,z7:1,social:0,s360:0},cobo:{room:1,courts:1,z7:0,social:0,s360:0},
  social:{room:0,courts:0,z7:0,social:2,s360:0},s360:{room:1,courts:0,z7:0,social:0,s360:1}};
const money=n=>'$'+n.toLocaleString('en-US');

/* o: plain numbers and strings from the form. Returns the line items, the total and why it belongs to Event-Den, if it does. */
function estimate(o){
  const L=[],add=(t,n)=>{if(n)L.push([t,n]);};
  if(o.room)add('Party room, 3 hours',P.room);
  add(`Volleyball court × ${o.courts}, 3 hr`,o.courts*P.court);
  if(o.pkg==='cobo'&&o.room&&o.courts)add('Colorado Boom: 1 court included',-P.court);
  add(o.bb===0.5?'Basketball half court, 3 hr':'Basketball full court, 3 hr',o.bb*P.bb);
  add('Pickleball, 3 courts, 3 hr',o.pb*P.pb);
  add('Zone 7, 3 hr',o.z7*P.z7);
  add(`Social-Den private × ${o.social} hr`,o.social*P.social);
  add(`Shoot 360, 4 hoops × ${o.s360} hr`,o.s360*P.s360);
  add(`Corral area × ${o.corral}, 3 hr`,o.corral*P.corral);
  if(o.extras.includes('Inflatables'))add('Inflatables',P.inflatables);
  if(o.food==='oda'||o.food==='kids')add(`Kids food × ${o.kids}`,o.kids*P.kid);
  if(o.food==='oda')add(`Adult food × ${o.adults}`,o.adults*P.adult);
  if(o.food==='own')add('Outside food fee',P.outsideFood);
  const why=[];
  if(o.kids+o.adults>ROUTE.maxGuests)why.push(`${o.kids+o.adults} guests is over our ${ROUTE.maxGuests}-guest party limit.`);
  if(o.needs.length)why.push(`It needs ${o.needs.join(', ').toLowerCase()}.`);
  return {lines:L,total:L.reduce((s,l)=>s+l[1],0),route:why};
}

if(typeof document==='undefined'){module.exports={estimate,P,ROUTE};}else{(function(){
  const f=document.getElementById('party');if(!f)return;
  const $=s=>document.querySelector(s),int=v=>Math.max(0,parseInt(v,10)||0);
  const read=()=>{const d=new FormData(f);return{pkg:d.get('pkg'),room:f.room.checked,courts:int(d.get('courts')),
    z7:int(d.get('z7')),social:int(d.get('social')),s360:int(d.get('s360')),corral:int(d.get('corral')),bb:parseFloat(d.get('bb'))||0,pb:int(d.get('pb')),kids:int(d.get('kids')),adults:int(d.get('adults')),
    food:d.get('food'),needs:d.getAll('needs'),extras:d.getAll('extras')};};
  let last;
  function render(){
    const o=read();last=estimate(o);
    const ul=$('#lines');ul.replaceChildren(...last.lines.map(([t,n])=>{const li=document.createElement('li'),a=document.createElement('span'),b=document.createElement('b');
      a.textContent=t;b.textContent=(n<0?'−':'')+money(Math.abs(n));li.append(a,b);return li;}));
    $('#total').textContent=money(last.total);
    const r=$('#route'),big=last.route.length>0;r.hidden=!big;$('#route-why').textContent=last.route.join(' ');
    $('#send').textContent=big?'Send it to Event-Den':'Send my party request';
    if(o.extras.includes('Inflatables')&&!o.z7)$('#est-note').textContent='Inflatables go in Zone 7. Add Zone 7. Tax on food and drinks and a $300 security deposit are added.';
    else $('#est-note').textContent='Tax on food and drinks and a $300 security deposit are added. DJ and karaoke systems are quoted.';
  }
  $('#pkg').addEventListener('change',e=>{const p=PRESET[e.target.value];
    f.room.checked=!!p.room;for(const k of ['courts','z7','social','s360'])f.elements[k].value=String(p[k]);
    render();});
  f.addEventListener('input',render);f.addEventListener('change',render);
  f.addEventListener('submit',e=>{e.preventDefault();if(!f.reportValidity())return;
    const d=new FormData(f),o=read(),r=estimate(o),big=r.route.length>0,to=big?'admin@event-den.com':window.FH.SITE.email;
    const rows=[`Package: ${f.pkg.selectedOptions[0].text}`,`Kind of party: ${d.get('kind')}`,`Occasion: ${d.get('occasion')||'-'}`,`Date: ${d.get('date')} (backup ${d.get('date2')||'none'}) at ${d.get('start')}`,
      `Guests: ${o.kids} kids, ${o.adults} adults`,`Food: ${f.food.selectedOptions[0].text}`,
      `Extras: ${o.extras.join(', ')||'none'}`,`Needs: ${o.needs.join(', ')||'none'}`,`Colorado Boom player: ${d.get('cobo')||'-'}`,'',
      'Estimate:',...r.lines.map(([t,n])=>`  ${t}: ${n<0?'-':''}${money(Math.abs(n))}`),`  Total before tax: ${money(r.total)}`,'',
      `Name: ${d.get('name')}`,`Email: ${d.get('email')}`,`Phone: ${d.get('phone')}`,`Notes: ${d.get('details')||'-'}`];
    if(big)rows.unshift('Sent from aurorafieldhouseusa.com party builder. Routed to Event-Den: '+r.route.join(' '),'');
    location.href=`mailto:${to}?subject=${encodeURIComponent(`[FHUSA] ${big?'Event':'Party'} request: ${d.get('name')}, ${d.get('date')}`)}&body=${encodeURIComponent(rows.join('\n')+'\n')}`;
    $('#party-note').textContent=`Your email app should have opened, addressed to ${to}. If it didn't, email ${to}.`;});
  render();
})();}
