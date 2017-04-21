//pages/mine/index.js
const app = getApp();
const appParam = app.appParam;
const util = app.util;
var that;

Page({
	data: {
		userInfo: {},
	},
	onLoad: function() {
		that = this;
		app.getUserInfo(function(userInfo) {
			that.setData({
				userInfo: userInfo,
				version: appParam.wxApp.version,
			})
		})

	},
	aboutmeClick: function() {
		wx.showActionSheet({
			itemList: ['author:Q', 'HaoleiQ@gmail.com'],
			success: function(res) {
				if(res.tapIndex == 1) {
					util.setClip('HaoleiQ@gmail.com');
				}
			},
		})

	},

	onShow: function() {},

})