// Bootstrap JS
var bootstrap = require('bootstrap');
var Utils = require('./Utils.js');

import Chart from 'chart.js/auto';
import labels from '../data/interest_labels.json';
import datas from '../data/interest_data.json';


const ctx = document.getElementById('interestsOverlapChart');

const DATA_COUNT = 7;
const NUMBER_CFG = {count: DATA_COUNT, min: 0, max: 100};

const data1 = {
  labels: labels,
  datasets: datas,
};

const config1 = {
  type: 'polarArea',
  data: data1,
  options: {},
};

const mConfigs = {
  buildConfig: () => {
    const data = data1;
    const config = config1;
    return config;
  },
}

new Chart(ctx, mConfigs.buildConfig());

