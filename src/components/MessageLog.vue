<template>
  <div class="message-log">
    <div v-for="(message, index) in messages" :class="message.style" class="panel">
      <div class="panel-heading">
        {{ message.header }}
        <a class="close" :data-index="index" v-on:click="hideMessage">x</a>
      </div>
      <div class="panel-body">
        <p>
          {{ message.body }}
        </p>
        <p v-if="message.link">
          <a :href="message.link">{{ message.link }}</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['messages'],
    methods: {
      hideMessage: function (caller) {
        this.$emit('messageRemoved', caller.target.getAttribute('data-index'))
      }
    }
  }
</script>

<style scoped>
  div.panel {
    margin-top: 20px;
  }
</style>
