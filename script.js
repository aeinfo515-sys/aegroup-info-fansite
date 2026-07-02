const API_URL = "https://script.google.com/macros/s/AKfycbzh2IgijNSLHz9nx4D9iXfwnC4F0EhboOY8NaDJubK0btcUq9oTi193NXz2Aome2Io5iA/exec";

const styleInject = document.createElement("style");
styleInject.innerHTML = `
    .custom-schedule-item {
        background: #fdfdfd !important;
        border-radius: 8px !important;
        padding: 10px 12px !important;
        margin-bottom: 10px !important;
        box-shadow: 0 2px 4px rgba(0,0,0,0.04) !important;
        border-left: 5px solid #ccc !important;
        text-align: left !important;
    }
    .custom-date-time {
        font-size: 0.8rem !important;
        font-weight: bold !important;
        color: #555 !important;
        margin-bottom: 3px !important;
    }
    .custom-title {
        font-size: 0.95rem !important;
        font-weight: bold !important;
        color: #222 !important;
        margin-bottom: 4px !important;
    }
    .member-badge {
        display: inline-block !important;
        padding: 2px 10px !important;
        border-radius: 12px !important;
        font-size: 0.75rem !important;
        font-weight: bold !important;
        color: #fff !important;
    }
    .bg-group { background-color: #ff69b4 !important; }
    .bg-suezawa { background-color: #ff0000 !important; }
    .bg-masakado { background-color: #0000ff !important; }
    .bg-richard { background-color: #ffd700 !important; color: #333 !important; }
    .bg-kojima { background-color: #800080 !important; }
    .bg-sano { background-color: #008000 !important; }
`;
document.head.appendChild(styleInject);

function formatDate(dateStr) {
    if (!dateStr) return "";
    const str = String(dateStr);
    if (str.includes("1899")) return ""; // 1899年は日付としては無視
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatTime(timeStr) {
    if (!timeStr) return "";
    const str = String(timeStr);
    
    // 【超強力・時間引っこ抜き機能】
    // "1899-12-29T15:00:00.000Z" のような文字から、真ん中の「15:00」や「09:00」だけを絶対に抽出する
    if (str.includes("T")) {
        const parts = str.split("T");
        if (parts[1]) {
            const timePart = parts[1].substring(0, 5); // "15:00" をゲット
            if (timePart !== "00:00") return timePart;
        }
    }
    
    if (str.includes("00:00")) return "";
    if (str.includes(":") && !str.includes("GMT")) return str.substring(0, 5);
    
    return "";
}

function getMemberBadge(text) {
    if (!text) return "";
    if (text.includes("Aぇ! group")) return `<span class="member-badge bg-group">Aぇ! group</span>`;
    if (text.includes("末澤")) return `<span class="member-badge bg-suezawa">末澤 誠也</span>`;
    if (text.includes("正門")) return `<span class="member-badge bg-masakado">正門 良規</span>`;
    if (text.includes("リチャ")) return `<span class="member-badge bg-richard">草間リチャード敬太</span>`;
    if (text.includes("小島")) return `<span class="member-badge bg-kojima">小島 健</span>`;
    if (text.includes("佐野")) return `<span class="member-badge bg-sano">佐野 晶哉</span>`;
    return `<span class="member-badge" style="background:#777">${text}</span>`;
}

function getBorderColor(item) {
    const text = (item["詳細"] || "") + (item["タイトル"] || "");
    if (text.includes("Aぇ! group")) return "#ff69b4";
    if (text.includes("末澤")) return "#ff0000";
    if (text.includes("正門")) return "#0000ff";
    if (text.includes("リチャ")) return "#ffd700";
    if (text.includes("小島")) return "#800080";
    if (text.includes("佐野")) return "#008000";
    return "#ccc";
}

function createHtmlItem(item, showDate = true) {
    const time = formatTime(item["時間"]);
    const date = formatDate(item["日付"]);
    const member = getMemberBadge(item["詳細"] || item["タイトル"]);
    const borderColor = getBorderColor(item);
    
    let dateTimeText = "";
    if (showDate && date) dateTimeText += `🗓 ${date}`;
    if (time) dateTimeText += ` ⏰ ${time}`;
    if (!dateTimeText) dateTimeText = "Schedule";

    return `
        <div class="custom-schedule-item" style="border-left-color: ${borderColor} !important;">
            <div class="custom-date-time">${dateTimeText}</div>
            <div class="custom-title">${item["タイトル"]}</div>
            <div>${member}</div>
        </div>
    `;
}

async function loadSchedule() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        const now = new Date();
        const todayStr = now.toLocaleDateString("ja-JP", {timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit"}).replace(/\//g, "-");

        const todayTV = [];
        const todayTicket = [];
        const todaySNS = [];
        const todayBlog = [];
        let futureHTML = "";

        data.forEach(item => {
            if (!item["日付"]) return;
            if (String(item["日付"]).includes("1899")) return; // バグ日付データはスキップ

            const itemDate = new Date(item["日付"]).toLocaleDateString("ja-JP", {timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit"}).replace(/\//g, "-");
            const type = item["種類"] || "";

            if (itemDate >= todayStr) {
                futureHTML += createHtmlItem(item, true);
            }

            if (itemDate === todayStr) {
                const htmlContent = createHtmlItem(item, false);
                if (type === "出演" || type === "TV") todayTV.push(htmlContent);
                else if (type === "チケット" || type === "当落" || type === "予約開始" || type === "Ticket") todayTicket.push(htmlContent);
                else if (type === "SNS" || type === "YouTube") todaySNS.push(htmlContent);
                else if (type === "ブログ" || type === "雑誌" || type === "Blog") todayBlog.push(htmlContent);
            }
        });

        if (document.getElementById("today-tv")) document.getElementById("today-tv").innerHTML = todayTV.join("") || "予定はありません";
        if (document.getElementById("today-ticket")) document.getElementById("today-ticket").innerHTML = todayTicket.join("") || "予定はありません";
        if (document.getElementById("today-sns")) document.getElementById("today-sns").innerHTML = todaySNS.join("") || "予定はありません";
        if (document.getElementById("today-blog")) document.getElementById("today-blog").innerHTML = todayBlog.join("") || "予定はありません";
        if (document.getElementById("future-list")) document.getElementById("future-list").innerHTML = futureHTML || "予定はありません";

    } catch (e) {
        console.error(e);
    }
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadSchedule);
} else {
    loadSchedule();
}
