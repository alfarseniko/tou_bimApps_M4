import * as React from "react";
import { toggleModal } from "../class/HelperFunctions";
import { Project } from "../class/Project";
import Todo from "./Todo";
import { ITodo } from "../class/Project";
import { ProjectsManager } from "../class/ProjectsManager";
import AddTodoForm from "./forms/AddTodoForm";

interface Props {
  project: Project;
  projectsManager: ProjectsManager;
}

export default function ProjectTasksList(props: Props) {
  const [todo, setTodo] = React.useState(props.project.todo);
  const [project, setProject] = React.useState(props.projectsManager.list);

  const sampleTodo: ITodo = {
    description: "A normal task",
    status: "Active",
    priority: "Normal Priority",
    id: NaN,
    finishDate: new Date(),
  };

  const onAddTodoClick = () => {
    toggleModal("add-todo-modal");
  };

  const todoItems = todo.map((todo) => {
    return (
      <Todo
        todo={todo}
        projectsManager={props.projectsManager}
        project={props.project}
        key={todo.id}
      />
    );
  });

  /**----------ON PROJECT SEARCH------------ */
  const onTodoSearch = (value: string) => {
    setTodo(props.project.filterTodos(value));
  };
  return (
    <>
      <div className="dashboard-card" style={{ flexGrow: 1 }}>
        <div
          style={{
            padding: "20px 30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h4>To-Do</h4>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
              columnGap: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                columnGap: 10,
              }}
            >
              <span className="material-icons-round">search</span>
              <input
                onChange={(e) => {
                  onTodoSearch(e.target.value);
                }}
                type="text"
                placeholder="Search To-Do's by name"
                style={{ width: "100%" }}
              />
            </div>
            <span
              id="add-todo-button"
              className="material-icons-round"
              onClick={onAddTodoClick}
            >
              add
            </span>
          </div>
        </div>
        <div
          id="todo-list"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "10px 30px",
            rowGap: 20,
          }}
        >
          {todoItems}
        </div>
      </div>
      <AddTodoForm
        projectsManager={props.projectsManager}
        project={props.project}
        todo={sampleTodo}
      />
    </>
  );
}
