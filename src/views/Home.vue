<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App111111111111111111111111111"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'home',
  components: {
    HelloWorld
  },
  created: function () {
    this.login();
  },
  methods: {

    login() {
      let param = {
        content: {
          username: 'GrandKai',
          password: '123456'
        }
      };

      this.$http.post("/auth/login", param).then(data => {
        this.$message.success(data.message);

        if (200 === data.code) {
          let content = data.content;
          let user = content.user;
          let accessToken = content.accessToken;
          let refreshToken = content.refreshToken;
          sessionStorage.setItem('accessToken', accessToken);
          sessionStorage.setItem('refreshToken', refreshToken);
        }
      });
    }
  }
}
</script>
