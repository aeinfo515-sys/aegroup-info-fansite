const API_URL = "https://script.google.com/macros/s/AKfycbzh2IgijNSLHz9nx4D9iXfwnC4F0EhboOY8NaDJubK0btcUq9oTi193NXz2Aome2Io5iA/exec";

function $(id) {
  return document.getElementById(id);
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const month = d.getMonth() + 1;
  const date = d.getDate();
  return `${month}/${date}`;
}

function formatTime(timeStr) {
  if (!timeStr) return "";
  const str = String(timeStr);
  
  // 「08:00」や「23:00」のような短い時間形式ならそのまま返す
  if (str.includes(":") && !str.includes("GMT") && str.length <= 8) {
    return str;
  }
  
  // 長い「GMT+0900 (日本標準時)」などの文字列から時間をぶっこ抜く
  const d = new Date(timeStr);
  if (isNaN(d.getTime())) {
    // 文字列から「08:00」のような部分を無理やり探す
    const match = str.match(/(\d{2}):(\d{2})/);
    if (match) return `${match[1]}:${match[2]}`;
    return str;
  }
  
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

function todayString() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function normalizeDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function createCard(item) {
  const timeDisplay = formatTime(item["時間"]);
  const hasTime = item["時間"] && timeDisplay !== "" && timeDisplay !== "00:00";
  return `
    <div class="list-card">
      <div class="date">
        ${formatDate(item["日付"])}
        ${hasTime ? ` ${timeDisplay}` : ""}
      </div>
      <div class="title">${item["タイトル"] || ""}</div>
      ${item["詳細"] ? `<div class="detail">${item["詳細"]}</div>` : ""}
    </div>
  `;
}

async function loadSchedule() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const today = todayString();

    const todayTV = [];
    const todayTicket = [];
    const todaySNS = [];
    const todayBlog = [];

    let futureHTML = "";
    let scheduleHTML = "";
    let snsHTML = "";
    let ticketHTML = "";

    data.forEach(item => {
      const type = item["種類"] || "";
      const itemDate = normalizeDate(item["日付"]);

      if (itemDate >= today) {
        futureHTML += createCard(item);
      }

      if (itemDate === today) {
        const timeDisplay = formatTime(item["時間"]);
        const hasTime = timeDisplay && timeDisplay !== "00:00";
        const timePrefix = hasTime ? `[${timeDisplay}] ` : "";
        switch (type) {
          case "出演": todayTV.push(`${timePrefix}${item["タイトル"]}`); break;
          case "チケット": case "当落": case "予約開始": todayTicket.push(`${timePrefix}${item["タイトル"]}`); break;
          case "SNS": case "YouTube": todaySNS.push(`${timePrefix}${item["タイトル"]}`); break;
          case "ブログ": todayBlog.push(`${timePrefix}${item["タイトル"]}`); break;
        }
      }

      switch (type) {
        case "出演": scheduleHTML += createCard(item); break;
        case "SNS": case "ブログ": case "YouTube": snsHTML += createCard(item); break;
        case "チケット": case "当落": case "予約開始": ticketHTML += createCard(item); break;
      }
    });

    if ($("future-list")) $("future-list").innerHTML = futureHTML || "<p>予定はありません</p>";
    if ($("today-tv")) $("today-tv").innerHTML = todayTV.length ? todayTV.join("<br>") : "予定はありません";
    if ($("today-ticket")) $("today-ticket").innerHTML = todayTicket.length ? todayTicket.join("<br>") : "予定はありません";
    if ($("today-sns")) $("today-sns").innerHTML = todaySNS.length ? todaySNS.join("<br>") : "予定はありません";
    if ($("today-blog")) $("today-blog").innerHTML = todayBlog.length ? todayBlog.join("<br>") : "予定はありません";
    if ($("schedule-list")) $("schedule-list").innerHTML = scheduleHTML || "<p>予定はありません</p>";
    if ($("sns-list")) $("sns-list").innerHTML = snsHTML || "<p>予定はありません</p>";
    if ($("tickets-list")) $("tickets-list").innerHTML = ticketHTML || "<p>予定はありません</p>";
  } catch (error) {
    console.error(error);
    ["future-list", "schedule-list", "sns-list", "tickets-list"].forEach(id => {
      if ($(id)) $(id).innerHTML = "<p>データの取得に失敗しました。</p>";
    });
  }
}
loadSchedule();
