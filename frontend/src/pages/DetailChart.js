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

function DetailChart({cate, ocate}) {
  const [categoryCnt, setCategoryCnt] = useState([])

  const data = ocate.reduce((a, b) => a + b, 0)!==0 ? {
    labels: ['생활용품', '가구', '조명', '데코·식물', '패브릭', '수납·정리', '공구·DIY', '주방용품'],
    datasets: [{
      label: '좋아하는 카테고리',
      data: cate,
      backgroundColor: '#BEAED4',
      boarderColor: 'white'
    },
    {
      label: '오늘의집 찜 목록',
      data: ocate,
      backgroundColor: 'aqua',
      boarderColor: 'white'
    }
    ]
  } :
  {
    labels: ['생활용품', '가구', '조명', '데코·식물', '패브릭', '수납·정리', '공구·DIY', '주방용품'],
    datasets: [{
      label: '카테고리',
      data: cate,
      backgroundColor: '#BEAED4',
      boarderColor: 'white'
    }
    ]
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

export default DetailChart;
