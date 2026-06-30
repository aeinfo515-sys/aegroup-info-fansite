
const data = [
 {date:"2026-06-30",title:"ZIP!",time:"5:50〜"},
 {date:"2026-07-01",title:"THE TIME,",time:"6:00〜"}
];

function render(){
 document.getElementById("today").innerHTML =
 data.map(d=>`<div>${d.date} ${d.title} ${d.time}</div>`).join("");

 document.getElementById("list").innerHTML =
 data.map(d=>`<div class='card'>${d.date} - ${d.title}</div>`).join("");

 document.getElementById("ticket").innerHTML = "一般発売チェック中";
}
render();

function show(id){
 document.querySelectorAll(".panel").forEach(p=>p.classList.remove("active"));
 document.getElementById(id).classList.add("active");
}

document.getElementById("search").addEventListener("input",(e)=>{
 const v=e.target.value.toLowerCase();
 const filtered=data.filter(d=>d.title.toLowerCase().includes(v));
 document.getElementById("list").innerHTML =
 filtered.map(d=>`<div class='card'>${d.date} - ${d.title}</div>`).join("");
});
