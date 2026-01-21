// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

// ** Icons Imports
import DotsVertical from 'mdi-material-ui/DotsVertical'

// ** Custom Components Imports
import ReactApexCharts from 'react-apexcharts';
import { useState, useMemo } from 'react';

const SalesVerview = ({ overview = {} }) => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState('weekly');

  const { weeklySales = [], monthlySales = [], yearlySales = [] } = overview;

  const chartData = {
    weekly: weeklySales,
    monthly: monthlySales,
    yearly: yearlySales
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const options = useMemo(() => ({
    chart: {
      id: 'sales-line-chart',
      toolbar: { show: false },
      animations: { enabled: true },
      zoom: { enabled: false }
    },
    stroke: {
      curve: 'smooth',
      width: 3
    },
    markers: {
      size: 5,
      colors: ['#FF4560'],
      hover: { sizeOffset: 4 }
    },
    tooltip: {
      y: {
        formatter: function (val, opts) {
          const series = opts?.w?.config?.series?.[0]?.data || [];
          const index = opts?.dataPointIndex;
          const prev = series[index - 1] || 0;
          const diff = val - prev;
          const sign = diff > 0 ? '+' : '';
          return `${val} (${sign}${diff})`;
        }
      }
    },
    colors: ['#00E396'],
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 5
    },
    xaxis: {
      categories:
        activeTab === 'yearly'
          ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          : activeTab === 'monthly'
          ? Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
          : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    },
    yaxis: {
      labels: {
        formatter: value => `${value > 999 ? `${(value / 1000).toFixed(0)}k` : value}`
      }
    }
  }), [activeTab, theme]);

  // Calculate percentage change from previous week/month/year
  const getPerformanceText = () => {
    const data = chartData[activeTab];
    if (!data || data.length < 2) return 'Sales performance data is insufficient to evaluate trends.';

    const previous = data[data.length - 2];
    const current = data[data.length - 1];
    const diff = current - previous;
    const percentage = ((diff / previous) * 100).toFixed(1);
    const sign = diff >= 0 ? '+' : '';

    return `Sales have ${diff >= 0 ? 'increased' : 'decreased'} by ${sign}${percentage}% compared to the previous period.`;
  };

  return (
    <Card>
      <CardHeader
        title='Sales Overview'
        titleTypographyProps={{ sx: { lineHeight: '0rem !important', letterSpacing: '0.15px !important' } }}
        action={
          <IconButton size='small' aria-label='settings' className='card-more-options' sx={{ color: 'text.secondary' }}>
            <DotsVertical />
          </IconButton>
        }
      />
      <CardContent>
        <Tabs value={activeTab} onChange={handleTabChange} textColor='primary' indicatorColor='primary' sx={{ mb: 4 }}>
          <Tab value='weekly' label='Weekly' />
          <Tab value='monthly' label='Monthly' />
          <Tab value='yearly' label='Yearly' />
        </Tabs>
        <ReactApexCharts
          type='line'
          height={280}
          options={options}
          series={[{ name: 'Sales', data: chartData[activeTab] || [] }]}
        />
        <Box sx={{ mt: 5, display: 'flex', alignItems: 'center' }}>
          <Typography variant='h5' sx={{ mr: 4 }}>
            {chartData[activeTab]?.length > 1
              ? `${Math.round(((chartData[activeTab].at(-1) - chartData[activeTab].at(-2)) / chartData[activeTab].at(-2)) * 100)}%`
              : 'N/A'}
          </Typography>
          <Typography variant='body2'>{getPerformanceText()}</Typography>
        </Box>
        <Button fullWidth variant='contained'>Details</Button>
      </CardContent>
    </Card>
  );
};

export default SalesVerview;
