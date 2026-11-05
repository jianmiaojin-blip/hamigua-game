

const storyText = document.getElementById("story-text");
const choicesBox = document.getElementById("choices");
const sceneLabel = document.getElementById("scene-label");
const statusPanel = document.getElementById("status-panel");
const statusContent = document.getElementById("status-content");
const toggleStatusButton = document.getElementById("toggle-status");
const restartButton = document.getElementById("restart-button");

const initialState = () => ({
  affection: 0,          
  trust: 0,              
  truth: 0,               
  melonPan: 0,            
  strawberryBread: 0,     
  yakisoba: 0,            
  sawShinomiya: false,
  sawKounotori: false,
  day2RejectedClue: false,
  finalRiskChoice: false,
  caseSolved: false
});

let state = initialState();
let statusVisible = true;

function updateStatus() {
  statusPanel.classList.remove("hidden");
  statusContent.innerHTML = "";

  const items = [
    ["伊吹好感度", state.affection],
    ["搭檔信賴", state.trust],
    ["案件真相", state.truth],
    ["蜜瓜包", state.melonPan],
    ["草莓果醬麵包", state.strawberryBread],
    ["炒麵", state.yakisoba]
  ];

  items.forEach(([label, value]) => {
    const pill = document.createElement("span");
    pill.className = "status-pill";
    pill.textContent = `${label}：${value}`;
    statusContent.appendChild(pill);
  });

  statusContent.classList.toggle("hidden", !statusVisible);
  toggleStatusButton.textContent = statusVisible ? "收合數值" : "顯示數值";
}

function changeStats(changes = {}) {
  Object.entries(changes).forEach(([key, amount]) => {
    if (typeof state[key] === "number") {
      state[key] += amount;
    }
  });
  updateStatus();
}

function showScene({ label, day = "序章", paragraphs = [], choices = [] }) {
  sceneLabel.textContent = label;
  storyText.innerHTML = "";

  paragraphs.forEach((item) => {
    const p = document.createElement("p");
    if (typeof item === "string") {
      p.textContent = item;
    } else {
      p.className = "dialogue";
      const speaker = document.createElement("strong");
      speaker.textContent = `${item.speaker}：`;
      p.appendChild(speaker);
      p.appendChild(document.createTextNode(`「${item.text}」`));
    }
    storyText.appendChild(p);
  });

  choicesBox.innerHTML = "";
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `choice-button${choice.primary ? " primary" : ""}`;
    button.textContent = choice.text;
    button.addEventListener("click", () => {
      if (choice.changes) changeStats(choice.changes);
      if (choice.action) choice.action();
    });
    choicesBox.appendChild(button);
  });

  updateStatus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startGame() {
  state = initialState();
  updateStatus();
  introDisclaimer();
}

function introDisclaimer() {
  showScene({
    label: "遊戲說明",
    day: "序章",
    paragraphs: [
      "此為《MIU404》日本電視劇原作的延伸創作，沿用了劇內的角色設定、角色個性還有故事風格，來創作的二創故事，案件的故事為原創。為粉絲創作，輕鬆娛樂向。故事情節、案件內容皆為創作需要，非真實事件改編。",
      "每一次會描述一段故事內容，還會提供三至五個選項。你可以透過選擇改變故事的走向，並且解鎖不同的結局。(可能還有奇怪的隱藏結局?????)",
    ],
    choices: [
      { text: "我知道了，繼續", primary: true, action: characterIntro }
    ]
  });
}

function characterIntro() {
  showScene({
    label: "認識這部劇以及遊戲裡主要登場角色!",
    paragraphs: [
      "《MIU404》是2020年由綾野剛和星野源主演的連續劇，MIU為主角所屬的警視廳機動搜查隊的英文縮寫，404是主角駕駛車輛的無線電呼號。",
      "機動搜查隊簡稱機搜，是便衣刑警駕駛車輛在街道上進行巡邏的部隊，負責在案件發生時，第一時間趕到現場進行初動搜查。",
      "主角為新設的第四機搜搭檔，前搜查一課志摩一未與原本在奧多摩任職的巡警伊吹藍，在機緣巧合下組成搭檔。",
      "每一集不僅能看見這一對搭檔共同幫忙需要的人們解決案件，還能看見他們倆人的關係在這段時間的變化與發展。",
      "認識主要登場角色!",
      "伊吹藍：志摩一未的搭檔。優點是跑得很快，喜歡使用直覺查案。",
      "志摩一未：伊吹藍的搭檔，性格冷靜及理性，擁有強大的觀察力。",

      "此遊戲內的故事採用的是志摩一未的視角。",
      "看完說明後就可以進入故事~",
    ],

    choices: [
      { text: "進入第一天", primary: true, action: day1Morning }
    ]
  });
}

// -------------------- 第一天 --------------------

