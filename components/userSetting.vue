<template>
    <group>
        <div id="container">
            <cell title="更换头像" id="pickfiles">
                <img style="height:40px;width:40px;" :src="downImg.url" v-el:img @error='prePic'></img>
            </cell>
        </div>
        <hr style="height: 1rem;background:#eee;border:0px;">
        <cell title="修改密码:"></cell>
        <x-input title="原始密码:" :value.sync="oldPsw" type="password" placeholder='请输入原始密码'></x-input>
        <x-input title="修改密码:" :value.sync="userlist.userPsw" type="password" placeholder='请输入新的密码'></x-input>
        <x-input title="重复密码:" :equal-with="userlist.userPsw" type="password" placeholder='请再次输入您的新密码'></x-input>
        <x-input title="手机验证码:" placeholder='请输入验证码' :value.sync="shortMsg">
            <x-button text='获取验证码' @click='gain' mini type="primary"></x-button>
        </x-input>
        <switch title="打开/关闭消息推送" :value.sync="msgMark" @on-change='change'></switch>
        <x-button text='提交' type="warn" @click='sub' v-if="oldPsw != '' || userlist.userPsw != ''"></x-button>
    </group>
    <x-button text='注销登录' type="warn" @click='showOut = true' v-show='token'></x-button>
    <confirm :show.sync="showOut" confirm-text="确定" cancel-text="取消" title="操作提示" @on-confirm="onAction('确认')" @on-cancel="onAction('取消')">
      <p style="text-align:center;">确定注销当前账号？</p>
    </confirm>
    <toast :show.sync="show" width="50%" type="text">
        <p style="color:#fff;" v-if="shortMsg">提交成功！</p>
        <p style="color:#fff;" v-else>提交失败或验证码不能为空！</p>
    </toast>
    <toast :show.sync="showLogin" type="warn" width="9.6rem" :time='1500'>您还没登陆，请登陆</toast>
</template>
<script type="text/javascript">
    import {
        Group,
        Cell,
        XInput,
        XButton,
        XHeader,
        Confirm,
        Toast,
        Switch
    } from 'vux/src/components';
    import {
        bucket,
        downLoadUrl,
        getUpLoadTokenUrl,
        ChangCode,
        changepsw
    } from './api.js';
    import {
        uploader,
        downLoadImg,
        getImgList,
        getImageListUrl,
        getCookie,
        getLocation
    } from './setAjax.js'
    export default {
        components: {
            Group,
            Cell,
            XInput,
            Switch,
            XButton,
            Toast,
            Confirm,
            XHeader
        },
        data() {
            return {
                downImg: {
                    'url': ''
                },
                oldPsw:'',
                userlist: {
                    "nickname": '',
                    'userPsw': ''
                },
                key: 'u/'+this.userInfo.id,
                cont: 0,
                show: false,
                imgList: {},
                msgMark:false,
                shortMsg:'',
                Code:'',
                token:'',
                showLogin:false,
                showOut:false
            }
        },
       vuex:{
            getters:{
                userInfo:state => state.userInfo
            }
        },
        route: {
            data(t) {
                this.token = getCookie('token');
                // console.log(this.userInfo)
                this.imgurl(this.key);
                this.$nextTick(function() {
                    // console.log(this.key)
                    if (!!this.token) {
                        uploader(getUpLoadTokenUrl, bucket, this.key, this.imgurl);
                    }
                    t.next();
                });
            }
        },
        methods: {
            // Comfirm 提示框 是否退出登录
            onAction(type){
                    // console.log(type)
                if ( type =='确认') {
                    getLocation(true);
                    this.$router.go('/register/login');
                }
            },
            // 图片加载出错时调用
            prePic(){
                this.$els.img.src = 'http://2e.zol-img.com.cn/product/64_280x2000/410/ceneo4LyDg8c.jpg';
            },
            // 修改密码
            sub() {
                // console.log(this.token);
                if (!!this.token) {
                    // console.log(1);
                    if (this.Code == this.shortMsg && this.shortMsg!='') {
                        this.$http.post(changepsw,{'data':{'oldpassword':this.oldPsw,'newpassword':this.userlist.userPsw},'flor_token':this.token}).then((response)=>{
                            // console.log(response);
                            this.show = true;
                            document.querySelector('.weui_btn').style.display = 'none';
                        },(response)=>{
                            // console.log(response);
                        })
                    }else{
                        this.show = true;
                    }
                }else{
                    this.showLogin = true;
                }
            },
            // 获取验证码
            gain() {
                this.Code = Date.now().toString().slice(-4);
                this.$http.post(ChangCode,{'data': {'phone':this.userInfo.phone,'nickname':this.userInfo.nickname,'code':this.Code}}).then((response)=>{
                },(response)=>{
                });
            },
            // 推送消息 打开/关闭
            change(val){
            	// console.log(val);
               if (val) {
                this.$store.dispatch("CLOSE_NEWS");
               }else{
                this.$store.dispatch("OPEN_NEWS");
               }
               // console.log(this.userInfo)
            },
            // 获取用户 头像
            imgurl(key) {
                if (!!this.token) {
                    this.$http.post(downLoadUrl, {'data': {'url': 'http://' + bucket + '/' + key + '?imageView2/2/h/50'}}).then((r) => {
                            this.downImg = r.json();
                        },
                        (r) => {}
                    )
                }
            },
            // 返回上一个页面
            back() {
                window.history.back(-1);
            }
        }
    }
</script>

<style type="text/css" scoped>
img{
    background: url('http://2e.zol-img.com.cn/product/64_280x2000/410/ceneo4LyDg8c.jpg');
}
</style>
