<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App111111111111111111111111111"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import axios from 'axios'

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  created: function () {

    console.log('home 页面')
    let param = {
      content: {
        username: 'GrandKai',
        password: '123456'
      }
    };
    axios.post("/api/auth/login", param).then(resp => {
      console.log('resp', resp);
    })
  },
  methods: {
  }
}
</script>
