import React from "react";

export default function Icon(props){
    return(
        <img 
          className="nav-icon" 
          src={props.img} 
          style={{
            width: props.width ? props.width : '100%', 
            padding: props.padding ? props.padding : '1rem',
            position: props.position ? props.position : 'default',

        }}/>
    )
}