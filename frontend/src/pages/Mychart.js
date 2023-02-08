import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale
} from 'chart.js';
import { useState, useEffect } from 'react';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  RadialLinearScale
)

function Mychart() {
  const [categoryCnt, setCategoryCnt] = useState({})




  const data = {
    labels: ["가구",
    "주방용품",
    "수납·정리",
    "생활용품",
    "패브릭",
    "공구·DIY",
    "데코·식물",
    "조명"],
    datasets: [{
      label: '카테고리',
      data: [3, 6, 9],
      backgroundColor: '#BEAED4',
      boarderColor: 'white'
    }]
  }

  const options = {

  }

  // const response = axios.get
  return (
    <div style = { { width: '500px', padding: '20px' } }>
        <Radar
        data = {data}
        options = {options}
        >
        </Radar>
    </div>
  );
}

export default Mychart;
