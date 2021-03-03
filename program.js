let gCanvas;
let gCtx;

let fCanvas;
let fCtx;

let sfCanvas;
let sfCtx;

let sfCanvas2;
let sfCtx2;

let hCanvas;
let hCtx;

window.addEventListener('load', () => {
  onload();
}, false);

function onload() {
  gCanvas = document.getElementById("main_canvas");
  gCtx = gCanvas.getContext("2d");

  fCanvas = document.getElementById("fore_canvas");
  fCtx = fCanvas.getContext("2d");

  sfCanvas = document.getElementById("sub_fore_canvas");
  sfCtx = sfCanvas.getContext("2d");

  sfCanvas2 = document.getElementById("sub_fore_canvas2");
  sfCtx2 = sfCanvas2.getContext("2d");

  hCanvas = document.getElementById("hold_canvas");
  hCtx = hCanvas.getContext("2d");

  initGame();
  document.getElementById('msg_start').textContent="Ready?";
  window.setTimeout(start, 2000);
  document.addEventListener('keydown', (e) => {
    if ((e.keyCode == 37) || (e.keyCode == 65)) {
      moveHidari();
    } else if ((e.keyCode == 39) || (e.keyCode == 68)) {
      moveMigi();
    } else if ((e.keyCode == 38) || (e.keyCode == 87)) {
       kaiten();
    } else if ((e.keyCode == 40) || (e.keyCode == 83)) {
      moveShita();
    } else if ((e.keyCode == 16)  || (e.keyCode == 69)) {
      hold();
    } else if ((e.keyCode == 13) || (e.keyCode == 81)) {
      moveChokka();
    }
  });
}

let bloNow = null;
let bloNext = null;
let bloTNext = null;
let bloTTNext = null;
let score = 0;

let gamestat = 1;

let timerInterval = 1200;
let tickCount = 1;

let colorTable1 = [
  "rgb(251, 251, 251)", //margin
  "rgb(240, 255, 255)", //1 I
  "rgb(255, 255, 213)", //2 O
  "rgb(219, 255, 201)", //3 S
  "rgb(250, 162, 162)", //4 Z
  "rgb(208, 211, 254)", //5 J
  "rgb(255, 225, 180)", //6 L
  "rgb(232, 195, 255)", //7 T
];

let colorTable2 = [
  "rgb(196, 191, 191)", //margin
  "rgb(19, 168, 208)", //1 I
  "rgb(247, 225, 73)", //2 O
  "rgb(117, 210, 74)", //3 S
  "rgb(241, 90, 69)", //4 Z
  "rgb(33, 108, 195)", //5 J
  "rgb(236, 167, 86)", //6 L
  "rgb(140, 49, 182)", //7 T
];

let colorTable3 = [
  "rgb(166, 166, 166)", //margin
  "rgb(29, 129, 179)", //1 I
  "rgb(255, 191, 0)", //2 O
  "rgb(55, 153, 35)", //3 S
  "rgb(203, 30, 30)", //4 Z
  "rgb(31, 43, 124)", //5 J
  "rgb(217, 108, 18)", //6 L
  "rgb(124, 33, 166)", //7 T
];

let banmen = []; //[18][25]

let katachiList = [
  [[0]],
  [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]], //I
  [[2, 2], [2, 2]], //O
  [[0, 0, 0], [0, 3, 3], [3, 3, 0]], //S
  [[0, 0, 0], [4, 4, 0], [0, 4, 4]], //Z
  [[5, 0, 0], [5, 5, 5], [0, 0, 0]], //J
  [[0, 0, 6], [6, 6, 6], [0, 0, 0]], //L
  [[0, 7, 0], [7, 7, 7], [0, 0, 0]] //T
];

let katachiListAfter = [
  [[0]],
  [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]], //I
  [], //O
  [[3, 0, 0], [3, 3, 0], [0, 3, 0]], //S
  [[0, 4, 0], [4, 4, 0], [4, 0, 0]], //Z
  [], //J
  [], //L
  [[0, 7, 0], [0, 7, 7], [0, 7, 0]] //TSPIN syougou you
];

let started = false;

