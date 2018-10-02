<template>
    <div>
        <custom-page>
            111111111
        </custom-page>

        <div class="line"></div>
        <tree>
            22222222
        </tree>
    </div>
</template>

<script>
    import Tree from 'components/business/tree/Index';
    import CustomPage from 'components/listCustomPage/Index'
    export default {
        components: {
            'tree': Tree,
            'custom-page': CustomPage,
        }
    }
</script>

<style scoped>


    .line {
        width: 1px;
        min-height: 500px;
        float: right;
        /*background-color: #f0f0f0;*/
        background-color: red;
    }
</style>