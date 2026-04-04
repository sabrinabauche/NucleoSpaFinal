
import React from 'react';
import './appBtn.css';

//we are going to on click make it navigate to a section of the page
//we want our button to habe a name, as a reusable component
//the bttn component belongs to the parent-the header
//in typescript we need to define the type of variable name is
export default function AppBtn({name}: {name:string}) {

    const handleScrollTo=(section: string)=>{
        //go to booking a table section
    }

  return <a 
  className="app-btn scrollto"
  onClick={() => handleScrollTo('book-a-table')}
  >
    {name}
  </a>;
}
