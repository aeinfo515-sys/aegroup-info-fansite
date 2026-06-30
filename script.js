
async function load(){
 const res=await fetch('data/schedule.json')
 const data=await res.json()
 window.all=data
 render(data)
}

function render(data){
 const el=document.getElementById('list')
 el.innerHTML=data.map(d=>`<div>📅 ${d.date} ｜ ${d.title} ${d.time}</div>`).join('')
}

document.getElementById('search').addEventListener('input',e=>{
 const v=e.target.value.toLowerCase()
 render(window.all.filter(d=>d.title.toLowerCase().includes(v)))
})

load()
