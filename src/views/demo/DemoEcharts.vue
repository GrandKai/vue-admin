<template>
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <!--<div id="main" style="width: 600px;height:400px;"></div>-->
    <div>
        <echarts id="echarts" width="300px" height="300px" :option="option"></echarts>
    </div>
</template>

<script>
  import Echarts from "@/components/echarts/Echarts.vue";

  export default {
    components: {
      echarts: Echarts
    },
    data() {
      return {
        // 指定图表的配置项和数据
        option: {
          title: {
            text: 'ECharts 入门示例11111122111'
          },
          tooltip: {},
          legend: {
            data: ['销量']
          },
          xAxis: {
            data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
          },
          yAxis: {},
          series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
          }]
        }
      }
    },

    created() {
    },
    mounted() {
      /*// 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('main'));
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(this.option);*/
    }
  }
</script>

<style scoped>

</style>
