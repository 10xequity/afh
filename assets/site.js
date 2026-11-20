/* FieldhouseUSA: the parts every page shares: logo, header, side menu, footer, the ask-the-front-desk panel and the helper launcher.
   Page content itself is plain HTML so search engines and AI crawlers can read it without running this file.
   Everything inserted here is fixed text from this file; nothing a visitor types is ever written into the page as HTML. */
(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SITE={email:'admin@aurorafieldhouseusa.com',
  maps:'https://www.google.com/maps/search/?api=1&query=FieldhouseUSA+14200+E+Alameda+Ave+Aurora+CO+80012',waiver:'https://forms.gle/4vAwn3prUqkBDKqVA',lost:'https://forms.gle/wkkn4TCwwnCsuoRd6'};
const INQ=[['event','Host a special event'],['tournament','Host a tournament'],['rental','Find an activity or program'],['volleyball','Volleyball: club, league or drop-in'],['basketball','Basketball training or club'],
  ['studio','Studios and Social-Den'],['food','Food, bar or catering'],['therapy','Therapy / Spa Room'],['sponsor','Become a sponsor'],['other','Something else']];
const ACT=[['special-events','Special events'],['volleyball','Volleyball'],['basketball','Basketball'],['futsal','Futsal'],['social-leagues-community','Social leagues and community'],['studios-wellness','Studios and wellness']];
const NAV=[['index.html','Home','Start here','home'],['events.html','Parties & Events','Birthdays, gatherings, team-building','events'],['tournaments.html','Tournaments','Host yours here','tournaments'],
  ['activities.html','Activities','Find a sport or activity','activities'],['tour.html','Tour','3D map and floor plan','tour'],['index.html#rules','Facility Rules','Read before you come','rules'],
  ['index.html#sponsors','Sponsors','Put your name up','sponsors'],['activities.html#partners','Partners','Operators based here','partners'],['#ask','Contact','Email the front desk','ask']];
const page=document.body.dataset.page||'';
const here=k=>k===page?' aria-current="page"':'';
const navLink=n=>n[3]==='activities'
  ?`<div class="dd"><a href="${n[0]}"${here(n[3])} aria-haspopup="true">${n[1]}</a><div class="ddm">${ACT.map(a=>`<a href="activities.html#${a[0]}">${a[1]}</a>`).join('')}</div></div>`
  :`<a href="${n[0]}"${here(n[3])}>${n[1]}</a>`;
const ADDR='14200 E Alameda Ave<br>FieldhouseUSA<br>Aurora, CO 80012';
/* each page carries its name, address and email in plain HTML (for search engines and no-JS visitors); the full footer reuses it */
const staticFooter=$('body>footer'),NAP=staticFooter?$('address',staticFooter).innerHTML:`${ADDR}<br><a href="mailto:${SITE.email}">${SITE.email}</a>`;
staticFooter?.remove();
const opt=a=>a.map(o=>`<option>${o}</option>`).join('');

document.body.insertAdjacentHTML('afterbegin',`<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><symbol id="logo" viewBox="0 0 587 297"><path fill="#FF0000" d="M62.2,144.1c-6.7-10.1-13.3-20.2-20-30.3c-0.8-1.3-1.7-2.5-2.4-3.8c-7.7-14.6-8.2-24.3,4-37.1 c8.1-8.5,17.3-15.1,27.5-20.6c24.3-13.1,50-22.8,76.4-30.9c2.3-0.7,4.5-1.5,7.7-2.6c-6.2-1.9-12.6,1.4-17.5-4.2 c4.8-3.3,10-3.2,14.8-3.9C164.2,9,175.6,7.7,187,6.2c0.5-0.1,0.8-0.8,1.2-1.2c4.3,0,8.5,0,12.8,0c0.6,1.3,1.2,2.6,2.2,4.6 c-9.7,8.1-19.4,16.3-29.2,24.4c-3.7,3.1-7.7,5.9-11.5,9c-3.1,2.6-6.5,2.8-11.4,1.9c1.4-3.7,2.6-6.8,4.4-11.3 c-4.5,1.7-8.1,2.9-11.6,4.3C126,45.3,108,52.5,90.3,60.5c-11.6,5.2-22.6,11.9-31.9,20.8c-3.4,3.3-6.3,7.2-9.1,10.5 c4.3,13,12.1,22.8,18.4,33.5c2.7,4.7,5.2,9.5,7.8,14.3c-2.1,1.3-4.3,2.6-7.4,4.5C66.9,144.1,64.6,144.1,62.2,144.1z"/> <path fill="var(--logo-ink,#fff)" d="M62.2,143c2.3,0,4.7,0,5.9,0c3.1-1.9,5.3-3.2,7.4-4.5c7.3-1.4,14.7-2.9,22-4c4.6-0.7,9.3-0.7,14.1-1c-0.6,4.6-3.4,4.9-6,5.8 c-6.8,2.3-13.6,4.8-20.3,7.4c-1.8,0.7-3.2,2.3-4.8,3.4c-2.6,0.1-5.3,0.3-7.5,0.4c-2,1.7-3.7,3.1-5.4,4.6 c-9.1,5.3-18.2,10.5-28.7,16.6c4.6,0.7,7.3,1.1,10.5,1.6C42.9,180.4,22.2,186.3,9,185c0-1.8,0-3.7,0-5.5 c7.2-8.7,14.4-17.4,21.7-26.1c2.1-2.5,4.3-5.1,8.8-4.1c0.5,2,0.9,4.2,1.6,6.9C48.2,151.8,55.2,147.4,62.2,143z"/> <path fill="#FF0000" d="M520.9,221c14.1-1.2,28.2-2.3,43-3.6c1.8,1,4.2,2.2,6.5,3.5c0.6,7.8,1.1,15.6,1.9,23.3c1,9.2,2.4,18.4,3.4,27.6 c0.3,2.3-0.2,4.6-0.3,6.9c-8.6,1.1-16.5,2-24.5,3c0,0.2,0,0.4,0,0.7c8.8,0,17.6,0,26.2,0c0.5-5.7,1-10.7,1.5-15.7 c0.3,5.7,0.5,11.3,0.8,17.8c-11.1,0-21.4,0.3-31.6-0.1c-19.8-0.7-39.2,2.9-58.7,4.9c-4.2,0.4-8.5,1-12.7,0.9c-2.5,0-5.1-1.2-8.3-2 c-2.4-19.8-4.8-39.1-7.3-59.2c3.4-0.5,6-0.9,8.5-1.3c3.9,0,8.2,1.1,11.6-0.2c8.7-3.4,17.6-2.7,26.5-3.4 C512.1,223.9,516.5,222.1,520.9,221z M539.7,277.3c3.1-0.2,5.6-0.4,8.8-0.6c-0.7-7.4-1.3-14.1-1.9-20.9c4.6-0.7,8.1-1.3,12.1-1.9 c1.2,7.3,2.3,14.3,3.5,21.9c3.3-1.2,5.7-2,8-2.8c-0.6-23.7-3.7-42.2-8.2-48.5c-8.4,0.2-17.2-1.1-26.9,3.9 C534.7,244.3,537.4,260.5,539.7,277.3z M511.6,242.2c7.2-1.2,13.6-2.3,20.2-3.4c-0.9-4.6-1.7-8.4-2.4-11.9 c-6.9,0.6-13.2,0.9-19.5,1.7c-6.5,0.8-9.1,4.2-8.3,10.4c0.4,3.6,1,7.2,1.2,10.8c0.3,4.5,1.9,8.2,6.3,10.8c4.7-0.5,9.6-1,15.2-1.6 c0,2.9,0,4.8,0,7.3c-6.5,0.9-12.7,1.7-19.2,2.6c0.6,4,1.2,7.8,1.9,12.5c9-1.2,17.5-2.4,25.9-3.5c3.9-11.1,1.2-20.3-2.5-29.8 c-6.4,0-12.1,0-18.2,0C512.1,246.3,511.9,244.9,511.6,242.2z M481.3,270.9c-1.7-13.1-3.3-25.1-4.9-37.5c-3,0.3-5.6,0.6-9.1,1 c3.2,16.8,2.2,33.5,7.7,50.3c8.5-0.8,16.2-1.6,24.2-2.4c1.3-2.7,2.4-5.1,3.1-6.7c-1.9-15.6-3.6-30.2-5.5-45.6 c-3.4,0.8-5.9,1.4-9.1,2.2c0.8,6.4,1.6,12.4,2.2,18.4c0.7,6.2,1.1,12.5,1.7,19.3C488.1,270.3,485.2,270.5,481.3,270.9z"/> <path fill="#FF0000" d="M67.6,156.1c1.7-1.4,3.4-2.9,5.4-4.6c2.2-0.1,4.9-0.2,7.5-0.4c6,10.2,7,18.8,3.4,34c4.4,1.2,8.9,2.4,13.9,3.8 c0.6,3.3,1.2,6.8,1.8,10.7c-2.6,2.4-5.3,4.9-8.3,7.6c2.1,1,4.1,1.9,7.2,3.3c0.5,2.2,1.2,5.3,1.9,8.5c-3.8,3.4-7.1,6.5-11,10 c4.2,2.1,8.4,4,8.8,9.9c-0.5,1.5-1.3,3.8-2.2,6.5c4.8,0.9,9.6,1.9,15.4,3c1.5,1.4,3.4,3.2,5.2,4.9c0,5,0,9.2,0,13.2 c-8.9,10.8-22.4,15.2-33.2,10.9c-4.6-1.9-8.7-4.3-9.2-10.1c-0.5-6.3,1.1-11.5,6.5-15c3-1.9,6.4-3.3,9.7-5c0.7-3.2,1.3-6.3,2.1-9.9 c-4.7-0.7-9.1-1.4-13.5-2.1c-0.4-4.9-0.4-4.9,9.9-17.7c-4.8-0.6-9.3-1.2-14.1-1.9c0-3.4,0-6.1,0-10.9c2.3-1.5,5.9-3.9,10.5-7.1 c-6.6-1.5-11-2.5-16-3.6c-0.8-2.4-1.8-5.2-2.1-6.2c2.5-7,4.3-12.3,6.2-17.8C71.6,165.4,69.6,160.8,67.6,156.1z M111.3,258.6 c-11.6-5.3-21.3-2.8-26.9,6.9c4.5,7.5,11.6,5.1,17.9,4.2C107.9,268.9,110.4,265.2,111.3,258.6z"/> <path fill="var(--logo-ink,#fff)" d="M284.4,208.8c-6.4-0.9-5.2-5.5-7.4-8c-10,9.6-21.8,11.5-34.4,6.7c-4-1.5-7.9-4.7-10.6-8.1c-5.8-7-5.1-16.7,1.3-23.2 c7.7-8,17.4-10.8,28.2-9.3c2.9,0.4,5.7,1.5,9,2.4c0-10.3-0.5-20.3,0.2-30.2c0.4-6.6,2.1-13.1,3.7-19.5c1.1-4.5,3.8-8.2,9.9-9.9 c1,2,2.4,4.1,3.2,6.4c0.5,1.6,0.2,3.6-0.1,5.4c-3.3,25.7-2.1,51.6-2.3,77.4C285,201.9,284.6,205.1,284.4,208.8z M275.9,196.3 c-0.4-11.6-9.5-19.6-22.4-19.5c-9.9,0-13.7,3.4-15.8,13.5C244.9,205.4,263.3,208.3,275.9,196.3z"/> <path fill="var(--logo-ink,#fff)" d="M343.7,211c0-3,0.2-6,0-8.9c-0.3-3.6-0.1-7.4-1.4-10.7c-5.2-12.8-15.9-14.9-26.8-5.7c-3.3,6.4-1.4,14.3-4.9,20.6 c-5.6,0-8.7-2.8-8.8-7.1c-0.3-19.4-7.9-38.2-5.6-57.8c0.8-6.6,1.9-13.2,3.5-19.6c1.3-5.3,2.1-5.5,8.4-8.5c4.2,1,4.8,4.3,4.6,7.8 c-0.3,4.8-1,9.7-1.3,14.5c-0.6,11.2-1,22.3-1.5,33.8c20.5-5.3,33.4-0.5,39.8,14.1c2.8,6.4,2.5,13.2,0.6,19.6 C349.4,206,349.3,210.7,343.7,211z"/> <path fill="var(--logo-ink,#fff)" d="M155.3,182.5c0,2.6,0,5,0,7.2c4.2,6.3,10.5,8.4,17.2,9.1c6,0.6,12.1,0.8,18.2,0.9c4.3,0.1,8.3,0.9,12.9,4.4 c-3.6,2.6-6.1,5.4-9.3,6.4c-13.9,4.8-27.7,3.9-40.5-3.2c-18.1-10.1-17.8-31.7,0.3-42.4c11.3-6.7,22.7-5.7,33.5,1.1 c5.3,3.3,8,8.2,5.8,14.8c-7.3,7.9-21.6,9.8-32.2,3.7c7.5-4.3,16.8-1.1,23.2-6.7C176.2,168.3,166,169.8,155.3,182.5z"/> <path fill="var(--logo-ink,#fff)" d="M530.5,178.4c6,7.1,14.1,8.6,22.3,9.4c4.5,0.4,9.1,0.2,13.7,0.1c4,0,7.8,0.2,11,3.3c-1.5,4.5-5.6,5.4-9.1,6.7 c-13.6,5-27,3.6-39.6-3.2c-16.4-8.9-17.8-26.7-3.3-39.1c12.7-10.9,31-9.9,43,3.7c0,2.8,0,6.4,0,9.6c-7.9,7-23.4,8.8-32.7,3.1 c8.6-1.8,16-3.3,23.7-4.9c-4.3-7-10.9-8.7-19-5.8C532.2,164.1,529.4,168.7,530.5,178.4z"/> <path fill="var(--logo-ink,#fff)" d="M215.9,102.8c1.8,2.6,4.1,4.9,5.2,7.7c1.5,3.9,2.7,8.1,3,12.3c1.2,16.7,2.1,33.4-0.4,50c-1.9,12.3-3.9,24.5-6,36.7 c-0.4,2.1-1.5,4.1-2.3,6.2c-4.5-1.8-3.6-5-3.6-7.5c-0.8-27.9-1.5-55.9-2.1-83.8c-0.1-4.8-0.1-9.7,0.4-14.4c0.3-2.4,1.9-4.7,3-7 C214,103,214.9,102.9,215.9,102.8z"/> <path fill="var(--logo-ink,#fff)" d="M158.9,107.1c0,12.5-11.5,16.7-18.2,25.2c3.2,2.2,6.5,4.5,10.5,7.2c0.2,2.3,0.3,4.9,0.5,7.5c-8.9,6.1-15.1-1.3-22-3.5 c-7.7,2.5-9.6,13.1-19.6,13.2c-1.8-8.9,6.4-13.3,8.4-20.1c-3-4.8-11.3-5.4-10.6-13.5c6.5-3,11.6,1.5,18,3.4c3.1-3,6.5-6.3,10-9.6 c3.1-2.9,6.2-5.8,9.5-8.5C149.3,105.1,153.6,103.5,158.9,107.1z"/> <path fill="var(--logo-ink,#fff)" d="M494.9,187.5c-4-2.9-7.8-5.8-11.8-8.5c-12.6-8.5-13.7-20-2.5-30.1c3.6-3.2,7.9-5.6,12-8.1c0.8-0.5,2.2-0.1,3.5-0.1 c-0.5,9.6-12.4,12.4-11.5,22.8c2.8,1.7,5.7,3.7,8.8,5.5c2.9,1.7,5.8,3.3,8.7,4.9c10.4,5.9,10.7,18.1,4.7,25.1 c-4.6,5.4-10.9,9.5-16.9,13.4c-2.1,1.4-5.6,0.6-8.7,0.7C478.9,200.8,492.3,198.1,494.9,187.5z"/> <path fill="var(--logo-ink,#fff)" d="M421.9,156.4c0,4.1,0.2,7.1,0,10.1c-1.3,14.9,4,22.7,18.5,26.6c12.4-3.5,16-8.1,16.5-21.4c0.1-3.3,0.2-6.7,0.4-10 c0.1-0.8,0.6-1.6,1.1-2.9c4.5,0.8,6.4,4,8,7.7c4.2,9.7,0.2,26.4-7.8,32.5c-10,7.5-24.3,7.3-33.9-0.3c-8.9-7.2-12.6-20.1-8.9-32.2 C416.8,163.1,417.1,159.2,421.9,156.4z"/> <path fill="#FF0000" d="M366,184.2c1.5,8.8,7.8,11.7,15.5,12.6c11.9,1.4,20.6-2.5,27.2-12.2c1.1,6.9-0.7,11.1-6.8,14.6 c-13.7,7.8-27.1,7.3-40-1.3c-8.2-13.4-7.3-22.6,3.5-29.3c4.5-2.8,9.8-5.2,15-6c11.5-1.7,22.4,0.1,30.7,10.1c0,2.8,0,5.8,0,10.2 c-2.6-1.9-4.7-3.2-6.6-4.9c-9.1-8-19.3-7.6-29.8-3.7C370.4,176.1,368.8,178.4,366,184.2z"/> <path fill="var(--logo-ink,#fff)" d="M129.5,158c1.4,3.1,3.5,5.9,3.9,8.9c1.9,16.6-1.6,32.5-7.8,47.8c-0.2,0.5-0.7,1-1.2,1.4c-0.5,0.3-1,0.5-2.3,1 c-0.5-1.6-1.3-3.2-1.3-4.7c0.5-15.1,1.1-30.3,1.7-45.4C122.6,163.3,123.4,159.8,129.5,158z"/> <path fill="var(--logo-ink,#fff)" d="M578.7,266.8c-0.5,5-1,10-1.5,15.7c-8.5,0-17.4,0-26.2,0c0-0.2,0-0.4,0-0.7c8-1,15.9-2,24.5-3c0.1-2.3,0.5-4.7,0.3-6.9 c-1-9.2-2.4-18.4-3.4-27.6c-0.8-7.8-1.3-15.6-1.9-23.3c2.4,1,4.8,1.9,7.3,2.9C579.7,238.6,579.4,252.7,578.7,266.8z"/> <path fill="var(--logo-ink,#fff)" d="M520.9,221c-4.4,1.1-8.8,2.9-13.3,3.3c-8.9,0.6-17.8,0-26.5,3.4c-3.4,1.3-7.7,0.2-11.6,0.2c0.1-2.1,0.3-4.2,0.5-6.9 C487,221,504,221,520.9,221z"/> <path fill="var(--logo-ink,#fff)" d="M539.7,277.3c-2.3-16.8-4.9-33-4.6-49c9.6-5,18.5-3.7,26.9-3.9c4.5,6.3,7.6,24.8,8.2,48.5 c-2.2,0.8-4.7,1.7-8,2.8c-1.2-7.6-2.3-14.6-3.5-21.9c-4,0.6-7.5,1.2-12.1,1.9c0.6,6.7,1.2,13.5,1.9,20.9 C545.3,276.9,542.7,277.1,539.7,277.3z M545.1,243.3c4.8-0.4,8.5-0.7,12.6-1c-0.3-2.3-0.5-3.7-0.8-5.7c-4.2,0.3-7.9,0.5-11.8,0.8 C545.1,239.5,545.1,240.9,545.1,243.3z"/> <path fill="var(--logo-ink,#fff)" d="M511.6,242.2c0.3,2.7,0.5,4.1,0.7,6c6.1,0,11.8,0,18.2,0c3.7,9.5,6.5,18.7,2.5,29.8c-8.5,1.1-17,2.3-25.9,3.5 c-0.7-4.7-1.3-8.5-1.9-12.5c6.5-0.9,12.7-1.7,19.2-2.6c0-2.5,0-4.4,0-7.3c-5.6,0.6-10.5,1.1-15.2,1.6c-4.4-2.7-6-6.3-6.3-10.8 c-0.3-3.6-0.8-7.2-1.2-10.8c-0.7-6.2,1.8-9.6,8.3-10.4c6.3-0.8,12.6-1.1,19.5-1.7c0.7,3.5,1.5,7.3,2.4,11.9 C525.2,240,518.8,241,511.6,242.2z"/> <path fill="var(--logo-ink,#fff)" d="M481.3,270.9c3.9-0.4,6.8-0.7,10.4-1c-0.6-6.8-1.1-13-1.7-19.3c-0.6-6-1.4-11.9-2.2-18.4 c3.2-0.8,5.7-1.4,9.1-2.2c1.8,15.3,3.6,30,5.5,45.6c-0.7,1.6-1.9,4-3.1,6.7c-8,0.8-15.7,1.6-24.2,2.4c-5.5-16.8-4.5-33.5-7.7-50.3 c3.5-0.4,6.1-0.7,9.1-1C478,245.9,479.6,257.8,481.3,270.9z"/> <path fill="#FF0000" d="M545.1,243.3c0-2.4,0-3.8,0-5.9c3.9-0.3,7.6-0.5,11.8-0.8c0.3,2,0.5,3.4,0.8,5.7 C553.6,242.6,549.8,242.9,545.1,243.3z"/></symbol></defs></svg>
<a class="skip" href="#main">Skip to content</a>
<header id="top">
  <a class="logo" href="index.html" aria-label="FieldhouseUSA home"><svg aria-hidden="true"><use href="#logo"/></svg></a>
  <nav aria-label="Main">${NAV.slice(0,7).map(navLink).join('')}</nav>
  <button id="menu-btn" aria-haspopup="dialog" aria-controls="menu"><i aria-hidden="true"></i>Menu</button>
</header>`);
document.body.insertAdjacentHTML('beforeend',`
<footer><div class="wrap">
  <div class="grid">
    <div><div class="flogo"><svg role="img" aria-label="FieldhouseUSA"><use href="#logo"/></svg></div>
      <address>${NAP}<br><a href="${SITE.maps}" rel="noopener">Get directions</a></address></div>
    <div><h3>Do</h3><ul><li><a href="events.html">Parties and events</a></li><li><a href="tournaments.html">Tournaments</a></li><li><a href="activities.html">Activities</a></li><li><a href="studios.html">Dance-Den and Yoga-Den</a></li></ul></div>
    <div><h3>See</h3><ul><li><a href="index.html">Home</a></li><li><a href="tour.html">Tour the fieldhouse</a></li><li><a href="activities.html#partners">Partners</a></li><li><a href="index.html#sponsors">Sponsors</a></li></ul></div>
    <div><h3>Know</h3><ul><li><a href="index.html#rules">Facility rules</a></li><li><a href="${SITE.waiver}" rel="noopener">Liability waiver</a></li><li><a href="index.html#lost">Lost items</a></li><li><a href="#ask">Contact</a></li></ul></div>
  </div>
  <div class="fine"><span>© ${new Date().getFullYear()} FieldhouseUSA</span><span>A commercial sports and event facility. Not a city rec center.</span></div>
</div></footer>
<dialog id="menu" aria-label="Menu"><div class="inner">
  <div class="mhead"><b>MENU</b><button class="x" aria-label="Close menu">×</button></div>
  <ol>${NAV.map((n,i)=>`<li><a href="${n[0]}" style="transition-delay:${40+i*30}ms,${40+i*30}ms,0ms"${here(n[3])}><span>${n[1]}</span><small>${n[2]}</small></a></li>`).join('')}</ol>
  <p class="hint">↑ ↓ to move · Enter to open · Esc to close</p>
  <div class="mfoot"><div class="acts"><a class="btn btn-red" href="${SITE.maps}" rel="noopener">Directions</a></div>${ADDR}<br><a href="mailto:${SITE.email}">${SITE.email}</a></div>
</div></dialog>
<dialog id="ask" aria-label="Ask the front desk"><div class="inner">
  <button class="x" aria-label="Close">×</button>
  <p class="eyebrow">Front desk</p><h2>Ask us</h2>
  <p class="lede">Tell us what you want to do and it goes to the right person. Event and tournament requests need the details below so we can answer with real dates and numbers.</p>
  <form id="inq" novalidate>
    <label>I want to<select name="type" id="inq-type" required>${INQ.map(i=>`<option value="${i[0]}">${esc(i[1])}</option>`).join('')}</select></label>
    <div class="f2"><label>Name <input name="name" required autocomplete="name"></label><label>Email<input name="email" type="email" required autocomplete="email"></label></div>
    <div class="f2"><label>Phone<input name="phone" type="tel" required autocomplete="tel"></label><label>Organization or team<input name="org" autocomplete="organization"></label></div>
    <fieldset id="evx"><legend>About the event <span class="req">(all required)</span></legend>
      <div class="f2"><label>Kind of event<select name="kind" required><option value="">Choose</option>${opt(['Tournament','Corporate event','Birthday or private party','Gala or fundraiser','Expo or trade show','Camp or clinic','League or recurring rental','Film or photo shoot','Other'])}</select></label>
        <label>Who is it for<select name="ages" required><option value="">Choose</option>${opt(['Adults','Youth','Adults and youth'])}</select></label></div>
      <div class="f2"><label>First choice date<input name="date" type="date" required></label><label>Backup date<input name="date2" type="date" required></label></div>
      <div class="f2"><label>Start time, including setup<input name="start" type="time" required></label><label>End time, including teardown<input name="end" type="time" required></label></div>
      <div class="f2"><label>Expected guests or players<input name="guests" type="number" min="1" inputmode="numeric" required></label><label>Teams, if a sports event<input name="teams" type="number" min="0" inputmode="numeric"></label></div>
      <div><label id="sp-l">Spaces you need</label><div class="checks" role="group" aria-labelledby="sp-l">${['Courts','Open floor (nets up)','Expo space','Gala space','Studio','Lounge and dining','Mezzanine','Not sure'].map(x=>`<label><input type="checkbox" name="spaces" value="${x}">${x}</label>`).join('')}</div></div>
      <div class="f2"><label>Food and drink<select name="food" required><option value="">Choose</option>${opt(['None','Food only','Food and bar','Not sure yet'])}</select></label>
        <label>Budget for the venue<select name="budget" required><option value="">Choose</option>${opt(['Under $2,500','$2,500 to $5,000','$5,000 to $10,000','$10,000 to $25,000','Over $25,000','Need a quote first'])}</select></label></div>
      <div class="f2"><label>Can you provide event insurance?<select name="coi" required><option value="">Choose</option>${opt(['Yes','No','Not sure'])}</select></label>
        <label>Is the date flexible?<select name="flex" required><option value="">Choose</option>${opt(['No, fixed date','Within the same week','Within the same month'])}</select></label></div>
      <label>Setup you need<textarea name="setup" required placeholder="Tables, chairs, staging, sound, scoreboards, vendors, anything brought in."></textarea></label>
    </fieldset>
    <label>Anything else<textarea name="details" placeholder="What would make this a good event for you."></textarea></label>
    <div><button class="btn btn-red" type="submit">Send the request</button></div>
    <p id="form-note">Sending opens your email app with the message filled in, addressed to ${SITE.email}. All rentals require a signed rental contract.</p>
  </form>
</div></dialog>
<button id="chat-open" type="button" aria-haspopup="dialog">Questions?</button>`);

const menu=$('#menu'),ask=$('#ask'),evx=$('#evx'),type=$('#inq-type');
$('#menu-btn').onclick=()=>menu.showModal();
[menu,ask].forEach(d=>{d.addEventListener('click',e=>{if(e.target===d)d.close();});$('.x',d).onclick=()=>d.close();});
/* the menu behaves like a game list: arrow keys move the selection */
menu.addEventListener('keydown',e=>{
  if(e.key!=='ArrowDown'&&e.key!=='ArrowUp')return;
  const items=$$('ol a',menu),i=items.indexOf(document.activeElement);e.preventDefault();
  items[(i+(e.key==='ArrowDown'?1:-1)+items.length)%items.length].focus();
});
/* event and tournament requests must answer the event questions; other requests skip them */
function syncType(){const on=type.value==='event'||type.value==='tournament';evx.hidden=!on;evx.disabled=!on;}
type.addEventListener('change',syncType);
function openAsk(t,fill){if(menu.open)menu.close();if(t&&INQ.some(i=>i[0]===t))type.value=t;syncType();
  if(fill)for(const [k,v] of Object.entries(fill)){const el=$('#inq').elements[k];if(el&&!(el instanceof RadioNodeList))el.value=v;}
  if(!ask.open)ask.showModal();}
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-ask],a[href="#ask"]');
  if(a){e.preventDefault();openAsk(a.dataset.ask||'other');return;} /* a plain Contact link is a general question, not whatever was picked last */
  if(e.target.closest('#menu ol a'))menu.close();
  /* downloads ask first */
  const d=e.target.closest('a[data-dl]');if(d&&!confirm('Download "'+d.dataset.dl+'" (PDF) to your device?'))e.preventDefault();
});
const LABEL={org:'Organization',kind:'Kind of event',ages:'For',date:'First choice date',date2:'Backup date',start:'Start (with setup)',end:'End (with teardown)',guests:'Guests or players',teams:'Teams',
  spaces:'Spaces',food:'Food and drink',budget:'Venue budget',coi:'Event insurance',flex:'Date flexible',setup:'Setup',details:'Notes'};
