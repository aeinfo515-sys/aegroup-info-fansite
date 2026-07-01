/* =========================
   DATA（ここだけ編集すれば全部更新される）
========================= */

const data = {
  today: {
    tv: "本日の出演はありません",
    ticket: "受付情報なし",
    sns: "更新予定なし",
    blog: "更新予定なし"
  },

  future: [
    { date: "7/2", text: "出演情報" },
    { date: "7/3", text: "チケット情報" },
    { date: "7/4", text: "SNS更新予定" }
  ]
};

/* =========================
   HOME更新
========================= */
function loadHome(){

  const tv = document.querySelector(".tv p");
  const ticket = document.querySelector(".ticket p");
  const sns = document.querySelector(".sns p");
  const blog = document.querySelector(".blog p");

  if(tv) tv.textContent = data.today.tv;
  if(ticket) ticket.textContent = data.today.ticket;
  if(sns) sns.textContent = data.today.sns;
  if(blog) blog.textContent = data.today.blog;

  const future = document.querySelector(".card .future-item")?.parentElement;

  if(future){
    future.innerHTML = "";
    data.future.forEach(item=>{
      const div = document.createElement("div");
      div.className = "future-item";
      div.innerHTML = `<strong>${item.date}</strong><br>${item.text}`;
      future.appendChild(div);
    });
  }
}

/* =========================
   実行
========================= */
document.addEventListener("DOMContentLoaded", loadHome);