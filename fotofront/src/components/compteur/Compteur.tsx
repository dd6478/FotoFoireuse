import React, { useState, useEffect } from "react";
import "./compteurs.css";

interface TimeLeft {
  jours?: number;
  heures?: number;
  minutes?: number;
  secondes?: number;
}

const Countdown: React.FC<{ targetDate: string }> = ({ targetDate }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft: TimeLeft = {};

    if (difference > 0) {
      timeLeft = {
        jours: Math.floor(difference / (1000 * 60 * 60 * 24)),
        heures: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        secondes: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const timerComponents: JSX.Element[] = [];

  (Object.keys(timeLeft) as (keyof TimeLeft)[]).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={interval}>
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div className="centered-div">
      {timerComponents.length ? (
        timerComponents
      ) : (
        <div className="centered-div">Le concours est fini!</div>
      )}
    </div>
  );
};

export default Countdown;
