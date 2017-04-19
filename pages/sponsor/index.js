//sponsor/index.js
var app = getApp()
var Bmob = require('../../lib/bmob.js');
var Diary = Bmob.Object.extend("user_note");
var that;
Page({

	data: {},

	onLoad: function() {
		that = this;
	},

	onShow: function() {
		var Diary_note = Bmob.Object.extend("sponsor");
		var query = new Bmob.Query(Diary_note);
		query.ascending('createdAt');
		query.find({
			success: function(results) {
				var temp = [];
				var temp2 = [];
				for(var i = 0; i < results.length; i++) {
					temp.push(results[i]);
					if(results[i].attributes.info) {
						that.setData({
							in_info: results[i].attributes.info,
						})
					}
				}
				that.setData({
					diaryList: temp,
				})
			},
			error: function(error) {
			}
		});
	},

})