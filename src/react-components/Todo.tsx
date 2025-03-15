/** ################################################### */
/*--------------------IMPORTS-------------------------- */
/** ################################################### */
import * as React from "react";
import { ITodo, Project, Status } from "../class/Project";
import { todoColour, toggleModal } from "../class/HelperFunctions";
import AddTodoForm from "./forms/AddTodoForm";
import { ProjectsManager } from "../class/ProjectsManager";

/** ################################################### */
/*--------------------INTERFACES----------------------- */
/** ################################################### */
interface Props {
  todo: ITodo;
  projectsManager: ProjectsManager;
  project: Project;
}

/** ################################################### */
/*--------------------REACT FUNCTION------------------- */
/** ################################################### */
export default function Todo(props: Props) {
  const [project, setProject] = React.useState(props.projectsManager.list);

  const onTodoClick = () => {
    toggleModal("edit-todo-modal");
  };
  /** ################################################### */
  /*--------------------JSX RETURN VALUE----------------- */
  /** ################################################### */
  return (
    <>
      <AddTodoForm
        projectsManager={props.projectsManager}
        project={props.project}
        todo={props.todo}
      />
      <div
        className="todo-item"
        style={{ backgroundColor: todoColour(props.todo.status) }}
        onClick={onTodoClick}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", columnGap: 15, alignItems: "center" }}>
            <span
              className="material-icons-round"
              style={{
                padding: 10,
                backgroundColor: "#686868",
                borderRadius: 10,
              }}
            >
              construction
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                rowGap: "7px",
                alignItems: "start",
                fontWeight: "bold",
              }}
            >
              <p>
                {props.todo.id}. {props.todo.description}
              </p>
              <p>{props.todo.priority}</p>
            </div>
          </div>
          <p style={{ textWrap: "nowrap", marginLeft: 10 }}>
            {props.todo.finishDate.toDateString()}
          </p>
        </div>
      </div>
    </>
  );
}
