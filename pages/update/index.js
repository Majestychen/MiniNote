//pages/update/index.js
var app = getApp();
const Bmob = require('../../lib/bmob.js');
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
		var query = new Bmob.Query(Bmob.Object.extend("update_history"));
		query.descending("time");
		query.find({
			success: function(results) {
				that.setData({
					updateHistoryData: results
				})
			},
			error: function(error) {
				retry();
			}
		});
	},

})