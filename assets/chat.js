/* FieldhouseUSA helper. Works with no network and no AI service: it matches keywords against the facility rules
   below, and it can walk someone through the questions we need to plan an event, then hands the answers to the
   request form. Everything a visitor types is shown with textContent, never as HTML. Keep the answers in step
   with the rules on index.html. */
(function(){
const {$,SITE,openAsk}=FH;
const KB=[
 [['food','eat','snack','lunch','cooler','coffee','starbucks','drink','gatorade','water','cup','stanley','gum'],'No outside food or drink is allowed in the building, including coffee. No coolers. On the courts, only sealed clear water. No gum. Oda Up serves food and drinks inside. If you bring outside food, eat it in your vehicle.'],
 [['bag','backpack','purse','search','camera bag'],'Everyone who enters is subject to a bag search. Only player backpacks are allowed inside. Purses and camera bags are allowed but must be open for a check.'],
 [['weapon','gun','firearm','knife'],'No weapons or firearms of any kind.'],
 [['dog','pet','animal','service animal'],'No animals, except service animals as defined by law. Tell us before you arrive so we have time to arrange a reasonable accommodation. Animals are not allowed on playing surfaces or in activity areas.'],
 [['lost','found','left my','forgot my','missing'],'We do not keep a lost and found and cannot hold lost items. If you left something today, use the lost item form in the Lost items section of the home page. Please don\'t call or email about lost items.'],
 [['park','parking','tailgate','car','lot'],'Parking is free and on site. We are not responsible for your vehicle, so lock it and keep valuables out of sight. No tables, camping or tailgating in front of the building, and no littering in the lot.'],
 [['kid','child','children','toddler','babysit'],'Children must be supervised at all times or will be asked to leave. Stay out of areas you are not booked in.'],
 [['chair','table','tent','camping chair','mat'],'No personal chairs, camping chairs, coolers or team tables on the courts. Floor mats and seats are fine if they do not scratch the floor. Spectator chairs are first come, first served. Please return them.'],
 [['first aid','ice','trainer','injury','injured','bandage'],'There is no athletic trainer and no ice on site. Bring your own. First-aid kits and bandages can be purchased for a fee.'],
 [['charge','outlet','plug','power','appliance'],'No appliances may be plugged in. Phone charging is allowed around the bar areas only.'],
 [['fine','penalty','offense','forfeit'],'Fines start at the first offense, with no warning. First offense: $25 to the offending team or club. Second: $50. Third: the team forfeits its remaining matches and is not welcomed back.'],
 [['photo','video','filming','camera','record'],'Photos and video taken in the facility belong to the facility and may be used in marketing. Security cameras and staff monitor the building.'],
 [['alcohol','beer','bar','wine'],'There is a full bar and kitchen on site, run by Oda Up. All alcohol stays in the bar seating area.'],
 [['hours','open','close','what time'],'Hours follow the day\'s programs and events. Check your program\'s schedule or your event confirmation before you come.'],
 [['drop-in','drop in','open gym','open play'],'Drop-in volleyball runs Thursday through Monday, 7 PM to 11 PM. Boomtown Athletics runs it. See boomtownathletics.com for details.'],
 [['party','parties','birthday','celebration','gathering','graduation','watch party','karaoke','team building','team-building','inflatable','bounce'],'Parties are booked on the Parties and Events page (events.html). The party room is $400 for 3 hours, setup and cleanup included. Add a court for $150. Most parties run $400 to $600 before food. Oda Up food is $15 per child and $25 per adult, or you can bring your own food for a $250 fee. No outside alcohol. Over 75 guests, Event-Den plans it.'],
 [['tournament','deposit','how far','advance','director'],'Tournament dates book 6 to 8 months ahead. A signed rental contract and a 30% deposit hold your dates. The balance is due at least 30 days before the event. Tap "Book an event" and I will take the details.'],
 [['contract','agreement','rent','rental','price','cost','rate','how much','quote'],'All rentals require a signed rental contract. This is a commercial facility, so pricing is not in line with schools or rec centers. For a quote, tap "Book an event" and I will take the details.'],
 [['rec center','recreation','public','city'],'FieldhouseUSA is a private, commercial facility, not a city rec center. We follow health code and our own policies.'],
 [['space','size','square','sq ft','how big','capacity','gala','expo','studio','lounge'],'With the nets raised there is about 32,000 sq ft of open floor. There are also 8,000 sq ft expo spaces, an 8,000 sq ft gala space, two studios of 1,500 and 2,000 sq ft, a 3,000 sq ft lounge and dining area, and a full bar and restaurant.'],
 [['waiver','liability','sign'],'Everyone who plays signs the liability waiver. It is linked from the Facility rules section of the home page.'],
 [['where','address','directions','location','located'],'14200 E Alameda Ave, FieldhouseUSA, Aurora, CO 80012. Use the Directions button in the menu.'],
 [['contact','email','phone','call','talk to','reach'],'Email '+SITE.email+'. For event requests, tap "Book an event" so we get the details we need the first time.'],
 [['rmr','usav','region'],'For USAV RMR events: players only may bring a brown-bag lunch that fits in a player backpack. Doors open at 7:00 AM and the coaches\' meeting is at 7:30 AM at the admin desk. Coaches must check out with the site director before leaving.'],
 [['spectator','parent','watch','fan'],'Spectators follow the same rules as players. Spectators who refuse to comply will be asked to leave or escorted out by Aurora police.'],
 [['ball','dribble','warm up','warmup'],'No ball handling or play outside authorized event areas, including dribbling and throwing.'],
];
/* Three inquiries, each asked only when the visitor asks for it. k matches the request form's field names (see LABEL in
   site.js); keys the form has no field for go into the email as extra lines (x:true). t is the form's request type. */
const DATE={re:/^(\d{4}-\d{1,2}-\d{1,2}|\d{1,2}\/\d{1,2}\/\d{2,4})$/,bad:'Please give a date like 3/14/2027.'};
const NUM={re:/^\d{1,5}$/,bad:'A number, please.'};
const BUDGET={k:'budget',q:'What is your total budget for this request, in dollars? We are a commercial facility and our prices reflect that. We are not a school or rec center. Requests without a budget get no response.',re:/^\$?\d[\d,]{0,8}$/,bad:'A dollar amount, please, like 5000.'};
const YOU=[
 {k:'name',q:'Your name?'},
 {k:'email',q:'Your email?',re:/^\S+@\S+\.\S+$/,bad:'That does not look like an email address.'},
 {k:'phone',q:'A phone number we can reach you on?',re:/^[\d\s().+-]{10,}$/,bad:'Please include the area code.'},
];
const FLOWS={
 tournament:{t:'tournament',title:'tournament',fixed:{kind:'Tournament'},steps:[
  {k:'sport',x:1,l:'Sport',q:'What sport?',o:['Volleyball','Basketball','Pickleball','Futsal','Martial arts','Wrestling or mat sports','Gymnastics, cheer or dance','Other']},
  {k:'org',q:'What organization, club or league is running it?'},
  {k:'ages',q:'Who is playing?',o:['Adults','Youth','Adults and youth']},
  {k:'date',q:'First choice date? Tournament dates book 6 to 8 months ahead.',...DATE},
  {k:'date2',q:'A backup date?',...DATE},
  {k:'days',x:1,l:'Days',q:'How many days?',o:['1 day','2 days','3 or more days']},
  {k:'courts',x:1,l:'Courts or space',q:'How many courts, or how much floor?',o:['2 to 4 courts','5 to 8 courts','9 to 15 courts','Open floor, nets up','Not sure']},
  {k:'teams',q:'About how many teams?',...NUM},
  {k:'guests',q:'Players and spectators on the busiest day, roughly?',...NUM},
  {k:'food',q:'Food and drink? Oda Up runs food and the bar inside. No outside food.',o:['None','Food only','Food and bar','Not sure yet']},
  {k:'coi',q:'Do you have insurance coverage (a certificate of insurance)?',o:['Yes','No','Not sure']},
  BUDGET,
  ...YOU]},
 party:{t:'event',title:'party',fixed:{kind:'Birthday party'},steps:[
  {k:'pkind',x:1,l:'Kind of party',q:'What kind of party?',o:['Kids birthday','Teen birthday','Adult birthday','Team party','Graduation','Holiday party','Other']},
  {k:'date',q:'What date? In winter most openings are Friday to Sunday nights.',...DATE},
  {k:'date2',q:'A backup date?',...DATE},
  {k:'start',q:'Start time? (for example 6:30 PM)',re:/^\d{1,2}(:\d{2})?\s*(am|pm)?$/i,bad:'A time like 6:30 PM, please.'},
  {k:'kids',x:1,l:'Kids',q:'How many kids?',...NUM},
  {k:'adults',x:1,l:'Adults',q:'How many adults?',...NUM},
  {k:'play',x:1,l:'Activity',q:'What do you want to play? The party room is $400 for 3 hours.',o:['Volleyball court ($150)','Basketball','Pickleball','Inflatables ($150)','Just the party room','Not sure']},
  {k:'food',q:'Food? Oda Up packages are $15 a kid and $25 an adult. Outside food is a $250 fee.',o:['Oda Up for everyone','Oda Up for kids only','We bring our own','Not sure yet']},
  {k:'details',q:'Anything else? Theme, allergies, DJ or karaoke, a game on TV. Or type "no".'},
  ...YOU]},
 big:{t:'event',title:'event',steps:[
  {k:'kind',q:'What kind of event?',o:['Corporate event','Gala or fundraiser','Expo or trade show','Cultural or community event','Camp or clinic','Other']},
  {k:'org',q:'What organization is it for?'},
  {k:'date',q:'First choice date?',...DATE},
  {k:'date2',q:'A backup date?',...DATE},
  {k:'days',x:1,l:'Days',q:'How many days?',o:['1 day','2 days','3 or more days']},
  {k:'guests',q:'About how many guests?',...NUM},
  {k:'spaces',q:'Which space fits best?',o:['Open floor (nets up)','Expo space','Gala space','Studio','Lounge and dining','Mezzanine','Not sure']},
  {k:'food',q:'Food and drink?',o:['None','Food only','Food and bar','Not sure yet']},
  {k:'coi',q:'Do you have insurance coverage (a certificate of insurance)?',o:['Yes','No','Not sure']},
  BUDGET,
  {k:'setup',q:'What setup do you need? Staging, sound, tables, vendors, décor.'},
  ...YOU]},
};
const PICK={'Host a tournament':'tournament','Plan a party':'party','Plan a big event':'big'};
const START=['Can I bring food?','Bag policy','Lost item','Book or plan something'];
document.body.insertAdjacentHTML('beforeend',`<section id="chat" role="dialog" aria-label="Fieldhouse helper" hidden>
  <header><div><b>Fieldhouse helper</b><small>Rules and event requests. Works offline.</small></div><button class="x" type="button" aria-label="Close helper">×</button></header>
  <div class="log" aria-live="polite"></div><div class="quick"></div>
  <form><input aria-label="Type a question" placeholder="Type a question" autocomplete="off"><button class="btn btn-red" type="submit">Send</button></form></section>`);
const box=$('#chat'),log=$('.log',box),quick=$('.quick',box),input=$('input',box);
let flow=null,step=-1,ans={},done=null;
function say(t,who){const m=document.createElement('div');m.className='m '+(who||'b');m.textContent=t;log.appendChild(m);log.scrollTop=log.scrollHeight;}
function chips(a){quick.textContent='';a.forEach(t=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.onclick=()=>handle(t);quick.appendChild(b);});}
function ask(){const s=flow.steps[step];say(s.q);chips([...(s.o||[]),'Cancel']);}
function iso(v){const m=v.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);if(!m)return v.replace(/-(\d)(?=-|$)/g,'-0$1');
  const y=m[3].length===2?'20'+m[3]:m[3];return `${y}-${m[1].padStart(2,'0')}-${m[2].padStart(2,'0')}`;}
