//pages/feedback/index.js
var Bmob = require('../../lib/bmob.js');
const app = getApp();
var feedbackContent = '';
var contactContent = '';
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
			success: function(chooseImageRes) {
				// 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
				var name = chooseImageRes.tempFilePaths + ""; //上传的图片的别名
				var file = new Bmob.File(name, chooseImageRes.tempFilePaths);
				// 最多上传10张图
				if(tempPathArr.length < 11) {
					file.save().then(function(res) {
						feedbackContent = "反馈截图上传成功" + "";
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
		wx.getStorage({
			key: 'user_openid',
			success: function(res) {
				if(feedbackContent) {
					var feedbackBomb = Bmob.Object.extend("feedback");
					var sendFeedback = new feedbackBomb();
					sendFeedback.set("user_openid_wechat", res.data);
					sendFeedback.set("contact", contactContent);
					sendFeedback.set("feedback", feedbackContent);
					sendFeedback.save(null, {
						success: function(result) {
							wx.showToast({
								title: '发送成功',
								icon: 'success',
								duration: 1226,
								success: function() {
									wx.navigateBack();
								},
							});
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
	},
});