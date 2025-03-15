/** ################################################### */
/*--------------------IMPORTS-------------------------- */
/** ################################################### */
import * as React from "react";
import { Link } from "react-router-dom";

/** ################################################### */
/*--------------------REACT FUNCTION------------------- */
/** ################################################### */
export function Sidebar() {
  /** ################################################### */
  /*--------------JSX RETURN VALUE----------------------- */
  /** ################################################### */
  return (
    <aside id="sidebar">
      <img
        id="company-logo"
        src="./assets/company-logo.svg"
        alt="Construction Company"
      />
      <ul id="nav-buttons">
        <Link to="/">
          <li id="projects-button">
            <span className="material-icons-round">apartment</span>Projects
          </li>
        </Link>
        <Link to="/project">
          <li id="users-button">
            <span className="material-icons-round">people</span>Project
          </li>
        </Link>
      </ul>
    </aside>
  );
}
