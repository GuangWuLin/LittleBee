<!-- 登录组件 -->
<template>
    <div>
        <group>
            <x-input title='账号:' placeholder="输入手机号" :value.sync='user.phone' keyboard="number"></x-input>
            <x-input title='密码:' placeholder="输入密码" :value.sync='user.password' type='password' :max="18" :min="6"
            @keyup.enter="logg"></x-input>
        </group>
        <group v-if="count>=3">
            <x-input title='验证码:' placeholder="输入验证码" :value.sync="checkCode" keyboard="number">
                <x-button mini type='primary' @click='check' text='获取验证码'></x-button>
            </x-input>
            <cell title="验证码:" :value.sync="markCode"></cell>
        </group>
    </div>
</template>
<script type="text/javascript">
import {
    Group,
    XInput,
    Cell,
    XButton
} from 'vux/src/components'
import {
    SetAjax,
    setCookie
} from './setAjax.js'
import {
    login,
    URL_GET_UserInfo,
    GetSignins
} from './api.js'
export default {
    components: {
        Group,
        XInput,
        Cell,
        XButton
    },
    methods:{
        check(e){
          e.target.innerText = 60;
                e.target.disabled = true;
                e.target.style.background = 'grey';
                let tid = setInterval(()=>{
                    e.target.innerText -= 1;
                },1000);
                // console.log(1)
                setTimeout(()=>{
                    clearInterval(tid);
                    e.target.innerText = '获取验证码';
                    e.target.disabled = false;
                    e.target.style.background = '#04BE02';
                },60000);
            this.markCode = Date.now().toString().slice(-4);
        },
        logg(){
        	if (this.flag) {
                // console.warn(this.flag);
                for(o in this.user){
                    this.user[o] || (function(){
                      this.$dispatch('Error');
                      return;
                    })();
                }
        	 this.$http.post(login, {'data': this.user}).then((response) => {
                    // console.log(response);
                    // 返回 success 存储 cookie
                    if (response.data) {
                        setCookie('token',response.data);
                        // 跳转路由到 主页面
                        this.$router.go('/home');
                       // 登录失败 (账号不存在或密码错误)
                    } else {
                        this.$dispatch('Error');
                        // 失败次数计数
                        this.count++;
                        // 当错误达到三次 则要求输入验证码并将flag改未false
                        if (this.count>=3) {
                            this.flag = false;
                        }
                        // console.warn(this.count)
                    }
                });
            // 密码输错三次之后需要输入 验证码
            }else{
                // 验证码和输入的数字需要匹配并且不为空
                if (this.markCode === this.checkCode && this.checkCode!=='') {
                    // 修改 flag 为true
                    this.flag = true;
                }else{
                // 验证码与输入码不匹配 则提示验证码错误
                    this.$dispatch('show4','ddd');
                }
            }
        }
    },
    events: {
        'log': function() {
            // flag 是否需要输入验证码  默认为 不需要（true）
            if (this.flag) {
                // console.warn(this.flag);
                for(o in this.user){
                    this.user[o] || (function(){
                      this.$dispatch('Error');
                      return;
                    })();
                }
                // console.log('dadaddadaad')
                this.$http.post(login, {'data': this.user}).then((response) => {
                    // console.log(response);
                    // 返回 success 存储 cookie
                    if (response.data) {
                        setCookie('token',response.data);
                        // 跳转路由到 主页面
                        this.$router.go('/home');
                       // 登录失败 (账号不存在或密码错误)
                    } else {
                        this.$dispatch('Error');
                        // 失败次数计数
                        this.count++;
                        // 当错误达到三次 则要求输入验证码并将flag改未false
                        if (this.count>=3) {
                            this.flag = false;
                        }
                        // console.warn(this.count)
                    }
                });
            // 密码输错三次之后需要输入 验证码
            }else{
                // 验证码和输入的数字需要匹配并且不为空
                if (this.markCode === this.checkCode && this.checkCode!=='') {
                    // 修改 flag 为true
                    this.flag = true;
                }else{
                // 验证码与输入码不匹配 则提示验证码错误
                    this.$dispatch('show4','ddd');
                }
            }
        }
    },
    route: {
        data(t) {
            // console.warn(this.count)
            t.next();
        }
    },
    data() {
        return {
            user: {
                phone: "",
                password: ""
            },
            count:0,
            checkCode:'',
            markCode:'',
            flag:true
        }
    }
}
</script>
<style type="text/css"></style>