function mailRequest(t,get){
  const label=INQ.find(i=>i[0]===t)[1],rows=[`Request: ${label}`,`Name: ${get('name')}`,`Email: ${get('email')}`,`Phone: ${get('phone')}`];
  for(const [k,l] of Object.entries(LABEL)){const v=get(k);if(v)rows.push(`${l}: ${v}`);}
  // ponytail: mailto, no backend. Upgrade: POST to a form service or Pages Function when spam or lost leads become a problem.
  location.href=`mailto:${SITE.email}?subject=${encodeURIComponent(`[FHUSA] ${label}: ${get('name')}`)}&body=${encodeURIComponent(rows.join('\n')+'\n')}`;
}
$('#inq').addEventListener('submit',e=>{e.preventDefault();const f=e.target;
  const sp=$$('input[name=spaces]',f),need=!evx.hidden&&!sp.some(x=>x.checked);sp[0].setCustomValidity(need?'Pick at least one space.':'');
  if(!f.reportValidity())return;
  const fd=new FormData(f);mailRequest(fd.get('type'),k=>k==='spaces'?fd.getAll('spaces').join(', '):(fd.get(k)||''));
  $('#form-note').textContent=`Your email app should have opened. If it didn't, email ${SITE.email}.`;});
syncType();
/* the helper loads only when someone opens it */
$('#chat-open').onclick=()=>{if(window.FHCHAT)return FHCHAT.open();const s=document.createElement('script');s.src='assets/chat.js';document.body.appendChild(s);};
window.FH={$,$$,esc,SITE,openAsk,mailRequest};
})();
