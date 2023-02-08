import { PieChart } from 'react-minimal-pie-chart';

function MyChart(props) {
    const x = parseInt(props.avg * 100);

    return (
        <PieChart
        data={[{
            value: x,
            color: '#BEAED4',
            title: 'positive'
        }]}
        reveal={x}
        lineWidth={18}
        rounded
        animate
        label={({dataEntry}) => dataEntry.value + '%'}/>
    )
}

export default MyChart;