function day1Morning() {
  showScene({
    label: "第一天・早上",
    day: "第一天",
    paragraphs: [
      "萬聖節即將到來，聽說附近的麵包店也推出了期間限定的萬聖節主題蜜瓜包。每日販售的數量有限，吸引不少人前去排隊。而搭檔伊吹藍也是排隊的其中一人。",
      { speaker: "伊吹藍", text: "志摩！我跟你說喔！前幾天說的那個限定麵包，我今天早上有去排隊欸。" },
      "剛走進機搜的分駐所，伊吹藍就迫不及待地分享早上的遭遇。",
      { speaker: "志摩一未", text: "你竟然真的特地去排隊了嗎？" },
      { speaker: "伊吹藍", text: "我只是早上晨跑的時候經過啦，我本來有機會買到最後一個蜜瓜包欸！" },
      { speaker: "伊吹藍", text: "結果輪到我的時候，店員們湊在一起不知道在說些什麼，然後就跟我說不好意思，因為數量計算錯誤，今天早上的蜜瓜包已經全部賣完了。" },
      { speaker: "志摩一未", text: "那真是太可惜了。" },
      { speaker: "伊吹藍", text: "那可是限定的蜜瓜包欸……本來想當作今天的早餐吃掉的。" }
    ],
    choices: [
      { text: "你可以明天再去排隊啊。", changes: { affection: 0 }, action: () => morningResponse("ordinary") },
      { text: "就為了這個，你一早就在這裡哀號？", changes: { affection: 5 }, action: () => morningResponse("tease") },
      { text: "……那你早餐吃了嗎？", changes: { affection: 10 }, action: () => morningResponse("care") }
    ]
  });
}

function morningResponse(type) {
  const paragraphs = type === "care"
    ? [
        { speaker: "伊吹藍", text: "小志摩關心我早餐吃什麼嗎？" },
        { speaker: "志摩一未", text: "算了，當我沒說。" },
        { speaker: "伊吹藍", text: "說出的話不可以取消。還有，我最後吃了紅豆麵包。" }
      ]
    : [
        { speaker: "伊吹藍", text: "你不懂啦！限定的主題麵包很吸引人欸。要是我那時候能買到的話，還會是今天早上最後一個買到麵包的人，不覺得超級幸運的嗎？" },
        { speaker: "志摩一未", text: "欸~是這樣喔。" },
        { speaker: "伊吹藍", text: "小志摩又敷衍人。" }
      ];

  showScene({
    label: "第一天・早上",
    day: "第一天",
    paragraphs,
    choices: [
      { text: "開始今天的工作", primary: true, action: day1RingCase }
    ]
  });
}

function day1RingCase() {
  showScene({
    label: "第一天・失物報案",
    day: "第一天",
    paragraphs: [
      "你們開始了今天的工作。今天要處理的案件是，有一位女士的失物報案。據報案人表示，她遺失了男友贈送的求婚戒指，她在抵達上班的公司後才發現戒指遺失。",
      "經過同事的初步詢問，你們取得了報案人一整天當天的行動紀錄，得知她曾經到訪的各個地點。",
      { speaker: "伊吹藍", text: "志摩……" },
      { speaker: "志摩一未", text: "嗯？怎麼了？" },
      { speaker: "伊吹藍", text: "你看這裡！報案人今天早上也有去那間麵包店排隊欸！" },
      { speaker: "伊吹藍", text: "有買到限定的麵包啊……真好。" },
      { speaker: "志摩一未", text: "所以這跟案件有什麼關係嗎？" },
      { speaker: "伊吹藍", text: "我是在想，戒指有沒有可能是在店裡遺失的啊？" }
    ],
    choices: [
      { text: "有什麼根據嗎？", changes: { trust: 5 }, action: () => ringCaseResponse("ask") },
      { text: "報案人只是剛好跟你去了同一間店吧。", changes: {}, action: () => ringCaseResponse("coincidence") },
      { text: "要去那間麵包店看看嗎？", changes: { trust: 10 }, action: () => ringCaseResponse("go") }
    ]
  });
}

function ringCaseResponse(type) {
  let paragraphs;
  if (type === "coincidence") {
    paragraphs = [
      { speaker: "伊吹藍", text: "就是感覺，案件的線索會跟那間店有關嘛！" },
      { speaker: "志摩一未", text: "也有可能只是掉在經過的路上了吧。" },
      { speaker: "伊吹藍", text: "也可以順便去那間店看看吧！" }
    ];
  } else {
    paragraphs = [
      { speaker: "志摩一未", text: "在報案人的行動紀錄中，確實只有這間店很令人在意。" },
      { speaker: "志摩一未", text: "就先去這間店看看吧。" },
      { speaker: "伊吹藍", text: "朝蜜瓜包店，出動！" },
      { speaker: "志摩一未", text: "在熱血沸騰什麼啊…… (跟平常一樣無奈地笑了。)" }
    ];
  }

  showScene({
    label: "第一天・前往麵包店",
    day: "第一天",
    paragraphs,
    choices: [
      { text: "午餐時間！", primary: true, action: lunchDay1 }
    ]
  });
}

