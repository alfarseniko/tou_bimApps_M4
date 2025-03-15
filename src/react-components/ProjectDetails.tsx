/** ################################################### */
/*--------------------IMPORTS-------------------------- */
/** ################################################### */
import * as React from "react";
import { useState } from "react";
import { ProjectsManager } from "../class/ProjectsManager";
import { IProject, ITodo } from "../class/Project";
import { useParams, useNavigate } from "react-router-dom";
import Todo from "./Todo";
import AddTodoForm from "./forms/AddTodoForm";
import { Project } from "../class/Project";
import ThreeViewer from "./ThreeViewer";
import { deleteProject, getCollection } from "../firebase";
import { toggleModal } from "../class/HelperFunctions";
import ProjectForm from "./forms/ProjectForm";
import ProjectTasksList from "./ProjectTasksList";
import * as Firestore from "firebase/firestore";
import { db } from "../firebase";

/** ################################################### */
/*--------------------INTERFACE------------------------ */
/** ################################################### */
interface Props {
  projectsManager: ProjectsManager;
}
/** ################################################### */
/*--------------------REACT FUNCTION------------------- */
/** ################################################### */
export default function ProjectDetails(props: Props) {
  const routeParams = useParams<{ id: string }>();
  if (!routeParams.id) {
    console.log("The ID parameter was not found.");
    return;
  } else {
    console.log("The following ID was passed to the page", routeParams.id);
  }

  const project = props.projectsManager.getProject(routeParams.id);
  if (!project) {
    console.warn("The project wasn't found.");
    return;
  } else {
    console.log("The following project was found:", project);
  }

  /**------------CHANGE STATE AND RENDER--------------- */
  const getFirestorTodos = async () => {
    const doc = await Firestore.getDoc(
      Firestore.doc(db, `/projects/${routeParams.id}`)
    );
    const data = doc.data();
    if (!data) {
      return;
    }
    const todoArray: ITodo[] = data.todoList;
    for (const todo of todoArray) {
      props.projectsManager.addTodo(todo, routeParams.id as string);
    }
  };

  React.useEffect(() => {
    getFirestorTodos();

    return () => {
      project.todo = [];
    };
  }, []);

  const [projects, setProjects] = useState<Project[]>(
    props.projectsManager.list
  );
  props.projectsManager.onProjectEditted = () => {
    setProjects([...props.projectsManager.list]);
  };
  props.projectsManager.onTodoCreated = () => {
    setProjects([...props.projectsManager.list]);
  };
  props.projectsManager.onTodoEditted = () => {
    setProjects([...props.projectsManager.list]);
  };

  const navigateTo = useNavigate();
  props.projectsManager.onProjectDeleted = async (id) => {
    await deleteProject("/projects", id);
    navigateTo("/");
  };

  const onEditProjectClick = () => {
    toggleModal("edit-project-modal");
  };

  const onTodoSearch = (value: string) => {
    setProjects(props.projectsManager.filterProjects(value));
  };

  /** ################################################### */
  /*--------------JSX RETURN VALUE----------------------- */
  /** ################################################### */
  return (
    <div className="page" id="project-details">
      <ProjectForm
        projectsManager={props.projectsManager}
        id={routeParams.id}
      />
      <header>
        <div>
          <h2 details-page-info="name-heading">{project.name}</h2>
          <p
            details-page-info="description-heading"
            style={{ color: "#969696" }}
          >
            {project.description}
          </p>
        </div>
        <button
          onClick={() => {
            props.projectsManager.deleteProject(project.id);
          }}
          type="button"
          style={{ backgroundColor: "red" }}
        >
          Delete Project
        </button>
      </header>
      <div className="main-page-content">
        <div style={{ display: "flex", flexDirection: "column", rowGap: 30 }}>
          <div className="dashboard-card" style={{ padding: "30px 0" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0px 30px",
                marginBottom: 30,
              }}
            >
              <p
                details-page-info="project-initials"
                style={{
                  fontSize: 20,
                  backgroundColor: "#ca8134",
                  aspectRatio: 1,
                  borderRadius: "100%",
                  padding: 12,
                  textTransform: "uppercase",
                }}
              >
                {project.name[0] + project.name[1]}
              </p>
              <button
                id="edit-project-button"
                className="btn-secondary"
                onClick={onEditProjectClick}
              >
                <p style={{ width: "100%" }}>Edit</p>
              </button>
            </div>
            <div style={{ padding: "0 30px" }}>
              <div>
                <h5 details-page-info="name">{project.name}</h5>
                <p details-page-info="description">{project.description}</p>
              </div>
              <div
                style={{
                  display: "flex",
                  columnGap: 30,
                  padding: "30px 0px",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Status
                  </p>
                  <p details-page-info="status">{project.status}</p>
                </div>
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Cost
                  </p>
                  <p details-page-info="cost">$ 2'542.000</p>
                </div>
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Role
                  </p>
                  <p details-page-info="role">{project.role}</p>
                </div>
                <div>
                  <p style={{ color: "#969696", fontSize: "var(--font-sm)" }}>
                    Finish Date
                  </p>
                  <p details-page-info="finishDate">
                    {project.finishDate.toDateString()}
                  </p>
                </div>
              </div>
              <div
                style={{
                  backgroundColor: "#404040",
                  borderRadius: 9999,
                  overflow: "auto",
                }}
              >
                <div
                  style={{
                    width: `${Math.floor(project.progress)}%`,
                    backgroundColor: "green",
                    padding: "4px 0",
                    textAlign: "end",
                    fontWeight: "bold",
                  }}
                >
                  {Math.floor(project.progress)}%
                </div>
              </div>
            </div>
          </div>
          <ProjectTasksList
            project={project}
            projectsManager={props.projectsManager}
          />
        </div>
        <ThreeViewer />
      </div>
    </div>
  );
}
