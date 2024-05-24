<template>
  <div></div>
</template>
<script>
  export default {
    name: 'AnimalProfileModal',
    created() {
      console.log(this.animalProfileList)
    },
    computed: {
      ...mapGetters('referential', {
        animalProfileList: 'animalProfileList',
      }),
    },
  }
</script>
