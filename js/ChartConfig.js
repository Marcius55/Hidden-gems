const labels = ['Nature', 'Urban', 'Trails', 'Culture', 'Art', 'Ruins'];
const data = {
  labels: labels,
  datasets: [{
    data: [1.5, 2.5, 2, 2.8, 4, 2.9], // Approximate values from the image
    fill: false,
    backgroundColor: [
      '#414a6b' // Dark blue color from the image
    ],
    borderColor: [
      '#414a6b' // Match border color to background if desired, or remove
    ],
    borderWidth: 0 // No border visible in the image
  }]
};

const config = {
  type: 'bar',
  data,
  options: {
    indexAxis: 'x', // Vertical bar chart
    scales: {
      y: {
        title: {
          display: true,
          text: 'Sustainability score'
        },
        min: 0,
        max: 10,
        ticks: {
            stepSize: 2
        }
      }
    }
  }
};

module.exports = {
  actions: [],
  config: config,
}; 