let blockgroup = [1, 0, 0, 0, 0, 0, 0, 0];
let bgcount = 0;

let notHold = true;
let holdblo;
let marginblo=[];

let level = 1;

let gameover = false;
let tickflag = true;

function start() {
  if (started) return;
  document.getElementById('msg_start').textContent="";
  started = true;
  // setTimeout(tick, timerInterval);
  setTimeout(() => {
    tick();
    document.getElementById('msg_next').textContent="  N  E  X  T";
    document.getElementById('msg_hold').textContent="  H  O  L  D  ";
    document.getElementById('msg_level').textContent="  S  T  A  G  E  " + level;
    document.getElementById('msg_desc').innerHTML="■操作方法：<br>↑/Wで回転<br>←↓→/ASDで左下右に移動<br>Shift/Eでブロックをホールド<br>Enter/Qで直下までブロックを落とす（下のボタンでも同様）<br><br>■工夫した点：<br>ブロックのデザインを三色で塗り分けた<br>三つ先までのブロックを作っておき、見れるようにした<br>出てくるブロックのパターンを7個で1セットにした上、三つ先までのブロックと被らないようにした<br>hold機能をつけた<br>直下に移動するのとは別に一マスずつした移動できるようにした<br>ゲームオーバー処理とスコア、レベルの処理<br>最高難易度のレベル９を単にtickが早いだけではなく、特殊なエフェクトをつけて操作を難しくさせた<br>ブロックの回転時、軸がぶれないように一部のブロックは回転後のブロック配置を別に用意した<br>Tスピンダブルとテトリス完成時に得点ボーナスをつけた<br></p>";
    fRec(hCtx, 0, 0, 70, 70, "black");

    //displayForecast
    displayForecast(fCtx, bloNext);

    //displaySubForecast
    displayForecast(sfCtx, bloTNext);

    //displaySubForecast
    displayForecast(sfCtx2, bloTTNext);
  }, timerInterval);
}

function createBlock(t, x, y) {
  const obj = {};
  obj.katachi = Array.from(katachiList[t]);
  obj.num = t;
  obj.ichiX = x;
  obj.ichiY = y;
  obj.size = obj.katachi.length;
  return obj;
}

function displayBanmen() {
  fRec(gCtx, 0, 0, 300, 600, "black");
  for (let x = 4; x <= 13; x++) {
    for (let y = 4; y <= 23; y++) {
      if (banmen[x][y] != 0) {
        dRec(gCtx, (x - 4) * 30, (y - 4) * 30, 30, 30, colorTable3[0]);
        fRec(gCtx, (x - 4) * 30+1, (y - 4) * 30+1, 28, 3, colorTable1[0]);
        fRec(gCtx, (x - 4) * 30+1, (y - 4) * 30+3, 28, 22, colorTable3[0]);
        fRec(gCtx, (x - 4) * 30+1, (y - 4) * 30+22, 28, 7, colorTable2[0]);
      }
    }
  }
  for (let i = 1; i <= 20; i++) {
    dLine(gCtx, 0, i * 30, 300, i * 30, "rgb(54, 54, 54)");
    dLine(gCtx, i * 30, 0, i * 30, 600, "rgb(54, 54, 54)");
  }
  if (bloNow != null && gamestat <= 2) {
    for (let xi = 0; xi < bloNow.size; xi++) {
      for (let yi = 0; yi < bloNow.size; yi++) {
        if (bloNow.katachi[xi][yi] != 0) {
          let x = bloNow.ichiX + xi;
          let y = bloNow.ichiY + yi;
          dRec(gCtx, (x - 4) * 30, (y - 4) * 30, 30, 30, colorTable3[bloNow.num]);
          fRec(gCtx, (x - 4) * 30+1, (y - 4) * 30+1, 28, 3, colorTable1[bloNow.num]);
          fRec(gCtx, (x - 4) * 30+1, (y - 4) * 30+3, 28, 22, colorTable3[bloNow.num]);
          fRec(gCtx, (x - 4) * 30+1, (y - 4) * 30+22, 28, 7, colorTable2[bloNow.num]);
        }
      }
    }
  }
}

