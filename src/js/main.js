// Bootstrap JS
var bootstrap = require('bootstrap');
var Utils = require('./Utils.js');

import Chart from 'chart.js/auto';



const ctx = document.getElementById('interestsOverlapChart');

const DATA_COUNT = 7;
const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

const labels = Utils.months({count: 7});
const data1 = {
  labels: labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: Utils.numbers(NUMBER_CFG),
      borderColor: Utils.CHART_COLORS.red,
      backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
    },
    {
      label: 'Dataset 2',
      data: Utils.numbers(NUMBER_CFG),
      borderColor: Utils.CHART_COLORS.blue,
      backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
    }
  ]
};

const config1 = {
  type: 'radar',
  data: data1,
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Chart.js Radar Chart'
      }
    }
  },
};

const mConfigs = {
  buildConfig: () => {
    const data = data1;
    const config = config1;
    return config;
  },
}

new Chart(ctx, mConfigs.buildConfig());

