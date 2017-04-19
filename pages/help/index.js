//pages/help/index.js
var Bmob = require('../../lib/bmob.js'); 
var that;
Page({
  
  data: {
  },

  onLoad: function () { 
      that=this;
  },

  onShow:function(){
          var Diary_note = Bmob.Object.extend("help");
          var query = new Bmob.Query(Diary_note);   
          // 排序
          query.ascending("order");
          // 查询当前用户数据  
          query.find({
            success: function (results) {
              // 循环处理查询到的数据
              var temp = [];
              var temp2 = [];
              for (var i = 0; i < results.length; i++) {               
                  temp.push(results[i]);              
              }
              that.setData({
                diaryList: temp
              })
            },
            error: function (error) {
            	  wx.showModal({
						    title: '网络出问题啦',
						    content: '是否重试',
						    confirmText:'重试', 
						    success: function(res) {
						    if (res.confirm) {
						    	// 如果用户点击了确认按钮
						    	that.onShow();
						    }
						  }
						});
            }
          }); 
},
 
})
