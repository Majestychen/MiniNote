function formatTime(date) {
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();
	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};

function formatNumber(n) {
	n = n.toString()
	return n[1] ? n : '0' + n
};

function getNoteData(openId) {
	const Bmob = require('../lib/bmob.js');
	var Diary_note = Bmob.Object.extend("user_note");
	var query = new Bmob.Query(Diary_note);
	query.equalTo("user_openid_wechat", openId);
	query.select("note_title");
	query.select("note_date");
	query.select("note_content");
	query.select("objectId");
	query.select("date");
	query.descending("date");
	query.limit(1000);
	query.find({
		success: function(results) {
			wx.setStorage({
				key: "noteData",
				data: results
			});
		},
		error: function(error) {}
	});
};
// 获取当前时间,并格式化
function getNowTimeformat() {
	var myDate2 = new Date();
	var now_call_hour = '';
	if(myDate2.getHours() >= 6 && myDate2.getHours() < 9) {
		now_call_hour = '早晨';
	} else if(myDate2.getHours() >= 9 && myDate2.getHours() < 11) {
		now_call_hour = '上午';
	} else if(myDate2.getHours() >= 11 && myDate2.getHours() < 13) {
		now_call_hour = '中午';
	} else if(myDate2.getHours() >= 13 && myDate2.getHours() < 18) {
		now_call_hour = '下午';
	} else if(myDate2.getHours() >= 18 && myDate2.getHours() < 21) {
		now_call_hour = '傍晚';
	} else if(myDate2.getHours() >= 21 && myDate2.getHours() < 23) {
		now_call_hour = '深夜';
	} else if(myDate2.getHours() >= 23 && myDate2.getHours() < 24) {
		now_call_hour = '深夜';
	} else if(myDate2.getHours() >= 0 && myDate2.getHours() < 3) {
		now_call_hour = '拂晓';
	} else if(myDate2.getHours() >= 3 && myDate2.getHours() < 6) {
		now_call_hour = '黎明';
	}
	var newtime3 = myDate2.getFullYear() + '年' + (1 + myDate2.getMonth()) + '月' + myDate2.getDate() + '日 ' + now_call_hour + '' + myDate2.getHours() + ':' + myDate2.getMinutes();
	return newtime3;
};

function errorTost() {
	wx.showToast({
		title: '网络故障,请重试',
		icon: 'loading',
		duration: 666
	})
};

module.exports = {
	formatTime: formatTime,
	getNowTimeformat: getNowTimeformat,
	getNoteData:getNoteData,
	errorTost:errorTost,
};