//pages/mine/index.js
const app = getApp();
const appParam=app.appParam;
var that;
Page({

	data: {
		motto: 'Hello World',
		userInfo: {},
		new_time: ''
	},
	onLoad: function() {
		that = this;
		app.getUserInfo(function(userInfo) {
			//更新数据
			that.setData({
				userInfo: userInfo,
				version: appParam.wxApp.version,
			})
		})

	},
	q_aboutus: function() {
		wx.showActionSheet({
			itemList: ['author:Q', 'www.QinHaolei.com', 'HaoleiQin@qq.com'],
			success: function(res) {
				if(res.tapIndex == 0) {
					wx.navigateTo({
						url: "../sponsor/index",
						success: function(res) {},
						fail: function() {},
						complete: function() {}
					})
				} else if(res.tapIndex == 1) {
					wx.setClipboardData({
						data: 'www.QinHaolei.com',
						success: function(res) {
							wx.getClipboardData({
								success: function(res) {
									wx.showToast({
										title: '已复制到剪切板',
										icon: 'success',
										duration: 1200
									})
								}
							})
						}
					})
				} else if(res.tapIndex == 2) {
					wx.setClipboardData({
						data: 'HaoleiQin@qq.com',
						success: function(res) {
							wx.getClipboardData({
								success: function(res) {
									wx.showToast({
										title: '已复制到剪切板',
										icon: 'success',
										duration: 1200
									})
								}
							})
						}
					})
				}

			},
			fail: function(res) {}
		})

	},

	onShow: function() {

	},

})