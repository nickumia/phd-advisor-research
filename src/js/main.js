// Bootstrap JS
var bootstrap = require('bootstrap');
var Utils = require('./Utils.js');

import Chart from 'chart.js/auto';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import datas from '../data/interests.json';
import cdatas from '../data/connected_interests.json';
import cdata_x_names from '../data/connected_interests_x.json';
import cdata_y_topics from '../data/connected_interests_y.json';

Chart.register(MatrixController, MatrixElement);
const ctx_interests_aggregate = document.getElementById('interestsOverlapChart');
const ctx_interests_individual = document.getElementById('interestsMatrixChart');

console.log(cdata_x_names);
console.log(cdata_y_topics);

const config_aggregate = {
  type: 'polarArea',
  data: datas,
  options: {},
};


// <block:cdata_helper:2>
const cdata_helper = {
  datasets: [{
    label: 'Connected Interests',
    data: cdatas,
    borderColor: 'rgba(0,0,0,0.5)',
    backgroundColor: 'rgba(200,200,0,0.3)',
    borderWidth: 1,
    width: ({chart}) => (chart.chartArea || {}).width / 57 - 1,
    height: ({chart}) =>(chart.chartArea || {}).height / 45 - 1
  }]
};
// </block:cdata_helper>

const config_individual = {
  type: 'matrix',
  data: cdata_helper,
  options: {
    plugins: {
      legend: false,
      tooltip: {
        callbacks: {
          title() {
            return '';
          },
          label(context) {
            const v = context.dataset.data[context.dataIndex];
            return ['x: ' + v.x, 'y: ' + v.y];
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        labels: cdata_x_names,
        offset: false,
        ticks: {
          display: true,
          autoSkip: false
        },
        grid: {
          display: true
        }
      },
      y: {
        type: 'category',
        labels: cdata_y_topics,
        offset: false,
        ticks: {
          display: true,
          autoSkip: false
        },
        grid: {
          display: false
        }
      }
    }
  }
};



const mConfigsAggregate = {
  buildConfig: () => {
    const data = datas;
    const config = config_aggregate;
    return config;
  },
}

const mConfigsIndividual = {
  buildConfig: () => {
    const data = cdata_helper;
    const config = config_individual;
    return config;
  },
}



new Chart(ctx_interests_aggregate, mConfigsAggregate.buildConfig());
new Chart(ctx_interests_individual, config_individual);
