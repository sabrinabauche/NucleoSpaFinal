//server components: all the data and prep of the page will be ready from the server side
//client component: the browsers starts to build your page
//if you have a lot of user interactions you have to use a client component (synamic)
//we will use a client component for animations
//default it will be a server component, if we are building a client component we have to specify it.

'use client'

import React, {useState,useEffect} from 'react';
import './topBar.css';
export default function TopBar(){
    //we need the scroll position to know when to hide the topbar
    const [scroll, setScroll] = useState(0);
    //the effect runs every time scroll changes
    useEffect(() => {
  window.addEventListener('scroll', () => {
    setScroll(window.scrollY);
  });

  return () => {
    window.removeEventListener('scroll', () => {
      setScroll(window.scrollY);
    });
  };
}, [scroll]);

return (
  <div
    id="topbar"
    className={`d-flex align-items-center fixed-top ${
      scroll > 100 ? 'topbar-scrolled' : undefined
    }`}
  >
    <div className="container d-flex justify-content-center justify-content-md-between">
      
      <div className="languages d-none d-md-flex align-items-center">

      </div>

    </div>
  </div>
);
}