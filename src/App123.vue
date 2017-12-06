<template>
  <div id="vue-memo">
    <nav class="navbar navbar-default navbar-fixed-top">
      <div class="container">
        <div class="navbar-header">
          <a class="navbar-brand">vue-memo</a>
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse" aria-expanded="false">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
        </div>
        <div class="collapse navbar-collapse navbar-right">
          <ul class="nav navbar-nav">
            <li class="add dropdown">
              <a class="create-new dropdown-toggle" data-toggle="dropdown">新建</a>
              <ul class="dropdown-menu">
                <li @click="createMarkdown">
                  <a>Markdown</a>
                </li>
                <li @click="createDoodle">
                  <a>涂鸦</a>
                </li>
              </ul>
            </li>
            <li class="categories dropdown">
              <a class="current-category dropdown-toggle" data-toggle="dropdown">
                {{categories[currentCategoryId]}}
                <span class="count badge">{{memosFiltered.length}}</span>
              </a>
              <ul class="dropdown-menu">
                <li class="total" @click="filterBy(0,queryString)">
                  <a>全部
                    <span class="count badge">{{memos.length}}</span>
                  </a>
                </li>
                <li class="divider"></li>
                <li @click="filterBy(1,queryString)">
                  <a>工作
                    <span class="count badge">{{ memosInWorkCate.length }}</span>
                  </a>
                </li>
                <li @click="filterBy(2,queryString)">
                  <a>生活
                    <span class="count badge">{{memosInLivingCate.length}}</span>
                  </a>
                </li>
                <li @click="filterBy(3,queryString)">
                  <a>学习
                    <span class="count badge">{{memosInStudyCate.length}}</span>
                  </a>
                </li>
              </ul>
            </li>
            <li class="sort-by dropdown">
              <a class="dropdown-toggle" data-toggle="dropdown">
                {{currentSortBy}}
              </a>
              <ul class="dropdown-menu">
                <li @click="sortByTimeOrTitle('title')">
                  <a>按标题排序</a>
                </li>
                <li @click="sortByTimeOrTitle('timeStamp')">
                  <a>按创建时间排序</a>
                </li>
              </ul>
            </li>
            <li>
              <input type="text" class="search-box form-control" placeholder="过滤标题、内容。时间戳" v-model="queryString" @keyup="filterBy(currentCategoryId,queryString)">
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div id="memos" class="container">
      <memo-item @edit="editMarkdown" @editDoodle="editDoodle" :key="index" v-for="(memo,index) in memosFiltered" :memo="memo"></memo-item>
    </div>
    <memo-editor ref="editor"></memo-editor>
    <div>123</div>
  </div>

</template>

<script>
  import helpers from './helpers';
  import storeUtil from './storage';
  import memoItem from './components/memoItem.vue';
  import memoEditor from './components/memoEditor.vue';

  let store = storeUtil.store;
  let Memo = storeUtil.Memo;

  export default {
    data(){
      return {
        memos:store.memos,
        memosFiltered:[],
        currentSortBy:'',
        currentCategoryId:'',
        queryString:'',
        categories:{
          0:'全部',
          1:'工作',
          2:'生活',
          3:'学习'
        },
        helpers
      }
    },
    components: {
      memoItem,
      memoEditor
    },
    methods:{
//      $dispatch(componentName, eventName, params) {
//        var parent = this.$parent || this.$root;
//        var name = parent.$options.componentName;
//
//        //寻找父级，如果父级不是符合的组件名，则循环向上查找
//        while (parent && (!name || name !== componentName)) {
//          parent = parent.$parent;
//
//          if (parent) {
//            name = parent.$options.componentName;
//          }
//        }
//        //找到符合组件名称的父级后，触发其事件。整体流程类似jQuery的closest方法
//        if (parent) {
//          parent.$emit.apply(parent, [eventName].concat(params));
//        }
//      },

      filterBy(categoryId,queryString){
        let result = [];
        switch (categoryId) {
          case 0:
                result = this.memos;
                this.currentCategoryId = 0;
                break;
          case 1:
                result = this.memosInWorkCate;
                this.currentCategoryId = 1;
                break;
          case 2:
                result = this.memosInLivingCate;
                this.currentCategoryId = 2;
                break;
          case 3:
                result = this.memosInStudyCate;
                this.currentCategoryId = 3;
                break;
        }
        if (queryString !== '') {
          result = result.filter((item) => {
              let matchesQuery = false;
          if (item.title.indexOf(queryString) !== -1 || item.timeStamp.indexOf(queryString) !== -1) {
            matchesQuery = true;
          }
          if (item.type === 0 && item.content.indexOf(queryString) !== -1) {
            matchesQuery = true;
          }
          // 则过滤之
          return matchesQuery;
        });
        }
        this.memosFiltered = result;
        this.sortByTimeOrTitle('title');
      },

      sortByTimeOrTitle(option){
        this.memosFiltered.sort((m1,m2) =>{
          if(m1[option]<m2[option]){
          return -1
        } else {
          return 1
        }
        });
        this.currentSortBy = option === 'timeStamp' ? '按创建时间排序' : '按标题排序';
      },
      createMarkdown(){
        this.$refs.editor.createMarkdown();
      },
      createDoodle(){
        this.$refs.editor.createDoodle();
      },
      editMarkdown(memo){
        this.$refs.editor.editMarkdown(memo);
      },
      editDoodle(memo){
        this.$refs.editor.editDoodle(memo);
      }
    },
    computed:{
      memosInWorkCate () {
        return this.memos.filter((item)=>{
            return item.categoryId === 1
          })
      },
      memosInLivingCate(){
        return this.memos.filter((item)=>{
            return item.categoryId === 2
          })
      },
      memosInStudyCate(){
        return this.memos.filter((item)=>{
            return item.categoryId === 3
          })
      }
    },
    mounted(){
      this.filterBy(0,this.queryString);
      this.sortByTimeOrTitle('title');
    },
    watch: {
      memosFiltered () {
        helpers.resizeMemos();
      }
    }
  }
</script>

<style lang="stylus">
  @import './style/main'
</style>
