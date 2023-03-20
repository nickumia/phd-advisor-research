// Global Imports
var bootstrap = require('bootstrap');
import Chart from 'chart.js/auto';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
Chart.register(MatrixController, MatrixElement);

import datas from '../data/interests.json';
import cdatas from '../data/connected_interests.json';


// Polar Chart showing frequency of topics
const config_aggregate = {
  type: 'polarArea',
  data: datas,
  options: {},
};


// Matrix Chart showing connections between topic + faculty
const config_individual = {
  type: 'matrix',
  data: {
    datasets: [{
      label: 'Connected Interests',
      data: cdatas.connections,
      borderColor: 'rgba(0,0,0,0.5)',
      backgroundColor: 'rgba(200,200,0,0.3)',
      borderWidth: 1,
      width: ({chart}) => (chart.chartArea || {}).width / 57 - 1,
      height: ({chart}) =>(chart.chartArea || {}).height / 45 - 1
    }]
  },
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
        labels: cdatas.names,
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
        labels: cdatas.topics,
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


const ctx_interests_aggregate = document.getElementById('interestsOverlapChart');
const ctx_interests_individual = document.getElementById('interestsMatrixChart');

new Chart(ctx_interests_aggregate, config_aggregate);
new Chart(ctx_interests_individual, config_individual);
