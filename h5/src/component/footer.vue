<template>
  <div class="footer-cont">
    <ul class="footer">
      <router-link tag="li" :active="$props.curNav === index+1" class="item" v-for="(item, index) in list" :key="index" :to="item.link">
        <span class="icon" :style="{backgroundImage: `url(${ $props.curNav === index+1 ? item.iconAct :item.icon})`}"></span>
        <span>{{item.title}}</span>
      </router-link>
      <!-- <li class="item" v-for="(item, index) in list " :key="index" >
      </li> -->
    </ul>
  </div>
</template>

<script>
const navHome = require('../assets/nav-home.png');
const navHomeCur = require('../assets/nav-home-cur.png');
const navList = require('../assets/nav-list.png');
const navListCur = require('../assets/nav-list-cur.png');
const navMine = require('../assets/nav-mine.png');
const navMineCur = require('../assets/nav-mine-cur.png');

export default {
  props: {
    curNav: {
      type: [Number],
      default: 1
    }
  },
  data() {
    return {
      list:[
        {
          icon: navHome,
          iconAct: navHomeCur,
          title: '首页',
          link: '/home'
        },
        {
          icon: navList,
          iconAct: navListCur,
          title: '已申报',
          link: '/apply'
        },
        {
          icon: navMine,
          iconAct: navMineCur,
          title: '我的',
          link: '/i'
        }
      ]
    }
  },
}
</script>

<style lang="less">
body {
  padding-bottom: 130px!important;
}
</style>

<style lang="less" scoped>
.footer-cont {
  position: fixed;
  bottom: 0;
  left: 0;
  box-shadow:0px -1px 0px 0px rgba(238,238,238,1);

  .footer {
    width: 750px;
    background: #fff;
    height: 98px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: center;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    font-weight:500;
    color:rgba(102,102,102,1);
    
    .item {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      cursor: pointer;

      &[active='true'] {
        color: #ff8245;
      }
    }

    .icon {
      height: 48px;
      width: 48px;
      display: inline-block;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
}
</style>