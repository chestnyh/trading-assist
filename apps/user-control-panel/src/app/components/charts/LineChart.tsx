import React from "react";
import ReactApexChart from "react-apexcharts";

interface LineChartProps {
  chartData: any[];
  chartOptions: any;
}

interface LineChartState {
  chartData: any[];
  chartOptions: any;
}

class LineChart extends React.Component<LineChartProps, LineChartState> {
  constructor(props: LineChartProps) {
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
      <ReactApexChart
        options={this.state.chartOptions}
        series={this.state.chartData}
        type='line'
        width='100%'
        height='100%'
      />
    );
  }
}

export default LineChart;