function lunchDay1() {
  showScene({
    label: "第一天・午餐時間",
    day: "第一天",
    paragraphs: [
      "你和伊吹藍決定先吃頓午餐，再到案發現場(那間麵包店)去搜查案件的線索。午餐要吃什麼呢?"
    ],
    choices: [
      { text: "蜜瓜包", changes: { melonPan: 10, affection: 5 }, action: () => lunchStoryDay1("melon") },
      { text: "烏龍麵", changes: { trust: 5 }, action: () => lunchStoryDay1("udon") },
      { text: "草莓果醬麵包", changes: { strawberryBread: 1 }, action: () => lunchStoryDay1("strawberry") },
      { text: "炒麵", changes: { yakisoba: 1 }, action: () => lunchStoryDay1("yakisoba") },
      { text: "問伊吹藍想要吃什麼", changes: { trust: 5, affection: 5 }, action: () => lunchStoryDay1("ask") }
    ]
  });
}

function lunchStoryDay1(food) {
  let paragraphs = [];
  if (food === "melon") {
    paragraphs = [
      "你想著因為早上那傢伙沒有買到他想要買的蜜瓜包，也許他還是很想要吃蜜瓜包吧。所以你用外送的應用程式幫伊吹藍買了蜜瓜包當午餐。",
      "伊吹藍看到你幫他買的蜜瓜包時露出了非常開心的表情。",
      { speaker: "伊吹藍", text: "小志摩！" },
      { speaker: "志摩一未", text: "好了好了！我只是買我的午餐，然後順便幫你買的，不要黏過來！" }
    ];
  } else if (food === "udon") {
    paragraphs = [
      "你們和第四機搜的另一對搭檔，代號401的陣馬耕平和九重世人一起在分駐所煮了機搜烏龍麵來吃。",
      "有空的時候，大家就會在分駐所一起吃烏龍麵。分駐所就像是第四機搜在這裡的家一樣，這個時刻總是讓心裡感受到溫暖。"
    ];
  } else if (food === "strawberry") {
    state.sawShinomiya = true;
    paragraphs = [
      "你到便利商店購買草莓果醬麵包想要拿來當你和伊吹藍的午餐，轉身準備去櫃台結帳，卻遇上一個長得跟你非常像的男人。",
      "他的身上穿著醫師的白色長袍，胸前掛著一個名牌，名牌上的名字是「四宮春樹」。",
      "你和四宮春樹對上了眼神，但他並沒有先開口說話。",
      "你看見他的手上也正拿著兩個草莓果醬麵包和一瓶牛奶，好奇的對他詢問。",
      { speaker: "四宮春樹", text: "……。" },
      { speaker: "志摩一未", text: "那個，也是要買給誰吃的午餐嗎？" },
      { speaker: "四宮春樹", text: "這都是我自己要吃的。" },
      "你無法從四宮春樹的表情判斷他此刻的情緒。",
      "回去之後，你對伊吹藍說起這場相遇。",
      { speaker: "伊吹藍", text: "難道是什麼草莓果醬麵包魔人？" },
      { speaker: "志摩一未", text: "哪有那種東西。只是一個很喜歡吃草莓果醬麵包的醫生吧。" },
      "也許你下次還有機會遇見那位醫生。"
    ];
  } else if (food === "yakisoba") {
    state.sawKounotori = true;
    paragraphs = [
      "伊吹藍決定到便利商店購買炒麵當你們的午餐。他帶著兩盒炒麵回來時還說起了一場奇妙的相遇。",
      "在便利商店準備去結帳的時候，轉身與一位長得與他很像的男人對上視線。",
      "他的身上穿著醫師的白色長袍，胸前掛著一個名牌，名牌上的名字是「鴻鳥櫻」。",
      "伊吹藍看見他的手上正拿著一盒炒麵。",
      { speaker: "伊吹藍", text: "醫生的工作很忙吧……，中午的時間也只能吃炒麵了嗎?" },
      { speaker: "鴻鳥櫻", text: "雖然很忙，但只要能讓每位產婦都平安生產，就是我們的工作。" },
      "鴻鳥櫻溫柔地瞇起眼睛笑了。",
      { speaker: "鴻鳥櫻", text: "然後我其實還蠻喜歡吃這個的。" },
      "聽完伊吹藍的描述後，你覺得那個人聽起來是個非常溫柔的人。",
      "也許下次還有機會遇見那位醫生。",
    ];
  } else {
    paragraphs = [
      "你決定問伊吹藍想要吃什麼，聽到你難得問他想吃什麼的伊吹藍很高興。",
      "伊吹藍說因為早上沒有買到蜜瓜包，所以他想要買一個蜜瓜包帶著在路上吃。",
      "你幫他買了蜜瓜包，還有你自己要吃的那份，伊吹藍看起來很開心。",
    ];
  }

  showScene({
    label: "第一天・午餐",
    day: "第一天",
    paragraphs,
    choices: [
      { text: "前往麵包店調查", primary: true, action: day1Bakery }
    ]
  });
}

