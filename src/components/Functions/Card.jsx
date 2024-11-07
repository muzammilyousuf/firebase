import * as React from 'react';



export default function Card(props, title) {
 
  return (
    <div class="card" style={{width: "18rem;"}}>
    <img src={props.src} class="card-img-top" alt="..."/>
    <div class="card-body">
      <h5 class="card-title">{props.title !=="" ? "Title" : {title} }</h5>
      <p class="card-text"> {props.desc} </p>
      <a href={props.btnhref} class="btn btn-primary">View Profile</a>
    </div>
  </div>
  );
};
