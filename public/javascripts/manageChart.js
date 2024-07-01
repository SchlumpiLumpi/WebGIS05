"use strict"

// rendering the temperature chart
async function drawChart(data){
    const ctx = document.getElementById('chart1')
    
    let tempData= await mergeWeatherData(data)
    //sort temperatures in ascending order  
    let sortby = (a, b) => a.temp - b.temp //sort in ascending order, feedback from exercise 1
    tempData = tempData.sort(sortby)

    console.log("draw Chart: ",tempData)

    let label_list = []
    let data_list = []
    //auto labeling for 2dim data
    for (let i = 0; i < tempData.length; i++) {
        label_list.push(tempData[i].cityName)
        data_list.push(tempData[i].temp)
    }
    let minDataValue = Math.min(tempData);
    let maxDataValue = Math.max(tempData);

    let myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: label_list,
            datasets: [{
                label: 'Temperature [°C]',
                data: data_list,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    suggestedMin:minDataValue,
                    suggestedMax:maxDataValue,
                }
            }
        }
    });
}

//get cities from chart.pug
drawChart(cities)