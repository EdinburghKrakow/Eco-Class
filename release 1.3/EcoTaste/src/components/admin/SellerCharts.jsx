import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function SellerCharts({ dailySales, topProducts, totalRevenue }) {
  console.log('SellerCharts получил dailySales:', dailySales);

  const dailyChartData = {
    labels: dailySales.map((item) => item.date),
    datasets: [
      {
        label: 'Выручка по дням (₽)',
        data: dailySales.map((item) => item.total),
        backgroundColor: '#4caf50',
      },
    ],
  };

  const barChartData = {
    labels: topProducts.map((item) => item.name),
    datasets: [
      {
        label: 'Продано (шт.)',
        data: topProducts.map((item) => item.total_qty),
        backgroundColor: '#2196f3',
      },
    ],
  };

  return (
    <div className="seller-charts" style={{ padding: '20px' }}>
      <h2>Аналитика продавца</h2>

      <div style={{ marginBottom: '40px' }}>
        <h3>Общая выручка: {Number(totalRevenue).toFixed(2)} ₽</h3>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        <div style={{ flex: '1 1 400px' }}>
          <h3>Продажи по дням (столбцы)</h3>
          {dailySales.length > 0 ? (
            <Bar data={dailyChartData} />
          ) : (
            <p>Нет данных</p>
          )}
        </div>

        <div style={{ flex: '1 1 400px' }}>
          <h3>Топ-5 товаров</h3>
          {topProducts.length > 0 ? (
            <Bar data={barChartData} />
          ) : (
            <p>Нет данных</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SellerCharts;
