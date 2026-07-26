import { useState, useRef, memo } from 'react';
import { Star, Share2, Copy, Download, Camera, AlertTriangle, MapPin, Calendar, Clock } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useSettings } from '../context/SettingsContext';
import { formatTemp, formatWind } from '../utils/unitUtils';

const CurrentWeatherCard = memo(function CurrentWeatherCard({ weather, isFavorite, onToggleFavorite, onShowToast }) {
  const { tempUnit, windUnit, animations, t } = useSettings();
  const cardRef = useRef(null);
  const [exporting, setExporting] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  if (!weather) return null;

  const formattedTemp = formatTemp(weather.temperature, tempUnit);
  const formattedFeelsLike = formatTemp(weather.feelsLike, tempUnit);
  const formattedWind = formatWind(weather.windSpeed, windUnit);
  const formattedGust = formatWind(weather.windGust || weather.windSpeed, windUnit);

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleCopyReport = () => {
    const report = `🌍 Weather Report for ${weather.cityName} (${weather.latitude?.toFixed(2)}, ${weather.longitude?.toFixed(2)})
🌡️ Temperature: ${formattedTemp} (Feels like ${formattedFeelsLike})
☁️ Condition: ${weather.condition}
💧 Humidity: ${weather.humidity}% | 💨 Wind: ${formattedWind} | ☀️ UV Index: ${weather.uvIndex}
🌧️ Chance of Rain: ${weather.rainProbability}% | 😷 AQI: ${weather.airQualityCategory} (${weather.airQualityIndex}/5)
Generated via ClimateCue Premium Platform`;

    navigator.clipboard.writeText(report);
    onShowToast('Weather report copied to clipboard! 📋');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ClimateCue: Weather in ${weather.cityName}`,
          text: `It's currently ${weather.temperature}°C and ${weather.condition} in ${weather.cityName}. Feels like ${weather.feelsLike}°C!`,
          url: window.location.href,
        });
      } catch (err) {
        handleCopyReport();
      }
    } else {
      handleCopyReport();
    }
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text(`ClimateCue Weather Report`, 20, 25);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(14);
      doc.text(`Location: ${weather.cityName}`, 20, 40);
      doc.text(`Date & Time: ${formatDate()} - ${formatTime()}`, 20, 50);
      
      doc.setFontSize(16);
      doc.text(`Current Conditions: ${weather.condition}`, 20, 70);
      doc.text(`Temperature: ${formattedTemp}`, 20, 80);
      doc.text(`Feels Like: ${formattedFeelsLike}`, 20, 90);
      doc.text(`Humidity: ${weather.humidity}%`, 20, 100);
      doc.text(`Wind Speed: ${formattedWind} (Gusts up to ${formattedGust})`, 20, 110);
      doc.text(`Pressure: ${weather.pressure} hPa`, 20, 120);
      doc.text(`UV Index: ${weather.uvIndex}`, 20, 130);
      doc.text(`Air Quality: ${weather.airQualityCategory} (AQI ${weather.airQualityIndex})`, 20, 140);
      doc.text(`Rain Probability: ${weather.rainProbability}%`, 20, 150);
      
      if (weather.weatherAlert && !weather.weatherAlert.includes('No active')) {
        doc.setTextColor(220, 38, 38);
        doc.text(`Alert: ${weather.weatherAlert}`, 20, 170);
      }
      
      doc.save(`${weather.cityName}_Weather_Report.pdf`);
      onShowToast('PDF Report downloaded successfully! 📄');
    } catch (e) {
      onShowToast('Failed to generate PDF');
    }
  };

  const handleScreenshot = async () => {
    if (!cardRef.current) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0f172a',
        scale: 2,
        useCORS: true
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `${weather.cityName}_Weather_Card.png`;
      link.click();
      onShowToast('Screenshot saved as PNG! 📸');
    } catch (e) {
      onShowToast('Failed to take screenshot');
    } finally {
      setExporting(false);
    }
  };

  // Mouse Parallax & 3D Card Tilt (Apple / Stripe inspired)
  const handleMouseMove = (e) => {
    if (!cardRef.current || animations === 'disabled' || exporting) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const normX = (x - centerX) / centerX;
    const normY = (y - centerY) / centerY;

    setMousePos({ x, y });
    const rotateX = normY * -4;
    const rotateY = normX * 4;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.01, 1.01, 1.01)`;
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cardRef.current && !exporting) {
      cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
      
      {/* Weather Warning / Alert Banner */}
      {weather.weatherAlert && !weather.weatherAlert.includes('No active') && (
        <div className="glass-panel" style={{
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid rgba(239, 68, 68, 0.5)',
          padding: '0.8rem 1.25rem',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#fca5a5',
          fontWeight: 600,
          animation: 'pulse 2s infinite'
        }}>
          <AlertTriangle size={22} className="flex-shrink-0 text-red-400" />
          <span>{weather.weatherAlert}</span>
        </div>
      )}

      {/* Main Handcrafted 3D Hero Card */}
      <div 
        ref={cardRef} 
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="glass-panel-3d" 
        style={{ 
          padding: '2rem', 
          position: 'relative', 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.75), rgba(15, 23, 42, 0.88))',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1
        }}
      >
        {/* Interactive Cursor Light Reflection Sheen */}
        {isHovered && animations !== 'disabled' && !exporting && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            background: `radial-gradient(550px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.08), transparent 45%)`,
            zIndex: 1
          }} />
        )}

        {/* Top Header: City & Action Tools */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem', position: 'relative', zIndex: 2 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <MapPin size={22} color="var(--accent-color)" />
              <h2 style={{ fontSize: '2.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>{weather.cityName}</h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={14} /> {formatDate()}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={14} /> {formatTime()}
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          {!exporting && (
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => onToggleFavorite(weather)}
                className="glass-button"
                style={{
                  padding: '0.6rem',
                  background: isFavorite ? 'rgba(245, 158, 11, 0.2)' : 'var(--glass-bg)',
                  borderColor: isFavorite ? 'rgba(245, 158, 11, 0.5)' : 'var(--glass-border)',
                }}
                title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              >
                <Star size={18} color="#f59e0b" fill={isFavorite ? '#f59e0b' : 'none'} />
              </button>
              
              <button onClick={handleShare} className="glass-button" style={{ padding: '0.6rem' }} title="Share Weather">
                <Share2 size={18} />
              </button>

              <button onClick={handleCopyReport} className="glass-button" style={{ padding: '0.6rem' }} title="Copy Weather Report">
                <Copy size={18} />
              </button>

              <button onClick={handleDownloadPDF} className="glass-button" style={{ padding: '0.6rem' }} title="Download PDF Report">
                <Download size={18} />
              </button>

              <button onClick={handleScreenshot} className="glass-button" style={{ padding: '0.6rem' }} title="Screenshot Card">
                <Camera size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Middle Section: Temperature & Floating 3D Badge Icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', flexWrap: 'wrap', gap: '2.5rem', margin: '2rem 0', position: 'relative', zIndex: 2 }}>
          <div className="floating-badge animate-float" style={{
            width: '145px',
            height: '145px',
            borderRadius: '36px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.03))',
            boxShadow: '0 25px 50px rgba(0,0,0,0.4), inset 0 2px 2px rgba(255, 255, 255, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}>
            <img
              src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
              alt={weather.condition}
              style={{ width: '125px', height: '125px', filter: 'drop-shadow(0 12px 18px rgba(0,0,0,0.45))' }}
            />
          </div>
          <div>
            <div style={{ fontSize: '5.5rem', fontWeight: 800, lineHeight: 1, letterSpacing: '-3px', color: 'var(--text-primary)' }}>
              {formattedTemp}
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-accent)', marginTop: '0.5rem', textTransform: 'capitalize' }}>
              {weather.condition}
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginTop: '0.3rem', fontWeight: 500 }}>
              Feels like <strong style={{ color: 'var(--text-primary)' }}>{formattedFeelsLike}</strong>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

export default CurrentWeatherCard;
