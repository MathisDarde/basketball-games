"use client";

import { useEffect, useState } from "react";

function getTimeRemaining() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0); // Prochain minuit
  const diff = midnight.getTime() - now.getTime();

  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

export default function CountdownToNextDraw() {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const { hours, minutes, seconds } = timeLeft;

  return (
    <div className="mt-4 text-center text-sm text-gray-600">
      <p>
        Prochain tirage dans{" "}
        <span className="font-semibold text-black">
          {`${hours.toString().padStart(2, "0")}h:${minutes
            .toString()
            .padStart(2, "0")}m:${seconds.toString().padStart(2, "0")}s`}
        </span>
      </p>
    </div>
  );
}
