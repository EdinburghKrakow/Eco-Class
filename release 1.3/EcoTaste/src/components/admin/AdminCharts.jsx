import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function AdminCharts({ dailySales, topProducts, deliveryStats, pickupStats, totalRevenue }) {
  // Данные для столбчатой диаграммы "Продажи по дням"
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

  // Данные для столбчатой диаграммы "Топ-5 товаров"
  const barChartData = {
    labels: topProducts.slice(0, 5).map((item) => item.name),
    datasets: [
      {
        label: 'Продано (шт.)',
        data: topProducts.slice(0, 5).map((item) => item.quantity),
        backgroundColor: '#2196f3',
      },
    ],
  };

  // Данные для круговой диаграммы "Доставка / Самовывоз"
  const pieChartData = {
    labels: ['Доставка', 'Самовывоз'],
    datasets: [
      {
        data: [deliveryStats?.countPercent || 0, pickupStats?.countPercent || 0],
        backgroundColor: ['#ff6384', '#36a2eb'],
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Аналитика продаж (админ)</h2>
      <div style={{ marginBottom: '40px' }}>
        <h3>Общая выручка: {Number(totalRevenue).toFixed(2)} ₽</h3>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        <div style={{ flex: '1 1 400px' }}>
          <h3>Продажи по дням</h3>
          {dailySales.length > 0 ? <Bar data={dailyChartData} /> : <p>Нет данных</p>}
        </div>
        <div style={{ flex: '1 1 400px' }}>
          <h3>Топ-5 товаров</h3>
          {topProducts.length > 0 ? <Bar data={barChartData} /> : <p>Нет данных</p>}
        </div>
        <div style={{ flex: '1 1 300px' }}>
          <h3>Самовывоз / Доставка</h3>
          {pickupStats?.countPercent !== undefined || deliveryStats?.countPercent !== undefined ? (
            <Pie data={pieChartData} />
          ) : (
            <p>Нет данных</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCharts;
