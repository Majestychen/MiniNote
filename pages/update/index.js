//update/index.js
//获取应用实例
var app = getApp()
var Bmob = require('../../lib/bmob.js');
var that;
Page({

	data: {
		motto: 'Hello World',
		userInfo: {}
	},

	onLoad: function() {
		that = this;
	},

	onShow: function() {
		var Diary_note = Bmob.Object.extend("update_history");
		var query = new Bmob.Query(Diary_note);
		query.descending("time");
		query.find({
			success: function(results) {
				var temp = [];
				var temp2 = [];
				for(var i = 0; i < results.length; i++) {
					temp.push(results[i]);
				}
				that.setData({
					diaryList: temp
				})
			},
			error: function(error) {}
		});
	},

})