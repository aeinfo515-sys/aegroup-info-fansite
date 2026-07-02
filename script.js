const API_URL = "https://script.google.com/macros/s/AKfycbzh2IgijNSLHz9nx4D9iXfwnC4F0EhboOY8NaDJubK0btcUq9oTi193NXz2Aome2Io5iA/exec";

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

// メンバー名を判別して色をつける関数
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

function createCard(item) {
    const time = formatTime(item["時間"]);
    const date = formatDate(item["日付"]);
    const member = getMemberBadge(item["詳細"] || item["タイトル"]);
    
    return `
        <div class="list-card" style="border-left-color: ${getBorderColor(item)}">
            <div class="date-time">
                <span>🗓 ${date}</span>
                ${time ? `<span>⏰ ${time}</span>` : ""}
            </div>
            <div class="title">${item["タイトル"]}</div>
            <div class="performer">${member}</div>
        </div>
    `;
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

async function loadSchedule() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const today = new Date().toISOString().split('T')[0];

        let todayHTML = "";
        let futureHTML = "";

        data.forEach(item => {
            const itemDate = new Date(item["日付"]).toISOString().split('T')[0];
            if (itemDate === today) {
                todayHTML += createCard(item);
            } else if (itemDate > today) {
                futureHTML += createCard(item);
            }
        });

        const combinedHTML = todayHTML + futureHTML || "<p>予定はありません</p>";

        // 【無敵モード】HTML内のどこに予定表示エリアがあっても見つけ出して強制上書きする
        const targetIds = ["future-list", "schedule-list", "list-container", "schedule"];
        let targetEl = null;
        
        for (const id of targetIds) {
            targetEl = document.getElementById(id);
            if (targetEl) break;
        }
        
        if (!targetEl) {
            // 万が一IDが見つからなければ、class名が「container」の場所か、最悪bodyにねじ込む
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
