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
            <h2>{props.title}</h2>
            <p>Thurs July 18</p>
            <p>{time}</p>
            <div className="account">
                <NavIcon img="/assets/icons/notification-icon.svg" />
                <NavIcon img="/assets/icons/grid-menu-icon.svg" />
                <p>{props.userName}</p>
                <Pfp src="/assets/pfp.jpeg"/>
            </div>
        </header>
    )
}