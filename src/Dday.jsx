import { useState, useEffect } from 'react';
import './Dday.scss';

function Dday() {
  const [dDay, setDDay] = useState('');

  useEffect(() => {
    const graduationDate = new Date('2026-03-01');
    const today = new Date();

    // 시간, 분, 초를 0으로 설정하여 날짜만 비교
    graduationDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const timeDiff = graduationDate.getTime() - today.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (dayDiff === 0) {
      setDDay('D-Day');
    } else if (dayDiff > 0) {
      setDDay(`D-${dayDiff}`);
    } else {
      setDDay(`D+${Math.abs(dayDiff)}`);
    }
  }, []);

  return (
    <div className="dday-container">
      <h2>졸업까지</h2>
      <p className="dday-result">{dDay}</p>
    </div>
  );
}

export default Dday;
