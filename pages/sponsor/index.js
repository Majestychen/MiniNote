//pages/sponsor/index.js
var app = getApp();
var Bmob = require('../../lib/bmob.js');
var that;
var sponsorMoney = 0;

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

function getUserOpenid() {
	wx.getStorage({
		key: "user_openid",
		success: function(openIdResult) {
			paySponsor(openIdResult.data);
		},
	});
};



function paySponsor(openId) {
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

	moneyInput: function(e) {
		sponsorMoney = e.detail.value;
	},

	payBtnClick: function() {
		getUserOpenid();
	},
})