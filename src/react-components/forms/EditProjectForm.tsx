import * as React from "react";
import { FormEvent } from "react";
import { IProject, Role, Status } from "../../class/Project";
import { ProjectsManager } from "../../class/ProjectsManager";
import { ErrorPopup } from "../../class/ErrorPopup";

interface Props {
  projectsManager: ProjectsManager;
}

export default function EditProjectForm(props: Props) {
  // Toggle modal function
  function toggleModal(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal.open) {
      modal.close();
    } else {
      modal.showModal();
    }
  }

  const onEditProjectFormSubmit = (e: FormEvent) => {
    const editForm = document.getElementById(
      "edit-project-form"
    ) as HTMLFormElement;
    e.preventDefault();
    const formData = new FormData(editForm);
    // Initializing an object of type IProject to store project data
    let data: IProject = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      role: formData.get("role") as Role,
      status: formData.get("status") as Status,
      finishDate: new Date(formData.get("finishDate") as string),
    };
    try {
      // Calling NEWPROJECT function
      props.projectsManager.editProject(
        props.projectsManager.currentProject,
        data
      );
      editForm.reset();
      toggleModal("edit-project-modal");
    } catch (err) {
      console.warn(err.message);
    }
  };

  return (
    <form id="edit-project-form" onSubmit={(e) => onEditProjectFormSubmit(e)}>
      <h2>Edit Project</h2>
      <div className="input-list">
        <div className="form-field-container">
          <label>
            <span className="material-icons-round">apartment</span>
            Name
          </label>
          <input
            required
            name="name"
            type="text"
            placeholder="What's the name of your project?"
          />
          <p
            style={{
              color: "gray",
              fontSize: "var(--font-sm)",
              marginTop: 5,
              fontStyle: "italic",
            }}
          >
            TIP: Give it a short name
          </p>
        </div>
        <div className="form-field-container">
          <label>
            <span className="material-icons-round">subject</span>
            Description
          </label>
          <textarea
            name="description"
            cols={30}
            rows={5}
            placeholder="Give your project a nice description! So people is jealous about it."
            defaultValue={""}
          />
        </div>
        <div className="form-field-container">
          <label>
            <span className="material-icons-round">person</span>Role
          </label>
          <select name="role">
            <option>Architect</option>
            <option>Engineer</option>
            <option>Developer</option>
          </select>
        </div>
        <div className="form-field-container">
          <label>
            <span className="material-icons-round">not_listed_location</span>
            Status
          </label>
          <select name="status">
            <option>Pending</option>
            <option>Active</option>
            <option>Finished</option>
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
          <button type="submit" style={{ backgroundColor: "rgb(18, 145, 18)" }}>
            Accept
          </button>
        </div>
      </div>
    </form>
  );
}
