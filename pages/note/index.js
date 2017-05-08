//  pages/note/index.js 
const app = getApp();
const appParam = app.appParam;
const Bmob = require('../../lib/bmob.js');
const util = app.util;
var that;
var noteData = [];
var noteVillage = []; //0:userOpenId //1模拟按钮触摸效果 //2:objectID

function getNoteData() {
	var query = new Bmob.Query(Bmob.Object.extend("user_note"));
	query.equalTo("user_openid_wechat", noteVillage[0]);   
	query.select("note_title");
	query.select("note_date");
	query.select("note_content");
	query.select("objectId");
	query.select("date");
	query.descending("date");
	query.limit(1000);
	query.find({
		success: function(results) {  
			noteData=results;
			wx.setStorage({
				key: "noteData",
				data: results
			});
		},
		error: function(error) {}
	});
};

function deleteNote() {
	var query = new Bmob.Query(Bmob.Object.extend("user_note")); 
	query.get(noteVillage[2], {
		success: function(object) {
			object.destroy({
				success: function(deleteObject) {
					that.onShow();
					getNoteData();
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

function deleteNoteMenu() {
	for(var i = 0; i < noteData.length; i++) {
		if(noteData[i].id == noteVillage[2]) {
			wx.showModal({
				title: '确定删除?',
				content: '标题:' + noteData[i].attributes.note_title,
				success: function(res) {
					if(res.confirm) {
						deleteNote(noteVillage[2]);
					}
				}
			});
		}
	}
}

function longClickMenu(e) {
	noteVillage[2] = e.target.id ? e.target.id : e.currentTarget.id;
	wx.showActionSheet({
		itemList: ['复制', '删除'],
		success: function(res) {
			if(res.tapIndex == 1) {
				deleteNoteMenu();
			} else if(res.tapIndex == 0) {
				for(var i = 0; i < noteData.length; i++) {
					if(noteData[i].id == objectId) {
						util.setClip(noteData[i].attributes.note_content);
					}
				}
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

function jumpTop(e) {
	that.setData({
		scrollTop: 0,
	});
};

function compareNoteData(results) {
	wx.getStorage({
		key: 'dataChange',
		success: function(dataChange) {
			if(dataChange.data) {
				jumpTop();
			}
		},
		fail: function(e) {},
	})
};

function getUserOpenId() {
	wx.login({
		success: function(code) {
			wx.request({
				url: appParam.apiUrl.openId,
				data: {
					appid: appParam.wxApp.appKey,
					secret: appParam.wxApp.secret,
					js_code: code.code,
					grant_type: 'authorization_code'
				},
				success: function(openIdResult) {
					noteVillage[0]=openIdResult.data.openid;
					getNoteData();
					wx.setStorage({
						key: "user_openid",
						data: openIdResult.data.openid,
						success: function() {
							requestNoteData();
						},
					});
				}
			})
		}
	});
};

function requestNoteData() { 
	var Diary_note = Bmob.Object.extend("user_note");
	var query = new Bmob.Query(Diary_note);
	query.equalTo("user_openid_wechat", noteVillage[0]);
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
			noteData = results;
			wx.hideNavigationBarLoading();
			compareNoteData();
		},
		error: function(error) {
			retry();
		}
	});
};

function getNoteDataSt() {
	wx.getStorage({
		key: 'noteData',
		success: function(res) { 
			that.setData({
				diaryList: res.data,
			});
		},
		complete: function(res) {
			getUserOpenId();
		},
	})
};

function init() {
	wx.getSystemInfo({
		success: function(res) {
			var tempHeight = res.windowHeight;
			tempHeight = tempHeight - 40;
			that.setData({
				scrollHeight: tempHeight,
			});
		}
	});
	getNoteDataSt();
};

Page({
	data: {
		sysBtnSrc: appParam.res.sysBtnSrc,
		createBtnSrc: appParam.res.creatBtnSrc,
		diaryListSwitch: true,
	},
	onLoad: function(this_object) {
		wx.showNavigationBarLoading();
		noteVillage[1] = false;
		that = this;
	},

	onShow: function() {
		init();
	},

	listShortcutClick: function() {
		wx.showActionSheet({
			itemList: ['复制', '删除'],
			success: function(res) {
				if(res.tapIndex == 1) {
					wx.showToast({
						title: '该提示将在新建后自动删除',
						icon: 'success',
						duration: 2500
					})
				}	
				if(res.tapIndex == 0) {
					wx.showToast({
						title: '内容复制成功',
						icon: 'success',
						duration: 1000
					})
				}
			},
			fail: function(res) {}
		})
	},

	clickNotelist: function(e) {
		var objectId = e.target.id ? e.target.id : e.currentTarget.id;
		wx.setStorage({
			key: 'dataChange',
			data: false,
			success: function(res) {
				for(var i = 0; i < noteData.length; i++) {
					if(noteData[i].id == objectId && !noteVillage[1]) {
						wx.navigateTo({
							url: '../edit/index?id=' + objectId 
						})
					}
				}
			},
		})

	},

	noteListLongPress: function(e) {
		noteVillage[1] = true;
		longClickMenu(e);
	},
	listShortBtnClick: function(e) {
		longClickMenu(e);
	},

	search: function(inputing) {
		var Diary_note = Bmob.Object.extend("user_note");
		var query = new Bmob.Query(Diary_note);
		query.equalTo("user_openid_wechat", noteVillage[0]);
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
				for(var i = 0; i < results.length; i++) {
					if((results[i].attributes.note_title).indexOf(inputing.detail.value) >= 0) {
						temp.push(results[i]);
						tempSwicth = false;
					}
					that.setData({
						diaryList: temp
					})
				}
				if(temp.length == 0 && inputing.detail.value != '') {
					that.setData({
						diaryListSwitch: false
					})
				}
			},
			error: function(error) {
				retry();
			}
		});
	},

	createBtnClick: function() {
		wx.setStorage({
			key: 'dataChange',
			data: false,
			success: function(res) {
				wx.navigateTo({
					url: '../create/index?id=' + noteVillage[0]
				})
			},
		})
	},
	sysBtnClick: function(show) {
		if(show != 'hide') {
			wx.showToast({
				title: '正在同步',
				icon: 'loading',
				duration: 9999
			});
		}
		that.onShow();
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