import React from "react";
import Icon from "./Icon";

import '../style/nav.scss';

export default function Nav(){
    return(
        <nav className="nav-bar">
            <Icon img="/assets/icons/burger-icon.svg" width="70%"/>
            <Icon img="/assets/icons/hotdish-icon.svg" />
            <Icon img="/assets/icons/employee-icon.svg" />
            <Icon img="/assets/icons/schedule-icon.svg" />
            <Icon img="/assets/icons/inventory-icon.svg" />
            <Icon img="/assets/icons/reports-icon.svg" />
            <Icon img="/assets/icons/settings-icon.svg" position="absolute"/>
        </nav>
    )
}
