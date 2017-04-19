//  pages/note/index.js 
const app = getApp();
const appParam = app.appParam;
const Bmob = require('../../lib/bmob.js');
var that;
var noteData = [];
var noteVillage = []; //0:userOpenId //1模拟按钮触摸效果

function deleteNote(objectId) {
	var query = new Bmob.Query(Bmob.Object.extend("user_note"));
	query.equalTo("objectId", objectId);
	query.get(objectId, {
		success: function(object) {
			object.destroy({
				success: function(deleteObject) {
					that.sysBtnClick('hide');
				},
				error: function(object, error) {
					retry();
				}
			});
		},
		error: function(object, error) {
			retry();
		}
	});
};

function deleteNoteMenu(objectId) {
	for(var i = 0; i < noteData.length; i++) {
		if(noteData[i].id == objectId) {
			wx.showModal({
				title: '确定删除?',
				content: '标题:' + noteData[i].attributes.note_title,
				success: function(res) {
					if(res.confirm) {
						deleteNote(objectId);
					}
				}
			});
		}
	}
}

function longClickMenu(e) {
	var objectId = e.target.id ? e.target.id : e.currentTarget.id;
	wx.showActionSheet({
		itemList: ['查看', '删除'],
		success: function(res) {
			if(res.tapIndex == 0) {
				wx.navigateTo({
					url: '../edit/index?id=' + objectId
				})
			} else if(res.tapIndex == 1) {
				deleteNoteMenu(objectId);
			}
			noteVillage[1] = false;
		},
		fail: function(res) {}
	});

};

function retry() {
	wx.showModal({
		title: '网络开小差了',
		content: '是否重试',
		confirmText: '重试',
		success: function(res) {
			if(res.confirm) {
				that.onShow();
			}
		}
	})
};

function jumpTop() {
	that.setData({
		scrollTop: 0,
	});
};

function compareNoteData(results) {
	wx.getStorage({
		key: 'noteData',
		success: function(noteDataStorage) {
			var newData = [],
				oldData = [],
				dataSame = true;
			for(var i = 0; i < noteDataStorage.data.length; i++) {
				newData.push(noteDataStorage.data[i].date);
				oldData.push(results[i].attributes.date)
				if(noteDataStorage.data[i].date != results[i].attributes.date) {
					dataSame = false;
				}
			}
			if(!dataSame || results.length != noteDataStorage.data.length) {
				noteData = results;
				wx.setStorage({
					key: 'noteData',
					data: results,
					success: function(res) {
						jumpTop();
					},
				})
			} else {}
		},
	})
};

function init() {
	wx.getSystemInfo({
		success: function(res) {
			var tempHeight = res.windowHeight;
			tempHeight = tempHeight + 20;
			that.setData({
				texth: tempHeight,
			});
		}
	})
	wx.getStorage({
		key: 'user_openid',
		success: function(openId) {
			noteVillage[0] = openId.data;
			var Diary_note = Bmob.Object.extend("user_note");
			var query = new Bmob.Query(Diary_note);
			query.equalTo("user_openid_wechat", openId.data);
			query.select("note_title");
			query.select("note_date");
			query.select("note_content");
			query.select("objectId");
			query.select("date");
			query.descending("date");
			query.limit(1000);
			query.find({
				success: function(results) {
					that.setData({
						diaryList: results,
					});
					compareNoteData(results);
				},
				error: function(error) {
					retry();
				}
			});
		}
	})
};

