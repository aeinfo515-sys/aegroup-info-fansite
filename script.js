
const data = [
  {title:"ZIP!", time:"5:50〜"}
];

document.getElementById("schedule").innerHTML =
  data.map(d=>`<div>• ${d.title} ${d.time}</div>`).join("");
