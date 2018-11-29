<template>
    <div>
        <cropper></cropper>
    </div>
</template>

<script>
  import Cropper from 'components/cropper/Cropper.vue';
  export default {
    components: {
      Cropper
    },
    data() {
      return {};
    },
    methods: {

    },
    mounted() {
      console.log('mounted');
    }
  }
</script>

<style scoped>

</style>
