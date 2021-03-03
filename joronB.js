//線を描く関数
//コンテキストctx, (x1, y1)から(x2, y2)まで色color（デフォ：黒）で太さwidth（デフォ：1）で線を描画
function dLine(ctx, x1, y1, x2, y2, color = "black", width = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.closePath();
  ctx.stroke();
}

//四角形を描く関数
//コンテキストctx, (x, y)から幅w, 高さhで色color（デフォ：黒）で太さwidth（デフォ：1）で四角形を描画
function dRec(ctx, x, y, w, h, color = "black", width = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x+w, y);
  ctx.lineTo(x+w, y+h);
  ctx.lineTo(x, y+h);
  ctx.closePath();
  ctx.stroke();
}

//四角形を塗りつぶす関数
function fRec(ctx, x, y, w, h, color = "black") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

//円を描く関数
//コンテキストctx, (cx, cy)を中心座標に, 半径rで色color（デフォ：黒）で太さwidth（デフォ：1）で円を描画
function dCir(ctx, cx, cy, r, color = "black", width = 1) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
  ctx.stroke();
}

//円を塗りつぶす関数
//コンテキストctx, (cx, cy)を中心座標に, 半径rで色color（デフォ：黒）で塗り潰した円を描画
function fCir(ctx, cx, cy, r, color = "black") {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
  ctx.fill();
}

//多角形を描く
//コンテキストctx, 座標リストxylistの点に従って色colorで太さwidthで多角形を描画
function dPoly(ctx, xylist, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(xylist[0][0], xylist[0][1]);
  for (let i = 1; i < xylist.length; i++) {
    ctx.lineTo(xylist[i][0], xylist[i][1]);
  }
  ctx.closePath();
  ctx.stroke();
}
