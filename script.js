/* ===== CONFIG: paste any YouTube link here (watch, share or embed URL) ===== */
const YOUTUBE_URL = "https://youtu.be/oZk_UCZC2NE?si=5ql1WkpJXZcO_-kC";   // e.g. "https://www.youtube.com/watch?v=VIDEO_ID"
const SEARCH_FALLBACK = "https://www.youtube.com/results?search_query=food+delivery+system+UML+class+diagram+object+oriented+design";

const classes = {
  User:{d:"Base class holding common user ID and contact details.",a:["userId","name","email","phone","password"],m:["login()","logout()","updateProfile()"]},
  Customer:{d:"Searches food and manages orders. Inherits from User.",a:["customerId","address","isPremium"],m:["searchRestaurants()","placeOrder()","cancelOrder()","trackOrder()"]},
  Restaurant:{d:"Updates menu items and availability. Inherits from User.",a:["restaurantId","name","cuisine","rating"],m:["addMenuItem()","updateMenu()","acceptOrder()"]},
  DeliveryAgent:{d:"Picks up orders and updates delivery status. Inherits from User.",a:["agentId","vehicleNo","status"],m:["pickOrder()","updateStatus()","completeDelivery()"]},
  Order:{d:"Order ID, items, status and total amount.",a:["orderId","orderDate","status","totalAmount"],m:["createOrder()","cancelOrder()","updateStatus()","getDetails()"]},
  MenuItem:{d:"A dish offered by a restaurant, with price and availability.",a:["itemId","name","price","available"],m:["isAvailable()","updatePrice()","getDetails()"]},
  Payment:{d:"Payment amount, method and status. Supports UPI, card and cash.",a:["paymentId","amount","method","status"],m:["processPayment()","refund()","getDetails()"]},
  Review:{d:"Rating and comment written by a customer.",a:["reviewId","rating","comment"],m:["addReview()","getDetails()"]},
  Notification:{d:"Messages sent to users about order updates.",a:["notificationId","message","type"],m:["send()","getDetails()"]}
};
const steps=[
  ["Browse","Customer browses restaurants and selects food items."],
  ["Check","System checks item availability."],
  ["Place","Customer reviews the cart and places the order."],
  ["Prepare","Restaurant accepts and prepares the order."],
  ["Pay","Customer completes the payment."],
  ["Deliver","Delivery agent picks up and delivers the order."],
  ["Done","Order status is updated to delivered."]
];
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

/* mobile menu */
const menuBtn=$("#menuBtn"), navLinks=$("#navLinks");
menuBtn.onclick=()=>{const o=navLinks.classList.toggle("open");menuBtn.setAttribute("aria-expanded",o)};
$$("#navLinks a").forEach(a=>a.onclick=()=>navLinks.classList.remove("open"));

/* class explorer */
const list=$("#classList"), detail=$("#classDetail");
function showClass(n){
  $$(".class-btn").forEach(b=>b.classList.toggle("active",b.textContent===n));
  const c=classes[n];
  detail.innerHTML=`<h3>${n}</h3><p class="desc">${c.d}</p><div class="cols"><div><h4>Attributes</h4>${c.a.map(x=>`<code>- ${x}</code>`).join("")}</div><div><h4>Methods</h4>${c.m.map(x=>`<code>+ ${x}</code>`).join("")}</div></div>`;
}
Object.keys(classes).forEach(n=>{const b=document.createElement("button");b.className="class-btn";b.textContent=n;b.onclick=()=>showClass(n);list.appendChild(b)});
showClass("User");

/* diagram tabs */
$$("#diagramTabs .tab").forEach(t=>t.onclick=()=>{
  $$("#diagramTabs .tab").forEach(x=>x.classList.remove("active"));t.classList.add("active");
  $$(".pane").forEach(p=>p.classList.toggle("active",p.id===t.dataset.target));
});

/* lightbox */
const lb=$("#lightbox"), lbImg=$("#lightImg");
function zoom(src,alt){lbImg.src=src;lbImg.alt=alt||"";lb.classList.add("show")}
$$(".zoomable").forEach(i=>i.onclick=()=>zoom(i.src,i.alt));
$(".hero-card").onclick=()=>zoom($("#posterThumb").src,"Poster");
lb.onclick=()=>lb.classList.remove("show");
document.addEventListener("keydown",e=>{if(e.key==="Escape")lb.classList.remove("show")});

/* workflow stepper */
const st=$("#stepper"), info=$("#stepInfo"); let cur=0, timer=null;
steps.forEach((s,i)=>{const d=document.createElement("div");d.className="step";d.innerHTML=`<div class="dot">${i+1}</div><small>${s[0]}</small>`;d.onclick=()=>{stop();go(i)};st.appendChild(d)});
function go(i){cur=(i+steps.length)%steps.length;
  $$(".step").forEach((el,k)=>{el.classList.toggle("active",k===cur);el.classList.toggle("done",k<cur)});
  info.textContent=`Step ${cur+1}: ${steps[cur][1]}`}
function stop(){clearInterval(timer);timer=null;$("#playBtn").textContent="▶ Play"}
$("#playBtn").onclick=()=>{if(timer){stop();return}
  $("#playBtn").textContent="⏸ Pause";if(cur===steps.length-1)go(0);
  timer=setInterval(()=>{if(cur>=steps.length-1){stop();return}go(cur+1)},1500)};
$("#nextBtn").onclick=()=>{stop();go(cur+1)};$("#prevBtn").onclick=()=>{stop();go(cur-1)};
go(0);

/* YouTube video */
function ytId(u){const m=u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);return m?m[1]:null}
(function(){
  const f=$("#videoFrame"), id=YOUTUBE_URL?ytId(YOUTUBE_URL):null;
  const watch=id?`https://www.youtube.com/watch?v=${id}`:SEARCH_FALLBACK;
  const card=(note)=>{
    f.innerHTML=`<div class="video-fallback" ${id?`style="background:linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url('https://img.youtube.com/vi/${id}/hqdefault.jpg') center/cover"`:""}><div style="font-size:3rem">▶</div><p>${note}</p><a class="btn" href="${watch}" target="_blank" rel="noopener">${id?"Watch on YouTube":"Open YouTube"}</a></div>`};
  if(!id){card("Watch related videos on YouTube");return}
  /* YouTube blocks embeds (Error 153) when the page has no http(s) origin, e.g. opened as file:// */
  if(location.protocol==="file:"){card("Embedded playback needs the site to be hosted (GitHub Pages or a local server). Click to watch on YouTube.");return}
  f.innerHTML=`<iframe src="https://www.youtube.com/embed/${id}?rel=0&modestbranding=1" title="Project video" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>`;
})();

/* scroll effects */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});
$$(".reveal").forEach(el=>io.observe(el));
const toTop=$("#toTop");toTop.onclick=()=>scrollTo({top:0,behavior:"smooth"});
const secs=$$("main section[id]"), links=$$("#navLinks a");
addEventListener("scroll",()=>{
  toTop.classList.toggle("show",scrollY>500);
  let id="";secs.forEach(s=>{if(scrollY>=s.offsetTop-120)id=s.id});
  links.forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+id));
});
/* counters */
const co=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;co.unobserve(e.target);
  const t=+e.target.dataset.count;let n=0;const iv=setInterval(()=>{n++;e.target.textContent=n;if(n>=t)clearInterval(iv)},90)}));
$$("[data-count]").forEach(el=>co.observe(el));
