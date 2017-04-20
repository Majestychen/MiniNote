//pages/edit/index.js
const app = getApp();
const Bmob = require('../../lib/bmob.js');
const util = app.util;
var queryParam = []; //0:openid 1:noteData
var noteData = [];
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
				}
			});
		},
		error: function(object, error) {
			console.log(error)
			util.errorTost();
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

Page({
	data: {},
	onLoad: function(query) {
		var that = this;
		queryParam[0] = query.id.split(',')[0];
		queryParam[1] = query.id.slice((query.id.indexOf(",") + 1));
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

	},

	onShow: function() {
		inputData[1] = '';
		inputData[0] = '';
		wx.getStorage({
			key: 'noteData',
			success: function(res) {
				noteData = res.data;
			},
		})
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
		}, 500);
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