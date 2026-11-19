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
/* the questions we need answered before we can plan an event. k matches the request form's field names. */
const FLOW=[
 {k:'kind',q:'What kind of event is it?',o:['Tournament','Corporate event','Birthday or private party','Gala or fundraiser','Expo or trade show','Camp or clinic','League or recurring rental','Other']},
 {k:'org',q:'What organization or team is it for?'},
 {k:'ages',q:'Who is it for?',o:['Adults','Youth','Adults and youth']},
 {k:'date',q:'What is your first choice date? (for example 2027-03-14)',re:/^\d{4}-\d{2}-\d{2}$/,bad:'Please give the date as YYYY-MM-DD.'},
 {k:'date2',q:'And a backup date?',re:/^\d{4}-\d{2}-\d{2}$/,bad:'Please give the date as YYYY-MM-DD.'},
 {k:'guests',q:'About how many guests or players?',re:/^\d+$/,bad:'A number, please.'},
 {k:'food',q:'Food and drink?',o:['None','Food only','Food and bar','Not sure yet']},
 {k:'budget',q:'What is your budget for the venue?',o:['Under $2,500','$2,500 to $5,000','$5,000 to $10,000','$10,000 to $25,000','Over $25,000','Need a quote first']},
 {k:'setup',q:'What setup do you need? Tables, chairs, staging, sound, vendors.'},
 {k:'name',q:'Your name?'},
 {k:'email',q:'Your email?',re:/^\S+@\S+\.\S+$/,bad:'That does not look like an email address.'},
 {k:'phone',q:'A phone number we can reach you on?'},
];
const START=['Can I bring food?','Bag policy','Lost item','Book an event'];
document.body.insertAdjacentHTML('beforeend',`<section id="chat" role="dialog" aria-label="Fieldhouse helper" hidden>
  <header><div><b>Fieldhouse helper</b><small>Rules and event requests. Works offline.</small></div><button class="x" type="button" aria-label="Close helper">×</button></header>
  <div class="log" aria-live="polite"></div><div class="quick"></div>
  <form><input aria-label="Type a question" placeholder="Type a question" autocomplete="off"><button class="btn btn-red" type="submit">Send</button></form></section>`);
const box=$('#chat'),log=$('.log',box),quick=$('.quick',box),input=$('input',box);
let step=-1,ans={};
function say(t,who){const m=document.createElement('div');m.className='m '+(who||'b');m.textContent=t;log.appendChild(m);log.scrollTop=log.scrollHeight;}
function chips(a){quick.textContent='';a.forEach(t=>{const b=document.createElement('button');b.type='button';b.textContent=t;b.onclick=()=>handle(t);quick.appendChild(b);});}
function ask(){const s=FLOW[step];say(s.q);chips(s.o||['Cancel']);}
function finish(){
  step=-1;say('Thanks. I have what we need to start. Next I will open the request form with your answers filled in. Add your times and spaces there, then send it.');
  chips(['Open the request form','Start over']);
}
function answer(t){
  const q=' '+t.toLowerCase()+' ';let best=null,score=0;
  for(const [keys,a] of KB){const s=keys.filter(k=>q.includes(k)).length;if(s>score){score=s;best=a;}}
  return best||'I can answer questions about the facility rules and take the details for an event request. Try "Can I bring food?" or tap "Book an event". For anything else, email '+SITE.email+'.';
}
function handle(t){
  t=t.trim();if(!t)return;say(t,'u');
  if(t==='Open the request form'){box.hidden=true;openAsk(/tournament/i.test(ans.kind||'')?'tournament':'event',ans);return;}
  if(t==='Start over'||t==='Cancel'){step=-1;ans={};say('No problem. What would you like to know?');chips(START);return;}
  if(step<0&&/^book an event$|book|reserve|host (an?|my|our) /i.test(t)){step=0;ans={};say('I will ask a few questions so the request is complete. All rentals require a signed rental contract.');ask();return;}
  if(step>=0){const s=FLOW[step];
    if(s.o&&!s.o.includes(t)){say('Please pick one of the options.');return;}
    if(s.re&&!s.re.test(t)){say(s.bad);return;}
    ans[s.k]=t;step++;if(step<FLOW.length)ask();else finish();return;}
  say(answer(t));chips(START);
}
$('form',box).addEventListener('submit',e=>{e.preventDefault();const v=input.value;input.value='';handle(v);});
$('.x',box).onclick=()=>{box.hidden=true;};
box.addEventListener('keydown',e=>{if(e.key==='Escape')box.hidden=true;});
window.FHCHAT={open(){box.hidden=false;if(!log.children.length){say('Hi. I can answer questions about the facility rules, or take the details for an event request.');chips(START);}input.focus();},answer};
FHCHAT.open();
})();
