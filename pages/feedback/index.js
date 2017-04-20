//pages/feedback/index.js
const Bmob = require('../../lib/bmob.js');
var fbBmob = Bmob.Object.extend("user_feedback");
const app = getApp();
var feedbackContent = '';
var contactContent = '';
var chooseImg = [];
var tempPaths = '';
var tempFile_num = 0;
var tempPathArr = [];
Page({
	data: {
		chooseImgBtn: '',
	},
	onLoad: function(options) {},
	onShow: function() {
		wx.showNavigationBarLoading();
		setTimeout(function() {
			wx.hideNavigationBarLoading()
		}, Math.random() * 2022);

	},

	onReady: function() {},
	chooseImgClick: function() {
		var that = this;
		wx.showNavigationBarLoading();
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
			success: function(res) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
				var addFeedback = new fbBmob();
				var name = res.tempFilePaths + ".jpg"; //上传的图片的别名
				var file = new Bmob.File(name, res.tempFilePaths);
				// 最多上传10张图
				if(tempPathArr.length < 11) {
					file.save().then(function(res) {
						tempPathArr.push(res.url());
						that.setData({
							src: tempPathArr,
						});
						wx.hideNavigationBarLoading();
					}, function(error) {});
				} else {
					that.setData({
						chooseImgBtn: 'hide',
					});
				}

			}
		})
	},

	deleteImgClick: function(e) {
		var that = this;
		var id = e.currentTarget.id ? e.currentTarget.id : e.target.id;
		if(tempPathArr.length == 1) {
			tempPathArr = [];
			that.setData({
				src: tempPathArr,
			});
		} else {
			for(var i = 0; i < tempPathArr.length; i++) {
				if(id == tempPathArr[i]) {
					tempPathArr.splice(i, 1);
					that.setData({
						src: tempPathArr,
					});
				}
			}
		}

	},
 
	phoneNumberInput: function(e) {
		contactContent = e.detail.value;
	},

	feedbackContentInput: function(e) {
		feedbackContent = e.detail.value;
	},
	sendBtnClick: function(e) {
		var diary_q_1 = new fbBmob();
		wx.getStorage({
			key: 'user_openid',
			success: function(res) {
				diary_q_1.set("user_openid_wechat", res.data);
				if(feedbackContent) {
					if(tempPaths.length > 0) {
						var name = res.data + '/' + tempFile_num + ".jpg"; //上传的图片的别名
						var file = new Bmob.File(name, tempPaths);
						file.save().then(function(res) {}, function(error) {});
						// 状态
						diary_q_1.set("status", '有图' + name);
					}
					diary_q_1.set("contact", contactContent);
					diary_q_1.set("feedback", feedbackContent);
					diary_q_1.save(null, {
						success: function(result) {
							wx.showToast({
								title: '感谢您的意见 ^_^',
								icon: 'success',
								duration: 1226
							})
							setTimeout(function() {
								wx.navigateBack();
							}, 1226);

						},
						error: function(result, error) {
							wx.showToast({
								title: '网络故障 请重试',
								icon: 'loading',
								duration: 1226
							})
						}
					});

				} else {
					wx.showToast({
						title: '空空的~',
						icon: 'loading',
						duration: 1222
					})
				}

			}
		})

		//  onsubmit结束
	},

	// 取消事件
	cancle: function() {
		wx.navigateBack({
			url: '../mine/index'
		})
	}
	// 取消事件结束
});