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
            <bim-label
              style={{ color: "#fff" }}
              icon="material-symbols:apartment"
            >
              Projects
            </bim-label>
          </li>
        </Link>
        <Link to="/users">
          <li id="users-button">
            <bim-label style={{ color: "#fff" }} icon="mdi:user">
              Users
            </bim-label>
          </li>
        </Link>
      </ul>
    </aside>
  );
}
