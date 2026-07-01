const API_URL = "https://script.google.com/macros/s/AKfycbzh2IgijNSLHz9nx4D9iXfwnC4F0EhboOY8NaDJubK0btcUq9oTi193NXz2Aome2Io5iA/exec";

async function loadSchedule() {
  try {

    const response = await fetch(API_URL);
    const data = await response.json();

    console.log(data);

    // 今日の予定
    let tv = [];
    let ticket = [];
    let sns = [];
    let blog = [];

    // 今後の予定
    let future = "";

    data.forEach(item => {

      future += `
        <div class="future-item">
          <strong>${item["日付"]} ${item["時間"]}</strong><br>
          【${item["種類"]}】${item["タイトル"]}<br>
          ${item["詳細"]}
        </div>
      `;

      switch(item["種類"]){

        case "出演":
          tv.push(`${item["時間"]} ${item["タイトル"]}`);
          break;

        case "チケット":
          ticket.push(item["タイトル"]);
          break;

        case "SNS":
          sns.push(item["タイトル"]);
          break;

        case "ブログ":
          blog.push(item["タイトル"]);
          break;

      }

    });

    document.getElementById("future-list").innerHTML =
      future || "予定はありません";

    document.getElementById("today-tv").innerHTML =
      tv.length ? tv.join("<br>") : "予定はありません";

    document.getElementById("today-ticket").innerHTML =
      ticket.length ? ticket.join("<br>") : "予定はありません";

    document.getElementById("today-sns").innerHTML =
      sns.length ? sns.join("<br>") : "予定はありません";

    document.getElementById("today-blog").innerHTML =
      blog.length ? blog.join("<br>") : "予定はありません";

  } catch (error) {

    console.error(error);

    document.getElementById("future-list").innerHTML =
      "データの取得に失敗しました";

  }
}

loadSchedule();