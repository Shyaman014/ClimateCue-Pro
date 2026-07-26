export default function SkeletonLoader() {
  return (
    <div className="animate-fade-in" role="status" aria-label="Loading weather data..." aria-busy="true" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      
      {/* Hero Card Skeleton */}
      <div className="glass-panel" style={{ padding: '2rem', height: '280px', display: 'flex', flexDirection: 'column', justify: 'space-between' }}>
        <div style={{ display: 'flex', justify: 'space-between' }}>
          <div className="skeleton" style={{ width: '220px', height: '36px' }} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '12px' }} />
            <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '12px' }} />
            <div className="skeleton" style={{ width: '36px', height: '36px', borderRadius: '12px' }} />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div className="skeleton" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
          <div>
            <div className="skeleton" style={{ width: '160px', height: '54px', marginBottom: '0.5rem' }} />
            <div className="skeleton" style={{ width: '120px', height: '24px' }} />
          </div>
        </div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="skeleton" style={{ width: '180px', height: '24px', marginBottom: '1rem' }} />
        <div style={{ display: 'flex', gap: '1rem', overflow: 'hidden' }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="skeleton" style={{ width: '125px', height: '140px', flex: '0 0 auto', borderRadius: '16px' }} />
          ))}
        </div>
      </div>

      {/* Advanced Metrics Grid Skeleton */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="glass-panel skeleton" style={{ height: '160px', borderRadius: '16px' }} />
        ))}
      </div>

    </div>
  );
}
