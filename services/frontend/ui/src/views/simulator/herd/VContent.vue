<template>
  <p>{{ content }}</p>
</template>
<script>
  export default {
    props: {
      content: {
        type: String,
        default: '',
      },
    },
    name: 'VContent',
  }
</script>
