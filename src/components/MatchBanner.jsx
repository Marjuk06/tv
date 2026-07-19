import React, { useState, useEffect } from 'react';

export default function MatchBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    // July 20, 2026 at 1:00 AM (local time based on user's timezone)
    const targetDate = new Date('2026-07-20T01:00:00+06:00').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setIsLive(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setIsLive(false);
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    updateTimer(); // Initial call
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num) => num.toString().padStart(2, '0');

  return (
    <div className="match-banner-sidebar">
      <div className="match-banner-bg-glow"></div>
      
      <div className="match-banner-header">
        <span className="tournament-badge">🏆 FINAL 2026</span>
      </div>

      <div className="match-banner-content-compact">
        <div className="team-row">
          <img src="https://flagcdn.com/w160/es.png" alt="Spain" className="team-flag-small" />
          <span className="team-name-small">ESP</span>
          <span className="vs-badge-small">VS</span>
          <span className="team-name-small">ARG</span>
          <img src="https://flagcdn.com/w160/ar.png" alt="Argentina" className="team-flag-small" />
        </div>

        {isLive ? (
          <div className="live-status pulse" style={{ marginTop: 16 }}>🔴 LIVE</div>
        ) : (
          <div className="countdown-container-small">
            <div className="countdown-box">
              <span className="time">{formatNumber(timeLeft.hours)}</span>
              <span className="label">HRS</span>
            </div>
            <span className="colon">:</span>
            <div className="countdown-box">
              <span className="time">{formatNumber(timeLeft.minutes)}</span>
              <span className="label">MIN</span>
            </div>
            <span className="colon">:</span>
            <div className="countdown-box">
              <span className="time pulse-text">{formatNumber(timeLeft.seconds)}</span>
              <span className="label">SEC</span>
            </div>
          </div>
        )}
        <div className="match-time-label">Tomorrow • 1:00 AM</div>
      </div>
    </div>
  );
}
