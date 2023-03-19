// Bootstrap JS
var bootstrap = require('bootstrap');
var Utils = require('./Utils.js');

import Chart from 'chart.js/auto';
import datas from '../data/interests.json';
import cdatas from '../data/connected_interests.json';


const ctx_interests_aggregate = document.getElementById('interestsOverlapChart');
const ctx_interests_individual = document.getElementById('interestsPieChart');

const config_aggregate = {
  type: 'polarArea',
  data: datas,
  options: {},
};

const config_individual = {
  type: 'pie',
  data: cdatas,
  options: {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          generateLabels: function(chart) {
            // Get the default label list
            const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;
            const labelsOriginal = original.call(this, chart);

            // Build an array of colors used in the datasets of the chart
            let datasetColors = chart.data.datasets.map(function(e) {
              return e.backgroundColor;
            });
            datasetColors = datasetColors.flat();

            // Modify the color and hide state of each label
            labelsOriginal.forEach(label => {
              // There are twice as many labels as there are datasets. This converts the label index into the corresponding dataset index
              label.datasetIndex = (label.index - label.index % 2) / 2;

              // The hidden state must match the dataset's hidden state
              label.hidden = !chart.isDatasetVisible(label.datasetIndex);

              // Change the color to match the dataset
              label.fillStyle = datasetColors[label.index];
            });

            return labelsOriginal;
          }
        },
        onClick: function(mouseEvent, legendItem, legend) {
          // toggle the visibility of the dataset from what it currently is
          legend.chart.getDatasetMeta(
            legendItem.datasetIndex
          ).hidden = legend.chart.isDatasetVisible(legendItem.datasetIndex);
          legend.chart.update();
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const labelIndex = (context.datasetIndex * 2) + context.dataIndex;
            return context.chart.data.labels[labelIndex] + ': ' + context.formattedValue;
          }
        }
      }
    }
  },
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
    const data = cdatas;
    const config = config_individual;
    return config;
  },
}

new Chart(ctx_interests_aggregate, mConfigsAggregate.buildConfig());
new Chart(ctx_interests_individual, mConfigsIndividual.buildConfig());