function day1Bakery() {
  showScene({
    label: "第一天・麵包店調查",
    day: "第一天",
    paragraphs: [
      "吃過午餐之後，你們到那間麵包店進行調查。結果剛到麵包店，就看見店員們聚在一起似乎在討論些什麼。",
      "你和伊吹藍出示了警察證，並說明了你們的來意。",
      { speaker: "志摩一未", text: "遇到什麼事情了嗎？" },
      { speaker: "麵包店店員", text: "是這樣的，我們這幾天早上都有販售主題限定蜜瓜包的活動。有一個店員負責替客人買的限定麵包包裝，但他在今天早上的活動結束後就突然失去蹤影了。我們聯絡不到他。" },
      { speaker: "伊吹藍", text: "有一個店員消失了嗎……。" },
      { speaker: "志摩一未", text: "那位店員最近有什麼不太尋常的地方嗎？" },
      { speaker: "麵包店店員", text: "我只知道他最近正在煩惱家人的醫藥費，除此之外沒有了。" },
      { speaker: "伊吹藍", text: "志摩，這背後一定有什麼更大的陰謀。" }
    ],
    choices: [
      { text: "接下來去調查那個店員的去向。", changes: { trust: 10, affection: 10 }, action: () => bakeryResponse("investigate") },
      { text: "這只是巧合吧。", changes: { trust: -10, affection: -5 }, action: () => bakeryResponse("coincidence") },
      { text: "也許他只是遇到了什麼其他困難才消失的。", changes: {}, action: () => bakeryResponse("concern") }
    ]
  });
}

function bakeryResponse(type) {
  const paragraphs = type === "investigate"
    ? [
        { speaker: "伊吹藍", text: "小志摩也覺得這幾件事同時發生很奇怪嗎？" },
        { speaker: "志摩一未", text: "我只是不想錯過所有可能的線索而已。" },
        { speaker: "伊吹藍", text: "嘴硬魔人。" }
      ]
    : [
        { speaker: "伊吹藍", text: "這幾件事同時在這段時間發生，不覺得奇怪嗎？" },
        { speaker: "志摩一未", text: "可能就是這麼剛好地發生了吧。" },
        { speaker: "伊吹藍", text: "還是去調查一下吧，也許真的會有什麼發現啊。" }
      ];

  showScene({
    label: "第一天・結束",
    day: "第一天",
    paragraphs: [...paragraphs, "第一天的調查暫時告一段落。"],
    choices: [
      { text: "進入第二天", primary: true, action: day2Morning }
    ]
  });
}

// -------------------- 第二天 --------------------

function day2Morning() {
  showScene({
    label: "第二天・早上",
    day: "第二天",
    paragraphs: [
      "你和伊吹藍決定繼續追查那個麵包店店員可能的去向，但沒有找到那位店員。",
      "就在這時你們先收到了來自於第一機搜裡負責網路分析的班長，糸卷貴志給的情報。",
      "他去調查了報案人遺失的那枚鑽戒，在鎮上的那間珠寶店有兩份購買紀錄都是在最近。",
      "他還調查到最近警方正在追查另一起詐騙案，此詐騙案涉及的金額剛好與這枚鑽戒的金額非常接近。",
      "你和伊吹藍開始思考這個線索與你們現在追查的案件是否有關連。",
      { speaker: "伊吹藍", text: "這有可能是詐騙集團的人利用這枚鑽戒來洗錢吧!" },
    ],
    choices: [
      { text: "這個線索與你們正在追查的案件無關。", changes: { trust: -5 }, action: () => {
          state.day2RejectedClue = true;
          ending404("你們過早排除了關鍵線索，沒有追查詐騙案與失聯店員之間的關聯。");
        }
      },
      { text: "這個線索與你們正在追查的案件有關。", changes: { trust: 10, affection: 10 }, action: day2Continue },
      { text: "這個線索與你們正在追查的案件只是一場巧合。", changes: { truth: 10 }, action: day2Continue }
    ]
  });
}

function day2Continue() {
  showScene({
    label: "第二天・午餐時間",
    day: "第二天",
    paragraphs: [
      "你和伊吹藍決定先吃頓午餐，再去調查案件的線索。今天午餐要吃什麼呢?"
    ],
    choices: [
      { text: "蜜瓜包", changes: { melonPan: 10 }, action: () => lunchDay2Story("melon") },
      { text: "烏龍麵", changes: { trust: 5 }, action: () => lunchDay2Story("udon") }
    ]
  });
}

