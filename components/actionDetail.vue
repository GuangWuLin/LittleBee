<!-- 活动详情页 -->
<!-- 修改内部轮播图 -->
<template>
    <div class="page">
    	<!-- 活动名字 -->
    	<div class="home-top">
		    <x-header :left-options="{showBack: false}" style="background:#f95377">
		        <p class="gaction">{{news.actionname}}</p>
		      <div class="header_left" @click="back"></div>
		      <div></div>
		    </x-header>
        </div>
        <!-- 活动内容 -->
        <div id="container">
	        <div class="flex-item">
		        <div class="main">
              <div class="gardenBgm">
                  <swiper :list="list" :min-moving-distance="20" auto="" dots-position="center" width="100%"></swiper>
              </div>
		            <div class="content">
		                <div class="title">活动详情</div>
		                <hr>
		                <div class="gardenInfo gardenInfo_" >{{ news.intro }}</div>
		            </div>
		            <div class="comment">
		                <div class="title">评论</div>
		                <hr>
		                <div class="userComments">
		                   <comment-component   v-ref:hk></comment-component>
		                </div>
		            </div>
		            <div class="ttt"  v-if='Textarea'>
		            	<div class="ttt_heard">
		            		<div @click="del" class="left">
		            			取消
		            		</div>
		            		<div @click="submit" class="right">
		            			发送
		            		</div>
		            	</div>
		            	<group >
		            		<x-textarea :max="200" placeholder="请输入您的评论" :value.sync='msg'></x-textarea>
		            	</group>
		            </div>
	        	</div>
        	</div>
        </div>
        <footer class="footers" v-if="showFooter">
            <div class="login" v-if="news.applynum == 'null' || news.applynum-news.peoples<=0 ||this.check">{{ news.typename }}</div>
            <div v-else @click='sign'> 预约报名 </div>
            <div class="footTitle" @click.stop = 'comment' v-show="Login">评论</div>
            <div class="footTitle" v-else v-link="{path:'/register/login'}" >登录</div>
        </footer>
		<toast :show.sync="show2" type="warn" width="9.6rem" :time='1500'>您还没登陆，请登陆</toast>
		<toast :show.sync="show1" type="warn" width="9.6rem" :time='1500'>
			<p v-if="successs">请输入文字后再发送</p>
			<p v-else>您已经报名了，不可重复报名。</p>
		</toast>
		<toast :show.sync="show" type="success" width="9.6rem" :time='1500'>
			报名成功!
		</toast>
    </div>
