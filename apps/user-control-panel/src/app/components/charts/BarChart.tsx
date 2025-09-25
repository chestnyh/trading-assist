import { Component } from "react";
import Chart from "react-apexcharts";

interface BarChartProps {
  chartData: any[];
  chartOptions: any;
}

interface BarChartState {
  chartData: any[];
  chartOptions: any;
}

class ColumnChart extends Component<BarChartProps, BarChartState> {
  constructor(props: BarChartProps) {
    super(props);
    this.state = {
      chartData: [],
      chartOptions: {},
    };
  }

  componentDidMount() {
    this.setState({
      chartData: this.props.chartData,
      chartOptions: this.props.chartOptions,
    });
  }

  render() {
    return (
      <Chart
        options={this.state.chartOptions}
        series={this.state.chartData}
        type='bar'
        width='100%'
        height='100%'
      />
    );
  }
}

export default ColumnChart;
