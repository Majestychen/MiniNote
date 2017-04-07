//pages/mine/index.js
var app = getApp();
var that;

Page({

	data: {
		motto: 'Hello World',
		userInfo: {},
		new_time: ''
	},
	onLoad: function() {
		that = this;
		//调用应用实例的方法获取全局数据
		app.getUserInfo(function(userInfo) {
			//更新数据
			that.setData({
				userInfo: userInfo,
				woshi: getApp().nihao,
				version: app.getversion(),
			})
		})

	},

	// 关于我们
	q_aboutus: function() {
		wx.showActionSheet({
			itemList: ['山东大叶榕信息科技有限公司', '电话:400-865-8850', '位置:山东寿光市青年电商大厦', '邮箱:HaoleiQin@qq.com'],
			success: function(res) {
				if(res.tapIndex == 0) {
					wx.navigateTo({
						url: "../sponsor/index",
						success: function(res) {
						},
						fail: function() {
						},
						complete: function() {
						}
					})
				} else if(res.tapIndex == 1) {
					wx.makePhoneCall({
						phoneNumber: '400-865-8850'
					})
				}

			},
			fail: function(res) {}
		})

	},

	onShow: function() {

	},

})