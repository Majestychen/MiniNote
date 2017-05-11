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
			})
		})

	},
	aboutmeClick: function() {
		wx.showActionSheet({
			itemList: ['HaoleiQ@gmail.com', '版本:v' + appParam.wxApp.version],
			success: function(res) {
				if(res.tapIndex == 0) {
					util.setClip('HaoleiQ@gmail.com');
				} else if(res.tapIndex == 1) {
					wx.navigateTo({
						url: '../update/index'
					})
				}
			},
		})

	},

	onShow: function() {},

})