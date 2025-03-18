/** ################################################### */
/*--------------------IMPORTS-------------------- */
/** ################################################### */
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import * as Router from "react-router-dom";
import * as BUI from "@thatopen/ui";
import { Sidebar } from "./react-components/Sidebar";
import { ProjectsPage } from "./react-components/ProjectsPage";
import { ProjectsManager } from "./class/ProjectsManager";
import ProjectDetails from "./react-components/ProjectDetails";
import UsersPage from "./react-components/UsersPage";

/** ################################################### */
/*--------------------REACT---------------------------- */
/** ################################################### */

// Global declaration of HTML Components
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "bim-grid": any;
      "bim-label": any;
      "bim-button": any;
      "bim-text-input": any;
      "bim-viewport": any;
    }
  }
}

// Initializing the BIM UI Manager
BUI.Manager.init();

//Initializing projectsManager for global use
const projectsManager = new ProjectsManager();

// Getting an element for REACT Root Element
const rootElement = document.getElementById("app") as HTMLDivElement;
// React Root Element assigned
const appRoot = ReactDOM.createRoot(rootElement);
// All renders and HTML changes happen with this function
appRoot.render(
  <>
    {/**  ROUTER helps in page navigation
     *    BrowserRouter for use in Web Browser */}
    <Router.BrowserRouter>
      {/** Sidebar remains constant and doesn't change */}
      <Sidebar />
      {/** Router initialized for page routing/rendering */}
      <Router.Routes>
        {/** Each route is a different render in itself */}
        <Router.Route
          path="/"
          element={<ProjectsPage projectsManager={projectsManager} />}
        />
        <Router.Route
          path="/project/:id"
          element={<ProjectDetails projectsManager={projectsManager} />}
        />
        <Router.Route path="/users" element={<UsersPage />} />
      </Router.Routes>
    </Router.BrowserRouter>
  </>
);

// COMMENT AGAIN AND AGAIN
