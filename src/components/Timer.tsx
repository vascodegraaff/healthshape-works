import { useState, useEffect } from "react";

interface TimerProps {
  startTime: Date;
}

const Timer = ({ startTime }: TimerProps) => {
  const [elapsed, setElapsed] = useState("0:00");

  useEffect(() => {
    // Ensure startTime is a Date object
    const start = startTime instanceof Date ? startTime : new Date(startTime);

    const updateElapsed = () => {
      const now = new Date();
      const diff = now.getTime() - start.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setElapsed(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  return <div className="text-muted-foreground">{elapsed}</div>;
};

export default Timer; 