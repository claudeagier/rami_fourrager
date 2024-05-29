<template>
  <div>{{ $t(text.key, text.params) }}</div>
</template>
<script>
  export default {
    name: 'VTitle',
    props: {
      text: {
        type: Object,
        default: () => {},
      },
    },
  }
</script>
