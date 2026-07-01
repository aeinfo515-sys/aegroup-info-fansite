document.addEventListener("DOMContentLoaded", () => {

  /* ======================
     HOME
  ====================== */
  const tv = document.querySelector(".tv p");
  const ticket = document.querySelector(".ticket p");
  const sns = document.querySelector(".sns p");
  const blog = document.querySelector(".blog p");

  if (typeof DATA !== "undefined") {

    if (tv) tv.textContent = DATA.today.tv;
    if (ticket) ticket.textContent = DATA.today.ticket;
    if (sns) sns.textContent = DATA.today.sns;
    if (blog) blog.textContent = DATA.today.blog;

    const futureBox = document.querySelector(".card .future-item")?.parentElement;

    if (futureBox) {
      futureBox.innerHTML = "";
      DATA.future.forEach(item => {
        const div = document.createElement("div");
        div.className = "future-item";
        div.innerHTML = `<strong>${item.date}</strong><br>${item.text}`;
        futureBox.appendChild(div);
      });
    }
  }

});
const scheduleBox = document.getElementById("schedule-list");

if (scheduleBox && typeof DATA !== "undefined") {
  scheduleBox.innerHTML = "";

  DATA.future.forEach(item => {
    const div = document.createElement("div");
    div.className = "future-item";
    div.innerHTML = `<strong>${item.date}</strong><br>${item.text}`;
    scheduleBox.appendChild(div);
  });
}
const snsBox = document.getElementById("sns-box");

if (snsBox && typeof DATA !== "undefined") {

  const snsData = DATA.sns;

  snsBox.innerHTML = `
    <div class="future-item"><strong>X（旧Twitter）</strong><br>${snsData.x}</div>
    <div class="future-item"><strong>Instagram</strong><br>${snsData.insta}</div>
    <div class="future-item"><strong>YouTube</strong><br>${snsData.youtube}</div>
    <div class="future-item"><strong>TikTok</strong><br>${snsData.tiktok}</div>
  `;
}
const ticketsBox = document.getElementById("tickets-box");

if (ticketsBox && typeof DATA !== "undefined") {

  ticketsBox.innerHTML = "";

  DATA.tickets.forEach(item => {
    const div = document.createElement("div");
    div.className = "future-item";
    div.innerHTML = `<strong>${item.title}</strong><br>${item.period}`;
    ticketsBox.appendChild(div);
  });

}