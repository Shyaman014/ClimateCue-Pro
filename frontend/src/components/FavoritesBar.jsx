import { Star, MapPin, Trash2 } from 'lucide-react';

export default function FavoritesBar({ favorites, onSelectCity, onRemoveFavorite }) {
  if (!favorites || favorites.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-secondary)' }}>
        <Star size={20} color="#f59e0b" />
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>
          No favorite cities saved yet. Bookmark your favorite locations by clicking the ⭐ icon on any weather card!
        </span>
      </div>
    );
  }

  return (
    <div className="glass-panel animate-fade-in" style={{ padding: '1.25rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Star size={18} color="#f59e0b" fill="#f59e0b" />
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, margin: 0 }}>Saved Locations</h3>
      </div>

      <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {favorites.map((fav, idx) => (
          <div
            key={idx}
            className="glass-card"
            style={{
              minWidth: '180px',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '0.5rem',
              cursor: 'pointer',
              position: 'relative',
              background: 'rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--glass-border)'
            }}
            onClick={() => onSelectCity(fav.cityName)}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)', fontWeight: 700, fontSize: '1rem' }}>
                <MapPin size={16} color="var(--accent-color)" />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '110px' }}>
                  {fav.cityName}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(fav.cityName);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '2px',
                  borderRadius: '4px',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                title="Remove from Favorites"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
              <span>{fav.country || 'Global'}</span>
              <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.08)', padding: '2px 6px', borderRadius: '8px' }}>
                Quick View
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
