const CALENDAR_API = "https://script.google.com/macros/s/AKfycbzh2IgijNSLHz9nx4D9iXfwnC4F0EhboOY8NaDJubK0btcUq9oTi193NXz2Aome2Io5iA/exec";

console.log("calendar.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const calendarEl = document.getElementById("calendar");

  if (!calendarEl) {
    console.error("no calendar element");
    return;
  }

  const calendar = new FullCalendar.Calendar(calendarEl, {
    locale: "ja",
    initialView: "dayGridMonth",
    height: "auto",

    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay"
    },

    buttonText: {
      today: "今日",
      month: "月",
      week: "週",
      day: "日"
    },

    events: async function(info, successCallback, failureCallback) {
      try {
        const response = await fetch(CALENDAR_API);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!Array.isArray(data)) {
          console.error("データが配列ではありません", data);
          failureCallback(new Error("Data is not an array"));
          return;
        }

        const events = data.map(item => {
          let color = "#6d4cff";

          // グループ・メンバー・種類に応じた色分け
          if (item["種類"] === "出演") color = "#3b82f6";
          if (item["種類"] === "SNS" || item["種類"] === "YouTube") color = "#10b981";
          if (item["種類"] === "雑誌" || item["種類"] === "ブログ") color = "#f59e0b";
          if (item["種類"] === "チケット" || item["種類"] === "当落" || item["種類"] === "予約開始") color = "#ef4444";

          // --- 1. 日付の処理 ---
          let finalDateStr = "";
          if (item["日付"]) {
            const d = new Date(item["日付"]);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const date = String(d.getDate()).padStart(2, '0');
            finalDateStr = `${year}-${month}-${date}`;
          }

          // --- 2. 時間の処理 ---
          let finalTimeStr = "";
          if (item["時間"]) {
            if (typeof item["時間"] === "string" && item["時間"].includes(":")) {
              finalTimeStr = item["時間"];
            } else {
              const t = new Date(item["時間"]);
              const hours = String(t.getHours()).padStart(2, '0');
              const minutes = String(t.getMinutes()).padStart(2, '0');
              finalTimeStr = `${hours}:${minutes}`;
            }
          }

          // --- 3. カレンダー用スタート日時の結合 ---
          let start = finalDateStr;
          if (finalTimeStr && finalTimeStr !== "00:00") {
            start += "T" + finalTimeStr;
          }

          return {
            title: item["タイトル"] || "タイトルなし",
            start: start,
            color: color,
            extendedProps: {
              type: item["種類"] || "未分類",
              detail: item["詳細"] || "",
              time: finalTimeStr || "未定"
            }
          };
        });

        successCallback(events);

      } catch (err) {
        console.error("カレンダーデータの処理に失敗:", err);
        failureCallback(err);
      }
    },

    eventClick(info) {
      const e = info.event;
      const displayTime = e.extendedProps.time === "00:00" ? "未定または00:00" : e.extendedProps.time;
      alert(
`${e.title}

種類：${e.extendedProps.type}
時間：${displayTime}
詳細：${e.extendedProps.detail}`
      );
    }
  });

  calendar.render();
});
