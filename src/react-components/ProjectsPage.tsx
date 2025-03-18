/** ################################################### */
/*--------------------IMPORTS-------------------------- */
/** ################################################### */
import * as React from "react";
import * as Firestore from "firebase/firestore";
import * as BUI from "@thatopen/ui";
import { getCollection } from "../firebase/index";
import { Link } from "react-router-dom";
import { ErrorPopup } from "../class/ErrorPopup";
import { Project, IProject, Role, Status } from "../class/Project";
import { ProjectsManager } from "../class/ProjectsManager";
import { ProjectCard } from "./ProjectCard";
import ProjectForm from "./forms/ProjectForm";
import SearchBox from "./SearchBox";
import { useState, useEffect } from "react";
import { toggleModal } from "../class/HelperFunctions";

/** ################################################### */
/*--------------------INTERFACE------------------------ */
/** ################################################### */
interface Props {
  projectsManager: ProjectsManager;
}
/** ################################################### */
/*--------------------REACT FUNCTION------------------- */
/** ################################################### */

export function ProjectsPage(props: Props) {
  /**.................................................. */
  /**-----------------PROJECT STATE-------------------- */
  const [projects, setProjects] = useState<Project[]>(
    props.projectsManager.list
  );

  /**---------------ON PROJECT CREATION---------------- */
  props.projectsManager.onProjectCreated = () => {
    setProjects([...props.projectsManager.list]);
  };

  /**------------RETURN FIREBASE COLLECTION------------ */
  const collection = getCollection<IProject>("/projects");

  /**------------CHANGE STATE AND RENDER--------------- */
  const getFirestorProjects = async () => {
    const document = await Firestore.getDocs(collection);
    for (const doc of document.docs) {
      const data = doc.data();
      const projectData: IProject = {
        ...data,
        finishDate: (
          data.finishDate as unknown as Firestore.Timestamp
        ).toDate(),
      };
      try {
        props.projectsManager.newProject(projectData, doc.id);
      } catch {
        props.projectsManager.editProject(doc.id, projectData);
      }
    }
  };

  /**----------RENDER AFTER MOUNTING ONLY ONCE------------ */
  useEffect(() => {
    getFirestorProjects();
  }, []);

  /**----------RETURNS PROJECT CARD COMP------------ */
  const projectCards = projects.map((project) => {
    return (
      <Link to={`/project/${project.id}`} key={project.id}>
        <ProjectCard project={project} />
      </Link>
    );
  });

  /**----------NEW PROJECT CLICK------------ */
  const onNewProjectClick = () => {
    toggleModal("new-project-modal");
  };

  /**----------ON EXPORT------------ */
  const onExport = () => {
    props.projectsManager.exportAsJSON();
    console.log("Projects exported.");
  };

  /**----------ON IMPORT------------ */
  const onImport = () => {
    props.projectsManager.importFromJSON();
    console.log("Projects imported.");
  };

  /**----------ON PROJECT SEARCH------------ */
  const onProjectSearch = (value: string) => {
    setProjects(props.projectsManager.filterProjects(value));
  };

  useEffect(() => {
    const updownButtonContainer = document.getElementById("up-down-buttons");
    const newProjectButtonContainer =
      document.getElementById("new-project-button");

    updownButtonContainer?.appendChild(exportButton);
    updownButtonContainer?.appendChild(importButton);
    newProjectButtonContainer?.appendChild(newProjectButton);
  }, []);

  const exportButton = BUI.Component.create(() => {
    return BUI.html`
            <bim-button
              @click=${onExport}
              icon="ph:export"
              style='margin-right: 8px' 
            ></bim-button>
    `;
  });
  const importButton = BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
            <bim-button
              @click=${onImport}
              icon="iconoir:import"
              style='margin-left: 8px' 
            ></bim-button>
          </div>
    `;
  });

  const newProjectButton = BUI.Component.create<BUI.Button>(() => {
    return BUI.html`
            <bim-button
              @click=${onNewProjectClick}
              label="New Project"
              icon="fluent:add-20-regular"
            ></bim-button>
    `;
  });

  /** ################################################### */
  /*--------------JSX RETURN VALUE----------------------- */
  /** ################################################### */
  return (
    <div className="page" id="projects-page" style={{ display: "flex" }}>
      <ProjectForm projectsManager={props.projectsManager} id={""} />
      <header>
        <bim-label>Projects</bim-label>
        <SearchBox onChange={onProjectSearch} />
        <div id="header-button-container">
          <div id="up-down-buttons"></div>
          <div id="new-project-button"></div>
        </div>
      </header>
      {projectCards.length > 0 ? (
        <div id="projects-list">{projectCards}</div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "75%",
            textAlign: "center",
          }}
        >
          <div>
            <p style={{ fontSize: "x-large" }}>Oops!</p>
            <br />
            <p style={{ fontSize: "large" }}>No projects were found.</p>
          </div>
        </div>
      )}
    </div>
  );
}
