<template>
    <div class="pPage">
        <div class="home-top">
            <x-header :left-options="{showBack: false}" style="background:#f95377">
                <p class="gindex">{{gTitle}}</p>
                <div class="left" @click="back"></div>
                <div></div>
            </x-header>
        </div>
        <div class="aContainer">
            <div class="rout">
                <router-view></router-view> 
            </div>
        </div>
    </div>
</template>
<script>
import {
    XHeader
} from 'vux/src/components';
export default {
    components: {
        XHeader
    },
    data(){
    	return{
    		gTitle:''
    	}
    },
    route:{
    	data(t){
    		switch (this.$route.name){
    			case 'photos':
    				this.gTitle = "相册";
    				break;
    			case 'examine':
    				this.gTitle = "审核";
    				break;
    			case 'gAction':
    				this.gTitle = "班级活动"
                    break;
                case 'classMessage':
                    this.gTitle = "添加消息推送"
                    break;
                case 'classAction':
                    this.gTitle = "添加活动"
                    break;
    		}
    	}
    },
    methods:{
    	back() {
            window.history.back(-1);
        }
    }
}
</script>
<style scoped>
.pPage {
    display: flex;
    flex-flow: column;
    height: 100%;
    width: 100%;
}

.aContainer {
    display: flex;
    /*指定主轴的伸缩流方向是纵向的*/
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    height: 100%;
}
.gindex{
    font-size: 2rem;
    font-weight: bold;
}
.left {
    position: absolute;
    top: 1rem;
    left: 1.4rem;
    width: 1rem;
    height: 2rem;
    background: url('../assets/back@1x_0.png') no-repeat;
}
</style>
