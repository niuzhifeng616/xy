<template>
  <div>
    <Editor ref="editor"
      v-model="msg"
      :disabled="disabled" />
      <div style="margin-top:20px;">
        <Button class="xy-primary" @click="clear">清空内容</Button>
        <Button class="xy-danger" @click="disabled = !disabled">禁用/启用</Button>
    </div>
    <div style="margin-top:20px;">下面展示的是需要传给后端的内容（保存的时候直接获取this.msg传给后端即可）：</div>
    <div style="width:100%;">{{msg}}</div>
  </div>
</template>

<script>
  import Editor from '@/components/editor/Editor.vue'
  export default {
    name: 'editorDemo',
    components: {
      Editor
    },
    data () {
      return {
        disabled: false,
        msg: ''
      }
    },
    methods: {
      // 清空内容
      clear () {
        this.$refs.editor.clear()
      }
    }
  }
</script>