function lunchDay2Story(food) {
  const paragraphs = food === "melon"
    ? [
        { speaker: "伊吹藍", text: "小志摩最近很愛吃蜜瓜包嗎？" },
      ]
    : [
        "你們和第四機搜的另一對搭檔，代號401的陣馬耕平和九重世人一起在分駐所煮了機搜烏龍麵來吃。",
        "有空的時候，大家就會在分駐所一起吃烏龍麵。分駐所就像是第四機搜在這裡的家一樣，這個時刻總是讓心裡感受到溫暖。"
      ];

  showScene({
    label: "第二天・午餐",
    day: "第二天",
    paragraphs,
    choices: [
      { text: "繼續尋找失聯店員", primary: true, action: day2Employee }
    ]
  });
}

function day2Employee() {
  showScene({
    label: "第二天・失聯店員",
    day: "第二天",

    paragraphs: [
      "你們正準備繼續調查詐騙案與失物案時，在那個消失的麵包店店員可能會行經的地方發現了那個店員。你們成功將想逃跑的他攔了下來，向他說明案件的情況。",
      "並詢問他為何不告而別，以及為什麼看到你們就慌張得逃跑。",
      "那位店員交代，他是受人所託。如果幫忙完成一場交易，對方就願意給他一筆錢，讓他拿去支付家人的醫藥費。",
      "交易的方式是：那天早上會有一位負責交易的女士帶著鑽戒，他靠那枚鑽戒來認出負責交易的人。",
      "麵包店販售主題限定蜜瓜包時，會讓排隊購買的客人先將麵包夾進手中的盤子。排到櫃檯時，這位店員就會將麵包拿去後台包裝。",
      "那位負責交易的女士會偷偷將戒指一起交給店員。店員會將鑽戒與麵包一起帶走，再交給另一邊負責交易的人。做完這些事情之後，他因為害怕惹上麻煩，便決定離開店裡。",
      "這也是為什麼那天早上麵包店會少一個麵包，所以你的搭檔沒有買到蜜瓜包。",
      "得知這些資訊之後，你們帶這位店員回到警視廳，讓其他警察處理他牽涉的案件。",
      "然後你和伊吹藍重新整理案件目前的經過與所有線索。",
      {
        speaker: "志摩一未",
        text: "所以這兩件案件其實沒有關聯，但就是這麼剛好的同時發生了。"
      },
      {
        speaker: "伊吹藍",
        text: "還讓我沒辦法買到主題限定的麵包！"
      },
      {
        speaker: "志摩一未",
        text: "那不是重點。所以我們現在除了要找到遺失的鑽戒，還要抓到詐騙集團的團夥。"
      },
      {
        speaker: "伊吹藍",
        text: "會順利抓到的吧。"
      }
    ],

    
    choices: [
      {
        text: "結束第二天的調查",
        primary: true,
        action: day3Morning
      }
    ]
  });
}

// -------------------- 第三天 --------------------

function day3Morning() {
  showScene({
    label: "第三天・早上",
    day: "第三天",
    paragraphs: [
      "前一天你和伊吹藍已經從麵包店店員的口中得知，詐騙集團利用鑽戒進行交易的方式。",
      "不過，他所知道的資訊有限，他只負責將鑽戒交給另一名交易對象，並不知道整個詐騙集團的運作方式。",
      "但透過他的描述，你們得知了負責交易的人的長相特徵，還有他所駕駛的車輛特徵。",
      "你們請糸卷貴志協助調查麵包店附近的監視器，意外發現這輛車在昨天晚上也有出現在店家附近。",
      "進一步比對此車輛最近的移動路線，發現這輛車時常在一處廢棄倉庫附近停留。",
      { speaker: "伊吹藍", text: "這輛車時常在這間廢棄倉庫附近停留欸，我感覺這可能會是他們其中一個據點。" },
    ],
    choices: [
      { text: "相信伊吹藍的直覺，你們一起到倉庫附近小心調查", changes: { trust: 15,affection: 15 }, action: () => trustreaponses("trustibuki") },
      { text: "不相信他的直覺", changes: { trust: -10, affection: -15 }, action: () => {
          state.day3RejectedClue = true;
          endingDeath();
        }
      },
      { text: "讓其他警察也一起幫忙調查", changes: { affection: -5, trust: 10 }, action: () => trustreaponses("callleader") }
    ]
  });
}

