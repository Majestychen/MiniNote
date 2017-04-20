//pages/mine/index.js
const app = getApp();
const appParam = app.appParam;
const util=app.util;
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
			itemList: ['author:Q', 'www.qinhaolei.com', 'haoleiqin@qq.com'],
			success: function(res) {
				if(res.tapIndex == 0) {
					wx.navigateTo({
						url: "../sponsor/index",
					})
				} else if(res.tapIndex == 1) {
					util.setClip('www.QinHaolei.com');
				} else if(res.tapIndex == 2) {
					util.setClip('HaoleiQin@qq.com');
				}
			},
		})

	},

	onShow: function() {},

})