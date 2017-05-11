//pages/edit/index.js
const app = getApp();
const Bmob = require('../../lib/bmob.js');
const util = app.util;
var queryParam = []; //0:openid 1:noteData
var noteData = [],
	that;
var inputData = []; //0:inputTtile//1:inputContent //2:timeOut每次输入都保存数据//3:onload给textarea内容赋值 

function updateServerData(judge) {
	var query = new Bmob.Query(Bmob.Object.extend("user_note"));
	query.get(queryParam[0], {
		success: function(result) {
			result.set("note_content", inputData[1]);
			result.set("note_title", inputData[0]);
			result.set("note_date", util.getNowTimeformat());
			result.set("date", new Date().getTime());
			result.save({
				success: function(res) {
					saveStorageData(res, judge);
				},
				error: function(object, error) {
					console.log('save', error)
					util.errorTost();
				}
			});
		},
		error: function(object, error) {
			wx.showModal({
				title: '网络开小差啦',
				content: '是否重试?',
				confirmText: '重试',
				success: function(res) {
					if(res.confirm) {
						updateServerData(judge);
					} else if(res.cancel) {}
				}
			})
		}
	});
};

function changeNoteData(data, saveJudge) {
	wx.setStorage({
		key: 'noteData',
		data: data,
		success: function(res) {
			if(saveJudge) {
				wx.navigateBack();
			} else {
				wx.setStorage({
					key: 'dataChange',
					data: true,
				})
			}
		},
	});

};

function saveStorageData(res, saveJudge) {
	for(var i = 0; i < noteData.length; i++) {
		if(noteData[i].objectId == res.id) {
			noteData[i] = {
				date: res.attributes.date,
				note_content: res.attributes.note_content,
				note_date: res.attributes.note_date,
				note_title: res.attributes.note_title,
				objectId: res.id,
			};

		}
	}
	changeNoteData(noteData, saveJudge);
};

function init(objectID) {
	wx.getStorage({
		key: 'noteData',
		success: function(noteDataRes) {
			noteData = noteDataRes.data;
			for(var i = 0; i < noteDataRes.data.length; i++) {
				if(noteDataRes.data[i].objectId == objectID) {
					queryParam[1] = noteDataRes.data[i].note_content;
					wx.getSystemInfo({
						success: function(res) {
							var tempHeight = res.windowHeight;
							tempHeight = tempHeight - 85;
							that.setData({
								ContentTextHeight: tempHeight,
								textareaContent: queryParam[1],
							});
						}
					});
					inputData[3] = setInterval(function() {
						that.setData({
							textareaContent: queryParam[1],
						});
					}, 100);
				}
			}
		},
	});
};

Page({
	data: {},
	onLoad: function(query) {
		that = this;
		queryParam[0] = query.id;
		init(queryParam[0]);
	},

	onShow: function() {
		inputData[1] = '';
		inputData[0] = '';
	},

	onReady: function() {},

	contentInput: function(e) {
		clearTimeout(inputData[2]);
		clearInterval(inputData[3]);
		inputData[1] = e.detail.value;
		inputData[0] = inputData[1].substr(0, 20);
		if(inputData[0].indexOf("\n") > -1) {
			inputData[0] = inputData[0].substr(0, inputData[0].indexOf("\n"));
		}
		inputData[2] = setTimeout(function() {
			updateServerData(false);
		}, 600);
	},

	okClick: function(e) {
		if(inputData[0] != '' || inputData[1] != '') {
			updateServerData(true);
		} else {
			wx.navigateBack()
		}
	},

	onUnload: function() {},

	onHide: function() {},
});