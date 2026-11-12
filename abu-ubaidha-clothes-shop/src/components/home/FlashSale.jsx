import { useEffect, useState } from "react";

function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;

        if (seconds > 0) {
          seconds--;
        } else {
          seconds = 59;

          if (minutes > 0) {
            minutes--;
          } else {
            minutes = 59;

            if (hours > 0) {
              hours--;
            }
          }
        }

        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="max-w-7xl mx-auto py-16 px-6">

      <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-3xl p-10 text-white shadow-xl">

        <h2 className="text-5xl font-bold">
          ⚡ Flash Sale
        </h2>

        <p className="mt-3 text-lg">
          Up to <span className="font-bold">70% OFF</span> on selected products.
        </p>

        <div className="flex gap-6 mt-8">

          <div className="bg-white text-black rounded-xl p-5 w-24 text-center">
            <h3 className="text-3xl font-bold">{timeLeft.hours}</h3>
            <p>Hours</p>
          </div>

          <div className="bg-white text-black rounded-xl p-5 w-24 text-center">
            <h3 className="text-3xl font-bold">{timeLeft.minutes}</h3>
            <p>Minutes</p>
          </div>

          <div className="bg-white text-black rounded-xl p-5 w-24 text-center">
            <h3 className="text-3xl font-bold">{timeLeft.seconds}</h3>
            <p>Seconds</p>
          </div>

        </div>

      </div>

    </section>
  );
}

export default FlashSale;