function trustreaponses(type) {
  const paragraphs = type === "trustibuki"
    ? [ 
        "因為以前的經驗，你相信你的搭檔的直覺應該能幫助你找到關於案子的線索。",
        "感受到你的信任，伊吹藍感覺也變得更親近你了。",
        "你們兩個前往廢棄倉庫附近潛伏調查，發現詐騙集團的車輛真的再次停留。",
        "還有可能是集團的人下車後便進入倉庫。",
        { speaker: "伊吹藍", text: "果然是把這裡當成據點了嗎……。" },
        { speaker: "志摩一未", text: "先把這件事回報給隊長知道吧。" },
        "你一邊進行回報一邊忍不住在心裡想，這傢伙的直覺有時候真的準得很神奇。",
        { speaker: "伊吹藍", text: "小志摩剛剛是不是在想，我的直覺有時候真的很神奇?" },
        "就連你的想法也像是被看穿一樣的被猜中了。",
        { speaker: "志摩一未", text: "我沒有在想這件事。" },
        { speaker: "伊吹藍", text: "騙人。" }
      ]
    : [ 
        "你將伊吹藍的猜測還有你們目前掌握的資訊回報給隊長知道。隊長找來了在後方支援你們調查的人。",
        "在這之後，你們兩個前往廢棄倉庫附近潛伏調查，發現詐騙集團的車輛真的再次停留。還有可能是集團的人下車後便進入倉庫。",
        { speaker: "伊吹藍", text: "果然是把這裡當成據點了嗎……。" },
        "你們準備晚上就進行突破。"
      ];

  showScene({
    label: "第三天・早上",
    day: "第三天",
    paragraphs: paragraphs,
    choices: [
      {
        text: "繼續調查，準備晚上的行動",
        changes: {},
        action: () => day3Lunch()
      }
    ]
  });
} 

function day3Lunch() {
  showScene({
    label: "第三天・午餐時間",
    day: "第三天",
    paragraphs: [
      "你和伊吹藍決定先吃頓午餐，再去準備突破行動。今天午餐要吃什麼呢?"
    ],
    choices: [
      { text: "蜜瓜包", changes: { melonPan: 10 }, action: () => {
          if (state.melonPan >= 30) {
            endingMelonPan();
          } else {
            showScene({
              label: "第三天・午餐",
              day: "第三天",
              paragraphs: [
                { speaker: "伊吹藍", text: "小志摩最近很愛吃蜜瓜包嗎？" },
              ],
              choices: [
                { text: "最後的調查", primary: true, action: day3Final }
              ]
            });
          }
        }
      },
      { text: "烏龍麵", changes: { trust: 5 }, action: () => {
          showScene({
            label: "第三天・午餐",
            day: "第三天",
            paragraphs: [
              "你們和第四機搜的另一對搭檔，代號401的陣馬耕平和九重世人一起在分駐所煮了機搜烏龍麵來吃。",
              "有空的時候，大家就會在分駐所一起吃烏龍麵。分駐所就像是第四機搜在這裡的家一樣，這個時刻總是讓心裡感受到溫暖。",
            ],
            choices: [
              { text: "最後的調查", primary: true, action: day3Final }
            ]
          });
        }
      }
    ]
  });
}

function day3Final() {
  showScene({
    label: "第三天・最後的行動",
    day: "第三天",
    paragraphs: [
      "夜幕降臨，你和伊吹藍抵達了廢棄倉庫附近。",
      "其他警察已經在附近待命，你們在倉庫外觀查了一段時間，發現陸續有幾個人進出，似乎正在準備交易。",
      { speaker: "伊吹藍", text: "志摩，裡面有不少人欸。" },
      { speaker: "志摩一未", text: "先確認人數，等其他組都準備好再行動。" },
      "倉庫裡的人沒發現你們，繼續在進行他們的交易。",
      "終於等到其他組都到位，你們進行了突破並成功逮捕了詐騙集團。",
      "其他同事負責將那些被逮捕的人送往警視廳，你和伊吹藍也走向你們的404號車。",
      "當你發動車子，準備要開回分駐所時，伊吹藍接到了一通電話。",
      { speaker: "志摩一未", text: "怎麼了，是誰打來的?" },
      { speaker: "伊吹藍", text: "是之前戒指遺失的那個報案人。" },
      "剛剛的電話，是之前的那位女士打來的。她後來在家裡找到了遺失的那枚戒指。",
      "想謝謝你們之前的幫忙，還有說抱歉讓你們白忙一趟了。",
      "伊吹藍接完電話之後，看起來很開心。",
      { speaker: "伊吹藍", text: "戒指能夠找到真是太好了，畢竟那是很重要的東西吧。" },
      { speaker: "伊吹藍", text: "我和小志摩今天也把另一件詐騙集團的案件解決了，真是最棒的一天。" },
    ],
    choices: [
      { text: "是阿，今天是最棒的一天。", changes: { trust: 10, truth: 5 }, action: resolveEnding },
      { text: "終於可以休息了。", changes: { trust: -10 }, action: resolveEnding },
    ]
  });
}

function resolveEnding() {
    state.caseSolved = true;
    if (state.affection > 40) {
      endingAmbiguous();
    } else {
      endingTrue();
    }
}


// -------------------- 結局 --------------------

function ending404(reason = "你錯過了關鍵的訊息，或者是你沒有在對的時候相信你的搭檔。") {
  showScene({
    label: "結局・404 NOT FOUND",
    day: "結局",
    paragraphs: [
      "『404 NOT FOUND』",
      reason,
      "案件沒有被解決，你與搭檔也在案件中漸行漸遠。最終你和伊吹藍各自選擇了分頭行動，這是最糟糕的選擇。",
      "三天後的新聞報導是:機動搜查隊的兩位隊員在萬聖節的這幾天，調查一件求婚戒指失竊的案件。卻沒想到正好捲入了另一件詐騙案件的風波，與詐騙集團交手後，這兩位隊員就失去了蹤影，目前已通報失蹤，仍在尋找他們的下落……"
    ],
    choices: [
      { text: "重新開始", primary: true, action: startGame }
    ]
  });
}