Page({
	data: {
		sysBtnSrc: appParam.res.sysBtnSrc,
		createBtnSrc: appParam.res.creatBtnSrc,
		diaryListSwitch: true,
	},
	onLoad: function(this_object) {
		noteVillage[1] = false;
		that = this;
	},

	onShow: function(eshow) {
		init();
	},

	listShortcutClick: function() {
		wx.showActionSheet({
			itemList: ['编辑', '删除'],
			success: function(res) {
				if(res.tapIndex == 1) {
					wx.showToast({
						title: '该提示将在新建后自动删除',
						icon: 'success',
						duration: 4666
					})
				}
			},
			fail: function(res) {}
		})
	},

	clickNotelist: function(e) {
		if(!noteVillage[1]) {
			wx.navigateTo({
				url: '../edit/index?id=' + e.currentTarget.id
			})
		}
	},

	noteHoverStart: function(e) {
		noteVillage[1] = true;
		longClickMenu(e);
	},
	listShortBtnClick: function(e) {
		longClickMenu(e);
	},

	onEditItem: function(e) {
		var objectId = e.target.id ? e.target.id : e.currentTarget.id;
		wx.navigateTo({
			url: '../edit/index?id=' + objectId
		})
	},

	search: function(zhengzaishurudeneirong) {
		wx.getStorage({
			key: 'user_openid',
			success: function(res) {
				var Diary_note = Bmob.Object.extend("user_note");
				var query = new Bmob.Query(Diary_note);
				// 查询所有数据
				query.equalTo("user_openid_wechat", res.data);
				query.select("note_title");
				query.select("note_date");
				query.select("date");
				query.descending("date");
				query.limit(1000);
				query.find({
					success: function(results) {
						var temp = [];
						var temp2 = [];
						var tempSwicth = true;
						// 循环处理查询到的数据
						for(var i = 0; i < results.length; i++) {
							if((results[i].attributes.note_title).indexOf(zhengzaishurudeneirong.detail.value) >= 0) {
								temp.push(results[i]);
								tempSwicth = false;
							}
							that.setData({
								diaryList: temp
							})
						}
						if(temp.length == 0 && zhengzaishurudeneirong.detail.value != '') {
							that.setData({
								diaryListSwitch: false
							})
						}
					},

					error: function(error) {

						wx.showModal({
							title: '服务器开小差了',
							content: '是否重试',
							confirmText: '重试',
							success: function(res) {
								if(res.confirm) {
									// 如果用户点击了确认按钮
									that.onShow();
								}
							}
						});

					}
				});
			}
		})
	},

	createBtnClick: function() {
		wx.navigateTo({
			url: '../create/index'
		})
	},
	sysBtnClick: function(show) {
		if(show == 'hide') {} else {
			wx.showToast({
				title: '正在同步',
				icon: 'loading',
				duration: 9999
			});
		}
		var Diary_note = Bmob.Object.extend("user_note");
		var query = new Bmob.Query(Diary_note);
		// 查询当前用户数据
		if(noteVillage[0]) {
			query.equalTo("user_openid_wechat", noteVillage[0]);
			query.select("note_title");
			query.select("note_date");
			query.select("date");
			query.descending("date");
			query.limit(1000);
			query.find({
				success: function(results) {
					// 循环处理查询到的数据
					var temp = [];
					var this_object_arr = [];
					for(var i = 0; i < results.length; i++) {
						temp.push(results[i]);
					}
					that.setData({
						diaryList: temp,
					});
					wx.setStorage({
						key: 'noteData',
						data: temp,
						success: function(res) {},
					})
					setTimeout(function() {
						wx.hideToast()
					}, 700)

				},
				error: function(error) {}
			});
		}

	},

	onHide: function() {
		that.setData({
			searchContent: "",
		});

	},

	sysBtnHover: function() {
		that.setData({
			sysBtnSrc: appParam.res.sysBtnHlSrc,
		});
	},
	sysBtnHoverEnd: function() {
		that.setData({
			sysBtnSrc: appParam.res.sysBtnSrc,
		});
	},

	createBtnHover: function() {
		that.setData({
			createBtnSrc: appParam.res.creatBtnHlSrc,
		});
	},
	createBtnHoverEnd: function() {
		that.setData({
			createBtnSrc: appParam.res.creatBtnSrc,
		});
	},
})