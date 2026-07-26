import { AlertCircle, MapPinOff, Search, WifiOff, RefreshCw } from 'lucide-react';

export default function ErrorDisplay({ error, onRetry, onReset }) {
  if (!error) return null;

  const getErrorConfig = () => {
    const errLower = (error || '').toLowerCase();
    if (errLower.includes('city not found') || (errLower.includes('not found') && errLower.includes('city'))) {
      return {
        title: 'City Not Found',
        message: error || "We couldn't find weather data for that city or coordinate. Please check the spelling or try searching for a nearby major city.",
        icon: <Search size={48} color="#f59e0b" />,
        actionText: 'Search Another City'
      };
    }
    if (errLower.includes('permission') || errLower.includes('denied') || (errLower.includes('location') && errLower.includes('access'))) {
      return {
        title: 'Location Access Denied',
        message: error || 'Your browser denied location permissions. You can enable geolocation in your browser settings or search for your city manually above.',
        icon: <MapPinOff size={48} color="#ef4444" />,
        actionText: 'Search Manually'
      };
    }
    if (errLower.includes('network') || errLower.includes('fetch') || errLower.includes('failed') || errLower.includes('connect')) {
      return {
        title: 'Connection or API Error',
        message: error || 'Unable to connect to the ClimateCue backend servers. Please check if the Spring Boot server is running on port 8081.',
        icon: <WifiOff size={48} color="#38bdf8" />,
        actionText: 'Retry Connection'
      };
    }
    return {
      title: 'Weather Request Error',
      message: error || 'An unexpected error occurred while fetching weather data.',
      icon: <AlertCircle size={48} color="#ef4444" />,
      actionText: 'Try Again'
    };
  };

  const config = getErrorConfig();

  return (
    <div className="glass-panel animate-fade-in" role="alert" aria-live="assertive" style={{
      padding: '3rem 2rem',
      maxWidth: '600px',
      margin: '2rem auto',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '1.25rem',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      background: 'rgba(15, 23, 42, 0.85)'
    }}>
      <div style={{
        padding: '1.25rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '50%',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
      }}>
        {config.icon}
      </div>

      <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>{config.title}</h2>
      
      <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '480px' }}>
        {config.message}
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <button
          onClick={onRetry || onReset}
          className="btn-primary"
          style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <RefreshCw size={18} />
          <span>{config.actionText}</span>
        </button>
      </div>
    </div>
  );
}