function endingDeath() {
  showScene({
    label: "結局・再也無法並肩",
    day: "結局",
    paragraphs: [
      "『找不到搭檔。』",
      "你錯過了關鍵的訊息，或者是你沒有在對的時候相信你的搭檔。案件沒有被解決，你與搭檔也在案件中漸行漸遠。",
      "你的搭檔最後選擇了自己先行動，你發現的時候，已經聯絡不上伊吹藍了。",
      "後來收到其他警察傳來的消息，已經是一天後的事情。伊吹藍在那次行動遭遇意外，沒能平安回來。",
      "伊吹藍在那次行動遭遇意外，沒能平安回來。你站在辦公室裡，聽著隊長向你說明調查結果，但之後的細節你已經記不太清楚了。",
      "幾天後，你獨自坐上了404號車。駕駛座旁邊的副駕駛座空著，也沒有聽見那個人的聲音。",
      "之前你其實有很多話想對你的前搭檔說，但現在已經沒有機會了。",
      "你發動了車子，生活繼續往前行駛。",
      "只是副駕駛座後來一直是空的。",
    ],
    choices: [
      { text: "重新開始", primary: true, action: startGame }
    ]
  });
}

function endingAmbiguous() {
  showScene({
    label: "結局・你們真的只是搭檔嗎？",
    day: "結局",
    paragraphs: [
      "『真的只是搭檔嗎？』",
      "你和伊吹藍在這次的行動過後，還是繼續過著一樣的生活。",
      "每天你們依然都會去巡邏，還有繼續一起解決各種案件。",
      "看起來好像什麼都沒有變，但不一樣的是，你比之前更常先問問伊吹藍的意見。",
      "伊吹藍也會聽你的，在還不確定的情況下，不會自己先獨自行動。",
      "你感覺你會習慣這樣的生活，習慣有伊吹藍在你身邊。",
      { speaker: "伊吹藍", text: "小志摩~~我今天可以不要寫報告嗎?" },
      { speaker: "志摩一未", text: "不可以，你要自己寫完。" },
      "看著你的搭檔在他的位置上為了報告而煩惱的樣子，有時候你真的覺得這跟當初那個第一天就說「機搜真好啊，可以在事情變成最壞的情況之前阻止。」的人不是同一個。",
      "但你還是忍不住笑了。",
      "伊吹藍就是這樣的人，而你希望他可以一直保持這樣。",
      "至於你們的關係開始超出原本搭檔會有的界線，那又是另外一回事了。",
    ],
    choices: [
      { text: "查看隱藏彩蛋／結束", primary: true, action: showBonusOrRestart }
    ]
  });
}

function endingTrue() {
  showScene({
    label: "結局・明天也一起出勤",
    day: "結局",
    paragraphs: [
      "『繼續下去的MIU404』",
      "你和伊吹藍在這次的行動過後，還是繼續過著一樣的生活。",
      "每天你們依然都會去巡邏，還有繼續一起解決各種案件。",
      { speaker: "伊吹藍", text: "志摩，話說我還是沒吃到主題限定的麵包。" },
      { speaker: "志摩一未", text: "明天還可以去買吧。" },
      "隔天早上，你們在結束了工作之後一起去那間麵包店看看。",
      "結果剛好買到了最後一顆主題限定的麵包。",
      { speaker: "伊吹藍", text: "我們真的是超級幸運欸!" },
      { speaker: "志摩一未", text: "對阿，這樣你也總算是有吃到了。" },
      "結果伊吹藍將手裡的麵包掰成了兩半，並遞給你其中一半。",
      { speaker: "伊吹藍", text: "給你，敬最棒的搭檔。" },
      "你接過了那一半的蜜瓜包，咬了一口，麵包裡的內餡嘗起來十分甜蜜。",
      { speaker: "志摩一未", text: "很好吃。" },
      { speaker: "伊吹藍", text: "對吧，下次我們再一起去買吧。" },
      { speaker: "志摩一未", text: "好。" },
      "你和伊吹藍的搭檔生活還會繼續下去。",
    ],
    choices: [
      { text: "重新開始", primary: true, action: startGame }
    ]
  });
}

function endingMelonPan() {
  showScene({
    label: "隱藏結局・你看起來很好吃",
    day: "結局",
    paragraphs: [
      "『一整個哈密瓜～』",
      "因為你午餐吃太多蜜瓜包了，所以你變成了蜜瓜包!",
      { speaker: "伊吹藍", text: "不知道味道吃起來怎麼樣？" },
      { speaker: "志摩一未", text: "……。" },
      { speaker: "志摩一未", text: "真是不想幹了。" },
    ],
    choices: [
      { text: "重新開始", primary: true, action: startGame }
    ]
  });
}

