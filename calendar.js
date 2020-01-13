let today = new Date();
const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const japaneseHolidayList = {
    2020:
    "1/1,1/13,2/11,2/23,2/24,3/20,4/29,5/3,5/4,5/5,5/6,7/23,7/24,8/10,9/21,9/22,11/3,11/23", 
    2021: 
    "1/1,1/11,2/11,2/23,3/20,4/29,5/3,5/4,5/5,7/19,8/11,9/20,9/23,10/11,11/3,11/23"
};
function prevpage() {
    today.setMonth(today.getMonth() - 1);
    drawCalendar();
}
function nextpage() {
    today.setMonth(today.getMonth() + 1);
    drawCalendar();
}
function isHoliday(date) {
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();

    const str = japaneseHolidayList[yyyy];
    if (!str) return 0;
    const hlist = str.split(',');
    for (let i = 0; i < hlist.length; i ++) {
	const a = hlist[i].split('/');
	if (a[0] == mm && a[1] == dd) { return 1; }
    }
    return 0;
}

function drawCalendar() {
    //カレンダー描画
    const canvas = document.getElementById('calendar');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, 10000, 10000);

    let y = 120 - 5;
    ctx.fillStyle = '#777777'; ctx.fillRect(0, y-20, 120, 118);
    ctx.fillStyle = '#333333'; ctx.fillRect(1, y-19, 118, 116);
    ctx.strokeStyle = '#ff3355'; 
    ctx.lineWidth=1;

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
    y += 18;
    while (month == date.getMonth()) {
	const day = date.getDay();
	const dd = date.getDate();
	const dstr = (dd <= 9) ? " "+dd: ""+dd;
	const x = day * 17 + 9;
	const isBlue = isHoliday(date) == 2 || day == 6;
	const isRed = isHoliday(date) == 1 || day == 0;
	ctx.fillStyle = '#3f7f7f';
	if (isBlue) ctx.fillStyle = '#0000ff';
	if (isRed) ctx.fillStyle = '#ff0000';
	ctx.fillText(dstr, x, y+1);
	ctx.fillText(dstr, x, y-1);
	ctx.fillText(dstr, x-1, y);
	ctx.fillText(dstr, x+1, y);

	ctx.fillStyle = '#ffffff';
	if (isBlue) ctx.fillStyle = '#aaccff';
	if (isRed) ctx.fillStyle = '#ffccaa';
	ctx.fillText(dstr, x, y);

	date.setDate(date.getDate() + 1);
	if (day == 6) { y += 14; }
    }
    
    try {
	const png_src = canvas.toDataURL();
	document.getElementById("calendar_img").src = png_src;
	document.getElementById("calendar_img").alt = "calendar";
    } catch(e) {
	document.getElementById("calendar_img").alt = "";
    }
}
