const API_URL = "https://script.google.com/macros/s/AKfycbzh2IgijNSLHz9nx4D9iXfwnC4F0EhboOY8NaDJubK0btcUq9oTi193NXz2Aome2Io5iA/exec";

// 【強制デザイン注入】style.cssを無視してJSからメンカラとカード風デザインを直接当てる
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
    .bg-group { background-color: #ff69b4 !important; } /* ピンク */
    .bg-suezawa { background-color: #ff0000 !important; } /* 赤 */
    .bg-masakado { background-color: #0000ff !important; } /* 青 */
    .bg-richard { background-color: #ffd700 !important; color: #333 !important; } /* 黄 */
    .bg-kojima { background-color: #800080 !important; } /* 紫 */
    .bg-sano { background-color: #008000 !important; } /* 緑 */
`;
document.head.appendChild(styleInject);

function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
}

function formatTime(timeStr) {
    if (!timeStr || timeStr === "00:00") return "";
    const str = String(timeStr);
    if (str.includes(":") && !str.includes("GMT")) return str;
    const d = new Date(timeStr);
    if (isNaN(d.getTime())) {
        const match = str.match(/(\d{2}):(\d{2})/);
        return match ? `${match[1]}:${match[2]}` : "";
    }
    return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
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

// 分割された綺麗なパーツを作る
function createHtmlItem(item, showDate = true) {
    const time = formatTime(item["時間"]);
    const date = formatDate(item["日付"]);
    const member = getMemberBadge(item["詳細"] || item["タイトル"]);
    const borderColor = getBorderColor(item);
    
    let dateTimeText = "";
    if (showDate && date) dateTimeText += `🗓 ${date}`;
    if (time) dateTimeText += ` ⏰ ${time}`;
    if (!dateTimeText) dateTimeText = "予定";

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
        
        // 日本時間の今日を取得 (YYYY-MM-DD)
        const now = new Date();
        const todayStr = now.toLocaleDateString("ja-JP", {timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit"}).replace(/\//g, "-");

        const todayTV = [];
        const todayTicket = [];
        const todaySNS = [];
        const todayBlog = [];
        let futureHTML = "";

        data.forEach(item => {
            if (!item["日付"]) return;
            
            // アイテムの日付を YYYY-MM-DD に変換
            const itemDate = new Date(item["日付"]).toLocaleDateString("ja-JP", {timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit"}).replace(/\//g, "-");
            const type = item["種類"] || "";

            // 今後の予定リスト（今日以降すべて）
            if (itemDate >= todayStr) {
                futureHTML += createHtmlItem(item, true);
            }

            // 今日の4つの箱の仕分け
            if (itemDate === todayStr) {
                const htmlContent = createHtmlItem(item, false); // 今日の中身は日付を非表示にしてスッキリ
                if (type === "出演") todayTV.push(htmlContent);
                else if (type === "チケット" || type === "当落" || type === "予約開始") todayTicket.push(htmlContent);
                else if (type === "SNS" || type === "YouTube") todaySNS.push(htmlContent);
                else if (type === "ブログ" || type === "雑誌") todayBlog.push(htmlContent);
            }
        });

        // 画面のそれぞれの場所に一頭両断で流し込む
        if (document.getElementById("today-tv")) document.getElementById("today-tv").innerHTML = todayTV.join("") || "予定はありません";
        if (document.getElementById("today-ticket")) document.getElementById("today-ticket").getElementById("today-ticket").innerHTML = todayTicket.join("") || "予定はありません";
        if (document.getElementById("today-sns")) document.getElementById("today-sns").innerHTML = todaySNS.join("") || "予定はありません";
        if (document.getElementById("today-blog")) document.getElementById("today-blog").innerHTML = todayBlog.join("") || "予定はありません";
        if (document.getElementById("future-list")) document.getElementById("future-list").innerHTML = futureHTML || "予定はありません";

    } catch (e) {
        console.error(e);
    }
}
loadSchedule();
