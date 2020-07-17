import React from "react";
import logo from "../img/logo.png";
import smallLogo from "../img/logo48.png";

export default function Logo({size, logoStyle}) {
    return (<img className={logoStyle} src={size ==="small"?
         smallLogo: logo} alt={"logo"}/> );
}