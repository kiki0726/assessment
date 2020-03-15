const inputName = document.getElementById('user-name');
const buttonAssess = document.getElementById('assesment');
const result = document.getElementById('result-area');
const tweet = document.getElementById('tweet-area');

buttonAssess.onclick = () => {
  const userName = inputName.value;
  if (userName.length === 0) {
    return;
  }

  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }

  const header = document.createElement('h3');
  header.innerText = '診断結果';
  result.appendChild(header);
  const para = document.createElement('p');
  para.innerText = assessment(userName);
  result.appendChild(para);

  while (tweet.firstChild) {
    tweet.removeChild(tweet.firstChild);
  }
  const anchor = document.createElement('a');
  const hrefValue = 'https://twitter.com/intent/tweet?button_hashtag=' + encodeURIComponent('あなたのいいところ') + '&ref_src=twsrc%5Etfw';
  anchor.setAttribute('href', hrefValue);
  anchor.className = 'twitter-hashtag-button';
  anchor.setAttribute('data-text', result);
  anchor.innerText = 'Tweet #あなたのいいところ';
  tweet.appendChild(anchor);

  const script = document.createElement('script');
  script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
  tweet.appendChild(script);
};

const pattern = [
  '{userName}のいいところは声です。{userName}の特徴的な声は皆を惹きつけ、心に残ります。',
  '{userName}のいいところはまなざしです。{userName}に見つめられた人は、気になって仕方がないでしょう。',
  '{userName}のいいところは情熱です。{userName}の情熱に周りの人は感化されます。',
  '{userName}のいいところは厳しさです。{userName}の厳しさがものごとをいつも成功に導きます。',
  '{userName}のいいところは知識です。博識な{userName}を多くの人が頼りにしています。',
  '{userName}のいいところはユニークさです。{userName}だけのその特徴が皆を楽しくさせます。',
  '{userName}のいいところは用心深さです。{userName}の洞察に、多くの人が助けられます。',
  '{userName}のいいところは見た目です。内側から溢れ出る{userName}の良さに皆が気を惹かれます。',
  '{userName}のいいところは決断力です。{userName}がする決断にいつも助けられる人がいます。',
  '{userName}のいいところは思いやりです。{userName}に気をかけてもらった多くの人が感謝しています。',
  '{userName}のいいところは感受性です。{userName}が感じたことに皆が共感し、わかりあうことができます。',
  '{userName}のいいところは節度です。強引すぎない{userName}の考えに皆が感謝しています。',
  '{userName}のいいところは好奇心です。新しいことに向かっていく{userName}の心構えが多くの人に魅力的に映ります。',
  '{userName}のいいところは気配りです。{userName}の配慮が多くの人を救っています。',
  '{userName}のいいところはその全てです。ありのままの{userName}自身がいいところなのです。',
  '{userName}のいいところは自制心です。やばいと思ったときにしっかりと衝動を抑えられる{userName}が皆から評価されています。',
];

function assessment(userName) {
  let sum = 0;
  for (var i = 0; i < userName.length; i++) {
    sum += userName.charCodeAt(i);
  }
  let index = sum % pattern.length;
  let result = pattern[index];
  result = result.replace(/\{userName\}/g, userName);
  return result;
}