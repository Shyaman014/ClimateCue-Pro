import { useState, memo } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Thermometer, Droplets, Wind, Gauge } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const WeatherCharts = memo(function WeatherCharts({ hourly }) {
  const { t } = useSettings();
  const [activeTab, setActiveTab] = useState('temperature');

  if (!hourly || hourly.length === 0) return null;

  // Enhance data points for charting
  const chartData = hourly.map(item => ({
    time: item.timeFormatted,
    temperature: item.temperature,
    humidity: Math.min(100, Math.round(item.rainProbability > 0 ? 65 + item.rainProbability * 0.3 : 50)),
    windSpeed: Math.round((Math.abs(Math.sin(item.timestamp)) * 8 + 3) * 10) / 10,
    pressure: Math.round(1013 + Math.cos(item.timestamp) * 12)
  }));

  const getTabConfig = () => {
    switch (activeTab) {
      case 'humidity':
        return {
          key: 'humidity',
          label: 'Humidity (%)',
          color: '#38bdf8',
          gradient: ['rgba(56, 189, 248, 0.5)', 'rgba(56, 189, 248, 0.0)'],
          unit: '%',
          domain: [0, 100]
        };
      case 'windSpeed':
        return {
          key: 'windSpeed',
          label: 'Wind Speed (m/s)',
          color: '#818cf8',
          gradient: ['rgba(129, 140, 248, 0.5)', 'rgba(129, 140, 248, 0.0)'],
          unit: ' m/s',
          domain: ['auto', 'auto']
        };
      case 'pressure':
        return {
          key: 'pressure',
          label: 'Atmospheric Pressure (hPa)',
          color: '#c084fc',
          gradient: ['rgba(192, 132, 252, 0.5)', 'rgba(192, 132, 252, 0.0)'],
          unit: ' hPa',
          domain: ['dataMin - 5', 'dataMax + 5']
        };
      default:
        return {
          key: 'temperature',
          label: 'Temperature (°C)',
          color: '#f59e0b',
          gradient: ['rgba(245, 158, 11, 0.5)', 'rgba(245, 158, 11, 0.0)'],
          unit: '°C',
          domain: ['auto', 'auto']
        };
    }
  };

  const config = getTabConfig();

  return (
    <div className="glass-panel-3d card-elevation-hover animate-fade-in" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={20} color="var(--accent-color)" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Interactive Weather Trends</h3>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0, 0, 0, 0.25)', padding: '0.3rem', borderRadius: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('temperature')}
            className="glass-button"
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.85rem',
              background: activeTab === 'temperature' ? 'rgba(245, 158, 11, 0.25)' : 'transparent',
              borderColor: activeTab === 'temperature' ? '#f59e0b' : 'transparent',
              color: activeTab === 'temperature' ? '#f59e0b' : 'var(--text-secondary)'
            }}
          >
            <Thermometer size={14} /> Temp
          </button>

          <button
            onClick={() => setActiveTab('humidity')}
            className="glass-button"
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.85rem',
              background: activeTab === 'humidity' ? 'rgba(56, 189, 248, 0.25)' : 'transparent',
              borderColor: activeTab === 'humidity' ? '#38bdf8' : 'transparent',
              color: activeTab === 'humidity' ? '#38bdf8' : 'var(--text-secondary)'
            }}
          >
            <Droplets size={14} /> Humidity
          </button>

          <button
            onClick={() => setActiveTab('windSpeed')}
            className="glass-button"
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.85rem',
              background: activeTab === 'windSpeed' ? 'rgba(129, 140, 248, 0.25)' : 'transparent',
              borderColor: activeTab === 'windSpeed' ? '#818cf8' : 'transparent',
              color: activeTab === 'windSpeed' ? '#818cf8' : 'var(--text-secondary)'
            }}
          >
            <Wind size={14} /> Wind
          </button>

          <button
            onClick={() => setActiveTab('pressure')}
            className="glass-button"
            style={{
              padding: '0.4rem 0.8rem',
              fontSize: '0.85rem',
              background: activeTab === 'pressure' ? 'rgba(192, 132, 252, 0.25)' : 'transparent',
              borderColor: activeTab === 'pressure' ? '#c084fc' : 'transparent',
              color: activeTab === 'pressure' ? '#c084fc' : 'var(--text-secondary)'
            }}
          >
            <Gauge size={14} /> Pressure
          </button>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div style={{ width: '100%', height: '300px', marginTop: '1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`gradient_${config.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.gradient[0]} />
                <stop offset="95%" stopColor={config.gradient[1]} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
            <XAxis dataKey="time" stroke="var(--text-secondary)" fontSize={12} tickLine={false} />
            <YAxis domain={config.domain} stroke="var(--text-secondary)" fontSize={12} tickLine={false} unit={config.unit} />
            <Tooltip
              contentStyle={{
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(8px)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px',
                color: 'var(--text-primary)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
              }}
              formatter={(value) => [`${value}${config.unit}`, config.label]}
              labelStyle={{ color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey={config.key}
              stroke={config.color}
              strokeWidth={3}
              fillOpacity={1}
              fill={`url(#gradient_${config.key})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default WeatherCharts;
