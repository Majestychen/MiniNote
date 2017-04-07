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

function setEditData() {
	wx.getStorage({
		key: 'all_note_data_001',
		success: function(res) {
			over.editData = res.data;
			for(var i = 0; i < res.data.length; i++) {
				if(res.data[i].objectId === over.objectId) {
					over.arrayId = i;
					that.setData({
						input_conten: over.editData[i].note_content,
					});
					wx.setNavigationBarTitle({
						title: over.editData[i].note_title,
					})
					wx.hideNavigationBarLoading();
					EditSave();
				} else {

				}
			}
		},
		fail: function() {},
		complete: function() {}
	});
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
								over.objectId = result.id;
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
							success: function(res) {},
							fail: function() {
								// fail
							},
							complete: function() {
								// complete
							}
						})
					},
					error: function(result, error) {
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

function save() {
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
								over.objectId = result.id;
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
							success: function(res) {},
							fail: function() {
								// fail
							},
							complete: function() {
								// complete
							}
						})
					},
					error: function(result, error) {
						wx.showToast({
							title: '网络故障,请重试',
							icon: 'loading',
							duration: 666
						})
					}
				});

			}
		})
	} else {}

	that.setData({
		sendBtn: 'sendBtnHover',
	});
	setTimeout(function() {
		that.setData({
			sendBtn: 'sendBtn',
		});
	}, 100);
};

function EditSave() {
	if(over.input_title != '') {
		var Diary = Bmob.Object.extend("user_note");
		var query = new Bmob.Query(Diary);
		query.get(over.objectId, {
			success: function(result) {
				if(over.input_title != '') {
					result.set("note_title", over.input_title);
					over.editData[over.arrayId].input_title = over.input_title;
				}
				if(over.input_content || over.input_content == '') {
					result.set("note_content", over.input_content);
					over.editData[over.arrayId].input_content = over.input_content;
				}
				result.set("note_date", app.getNowTimeformat());
				over.editData[over.arrayId].note_date = app.getNowTimeformat();
				result.save({
					success: function(res) {
						wx.setStorage({
							key: 'all_note_data_001',
							data: over.editData,
							success: function(res) {},
							fail: function() {
								// fail
							},
							complete: function() {
								// complete
							}
						});
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
	} else {}

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
		if(over.editFirst) {
			save();
			over.editFirst = false;
		} else {
			setEditData();
		}
	},

	submit: function(e) {
		goSubmit();
	},

	cancle: function() {
		wx.navigateBack({
			url: '../note/index'
		})
	},

	onUnload: function() {
		if(over.input_content || over.input_title) {
			goSubmit();
		} else {

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