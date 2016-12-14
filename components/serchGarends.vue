<!-- 周边列表 -->
<template>
    <div class="around" v-scroll:bottom="onBottom">
        <div class="around-list" v-for="school in schools " track-by='$index' @click="routes(school)">
            <div id="GardenPic"></div>
            <div class="content">
                <div class="gardenname">{{ school.gardenname }}</div>
                <div class="star">
                    <rater :value=5 :max=5 :font-size=15 active-color="#FF9900" :disabled=true></rater>
                    <div class="dec" v-show="(school.coord+'').length<5">距离:{{ school.coord }}米</div>
                </div>
                <div class="gardenAddress" id="{{id}}">地址:{{ school.adname }}{{school.site}}</div>
            </div>
        </div>
    </div>
    <toast :show.sync="show2" width="50%" type="text">
        <p style="text-align:center; color:#fff;">亲！没有更多数据了</p>
    </toast>
</template>

<script>
import {
    Rater,
    Toast
} from 'vux/src/components'
export default {
    components: {
        Rater,
        Toast
    },
    data() {
        return {
            show2: false
        }
    },
    vuex:{
        getters:{
            schools: state => state.slectgardens
        }
    },
    methods: {
        // 进入学校看详情页
        routes(school){
            // 将学校信息 保存在 store 里
            this.$store.dispatch('NAME',school.gardenname);
            this.$router.go('/detail/'+school.id);
        },
        onBottom(){
            this.show2 = true;
        }
    }
}
</script>


<style scoped>
.around {
    height: 100%;
    overflow: auto;
    margin-bottom: 13.5rem;
}

.around-list {
    display: flex;
    flex-flow: row;
    line-height: 1.2rem;
    padding: .8rem;
    margin-top: .5rem;
    background: #fff;
    border-bottom: 1px solid #b6b6b6;
}

#GardenPic {
    width: 10rem;
    height: 5rem;
    background-color: pink;
    display: inline-block;
    margin: .3rem;
    background: url('../assets/around_pic@1x_0.png');
}

.star {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.dec {
    color: #c88570;
    font-size: 1.25rem;
}

.list {
    display: flex;
    flex-flow: column;
    flex: 1;
}

.gardenAddress,
.coord {
    font-family: '冬青黑体简体中文 W3';
    font-size: 1rem;
    color: #999;
}

.gardenname {
    font-size: 1.2rem;
    font-weight: bold;
    color: #333333;
}

.gardenname,
.gardenAddress,
.coord,
.star {
    padding: .4rem;
}

.content {
    width: 60%;
    display: flex;
    padding: .2rem;
    flex-flow: column wrap;
    justify-content: space-around;
    align-items: baseline;
    flex-grow: 1;
}
</style>
