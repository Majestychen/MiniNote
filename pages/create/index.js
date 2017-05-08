//pages/create/index.js
const app = getApp();
const util = app.util;
const Bmob = require('../../lib/bmob.js');
var inputContent = []; //0:title 1:content //2:openid //3:是否已经点过保存按钮
var noteData = [];

function changeNoteData(noteData, swicth) {
	wx.setStorage({
		key: 'noteData',
		data: noteData,
		success: function(res) {
			wx.setStorage({
				key: 'dataChange',
				data: true,
				success: function(res) {
					if(swicth) {
						wx.navigateBack();
					}
				},
			})
		},
	})
};

function addNote(swicth) {
	if(!inputContent[3]) {
		if(inputContent[1] != '' || inputContent[0] != '' && inputContent[2]) {
			var userNote = Bmob.Object.extend("user_note");
			var addNoteB = new userNote();
			addNoteB.set("user_openid_wechat", inputContent[2]);
			addNoteB.set("note_title", inputContent[0]);
			addNoteB.set("note_date", util.getNowTimeformat());
			addNoteB.set("date", new Date().getTime());
			addNoteB.set("note_content", inputContent[1]);
			addNoteB.save(null, {
				success: function(result) { 
					noteData.push(result);
					changeNoteData(noteData, swicth);
				},
				error: function(result, error) {
					util.errorTost();
				}
			});
		} else {
			if(swicth) {
				wx.showToast({
					title: '笔记空空',
					icon: 'loading',
					duration: 666
				})
			}
		}
	}
};

Page({
	data: {},
	onLoad: function(options) {
		var that = this;
		inputContent[2] = options.id;
		wx.getSystemInfo({
			success: function(res) {
				that.setData({
					ContentTextHeight: res.windowHeight - 90,
				});

			}
		})
	},

	onShow: function() {
		inputContent[1] = '';
		inputContent[0] = '';
		inputContent[3] = false;
		wx.getStorage({
			key: 'noteData',
			success: function(res) {
				noteData = res.data;
			},
		})
	},

	onReady: function() {},

	contentInput: function(e) {
		inputContent[1] = e.detail.value;
		inputContent[0] = inputContent[1].substr(0, 20);
		if(inputContent[0].indexOf("\n") > -1) {
			inputContent[0] = inputContent[0].substr(0, inputContent[0].indexOf("\n"));
		}
	},

	okClick: function(e) {
		addNote(true);
		inputContent[3] = true;
	},
	onUnload: function() {
		addNote(false);
	},
});