function showBonusOrRestart() {
  const bonusParagraphs = [];
  if (state.sawShinomiya || state.sawKounotori) {
    bonusParagraphs.push("【隱藏彩蛋：春天的櫻花】");
    bonusParagraphs.push("隔年春天，你和伊吹藍趁著休假，一起前往公園欣賞櫻花。在盛開的櫻花樹下，你們遇見了一對正在散步的戀人。");
    if (state.sawShinomiya) {
      bonusParagraphs.push("其中一個人長得與伊吹藍十分相似，他正牽著身旁人的手，看向對方時，露出了十分溫柔的笑容。");
      bonusParagraphs.push("你認出了另一位是曾經在便利商店買草莓果醬麵包的醫師，四宮春樹似乎也認出了你，只是仍舊一臉冷淡。");
      bonusParagraphs.push("但當他轉過頭看向身旁的人時，那雙眼睛裡流露出難以掩飾的眷戀。");
      bonusParagraphs.push("你看著眼前的兩人，產生了一種奇妙的感覺。");
      bonusParagraphs.push("不知道為什麼，看著那兩個人自然地牽著手、靠近彼此的模樣，心裡似乎有什麼地方變得不太一樣。");
      bonusParagraphs.push("你偷偷看了一眼站在身旁的伊吹，而他正好也轉過頭來。");
      bonusParagraphs.push("兩人的視線短暫交會，又很快各自移開。");
      bonusParagraphs.push({ speaker: "志摩一未", text: "……我想去旁邊的商店買些東西。" },)
      bonusParagraphs.push({ speaker: "伊吹藍", text: "欸?但剛剛不是才去過嗎?" },)
      bonusParagraphs.push({ speaker: "志摩一未", text: "有東西忘記了，我自己去就好。" },)
      bonusParagraphs.push({ speaker: "伊吹藍", text: "我也要跟小志摩去啦~" },)
      bonusParagraphs.push("也許之後，在另一個平行世界正在發生的故事。");
      bonusParagraphs.push("終有一天，也會在這個世界上演。");
    }
    if (state.sawKounotori) {
      bonusParagraphs.push("其中一個人長得與伊吹藍十分相似，他正牽著身旁人的手，看向對方時，露出了十分溫柔的笑容。");
      bonusParagraphs.push("伊吹藍朝鴻鳥櫻揮了揮手，鴻鳥櫻也對他露出溫和的笑容，抬手回應。 ");
      bonusParagraphs.push("而另一個人，則有著與你幾乎一模一樣的長相。");
      bonusParagraphs.push("他臉上是一副冷淡的表情，彷彿對周遭的一切都不怎麼在意。");
      bonusParagraphs.push("但當他轉過頭看向身旁的人時，那雙眼睛裡流露出難以掩飾的眷戀。");
      bonusParagraphs.push("你看著眼前的兩人，產生了一種奇妙的感覺。");
      bonusParagraphs.push("不知道為什麼，看著那兩個人自然地牽著手、靠近彼此的模樣，心裡似乎有什麼地方變得不太一樣。");
      bonusParagraphs.push("你偷偷看了一眼站在身旁的伊吹，而他正好也轉過頭來。");
      bonusParagraphs.push("兩人的視線短暫交會，又很快各自移開。");
      bonusParagraphs.push({ speaker: "志摩一未", text: "……我想去旁邊的商店買些東西。" },)
      bonusParagraphs.push({ speaker: "伊吹藍", text: "欸?但剛剛不是才去過嗎?" },)
      bonusParagraphs.push({ speaker: "志摩一未", text: "有東西忘記了，我自己去就好。" },)
      bonusParagraphs.push({ speaker: "伊吹藍", text: "我也要跟小志摩去啦~" },)
      bonusParagraphs.push("也許之後，在另一個平行世界正在發生的故事。");
      bonusParagraphs.push("終有一天，也會在這個世界上演。");
    }
  } else {
    bonusParagraphs.push("你這次沒有遇見隱藏角色!也許下一次換一種午餐，就會發生不一樣的故事。");
  }
  bonusParagraphs.push("謝謝遊玩《萬聖節的蜜瓜包事件》！");

  showScene({
    label: "隱藏彩蛋",
    day: "後日談",
    paragraphs: bonusParagraphs,
    choices: [
      { text: "重新開始遊戲", primary: true, action: startGame }
    ]
  });
}

// 開場按鈕、重新開始與數值面板
document.querySelector('[data-action="start"]').addEventListener("click", startGame);
restartButton.addEventListener("click", () => {
  if (confirm("確定要重新開始嗎？目前的進度會被重設。")) startGame();
});
toggleStatusButton.addEventListener("click", () => {
  statusVisible = !statusVisible;
  updateStatus();
});

// 初始顯示
updateStatus();
