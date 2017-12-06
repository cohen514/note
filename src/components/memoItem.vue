<template>
  <div class="memo-container">
    <div class="memo" :data-completed="memo.isCompleted ? 'true' :'false'">
      <div class="mark" @click="markAsDone"></div>
      <div class="memo-heading">
        <h5 class="title">{{memo.title}}</h5>
        <ul class="tools">
          <li class="edit" @click="editMarkdown"></li>
          <li class="delete" @click="deleteMemo"></li>
        </ul>
      </div>
      <h6 class="memo-info">
        <span class="timeStamp">{{memo.timeStamp}}</span>
        <span class="category">分类：{{categories[memo.categoryId]}}</span>
      </h6>
      <div class="content" :data-type="memo.type === 0 ? 'text' : 'doodle'">
        <div v-if="memo.type===0" v-html="marked(memo.content)" class="text"></div>
        <img class="doodle" v-else :src="memo.content">
      </div>
    </div>
  </div>
</template>

<script>
  import storeUtil from '../storage';
  import memoEditor from './memoEditor.vue';

  let store = storeUtil.store;

  export default {
    props:['memo'],
    data(){
      return {
        memos: store.memos,
        categories: {
          1: '工作',
          2: '生活',
          3: '学习'
        }
      }
    },
    methods:{
      marked,
      deleteMemo () {
        if (confirm(`确定删除「${this.memo.title}」吗？此操作不可撤销。`)) {
          store.remove(this.memo);
          store.saveToLocalStorage();
        }
      },
      markAsDone(){
        this.memo.isCompleted = this.memo.isCompleted ? false : true;
        store.saveToLocalStorage();
      },
      editMarkdown (){
        switch (this.memo.type) {
          case 0:
                this.$emit('edit',this.memo);
                break;
          case 1:
                this.$emit('editDoodle',this.memo);
                break;
        }
      }
    }
  }
</script>
