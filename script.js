
fetch('data/schedule.json')
.then(r=>r.json())
.then(data=>{
  const el=document.getElementById('schedule');
  if(!el) return;
  el.innerHTML=data.map(d=>`<div class='card'>${d.date} ${d.title} ${d.time}</div>`).join('');
});

const input=document.getElementById('search');
if(input){
 input.addEventListener('input',e=>{
  console.log(e.target.value);
 });
}
