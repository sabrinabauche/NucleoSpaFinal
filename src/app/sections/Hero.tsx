"use client";

import React from 'react';
import './hero.css';
import HeroBtn from '../components/HeroBtn';
import Logo from '../components/Logo';

//not a client component in new app- this is so we can play a video on the Hero
export default function Hero() {
  return (
    <section id="hero">

      <div
        className="container position-relative text-center"
        data-aos="zoom-in"
        data-aos-delay="100"
        data-aos-once="true"
      >
          <div className="logo">
            <Logo className="hero-logo" />
          </div>

          <div className="btns">
            <HeroBtn name="Agendar tratamiento" target="tratamientos" />
          </div>

        </div>
    </section>
  );
}