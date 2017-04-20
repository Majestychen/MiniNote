//pages/help/index.js
var Bmob = require('../../lib/bmob.js');
const app = getApp();
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
		var helpDataBase = Bmob.Object.extend("help");
		var query = new Bmob.Query(helpDataBase);
		query.ascending("order");
		query.find({
			success: function(results) {
				that.setData({
					helpData: results
				})
			},
			error: function(error) {
				retry();
			}
		});
	},

})