</template>
<script>
	import { SetAjax,getCookie } from './setAjax.js'
	import commentComponent from './commentList.vue'
	import { XTextarea,Group,Divider,XHeader,Toast,Swiper } from 'vux/src/components'
	// import alert from 'vux/src/components'
	import {URL_GET_ACTION ,URL_Add_actionTopic,URL_GET_ActionTopic, URL_USER_AddReply,URL_Add_actionPeople,downLoadUrl,getImageListUrl,bucket } from './api.js';
	let noteID = 0;
	export default {
		 components:{
      commentComponent,
      XTextarea,
      Swiper,
			Group,
			Divider,
			Toast,
			XHeader
	    },
	    data(){
	        return {
	        	token:'',
	            news:{},
              list:[],
              preList:[{img:require('../assets/actpic3@1x.png')}],
              key:'',
	            display:'none',
	            msg:'',
	            check:false,
	             Textarea:false,
	             showFooter:true,
	             show:false,
	             show1:false,
	            show2:false,
	            Login:true,
              imgList:{},
	            successs:false
	        }
	    },
	    methods: {
	    	// 返回上一页
	        back() {
	            window.history.back(-1);
	        },
	        // 活动预约报名
	        sign(){
	        	var _id = this.$route.params.id;
	        	// console.log(this.check);
	        	if (!this.token) {
	        		this.show2 = true; // 提示登录
	        	}else{
	        		// 添加活动人数
		        	SetAjax('post',URL_Add_actionPeople,{'aid':_id,'flor_token':this.token},(response)=>{
		        		// console.warn(response);
		        		this.check = true; // 用户点预约之后设置为 true
		        		response.data && [this.show=true,this.successs=true]; // 提示报名成功
		        		response.data || [this.show1=true,this.successs=false];
		        	});
	        	}
	        },
          // imgurl:function(){
          //   this.$http.post(downLoadUrl,{'data':this.imgList}).then(
    			// 		(r) => {
    			// 			console.log(r.body);
          //       console.log(this.imgList);
          //       if (r.body) {
          //         this.list=r.body;
          //       }else {
          //         this.list=[{img:require('../assets/home_swiper@1x_0.jpg')}];
          //       }
    			// 			console.log(this.list)
    			// 		});
          // },
          getImgList:function(){
            if(this.key!=''){
              // console.log(this.key);
              return Promise.resolve(this.$http.post(getImageListUrl,{"key":this.key}))
    				}
            return Promise.reject();
          },
	        // 点击评论
	        comment(){
	        	if (!this.token) {
	        		this.show2 = true; // 未登录提示
	        		this.Login = false; // '评论'两个字变为'登录'
	        	}else{
		        	this.Textarea = true; // 出现评论区域
		        	this.showFooter=false; // 底部导航隐藏
	        	}
	        },
	        // 提交评论
	        submit(){
	        	let _id = this.$route.params.id;
	        	if (this.msg.trim().length>0) { // 评论不为空时
		        	SetAjax('post',URL_Add_actionTopic,{content:{aid:_id,content:this.msg},'flor_token':this.token},(response)=>{
		        	});
	        		this.$broadcast('parent-msg',{msg:this.msg}); // 自定义事件，派发给commentList.vue组件
	        		this.msg = ''; // 情况评论框
		        	this.Textarea=false; // 隐藏评论框
		        	this.showFooter=true; // 隐藏底部导航
	        	}else{
	        		this.show1 = true; // 空白评论提示
	        		this.successs = true;
	        	}
	        },
	        // 取消评论
	         del(){
	        	this.Textarea=false;
	        	this.showFooter=true;
	        }
	    },
	    route: {
	        data(t) {
            this.$set('key','a/in/'+this.$route.params.id+'/');//定义key值
	        	// token 获取
	        	this.token = getCookie('token');
	            this.news = {};
	            var vm = this;
	            let _id = this.$route.params.id;
	            // 父组件直接调用子组件的方法
	            this.$refs.hk.get(URL_GET_ActionTopic,{aid:_id});
	            // 获取全部活动
	            SetAjax('post',URL_GET_ACTION,{data:{params:{aid:_id}},'flor_token':this.token},(response)=>{
	                // console.log(response);
	                response.data.forEach(function(c){
	                    if (c.id == _id && c.status==0) {
	                      vm.news = c;
	                    }
	                });
	            },(response)=>{
	            });
              this.getImgList().then(values=>{
                // console.log(values);
                // console.log(values.body);
                if(values.body.length>0 && typeof values.body!=="String"){
                  // console.log('is am here')
                  values.body.forEach(c=>{
                    this.imgList[c]='http://'+bucket+'/'+c+'?';
                  });
                  // console.log(this.imgList);
                  return Promise.resolve(this.$http.post(downLoadUrl,{'data':this.imgList}));
                }
                return Promise.reject();
              },(reject)=>{
                // console.log(reject);
              }).then(values=>{
                // console.log(values.body);
                for(o in values.body){
                  this.list.push({img:values.body[o]});
                }
                // this.list = values.body;
                // console.log(this.list);
              },(reject)=>{
                // console.log(reject);
                this.list = this.preList;
                // console.log(this.list);
              }).catch(e=>{
                // console.log(e);
              });
	            t.next();
	        }
	    }
	}
