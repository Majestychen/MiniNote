//pages/sponsor/index.js
var app = getApp()
var Bmob = require('../../lib/bmob.js');
var Diary = Bmob.Object.extend("user_note");
var that;
function retry() {
	wx.showModal({
		title: '网络出问题啦',
		content: '是否重试',
		confirmText: '重试',
		success: function(res) {
			if(res.confirm) {
				that.onShow();
			}
		}
	});
};
Page({

	data: {},

	onLoad: function() {
		that = this;
	},

	onShow: function() {
		var Diary_note = Bmob.Object.extend("sponsor");
		var query = new Bmob.Query(Diary_note);
		query.descending('updatedAt');
		query.find({
			success: function(results) {
				that.setData({
					sponsorData: results,
				})
			},
			error: function(error) {
				retry();
			}
		});
	},
	onPullDownRefresh: function() {
		that.onShow();
		wx.showToast({
			title: '刷新成功',
			icon: 'success',
			duration: 666
		})
		wx.stopPullDownRefresh();
	},
})