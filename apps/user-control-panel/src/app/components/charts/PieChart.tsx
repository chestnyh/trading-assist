import React from "react";
import ReactApexChart from "react-apexcharts";

interface PieChartProps {
  chartData: any[];
  chartOptions: any;
  h?: string;
  w?: string;
}

interface PieChartState {
  chartData: any[];
  chartOptions: any;
}

class PieChart extends React.Component<PieChartProps, PieChartState> {
  constructor(props: PieChartProps) {
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
        type='pie'
        width='100%'
        height='55%'
      />
    );
  }
}

export default PieChart;
