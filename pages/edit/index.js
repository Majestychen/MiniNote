//pages/edit/index.js
const app = getApp();
const Bmob = require('../../lib/bmob.js');
const util = app.util;
var that = {};
var over = {
	objectId: 0,
	input_title: '',
	input_content: '',
	editData: [],
	arrayId: -1,
};
var queryParam = [];

function goSave() {
	var Diary = Bmob.Object.extend("user_note");
	var query = new Bmob.Query(Diary);
	query.get(queryParam[0], {
		success: function(result) {
			if(over.input_title != '') {
				result.set("note_title", over.input_title);

			}
			if(over.input_content || over.input_content == '') {
				result.set("note_content", over.input_content);
			}
			result.set("note_date", util.getNowTimeformat());
			result.set("date", new Date().getTime());
			result.save({
				success: function(res) {
					wx.navigateBack({
						url: '../note/index'
					})
				}
			});
		},
		error: function(object, error) {
			console.log(error)
			wx.showToast({
				title: '网络故障,请重试',
				icon: 'loading',
				duration: 600
			})
		}
	});
};

function justSave() {
	var Diary = Bmob.Object.extend("user_note");
	var query = new Bmob.Query(Diary);
	query.get(queryParam[0], {
		success: function(result) {
			if(over.input_title != '') {
				result.set("note_title", over.input_title);
			}
			if(over.input_content || over.input_content == '') {
				result.set("note_content", over.input_content);
			}
			result.set("note_date", util.getNowTimeformat());
			result.set("date", new Date().getTime());
			result.save({
				success: function(res) {}
			});
		},
		error: function(object, error) {
			console.log(error)
			wx.showToast({
				title: '网络故障,请重试',
				icon: 'loading',
				duration: 600
			})
		}
	});
};
Page({
	data: {
		sendBtn: 'sendBtn',
	},

	onLoad: function(query) {
		that = this;
		wx.getSystemInfo({
			success: function(res) {
				var tempHeight = res.windowHeight;
				tempHeight = tempHeight - 85;
				that.setData({
					texth: tempHeight,
				});
			}
		})
		queryParam[0] = query.id.split(',')[0];
		queryParam[1] = query.id.slice((query.id.indexOf(",") + 1));
		that.setData({
			input_conten: queryParam[1],
		});
	},

	onShow: function() {
		over.input_content = '';
		over.input_title = '';
	},

	onReady: function() {},

	zhengzai_input: function(e) {
		over.input_content = e.detail.value;
		over.input_title = over.input_content.substr(0, 20);
		if(over.input_title.indexOf("\n") > -1) {
			over.input_title = over.input_title.substr(0, over.input_title.indexOf("\n"));
		}
		justSave();
		console.log(queryParam)
	},

	// 笔记分享功能
	/*
	onShareAppMessage: function() {
		return {
			title: over.input_title,
			path: 'pages/edit/index?id=' + queryParam
		}
	},
	*/

	submit: function(e) {
		if(over.input_title != '' || over.input_content != '') {
			goSave();
		} else {
			wx.navigateBack({
				delta: 1
			})
		}
	},

	btnHover: function() {
		that.setData({
			sendBtn: 'sendBtnHover',
		});
	},
	btnHoverend: function() {
		that.setData({
			sendBtn: 'sendBtn',
		});
	},

	// 页面卸载
	onUnload: function() {

	},

	onHide: function() {},
});