<template>
    <!-- 教师权限，可以添加相册 -->
    <x-button text="添加相册" @click='addPhotos' style="background:skyblue;margin:2px;"></x-button>

    <div class="container">
        <div v-for='(index,pic) in pics' style="width:140px;height:170px;display:inline;display:flex;flex-flow:column;text-align:center;margin:.3rem .2rem;" @click="morePic(index,pic)">
            <img src="http://img.mp.itc.cn/upload/20161105/10592411bfa54d0580e0f7f4457cf226_th.jpg" style="width:135px;height:135px;">
            <x-button :text="pic.name" type='warn'></x-button>
        </div>
    </div>
</template>
<script type="text/javascript">
import {
    XButton,
    Confirm,
    XInput
} from 'vux/src/components';
import Vue from 'vue';
export default {
    components: {
        XButton,
    },
    data() {
        return {
            count1: '0',
            count2: '0',
            pics: {},
            oDiv: {},
            title: ''
                // downImg:{}
        }
    },
    vuex:{
        getters:{
            class_id:state => state.class_id,//班级ID
        }
    },
    methods: {
        // 动态加载 相册
        addPhotos() {
            // 输入提示框
            var name = prompt('请输入相册名称:', '活动');
            var container = document.querySelector('.container');
            // 创建 div 和 img 标签
            var div = document.createElement('div');
            // var img = document.createElement('img');
            // 为每一个相册取名字
            if (/\//g.test(name))  name = name.replace(/\//g, '');
            // 如果 this.pics 不为空
            if (Object.getOwnPropertyNames(this.pics).length>0) {
            	// console.log(1);
            	// console.log(Object.getOwnPropertyNames(this.pics));
                var m = [].some.call(Object.getOwnPropertyNames(this.pics), (c, i) => {
                    // console.log(c)
                    return (name == c || !name);
                });
                // console.warn(m);
                // 新建相册名 不为空
                if (name != '' && name != null) {
                    this.title = m ? (name + '(' + (parseInt(this.count1) + 1) + ')') : name;
                    this.count1 = m ? (parseInt(this.count1) + 1) : parseInt(this.count1);
                } else {
                	// 新建相册名 是空
                    this.title = m ? ('新建文件夹' + '(' + (parseInt(this.count2) + 1) + ')') : '新建文件夹';
                    this.count2 = m ? (parseInt(this.count2) + 1) : parseInt(this.count2);
                }
            } else {
            	// this.pics 为空
            	// console.log(2)
                this.title = (name != '' && name != null) ? name : '新建文件夹';
            }
            // div.appendChild(img);
            this.oDiv = div;
            // console.warn(this.title);
            this.oDiv.name = this.title;
            // this.pics[this.oDiv.name] = this.oDiv;
            Vue.set(this.pics,this.oDiv.name,this.oDiv);
            localStorage.setItem(this.class_id[1],JSON.stringify(this.pics));
        },
        morePic(index, pic) {
            this.$store.dispatch('ADDRESS', pic.name);
            // console.warn(pic.name);
            this.$router.go('/gIndex/photo');
        }
    },
    route:{
    	data(t){
            // console.log(this.class_id[1])
            // console.log(this.class_id[1])
        	var obj = JSON.parse(localStorage.getItem(this.class_id[1]));
            // console.log(obj);
            this.pics = obj?obj:{};
            t.next();
    	}
    }
}
</script>

<style type="text/css">
.container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}
</style>