function displayForecast(ctx, obj) {
  fRec(ctx, 0, 0, 70, 70, "black");
  if (obj != null) {
    for (let xi = 0; xi < obj.size; xi++) {
      for (let yi = 0; yi < obj.size; yi++) {
        if (obj.katachi[xi][yi] != 0) {
          let dx;
          let dy = 0;
          if ((obj.num == 1) || (obj.num == 3) || (obj.num == 4)) {
            dx = -5;
          } else if (obj.num == 2) { //O nomi zahyou zureru
            dx = 5;
            dy = 4;
          } else if ((obj.num == 5) || (obj.num == 6) || (obj.num == 7)) {
            dx = 2;
          }
          dRec(ctx, (xi+2) * 10+dx, (yi+2) * 10+dy, 10, 10, colorTable3[obj.num]);
          fRec(ctx, (xi+2) * 10+dx+1, (yi+2) * 10+1+dy, 8, 1, colorTable1[obj.num]);
          fRec(ctx, (xi+2) * 10+dx+1, (yi+2) * 10+2+dy, 8, 5, colorTable3[obj.num]);
          fRec(ctx, (xi+2) * 10+dx+1, (yi+2) * 10+7+dy, 8, 2, colorTable2[obj.num]);
        }
      }
    }
  }
}

function printMsg(msg) {
  document.getElementById("msg").innerHTML = msg;
}

function initGame() {
  //banmen
  banmen = [];
  for (let x = 0; x < 18; x++) {
    banmen[x] = [];
    for (let y = 0; y < 25; y++) {
      banmen[x][y] = 0;
    }
  }
  for (let y = 0; y < 25; y++) {
    for (let x = 0; x < 4; x++) {
      banmen[x][y] = -1;
      banmen[x + 14][y] = -1;
    }
  }
  for (let x = 0; x < 18; x++) {
    banmen[x][24] = -1;
  }

  //create first block
  let nbnum = Math.floor(Math.random() * 7) + 1;
  blockgroup[nbnum]++;
  bgcount++;
  bloNow = createBlock(nbnum, 0, 0);
  bloNow.ichiX = Math.floor(Math.random() * (10 - bloNow.size)) + 4;
  bloNow.ichiY = 3 - bloNow.size;

  //create next block
  while (true) {
    nbnum = Math.floor(Math.random() * 7) + 1;
    if (blockgroup[nbnum] == 0)  {
      blockgroup[nbnum]++;
      bgcount++;
      break;
    }
  }
  bloNext = createBlock(nbnum, 0, 0);

  //create two next block
  while (true) {
    nbnum = Math.floor(Math.random() * 7) + 1;
    if (blockgroup[nbnum] == 0)  {
      blockgroup[nbnum]++;
      bgcount++;
      break;
    }
  }
  bloTNext = createBlock(nbnum, 0, 0);

  //create three next block
  while (true) {
    nbnum = Math.floor(Math.random() * 7) + 1;
    if (blockgroup[nbnum] == 0)  {
      blockgroup[nbnum]++;
      bgcount++;
      break;
    }
  }
  bloTTNext = createBlock(nbnum, 0, 0);

  timerInterval = 800;
  gamestat = 1;
  score = 0;
  printMsg("00000000");
}

function newBlock() {
  let nbnum = 0;

  //blockgroup reset
  if (bgcount == 7) {
    for (let i = 1; i < blockgroup.length; i++) {
      blockgroup[i] = 0;
    }
    bgcount = 0;
  }

  //create new block
  while (true) {
    nbnum = Math.floor(Math.random() * 7) + 1;
    if (nbnum != bloNext.num && nbnum != bloTNext.num && nbnum != bloTTNext.num) {
      if (blockgroup[nbnum] == 0)  {
        blockgroup[nbnum]++;
        bgcount++;
        break;
      }
    }
  }
  bloNow = bloNext;
  bloNext = bloTNext;
  bloTNext = bloTTNext;
  bloTTNext = createBlock(nbnum, 0, 0);

  bloNow.ichiX = Math.floor(Math.random() * (10 - bloNow.size)) + 4;
  bloNow.ichiY = 4 - bloNow.size;

  displayBanmen();
}