function begin(id){flow=FLOWS[id];step=0;ans={...(flow.fixed||{})};
  say(`I will ask a few questions so your ${flow.title} request is complete. All rentals require a signed rental contract.`);ask();}
/* the summary: form fields by their form names, the rest as "Label: value" lines */
function finish(){
  if(/^(no|none|nope|n\/a|nothing)\.?$/i.test(ans.details||''))delete ans.details;
  const f=flow,a=ans,more=f.steps.filter(s=>s.x&&a[s.k]).map(s=>`${s.l}: ${a[s.k]}`);
  if(f===FLOWS.party){const n=(+a.kids||0)+(+a.adults||0);a.guests=String(n);
    if(n>75)more.push('Note: over 75 guests, so Event-Den plans it.');}
  if(f===FLOWS.big)more.push('Note: big event, route to Event-Den.');
  done={t:f.t,a,more};flow=null;step=-1;
  const L={org:'Organization',kind:'Kind of event',ages:'For',date:'First choice',date2:'Backup',start:'Start',guests:'Guests',teams:'Teams',spaces:'Space',food:'Food and drink',budget:'Total budget (USD)',coi:'Insurance coverage',setup:'Setup',details:'Specific details of event',name:'Name',email:'Email',phone:'Phone'};
  const lines=Object.entries(L).filter(([k])=>a[k]).map(([k,l])=>`${l}: ${a[k]}`);
  say('Here is your request:\n'+[...lines,...more].join('\n'));
  if(f===FLOWS.party&&+a.guests>75)say('Over 75 guests is a planned event. Event-Den will take it from here.');
  say('Tap "Send it" and your email app opens with this filled in, addressed to '+SITE.email+'. Or open the full form to add times and spaces first.');
  chips(['Send it','Open the full form','Start over']);
}
function answer(t){
  const q=' '+t.toLowerCase()+' ';let best=null,score=0;
  for(const [keys,a] of KB){const s=keys.filter(k=>q.includes(k)).length;if(s>score){score=s;best=a;}}
  return best||'I can answer questions about the facility rules and take a tournament, party or event request. Try "Can I bring food?" or tap "Book or plan something". For anything else, email '+SITE.email+'.';
}
/* which inquiry a question is about, so the answer can offer to start it (only offered, never started unasked) */
function topic(t){return /tournament|league|meet|competition/i.test(t)?'Host a tournament':/party|birthday|gathering|graduation/i.test(t)?'Plan a party':/corporate|gala|expo|conference|fundraiser|festival|wedding|banquet/i.test(t)?'Plan a big event':'';}
function handle(t){
  t=t.trim();if(!t)return;say(t,'u');
  if(t==='Send it'&&done){const {t:type,a,more}=done;FH.mailRequest(type,k=>a[k]||'',more);say('Your email app should have opened. If it did not, email '+SITE.email+'.');chips(['Start over']);return;}
  if(t==='Open the full form'&&done){box.hidden=true;openAsk(done.t,done.a);return;}
  if(t==='Start over'||t==='Cancel'){flow=null;step=-1;ans={};done=null;say('No problem. What would you like to know?');chips(START);return;}
  if(flow){const s=flow.steps[step];
    if(s.o&&!s.o.includes(t)){say('Please pick one of the options.');return;}
    if(s.re&&!s.re.test(t)){say(s.bad);return;}
    ans[s.k]=s.re===DATE.re?iso(t):s===BUDGET?t.replace(/[$,]/g,''):t;step++;if(step<flow.steps.length)ask();else finish();return;}
  if(PICK[t]){begin(PICK[t]);return;}
  if(/^book or plan something$/i.test(t)||/\b(book|reserve|host|rent|plan)\b/i.test(t)&&!topic(t)){say('What would you like to plan?');chips([...Object.keys(PICK),'Cancel']);return;}
  if(/\b(book|reserve|host|rent|plan|request|inquir|quote)\w*/i.test(t)&&topic(t)){begin(PICK[topic(t)]);return;}
  const p=topic(t);say(answer(t));chips(p?[p,...START.slice(0,3)]:START);
}
$('form',box).addEventListener('submit',e=>{e.preventDefault();const v=input.value;input.value='';handle(v);});
$('.x',box).onclick=()=>{box.hidden=true;};
box.addEventListener('keydown',e=>{if(e.key==='Escape')box.hidden=true;});
window.FHCHAT={open(){box.hidden=false;if(!log.children.length){say('Hi. I can answer questions about the facility rules, or take a tournament, party or event request.');chips(START);}input.focus();},answer};
FHCHAT.open();
})();
