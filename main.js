/**
 * @type {HTMLCanvasElement}
 */

// 塔の高さ
const TOWER_HEIGHT = 5;

const H_RATIO = 33;
const V_RATIO = 18;
const DISK_COLOR = ["#FF0000", "#FFC000", "#FFFF00", "#92D050", "#00B0F0", "#0067B4", "#7030A0"];

let towers = [[], [], []]; // それぞれの棒の状況
let disks = [TOWER_HEIGHT]; // 全てのディスク
let pickPos = -1; // 選択している場所(-1は未選択)
let isStart = false; // スタートしているかどうか
let startTime, endTime; // 時間計測用変数
let timeoutID; // 時間停止用タイムアウトID

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = true;

// ディスクのクラス
class Disk {
	constructor(size, color) {
		this.size = size;
		this.color = color;
	}

	// ディスクを描画するメソッド
	drawDisk = (poleNum, height) => {
		ctx.beginPath();
		drawRect(4.5 - this.size / 2 + poleNum * 11, 16 - height, 2 + this.size, 1);
		ctx.fillStyle = this.color;
		ctx.fill();
		ctx.closePath();
		ctx.font = "bold 2.4vw Roboto medium";
		ctx.fillStyle = "#F6F6F6";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		/*ctx.fillText(
			this.size,
			(canvas.width * (5.5 + 11 * poleNum)) / H_RATIO,
			(canvas.width * (16.5 - height)) / H_RATIO
		);*/
	};
}

// 初期化関数
let init = () => {
	getCanvasSize();
	towers = [[], [], []];
	for (let i = 0; i < TOWER_HEIGHT; i++) {
		disks[i] = new Disk(TOWER_HEIGHT - i, DISK_COLOR[i]);
		towers[0].push(disks[i]);
	}
	draw();
};

// 描画関数
let draw = () => {
	ctx.clearRect(0, (canvas.height * 5) / V_RATIO, canvas.width, canvas.height);
	drawBase();
	drawAllDisk();
	if (towers[1].length == TOWER_HEIGHT || towers[2].length == TOWER_HEIGHT) {
		clearGame();
	}
};

// 四角形を描画する関数
let drawRect = (posX, posY, width, height) => {
	ctx.rect(
		(canvas.width * posX) / H_RATIO,
		(canvas.height * posY) / V_RATIO,
		(canvas.width * width) / H_RATIO,
		(canvas.height * height) / V_RATIO
	);
};

// 土台を書く関数
let drawBase = () => {
	ctx.beginPath();
	drawRect(0.5, 16, 32, 1);
	drawRect(5, 5, 1, 12);
	drawRect(16, 5, 1, 12);
	drawRect(27, 5, 1, 12);
	ctx.fillStyle = "#f9d076";
	ctx.fill();
	ctx.closePath();
};

// 全てのディスクを描画する関数
let drawAllDisk = () => {
	for (let i = 0; i < towers.length; i++) {
		for (let j = 0; j < towers[i].length; j++) {
			// 選択中のディスクを浮かす
			if (pickPos == i && j == towers[i].length - 1) {
				towers[i][j].drawDisk(i, j + 1 + 2);
			} else {
				towers[i][j].drawDisk(i, j + 1);
			}
		}
	}
};

// Canvasサイズを取得する関数
let getCanvasSize = () => {
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
};

// クリック時の処理
let click = id => {
	if (!isStart && towers[0].length == TOWER_HEIGHT) {
		isStart = true;
		startTime = Date.now();
		displayTime();
	}
	switch (id) {
		case "btn0":
			change(0);
			break;
		case "btn1":
			change(1);
			break;
		case "btn2":
			change(2);
			break;
	}
	draw();
};

// 入れ替えの処理
let change = pos => {
	if (pickPos == -1) {
		if (towers[pos].length != 0) {
			// 持ち上げる
			pickPos = pos;
		}
	} else if (pickPos == pos) {
		// 元に戻す
		pickPos = -1;
	} else {
		// 移し替えられるかの判定
		if (
			towers[pos].length == 0 ||
			towers[pos][towers[pos].length - 1].size > towers[pickPos][towers[pickPos].length - 1].size
		) {
			// 移し替える
			towers[pos].push(towers[pickPos].pop());
			pickPos = -1;
		}
	}
};

// クリア時の処理
let clearGame = () => {
    ctx.font = "bold 13vw Roboto medium";
	ctx.fillStyle = "#6666FF";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(
		"C L E A R",
		(canvas.width * 16.6) / H_RATIO,
		(canvas.height * 9) / V_RATIO
	);
    clearTimeout(timeoutID);
}

// 経過時間を表示する関数
let displayTime = () => {
	let currentTime = new Date(Date.now() - startTime);
	ctx.clearRect(0, 0, canvas.width, (canvas.height * 5) / V_RATIO);
	ctx.font = "bold 6vw Roboto medium";
	ctx.fillStyle = "#FFFFFF";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillText(
		String(currentTime.getMinutes()).padStart(2, "0") + ":" + String(currentTime.getSeconds()).padStart(2, "0"),
		(canvas.width * 16.5) / H_RATIO,
		(canvas.height * 2) / V_RATIO
	);
	timeoutID = setTimeout(displayTime, 10);
};

// 画面リサイズ時の処理
window.addEventListener("resize", () => {
	draw();
});

$(".button").on("click", function () {
	click($(this).attr("id"));
});

// 回答を表示する関数
let answer = (n, from, to, work) => {
	if (n > 0) {
		answer(n - 1, from, work, to);
		console.log(n + "を" + from + "から" + to + "に移す");
		answer(n - 1, work, to, from);
	}
};

init();

// answer(5, '左', '右', '真ん中');
