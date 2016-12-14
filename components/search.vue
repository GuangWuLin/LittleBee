<!-- 搜索框 -->
<template>
    <search @touch='ss' @on-cancel='cancel' @result-click="resultClick" @on-change="gResult" :results="results" :value.sync="value" top="46px" :placeholder="myplaceholdere" :cancel-text="mycancelText"></search>
</template>
<script type="text/javascript">
import {
    Search
} from 'vux/src/components';
import {
    URL_GET_ACTION,
    URL_GET_GardenLIST
} from './api.js';
import {
    SetAjax
} from './setAjax.js';
var str = '',
    flag = true,
    position = '';
export default {
    components: {
        Search
    },
      vuex: {
        getters: {
            'distance': state => state.distance
        }
    },
    methods: {
        // 点击事件，跳转相应的 学校 或者 活动
        resultClick(item) {
            // console.log(item.id);
            if (position === 'around') { // 跳周边学校
                this.$router.go("detail/" + item.id);
                this.$store.dispatch('NAME', this.value);
            } else if (position === 'action') { // 跳 活动
                this.$router.go("actionDetail/" + item.id);
            }
        },
        // 
        gResult(val) {
            // console.log(val);
            this.results = val ? this.getResult(this.value) : [];
        },
        ss() {
            // console.error('God is a girl');
            this.$dispatch('God', 'hide');
        },
        cancel() {
            // console.error('cancel');
            this.$dispatch('God', 'show');
        },
        getResult(val) {
            let rs = [];
            // console.log(str);
            // console.log(val)
            var ttt = '';
            var ddd= '';
            SetAjax('post', str, {
                select: {
                    name: val
                },
                ulat:this.distance
            }, (response) => {
                console.info(response);
                if (response.body) {
                    // this.$store.dispatch('SELECTGARDENS', response.data);
                    response.body.forEach(function(c) {
                        // console.log(c);
                        if (flag) {
                            ttt = `${c.gardenname}`;
                            ddd = c.coord<100000?c.coord:false;
                            ddd = ddd?`附近${ddd}米`:''
                        } else {
                            ttt = `${c.actionname}`;
                            ddd = `${c.acoord}`;
                        }
                        rs.push({
                            title: ttt +'→'+ddd ,
                            id: c.id
                        })
                    });
                    // rs.push(response.data);
                    // console.log(rs);
                }
            });
            return rs
        }
    },
    events: {
        'parents': function(msg) {
            if (msg === 'home' || msg === 'around') {
                str = URL_GET_GardenLIST;
                position = 'around';
                flag = true;
            } else if (msg === 'action') {
                str = URL_GET_ACTION;
                position = 'action';
                flag = false;
            }
        }
    },
    data() {
        return {
            results: [],
            value: '',
            myplaceholdere: '搜索',
            mycancelText: '取消',
        }
    }
}
</script>
<style>
</style>
