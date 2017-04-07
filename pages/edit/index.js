//pages/edit/index.js
var app = getApp();
var BmobEdit = require('../../utils/bmob.js');
var that = {};
var over = {
	objectId: 0,
	input_title: '',
	input_content: '',
	editData: {},
	arrayId: -1,
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
				} else {

				}
			}
		},
		fail: function() {
			// fail
		},
		complete: function() {
			// complete
		}
	});
};

function goSave() {
	var Diary = BmobEdit.Object.extend("user_note");
	var query = new BmobEdit.Query(Diary);
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
						success: function(res) {
							wx.navigateBack({
								url: '../note/index'
							})
						},
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
};

function justSave() {
	var Diary = BmobEdit.Object.extend("user_note");
	var query = new BmobEdit.Query(Diary);
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
						success: function(res) {
						},
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
};
Page({
	data: {
		sendBtn: 'sendBtn',
	},

	onLoad: function(e) {
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
		over.objectId = e.id;
		setEditData();
	},

	onShow: function() {
		over.input_content = '';
		over.input_title = '';
		wx.showNavigationBarLoading();
		setEditData()
	},

	onReady: function() {
		setEditData();
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
		justSave();
	},

	// 笔记分享功能
	/*
	onShareAppMessage: function() {
		return {
			title: over.input_title,
			path: 'pages/edit/index?id=' + over.objectId
		}
	},
	*/

	submit: function(e) {
		goSave();
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