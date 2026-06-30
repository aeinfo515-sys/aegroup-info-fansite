
fetch('data/schedule.json')
.then(r=>r.json())
.then(data=>{
  const el=document.getElementById('schedule');

  if(!data.length){
    el.innerHTML='本日の出演はありません';
    return;
  }

  el.innerHTML = data.map(i=>`
    <div style="padding:8px 0;border-bottom:1px solid #eee">
      <b>${i.title}</b><br>
      <small>${i.time} / ${i.date}</small>
    </div>
  `).join('');
});
