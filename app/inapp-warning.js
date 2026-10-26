// LINE や Instagram などのアプリの中のブラウザで開いたときに、Safari / Chrome で開き直すよう画面の上に知らせる。
// アプリの中のブラウザではマイクが使えないことが多い。トップページとアプリの両方で読み込む（defer で）。
(() => {
  const ua = navigator.userAgent;
  const apps = [
    [/\bLine\//i, "LINE"],
    [/Instagram/i, "Instagram"],
    [/FBAN|FBAV|FB_IAB/, "Facebook"],
    [/BytedanceWebview|musical_ly|TikTok/i, "TikTok"],
    [/YJApp/i, "Yahoo! JAPAN アプリ"],
  ];
  const app = apps.find(([re]) => re.test(ua))?.[1];
  if (!app) return;

  const ios = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const browser = ios ? "Safari" : "Chrome";

  const box = document.createElement("div");
  box.className = "inapp-warning";
  box.setAttribute("role", "alert");
  const title = document.createElement("strong");
  title.textContent = `${app} の中で開いています`;
  const text = document.createElement("p");
  text.textContent = `このままではマイクが使えないことがあります。画面のメニュー（「…」など）から「${browser}で開く」や「ブラウザで開く」を選んでください。`;
  box.append(title, text);

  // LINE は URL に openExternalBrowser=1 を付けると、ふだんのブラウザで開き直せる
  if (app === "LINE") {
    const url = new URL(location.href);
    url.searchParams.set("openExternalBrowser", "1");
    const link = document.createElement("a");
    link.className = "btn primary";
    link.href = url.href;
    link.textContent = `${browser}で開き直す`;
    box.append(link);
  }
  document.body.prepend(box);
})();
