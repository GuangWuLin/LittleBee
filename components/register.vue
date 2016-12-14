<template>
    <div style="padding:25% 5%;background:#fff;height:100%;">
        <h1 style="text-align:center;color:#f95377;">小蜜蜂</h1>
        <div class="route">
            <router-view></router-view>
        </div>
        <x-button :text='honey' style='background:#f95377; color: #fff;' @click='sign'></x-button>
        <p v-link="{path:'/register/login'}" style="text-align:center;font-size:1.3rem;margin:1rem auto;color:red;" v-if="this.$route.path=='/register/registerComponent'">已经注册账号?去登录吧</p>
        <p v-link="{path:'/register/registerComponent'}" style="text-align:center;font-size:1.3rem;margin:1rem auto;color:red;" v-if="this.$route.path=='/register/login'||this.$route.path=='/register/pswBack'">还没有账号?快去注册吧</p>
        <p v-link="{path:'/register/pswBack'}" style="text-align:center;font-size:1.3rem;margin:1rem auto;" v-if="this.$route.path=='/register/login'">找回密码</p>
        <h5 style="text-align:center;">Version 0.2</h5>
        <confirm :show.sync="show" confirm-text="确定" cancel-text="取消" title="操作提示" @on-confirm="onAction('确认')" @on-cancel="onAction('取消')">
            <p style="text-align:center;">注册成功,快去登录吧</p>
        </confirm>
        <toast :show.sync="show1" width='50%'type="text">
            <p style="text-align:center;color:#fff;" v-if="checkCode">对不起注册失败！请重新注册~</p>
            <p style="text-align:center;color:#fff;" v-else>该号码已被注册，请直接登录</p>
        </toast>
        <toast :show.sync="show2" width='50%'type="text">
            <p style="text-align:center;color:#fff;" v-if="exists">密码应在 6-18 位由数字，字母以及下划线组成</p>
            <p style="text-align:center;color:#fff;" v-else>请输入中国大陆11位手机号码</p>
        </toast>
        <toast :show.sync="show3" width='50%' type="text">
            <p style="text-align:center;color:#fff;">账号不存在或密码错误，请重新输入</p>
        </toast>
        <toast :show.sync="show4" width='50%' type="text">
            <p style="text-align:center;color:#fff;" v-if="lw">请输入手机验证码</p>
            <p style="text-align:center;color:#fff;">请输入手机验证码</p>
        </toast>
        <p @click="walk" style="text-align:center;font-size:1rem;margin:1rem auto;">还没有账号,我只想逛逛</p>
    </div>
</template>
<script>
import {
    SetAjax,
    setCookie
} from "./setAjax.js";
import {
    login,
    register
} from './api.js'
import {
    XButton,
    Confirm,
    Toast
} from 'vux/src/components'
export default {
    components: {
        Confirm,
        XButton,
        Toast
    },
    data() {
        return {
            Code: '',
            show: false,
            show1: false,
            show2: false,
            show3: false,
            show4:false,
            exists: true,
            honey: '',
            checkCode: true
        }
    },
    ready() {
        if (this.$route.path == '/register') {
            this.$router.go('/register/login');
            this.honey = '登陆';
        }
    },
    events: {
        'show1': function(msg) {
            if (msg == 'false') {
                this.checkCode = true;
            } else if (msg == 'exists') {
                this.checkCode = false;
            }
            this.show1 = true;
        },
        'show': function() {
            this.show = true;
        },
        'Exists': function(msg) {
            this.show2 = true;
            if (msg == 'psw') {
                this.exists = true;
            } else if (msg == 'num') {
                this.exists = false;
            }
        },
        'Error': function() {
            this.show3 = true;
        },
        'show4':function(msg){
            this.show4 = true;
            if (msg=='') {
                this.lw = true;
            }else{
                this.lw = false;
            }
        }
    },
    route: {
        data(t) {
            // 登录界面清cookie
            setCookie('token', '');
            this.$store.dispatch("CLOSE_LOADING");
            this.$store.dispatch("TO_SIGN",{});
            this.$store.dispatch("TEACHER_USER",{});
            this.$store.dispatch("GARDEN_INFO",{});
            this.honey = '';
            if (this.$route.path == '/register/registerComponent') {
                this.honey = '注册';
            } else if (this.$route.path == '/register/login') {
                this.honey = '登录';
            } else if(this.$route.path == '/register/pswBack') {
                this.honey = '提交'
            }
            t.next()
        }
    },
    methods: {
        sign() {

            if (this.$route.path == '/register/registerComponent') {
                this.$broadcast('reg');
            } else if (this.$route.path == '/register/login') {
                this.$broadcast('log');
            }else if (this.$route.path == '/register/pswBack') {
                this.$broadcast('psBack')
            }
            
        },
        onAction(type) {
            if (type == '确认') {
                this.$router.go('/home');
            } else if (type == '取消') {
                this.show = false;
            }
        },
        walk(){
            this.$store.dispatch("CLOSE_LOADING");
            this.$store.dispatch("TO_SIGN",{});
            this.$store.dispatch("TEACHER_USER",{});
            this.$store.dispatch("GARDEN_INFO",{});
            this.$store.dispatch("OPEN_LOADING",{});
            this.$nextTick(function(){
                this.$router.go('/home');
            });
        }
    }

}
</script>
<style>
</style>
