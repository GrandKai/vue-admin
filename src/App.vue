<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        width: 100%;
        height: 100%;
    }

    body, html {
        margin: 0;
        width: 100%;
        height: 100%;
    }

    .el-button {
        margin-right: 5px;
    }

    .btn-groups {
        text-align: left;
        padding-bottom: 1em;
        padding-top: 1em;
    }

</style>
