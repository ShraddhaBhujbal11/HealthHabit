import React, { useEffect } from "react";
import "./Home.css";

export default function Home() {
  useEffect(() => {
    const reveals = document.querySelectorAll(".reveal");

    const revealOnScroll = () => {
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
          reveals[i].classList.add("visible");
        }
      }
    };

    window.addEventListener("scroll", revealOnScroll);
    revealOnScroll(); // Run once on load

    return () => window.removeEventListener("scroll", revealOnScroll);
  }, []);

  return (
    <>
      <section className="hero">
          <div className="hero-glow-wrapper">
        <div className="hero-content reveal">
          <h1>Start <span className="highlight-text">Your Health Journey</span>
</h1>
          <p>Track habits daily, stay motivated, and achieve your wellness goals.</p>
          <button className="hero-btn">Get Started by Login or Registering...</button>
        </div>
        </div>
      </section>

      <section className="features">
        <h2 className="reveal">How HealthHabit Helps You ..?</h2>

        <div className="feature-item reveal">
          <img
            src="https://images.ctfassets.net/lzny33ho1g45/WSFQEChNCFYJ8JLn3MAAR/1711efce1f57022f7d73af3a2c86625d/habitify.jpeg"
            alt="User tracking daily health habits"
          />
          <div className="desc">
            <h4>Track Daily Habits</h4>
            <p className="para">Log exercise, water intake, sleep and more with ease and clarity.</p>
          </div>
        </div>

        <div className="feature-item reveal">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-Y2LNVZjaDDksTt5-5Q6Trpm0mtfEK_2y_g&s"
            alt="Progress monitoring with health insights"
          />
          <div className="desc">
            <h4>Monitor Progress</h4>
            <p className="para">Visualize trends over time and celebrate your health achievements.</p>
          </div>
        </div>

        <div className="feature-item reveal">
          <img
            src="https://miro.medium.com/v2/resize:fit:740/1*eHIt7Zo4zWaBNZLPVpdRWA.jpeg"
            alt="Set health goals and receive reminders"
          />
          <div className="desc">
            <h4>Set Goals & Reminders</h4>
            <p className="para">Define personal targets and receive reminders to help you stay on track.</p>
          </div>
        </div>
      </section>
    </>
  );
}
