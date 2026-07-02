const API_URL = "https://script.google.com/macros/s/AKfycbzh2IgijNSLHz9nx4D9iXfwnC4F0EhboOY8NaDJubK0btcUq9oTi193NXz2Aome2Io5iA/exec";

// 【超絶無敵】CSSが無視されるなら、JSから直接画面にデザインを強制注入する
const styleInject = document.createElement("style");
styleInject.innerHTML = `
    .list-card {
        background: #fff !important;
        border-radius: 12px !important;
        padding: 15px !important;
        margin-bottom: 12px !important;
        box-shadow: 0 4px 6px rgba(0,0,0,0.05) !important;
        border-left: 6px solid #ccc !important;
        font-family: sans-serif !important;
    }
    .list-card .date-time {
        font-size: 0.85rem !important;
        font-weight: bold !important;
        color: #666 !important;
        margin-bottom: 5px !important;
    }
    .list-card .title {
        font-size: 1.1rem !important;
        font-weight: 800 !important;
        color: #333 !important;
        margin-bottom: 8px !important;
        line-height: 1.4 !important;
    }
    .member-badge {
        display: inline-block !important;
        padding: 4px 12px !important;
        border-radius: 20px !important;
        font-size: 0.8rem !important;
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
    return `<span class="member-badge" style="background:#666">${text}</span>`;
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

function createCard(item) {
    const time = formatTime(item["時間"]);
    const date = formatDate(item["日付"]);
    const member = getMemberBadge(item["詳細"] || item["タイトル"]);
    const borderColor = getBorderColor(item);
    
    return `
        <div class="list-card" style="border-left: 6px solid ${borderColor} !important;">
            <div class="date-time">🗓 ${date} ${time ? ` ⏰ ${time}` : ""}</div>
            <div class="title">${item["タイトル"]}</div>
            <div class="performer">${member}</div>
        </div>
    `;
}

async function loadSchedule() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const today = new Date().toISOString().split('T')[0];

        let todayHTML = "";
        let futureHTML = "";

        data.forEach(item => {
            if (!item["日付"]) return;
            const itemDate = new Date(item["日付"]).toISOString().split('T')[0];
            if (itemDate === today) {
                todayHTML += createCard(item);
            } else if (itemDate > today) {
                futureHTML += createCard(item);
            }
        });

        const combinedHTML = todayHTML + futureHTML || "<p>予定はありません</p>";

        const targetIds = ["future-list", "schedule-list", "list-container", "schedule"];
        let targetEl = null;
        for (const id of targetIds) {
            targetEl = document.getElementById(id);
            if (targetEl) break;
        }
        if (!targetEl) {
            targetEl = document.querySelector(".container") || document.body;
        }

        if (targetEl) {
            targetEl.innerHTML = combinedHTML;
        }
    } catch (e) {
        console.error(e);
    }
}
loadSchedule();
