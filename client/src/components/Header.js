import React from "react";
import { useState } from "react";
import NavIcon from "./Icon";
import { styled } from "styled-components";
import '../style/header.scss';

export default function Header(props){
    const Pfp = styled.img` 
        width: 3rem;
        border-radius: 999px;
    `
    const [time, setTime] = useState(`${new Date().toLocaleTimeString()}`);
    
    setInterval(function(){
        setTime(`${new Date().toLocaleTimeString()}`);
      }, 60000);
      

    return(
        <header className="header">
            <div className="header-info">
                <h2>{props.title}</h2>
                <p>{new Date().toDateString()}</p>
                <p>{time}</p>
            </div>
            <div className="account">
                <NavIcon img="/assets/icons/notification-icon.svg" width="2.25rem"/>
                <NavIcon className="header-grid-icon" img="/assets/icons/grid-menu-icon.svg" width="2rem" />
                <p>{props.userName}</p>
                <Pfp src={props.image}/>
            </div>
        </header>
    )
}
