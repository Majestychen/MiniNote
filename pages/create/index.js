//pages/create/index.js
var Bmob = require('../../utils/bmob.js');
var that = {};
//  搞Bmob的一些东西哈
var Diary = Bmob.Object.extend("user_note");
//  用来查询数据的
var diary = new Diary();
var app = getApp();
// 用来存储笔记内容和标题
var over = {
	input_title: '',
	input_content: '',
	temp_consle: [],
	editData: [],
	objectId: 0,
	editFirst: true,
};

function goSubmit() {
	if(over.input_title != '') {
		var Diary_q_1 = Bmob.Object.extend("user_note");
		var diary_q_1 = new Diary_q_1();
		wx.getStorage({
			key: 'user_openid',
			success: function(res) {
				diary_q_1.set("user_openid_wechat", res.data);
				diary_q_1.set("note_title", over.input_title);
				diary_q_1.set("note_date", app.getNowTimeformat());
				diary_q_1.set("note_content", over.input_content);
				diary_q_1.save(null, {
					success: function(result) {
						wx.getStorage({
							key: 'all_note_data_001',
							success: function(res) {
								over.temp_consle = res.data;
								over.temp_consle.push({ note_title: over.input_title, note_date: app.getNowTimeformat(), note_content: over.input_content });
							},
							fail: function(res) {
								// fail
							},
							complete: function(res) {
								// complete
							}
						})

						wx.setStorage({
							key: 'all_note_data_001',
							data: over.temp_consle,
							success: function(res) {
								wx.navigateBack({
									delta: 1
								})
							},
							fail: function() {
								// fail
							},
							complete: function() {
								// complete
							}
						})
					},
					error: function(result, error) {
						over.editFirst = true;
						wx.showToast({
							title: '网络故障,请重试',
							icon: 'loading',
							duration: 666
						})
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

	that.setData({
		sendBtn: 'sendBtnHover',
	});
	setTimeout(function() {
		that.setData({
			sendBtn: 'sendBtn',
		});
	}, 100);
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
			now_time: app.getNowTimeformat(),
		});
	},

	onShow: function() {
		over.editFirst=true;
		wx.setNavigationBarTitle({
			title: '',
		})
	},

	onReady: function() {

	},

	zhengzai_input: function(e) {
		over.input_content = e.detail.value;
		over.input_title = over.input_content.substr(0, 20);
		if(over.input_title.indexOf("\n") > -1) {
			over.input_title = over.input_title.substr(0, over.input_title.indexOf("\n"));
		}
		wx.setNavigationBarTitle({
			title: over.input_title,
		})

	},

	submit: function(e) {
		if(over.editFirst) {
			goSubmit();
			over.editFirst = false;
		}
	},

	cancle: function() {
		wx.navigateBack({
			url: '../note/index'
		})
	},

	onUnload: function() {
		if(over.input_content || over.input_title) {
			if(over.editFirst) {
				goSubmit();
			}
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
});