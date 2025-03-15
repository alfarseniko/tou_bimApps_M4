import * as React from "react";
import { ITodo, Priority, Project, Status } from "../../class/Project";
import { ProjectsManager } from "../../class/ProjectsManager";
import { ErrorPopup } from "../../class/ErrorPopup";
import { toggleModal } from "../../class/HelperFunctions";
import * as Firestore from "firebase/firestore";
import { db, getCollection } from "../../firebase";
import { getDoc, getDocs } from "firebase/firestore";

interface Props {
  projectsManager: ProjectsManager;
  project: Project;
  todo: ITodo;
}

export default function AddTodoForm(props: Props) {
  function getIndex(todoArray: [], id: number) {
    return todoArray.findIndex(() => props.todo.id === id);
  }

  const onTodoFormSubmit = async (e: React.FormEvent) => {
    const todoForm = document.getElementById(
      "add-todo-form"
    ) as HTMLFormElement;
    if (!(todoForm instanceof HTMLFormElement)) {
      return;
    }

    e.preventDefault();
    const formData = new FormData(todoForm);
    // Initializing an object of type IProject to store project data
    let data: ITodo = {
      description: formData.get("description") as string,
      status: formData.get("status") as Status,
      priority: formData.get("priority") as Priority,
      finishDate: new Date(formData.get("finishDate") as string),
      id: 0,
    };
    try {
      // Calling NEWPROJECT function
      const todoData = { ...data, id: props.project.todo.length + 1 };
      props.projectsManager.addTodo(todoData, props.project.id);
      todoForm.reset();
      toggleModal("add-todo-modal");
      const doc = Firestore.doc(db, `/projects/${props.project.id}`);
      await Firestore.updateDoc(doc, {
        todoList: Firestore.arrayUnion(todoData),
      });
    } catch (err) {
      console.error(err.message);
    }
  };
  const onEditTodoFormSubmit = async (e: React.FormEvent) => {
    const todoForm = document.getElementById(
      "edit-todo-form"
    ) as HTMLFormElement;
    if (!(todoForm instanceof HTMLFormElement)) {
      return;
    }

    e.preventDefault();
    const formData = new FormData(todoForm);
    // Initializing an object of type IProject to store project data
    let data: ITodo = {
      description: formData.get("description") as string,
      status: formData.get("status") as Status,
      priority: formData.get("priority") as Priority,
      finishDate: new Date(formData.get("finishDate") as string),
      id: 0,
    };
    try {
      // Calling NEWPROJECT function
      props.projectsManager.editTodo(data, props.project.id, props.todo.id);
      todoForm.reset();
      toggleModal("edit-todo-modal");
      const doc = Firestore.doc(db, `/projects/${props.project.id}`);
      const docSnap = await getDoc(doc);
      if (!docSnap.exists()) {
        return console.log("No such document!");
      }
      const firebaseData = docSnap.data();
      const todoArray = firebaseData.todoList;

      const index = getIndex(todoArray, props.todo.id);
      const updatedTodo = { ...data, id: props.project.todo.length + 1 };
      todoArray[index] = updatedTodo;
      await Firestore.updateDoc(doc, {
        todoList: todoArray,
      });
    } catch (err) {
      new ErrorPopup(err.message);
    }
  };

  return (
    <>
      <dialog id="add-todo-modal">
        <form id="add-todo-form" onSubmit={onTodoFormSubmit}>
          <h2>Add ToDo</h2>
          <div className="input-list">
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">subject</span>
                Description
              </label>
              <textarea
                name="description"
                cols={30}
                rows={2}
                placeholder="Describe your task in detail."
                defaultValue={""}
              />
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">
                  not_listed_location
                </span>
                Status
              </label>
              <select name="status">
                <option>Pending</option>
                <option>Active</option>
                <option>Finished</option>
              </select>
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">
                  not_listed_location
                </span>
                Priority
              </label>
              <select name="priority">
                <option>Urgent</option>
                <option>Normal Priority</option>
                <option>Not Urgent</option>
              </select>
            </div>
            <div className="form-field-container">
              <label htmlFor="finishDate">
                <span className="material-icons-round">calendar_month</span>
                Finish Date
              </label>
              <input name="finishDate" type="date" />
            </div>
            <div
              style={{
                display: "flex",
                margin: "10px 0px 10px auto",
                columnGap: 10,
              }}
            >
              <button
                id="close-button-edit-form"
                type="button"
                style={{ backgroundColor: "transparent" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ backgroundColor: "rgb(18, 145, 18)" }}
              >
                Accept
              </button>
            </div>
          </div>
        </form>
      </dialog>
      <dialog id="edit-todo-modal">
        <form id="edit-todo-form" onSubmit={onEditTodoFormSubmit}>
          <h2>Edit ToDo</h2>
          <div className="input-list">
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">subject</span>
                Description
              </label>
              <textarea
                name="description"
                cols={30}
                rows={2}
                placeholder="Describe your task in detail."
                defaultValue={""}
              />
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">
                  not_listed_location
                </span>
                Status
              </label>
              <select name="status">
                <option>Pending</option>
                <option>Active</option>
                <option>Finished</option>
              </select>
            </div>
            <div className="form-field-container">
              <label>
                <span className="material-icons-round">
                  not_listed_location
                </span>
                Priority
              </label>
              <select name="priority">
                <option>Urgent</option>
                <option>Normal Priority</option>
                <option>Not Urgent</option>
              </select>
            </div>
            <div className="form-field-container">
              <label htmlFor="finishDate">
                <span className="material-icons-round">calendar_month</span>
                Finish Date
              </label>
              <input name="finishDate" type="date" />
            </div>
            <div
              style={{
                display: "flex",
                margin: "10px 0px 10px auto",
                columnGap: 10,
              }}
            >
              <button
                id="close-button-edit-form"
                type="button"
                style={{ backgroundColor: "transparent" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ backgroundColor: "rgb(18, 145, 18)" }}
              >
                Accept
              </button>
            </div>
          </div>
        </form>
      </dialog>
    </>
  );
}
