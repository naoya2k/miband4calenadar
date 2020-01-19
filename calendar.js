let today = new Date();
const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const japaneseHolidayList = {
    2020:
    "1/1,1/13,2/11,2/23,2/24,3/20,4/29,5/3,5/4,5/5,5/6,7/23,7/24,8/10,9/21,9/22,11/3,11/23", 
    2021: 
    "1/1,1/11,2/11,2/23,3/20,4/29,5/3,5/4,5/5,7/19,8/11,9/20,9/23,10/11,11/3,11/23",
    2022:
    "1/1,1/10,2/11,2/23,3/21,4/29,5/3,5/4,5/5,7/18,8/11,9/19,9/23,10/10,11/3,11/23",
    2023:
    "1/1,1/2,1/9,2/11,2/23,3/21,4/29,5/3,5/4,5/5,7/17,8/11,9/18,9/23,10/9,11/3,11/23"
};
function checkHoliday() {
    if (!(document.getElementById('autoHoliday').checked)) return;

    const date = new Date(today);
    const mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();

    const str = japaneseHolidayList[yyyy];
    let outstr = "";
    if (!str) return 0;

    const hlist = str.split(',');
    const len = hlist.length;
    for (let i = 0; i < len; i++) {
	const a = hlist[i].split('/');
	if (a[0] == mm) {
	    if (outstr.length > 1) outstr += ",";
	    outstr += hlist[i];
	}
    }

    document.getElementById('holidayText').value = outstr;
}

function prevpage() {
    today.setMonth(today.getMonth() - 1);
    checkHoliday();
    drawCalendar();
}
function nextpage() {
    today.setMonth(today.getMonth() + 1);
    checkHoliday();
    drawCalendar();
}
function isHoliday(date) {
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();

    const str = document.getElementById('holidayText').value;
    //  const str = japaneseHolidayList[yyyy];
    if (!str) return 0;
    const hlist = str.split(',');
    for (let i = 0; i < hlist.length; i ++) {
	const a = hlist[i].split('/');
	if (a[0] == mm && a[1] == dd) { return 1; }
    }
    return 0;
}

function createRoundRect(ctx, x, y, w, h, r) {
    r = ~~r;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}

function drawCalendar() {
    //カレンダー描画
    const canvas = document.getElementById('calendar');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, 10000, 10000);

    let y = 120 - 5;
    createRoundRect(ctx, 1, y-19, 118, 111,
		   document.getElementById('rectround').value);

    ctx.fillStyle = '#333333';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.fill();
    if (document.getElementById('rectstroke').value >= 1) {
	ctx.stroke();
    }
    ctx.strokeStyle = '#ff3355';

    const date = new Date(today);
    const month = date.getMonth();
    const mstr = monthNames[month];
    // const mstr = (month <= 8) ? "0"+(month+1): ""+(month+1);
    date.setDate(1);
    ctx.font = '18px "Roboto Mono", monospace';
    //    ctx.fillStyle = '#ffeecc';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign="center";
    //    ctx.fillText(""+date.getFullYear()+ "/"+mstr, 60, y);
    ctx.fillText(mstr+" " + date.getFullYear(), 60, y);

    ctx.font = '10px "Roboto Mono", monospace';
    ctx.textAlign="center";
    var column = 0;
    y += 18;
    date.setDate(date.getDate() - date.getDay());
    while (column < 6) {
	const isMain = (month == date.getMonth());

	const day = date.getDay();
	const dd = date.getDate();
	const dstr = (dd <= 9) ? " "+dd: ""+dd;
	const x = day * 17 + 9;
	const isBlue = isHoliday(date) == 2 || day == 6;
	const isRed = isHoliday(date) == 1 || day == 0;

	ctx.fillStyle = isMain ? '#3f7f7f' : '#000000';
	if (isBlue) ctx.fillStyle = isMain ? '#0000ff' : '#00007f';
	if (isRed) ctx.fillStyle = isMain ? '#ff0000' : '#7f0000';
	ctx.fillText(dstr, x, y+1);
	ctx.fillText(dstr, x, y-1);
	ctx.fillText(dstr, x-1, y);
	ctx.fillText(dstr, x+1, y);

	ctx.fillStyle = isMain ? '#ffffff' : '#7f7f7f';
	if (isBlue) ctx.fillStyle = isMain ? '#aaccff' : '#003f7f';
	if (isRed) ctx.fillStyle = isMain ? '#ffccaa' : '#7f3f00';
	ctx.fillText(dstr, x, y);

	date.setDate(date.getDate() + 1);
	if (day == 6) { y += 14; column++;}
    }
    
    try {
	const png_src = canvas.toDataURL();
	document.getElementById("calendar_img").src = png_src;
	document.getElementById("calendar_img").alt = "calendar";
    } catch(e) {
	document.getElementById("calendar_img").alt = "";
    }
}
