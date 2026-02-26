// Strava ブランド表示（API 利用規約必須）
// TODO: public/strava-powered-by.svg はプレースホルダー。Strava 公式ブランドアセットに差し替える。
//       https://developers.strava.com/guidelines/ からダウンロード可能。
function PoweredByStrava() {
  return (
    <a
      href="https://www.strava.com"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block"
    >
      <img
        src="/strava-powered-by.svg"
        alt="Powered by Strava"
        className="h-8"
      />
    </a>
  );
}

export default PoweredByStrava;