function move1() {
  bloNow.ichiY++;
  if (check(bloNow.katachi, bloNow.ichiX, bloNow.ichiY)) {
    return true;
  }
  bloNow.ichiY--;
  return false;
}

function check(a, ichix, ichiy) {
  if (bloNow != null) {
    for (let xi = 0; xi < bloNow.size; xi++) {
      for (let yi = 0; yi < bloNow.size; yi++) {
        if (a[xi][yi] != 0) {
          let x = ichix + xi;
          let y = ichiy + yi;
          if (banmen[x][y] != 0) {
            return false;
          }
        }
      }
    }
  }
  return true;
}

function button1_Click() {
  susumeru();
}

function kakutei() {
  for (let xi = 0; xi < bloNow.size; xi++) {
    for (let yi = 0; yi < bloNow.size; yi++) {
      if (bloNow.katachi[xi][yi] != 0) {
        let x = bloNow.ichiX + xi;
        let y = bloNow.ichiY + yi;
        if (y <= 3) {
          gameover = true;
        }
        banmen[x][y] = -1;
      }
    }
  }
}

function syoukyo() {
  let spinflag = false;
  let keshitaGyou = 0;
  let y = 23;
  while (y > 0) {
    let flag = true;
    for (let x = 4; x <= 13; x++) {
      if (banmen[x][y] == 0) {
        flag = false;
        break;
      }
    }
    if (flag) {
      keshitaGyou++;
      if ((banmen[bloNow.ichiX][bloNow.ichiY] == -1) || (banmen[bloNow.ichiX+2][bloNow.ichiY] == -1)) {
        spinflag = true;
      }
      for (let yi = y; yi > 0; yi--) {
        for (let xi = 4; xi <= 13; xi++) {
          banmen[xi][yi] = banmen[xi][yi - 1];
        }
      }
    } else {
      y--;
    }
  }
  if (keshitaGyou == 0) {

  } else if (keshitaGyou == 4) {
    score += 1000;
    document.getElementById('msg_skill').textContent="T  E  T  R  I  S  !";
  } else if (keshitaGyou < 4) {
    //hairetu no hikaku ha suuti no you ni dekinai
    let tspinflag = false;
    if (bloNow.katachi.length == katachiListAfter[7].length) {
      tspinflag = true;
      for (let x = 0; x < katachiListAfter[7].length; x++) {
        for (let y = 0; y < katachiListAfter[7].length; y++) {
          if (bloNow.katachi[x][y] !== katachiListAfter[7][x][y]) {
            tspinflag = false;
            break;
          }
        }
      }
    }
    if ((tspinflag) && (spinflag)) { //TSPIN jyouken -> Tgata && katachi && block ue ni aru
      document.getElementById('msg_skill').textContent="T  -  S  P  I  N  !";
      score += keshitaGyou * 500;
    } else {
      document.getElementById('msg_skill').textContent=keshitaGyou + "  L  I  N  E  !";
    }
    score += keshitaGyou * 200;
  }
  printMsg(String(score).padStart(8, '0'));
}

function ugokaseru() {
  bloNow.ichiY++;
  if (check(bloNow.katachi, bloNow.ichiX, bloNow.ichiY)) {
    bloNow.ichiY--;
    return true;
  }
  bloNow.ichiY--;
  return false;
}

function susumeru() {
  if (gamestat == 1) {
    move1();
    displayBanmen();
    if (ugokaseru()) {
      return;
    }
    gamestat = 2;
    return;
  } else if (gamestat == 2) {
    if (ugokaseru()) {
      gamestat = 1;
      return;
    }
    kakutei();
    displayBanmen();
    gamestat = 3;
  } else if (gamestat == 3) {
    syoukyo();
    displayBanmen();
    gamestat = 4;
  } else if (gamestat == 4) {
    if (gameover == true) {
      tickflag = false;
      document.getElementById('msg_start').innerHTML="G  A  M  E    O  V  E  R  !  !<br>S  C  O  R  E  :  " + score + "<br>S  T  A  G  E  :  " + level;
    }
    newBlock();
    displayBanmen();
    //displayForecast
    displayForecast(fCtx, bloNext);
    //displaySubForecast
    displayForecast(sfCtx, bloTNext);
    //displaySubForecast
    displayForecast(sfCtx2, bloTTNext);
    document.getElementById('msg_skill').textContent= "";
    gamestat = 1;
  }
}

