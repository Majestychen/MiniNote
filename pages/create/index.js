//pages/create/index.js
const app = getApp();
const util = app.util;
const Bmob = require('../../lib/bmob.js');
var that = {};
var over = {
	input_title: '',
	input_content: '',
	temp_consle: [],
	editData: [],
};
var noteData = [];

function errorTost() {
	wx.showToast({
		title: '网络故障,请重试',
		icon: 'loading',
		duration: 666
	})
};

function changeNoteData(noteData) {
	wx.setStorage({
		key: 'noteData',
		data: noteData,
		success: function(res) {
			wx.setStorage({
				key: 'dataChange',
				data: true,
				success: function(res) {
					wx.navigateBack();
				},
			})
		},
	})
};

function addNoteApi(swicth) {
	if(over.input_content != '' || over.input_title != '') {
		var Diary_q_1 = Bmob.Object.extend("user_note");
		var diary_q_1 = new Diary_q_1();
		wx.getStorage({
			key: 'user_openid',
			success: function(res) {
				diary_q_1.set("user_openid_wechat", res.data);
				diary_q_1.set("note_title", over.input_title);
				diary_q_1.set("note_date", util.getNowTimeformat());
				diary_q_1.set("date", new Date().getTime());
				diary_q_1.set("note_content", over.input_content);
				diary_q_1.save(null, {
					success: function(result) {
						noteData.push(result);
						changeNoteData(noteData);
					},
					error: function(result, error) {
						errorTost();
					}
				});

			}
		})
	} else {
		wx.showToast({
			title: '笔记空空',
			icon: 'loading',
			duration: 666
		})
	}
};

Page({
	data: {
		isNew: false,
		focus: false,
		input_title: '',
		sendBtn: 'sendBtn',
	},
	onLoad: function(options) {
		that = this;
		// 动态设置textarea高度
		wx.getSystemInfo({
			success: function(res) {
				var tempHeight = res.windowHeight;
				tempHeight = tempHeight - 90;
				that.setData({
					texth: tempHeight,
				});

			}
		})
		this.setData({
			now_time: util.getNowTimeformat(),
		});
	},

	onShow: function() {
		over.input_content = '';
		over.input_title = '';
		wx.getStorage({
			key: 'noteData',
			success: function(res) {
				noteData = res.data;
			},
		})
	},

	onReady: function() {},

	zhengzai_input: function(e) {
		over.input_content = e.detail.value;
		over.input_title = over.input_content.substr(0, 20);
		if(over.input_title.indexOf("\n") > -1) {
			over.input_title = over.input_title.substr(0, over.input_title.indexOf("\n"));
		}

	},

	okClick: function(e) {
		addNoteApi();
	},

	cancle: function() {
		wx.navigateBack();
	},

	onUnload: function() {
		addNoteApi();
	},
});