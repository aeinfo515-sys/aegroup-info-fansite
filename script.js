document.addEventListener('DOMContentLoaded', () => {
    // ローカルでの直接閲覧および非同期処理のフォールバック用データ
    const fallbackData = {
        "news": [
            { "date": "2026-07-01", "title": "最新シングル情報が解禁されました！" },
            { "date": "2026-06-15", "title": "メディア出演情報を更新しました。" }
        ],
        "schedule": [
            { "date": "2026-07-10", "title": "レギュラー番組 放送日" },
            { "date": "2026-07-18", "title": "雑誌掲載情報" },
            { "date": "2026-08-01", "title": "ライブツアー開幕" }
        ]
    };

    function renderData(data) {
        const newsList = document.getElementById('news-list');
        if (newsList && data.news) {
            newsList.innerHTML = data.news.map(item => `
                <li><span style="color:#888; margin-right:15px;">${item.date}</span> ${item.title}</li>
            `).join('');
        }

        const scheduleContainer = document.getElementById('schedule-container');
        if (scheduleContainer && data.schedule) {
            scheduleContainer.innerHTML = data.schedule.map(item => `
                <div class="schedule-item">
                    <div class="schedule-date">${item.date}</div>
                    <div class="schedule-title">${item.title}</div>
                </div>
            `).join('');
        }
    }

    fetch('data.json')
        .then(response => {
            if (!response.ok) throw new Error('Network error');
            return response.json();
        })
        .then(data => renderData(data))
        .catch(() => {
            // Fetchが失敗した場合（ローカル環境など）はフォールバックデータを使用
            renderData(fallbackData);
        });
});