function tick() {
  if (tickflag) {
    tickCount++;
    if ((tickCount % 100 == 0) && (tickCount < 800)) {
      timerInterval = 1 + Math.floor(timerInterval * 0.8);
      level++;
      document.getElementById('msg_level').textContent="  S  T  A  G  E  " + level;
    }
    susumeru();
    if ((tickCount % 20 == 0) && (tickCount >= 800)) {
      level = 9;
      document.getElementById('msg_level').textContent="  S  T  A  G  E  " + level;
      fRec(gCtx, 0, 0, 300, 600, "black");
      fRec(fCtx, 0, 0, 70, 70, "black");
      fRec(sfCtx, 0, 0, 70, 70, "black");
      fRec(sfCtx2, 0, 0, 70, 70, "black");
    }
    setTimeout(tick, timerInterval);
  }
}

function kaiten() {
  if (gamestat > 2) return;
  if (gameover) return;
  let s = bloNow.size;
  let a = [];
  if ((bloNow.num == 1) || (bloNow.num == 3) || (bloNow.num == 4)) {
    if  (check(katachiListAfter[bloNow.num], bloNow.ichiX, bloNow.ichiY)) {
      if (bloNow.katachi == katachiList[bloNow.num]) {
        bloNow.katachi = katachiListAfter[bloNow.num];
      } else {
        bloNow.katachi = katachiList[bloNow.num];
      }
    }
  } else {
    for (let x = 0; x < s; x++) {
      a[x] = [];
      for (let y = 0; y < s; y++) {
        a[x][y] = bloNow.katachi[y][s - 1 - x];
      }
    }
    if  (check(a, bloNow.ichiX, bloNow.ichiY)) {
      bloNow.katachi = a;
    }
  }
  displayBanmen();
}

function moveHidari() {
  if (gamestat > 2) return;
  if (gameover) return;
  bloNow.ichiX--;
  if (!check(bloNow.katachi, bloNow.ichiX, bloNow.ichiY)) {
    bloNow.ichiX++;
  }
  displayBanmen();
  return;
}

function moveMigi() {
  if (gamestat > 2) return;
  if (gameover) return;
  bloNow.ichiX++;
  if (!check(bloNow.katachi, bloNow.ichiX, bloNow.ichiY)) {
    bloNow.ichiX--;
  }
  displayBanmen();
  return;
}

function moveChokka() {
  if (gamestat != 1) return;
  if (gameover) return;
  while (move1());
  displayBanmen();
}

function moveShita() {
  if (gamestat > 2) return;
  if (gameover) return;
  bloNow.ichiY++;
  if (!check(bloNow.katachi, bloNow.ichiX, bloNow.ichiY)) {
    bloNow.ichiY--;
  }
  displayBanmen();
  return;
}

function hold() {
  if (gamestat != 1) return;
  if (gameover) return;
  if (notHold) {
    holdblo = bloNow; //hozon

    bloNow.ichiX = 0; //hyoujigai ni tobasu
    bloNow.ichiY = 20;
    moveChokka();

    displayForecast(hCtx, holdblo);
    for (let x = 0; x < 3; x++) { //hyoujigai no yatu wo kesu(kanzen hanzai)
      for (let y = 0; y < 4; y++) {
        banmen[x][y] = 0;
      }
    }
    notHold = false;
  } else {
    marginblo[0] = bloNow.katachi;
    marginblo[1] = bloNow.num;
    marginblo[2] = bloNow.size;
    bloNow.katachi = holdblo.katachi;
    bloNow.num = holdblo.num;
    bloNow.size = holdblo.size;
    holdblo.num = marginblo[1];
    holdblo.size = marginblo[2];
    holdblo.katachi = katachiList[holdblo.num];
    displayForecast(hCtx, holdblo);
  }
  displayBanmen();
}