</script>
<!-- scoped 只在当前组件应用样式 -->
<style scoped>
	.header_left{
    position: absolute;
    top: 1rem;
    left: 1.4rem;
    width: 1rem;
    height: 2rem;
    background: url('../assets/back@1x_0.png') no-repeat;
  }
  .gaction{
  	font-size: 2rem;
  }
	.page,.main,.userComments,.content,.comment{
		display: flex;
		flex-flow: column;
	}
	.footers,.wrap{
		display: flex;
		flex-flow: row;
	}
	.commentArea{
		display: flex;
		margin: .5rem auto;
		justify-content: center;
	}
	.page{
	    flex: 1;
	    min-height: 100vh;
	    justify-content: space-between;
	    position: absolute;
	    height: 100%;
	    width: 100%;
	    box-sizing:border-box;
	    -webkit-box-sizing:border-box;
	}
	.flex-item{
	    /*给"子元素"赋予自由伸缩的能力*/
	    -webkit-box-flex: 1;
	    -webkit-flex: 1;
	    flex: 1;
	    overflow-x: hidden;
	}
	#container{
		display: -webkit-box;
    	display: -webkit-flex;
    	display: flex;
		/*指定主轴的伸缩流方向是纵向的*/
	    -webkit-box-orient: vertical;
	    -webkit-box-direction: normal;
	    -webkit-flex-direction: column;
	    flex-direction: column;
	    position: relative;
	    width: 100%;
	    height: 100%;
	    /* overflow: hidden; */
	    background: #eee;
	}
	.main{
	    flex: 2;
	    justify-content: flex-start;
	}
	hr{
	    filter:alpha(opacity:100,finishopacity:0,style:3);
	    width:98%;
	    color:#987cb9;
	    size:3;
	}
	.footers{
	    height: 4rem;
	    font-size: 1.4rem;
	    font-family: 'microsoft yahei';
	    color: #fff;
	    align-items: center;
	    justify-content: space-around;
	    background: #f95377;
	}
	.login{
	    display: flex;
	    text-align: center;
	}
	.commentTitle{
	    display: flex;
	    text-align: center;

	}
  .vux-slider{
    width: 100%;
  }
	/* .wrap{
	    flex: 1;
	    margin: auto 1rem;
	    justify-content: flex-start;
	} */
	.gardenBgm{
	    display: flex;
	    margin-top: 1rem;
	    /*background: url('../assets/actpic3@1x.png');*/
	    width: 100%;
	    height: 19rem;
	}
	.gardenInfo{
	    display: flex;
	    justify-content: center;
	    font-size: 1.4rem;
	    color: #999;
	    text-indent: 2em;
	    line-height: 2rem;
	    margin: 1rem;
	}
	.gardenInfo_{
	    overflow: hidden;
	    text-overflow: ellipsis;
	    display: -webkit-box;
	    -webkit-line-clamp:5;
	    -webkit-box-orient:vertical;
	}
	.content {
	    width: 100%;
	    justify-content: center;
	    margin-top: 1rem;
	    background-color: #fff;
	}
	.title{
	    margin-top: 1rem;
	    margin: auto;
	    font-size: 1.6rem;
	    font-family: '黑体';
	}
	.mark{
	    display: flex;
	    font-size: 1.2rem;
	    font-family: '微软雅黑';
	    color: #f95377;
	    justify-content: center;
	    margin-left: 1rem;
	}
	.comment{
	    background-color: rgba(255,255,255,0.7);
	    margin-top: 1rem;
	}
	.ttt{
		display: flex;
		flex-direction: column;
		height: 60%;
		position: fixed;
		top:0;
		z-index: 999;
		width: 100%;
		background-color: rgba(255,255,255,1);
	}
	.ttt_heard{
		background-color: rgba(204,204,204,0.2);
		display: flex;
		justify-content: space-between;
		font-size: 1.5rem;
		color: #999;
	}
	.ttt_heard .left,.right{
		height: 2.5rem;
		width: 4rem;
		background: #f95377;
		text-align: center;
		margin: .5rem;
		border-radius: .2rem;
		color: #fff;
	}
</style>
