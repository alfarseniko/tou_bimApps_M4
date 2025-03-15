/** ################################################### */
/**-----------------------IMPORTS---------------------- */
/** ################################################### */
import { ErrorPopup } from "./ErrorPopup";
import { IProject, ITodo, Project } from "./Project";
import { v4 as uuidv4 } from "uuid";

/** ################################################### */
/**---------------CLASS DEFINITION--------------------- */
/** ################################################### */

export class ProjectsManager {
  // A list of projects in the app initialized empty
  list: Project[] = [];
  // HTML Container for all project cards
  currentProject: string;
  // Custom callback function / event
  onProjectCreated = () => {};
  onProjectDeleted = (id: string) => {};
  onProjectEditted = () => {};
  onTodoCreated = () => {};
  onTodoEditted = () => {};

  /** ################################################### */
  /**------------------NEW PROJECT----------------------- */
  /** ################################################### */

  newProject(data: IProject, id = uuidv4()) {
    /*  The map() method iterates over the whole array and then returns a list of required elements */
    const projectNames = this.list.map((project) => {
      return project.name;
    });
    // A custom ERROR has been created for same instances of name
    if (projectNames.includes(data.name)) {
      throw new Error(
        `A project with the name, "${data.name}", already exists in the database.`
      );
    }

    // A custom ERROR has been created for less than 5 chars
    if (this.isLessThanFiveChars(data.name)) {
      throw new Error(`The project title should be more than 5 characters.`);
    }

    const project = new Project(data, id);

    this.list.push(project);

    this.onProjectCreated();

    return project;
  }

  /** ################################################### */
  /**-------------------DELETE PROJECT------------------- */
  /** ################################################### */
  deleteProject(id: string) {
    /*  The filter() method takes a callback function in which we must return 
        a boolean value. The filter() method checks for all true values and retains the elements while for all false values it removes from the result */
    const remaining = this.list.filter((project) => {
      return project.id !== id;
    });
    // Replacing the whole list with 'remaining' which doesnt contain the deleted element
    this.list = remaining;
    this.onProjectDeleted(id);
  }

  /** ################################################### */
  /**-------------------ADD TODO------------------------- */
  /** ################################################### */

  addTodo(data: ITodo, id: string) {
    const project = this.getProject(id);
    if (!project) {
      return;
    }
    project.addTodo(data);
    this.onTodoCreated();
  }
  /** ################################################### */
  /**-------------------EDIT TODO------------------------- */
  /** ################################################### */

  editTodo(data: ITodo, projectId: string, todoId: number) {
    const project = this.getProject(projectId);
    if (!project) {
      return;
    }
    const todoData = { ...data, id: todoId };
    project.editTodo(todoData, todoId);
    this.onTodoEditted();
  }

  /** ################################################### */
  /**-----------------EDIT PROJECT----------------------- */
  /** ################################################### */
  editProject(id: string, data: IProject) {
    // Get the project from the current project open in details page
    const project = this.getProject(id);
    if (!project) {
      return;
    }

    // A custom ERROR has been created for less than 5 chars
    if (this.isLessThanFiveChars(project.name)) {
      throw new Error(`The project title should be more than 5 characters.`);
    }
    const edittedProject = project.editProject(data);
    this.onProjectEditted();
  }

  /** ################################################### */
  /**------------------FILTER PROJECTS------------------- */
  /** ################################################### */
  filterProjects(value: string) {
    const filteredProjects = this.list.filter((project) => {
      return project.name.includes(value);
    });
    return filteredProjects;
  }

  /** ################################################### */
  /**-------------------GET PROJECT---------------------- */
  /** ################################################### */
  getProject(id: string) {
    /*  The find() method takes a callback function in which we must
        return a boolean value. The find() method checks which element
        of the array got true and returns the element */
    const project = this.list.find((project) => {
      return project.id === id;
    });
    return project;
  }

  /** ################################################### */
  /**-------------------TOTAL COST----------------------- */
  /** ################################################### */
  totalCost() {
    let totalCost = 0;
    /*  The forEach() method is a for loop that runs over each element of
        the array. Do whatever you want with the logic */
    this.list.forEach((project) => {
      totalCost += project.cost;
    });
    return totalCost;
  }
  /** ################################################### */
  /**-------------------GET PROJECT BY NAME-------------- */
  /** ################################################### */
  getProjectByName(name: string) {
    /*  The find() method takes a callback function in which we must
        return a boolean value. The find() method checks which element
        of the array got true and returns the element */
    const projectByName = this.list.find((project) => {
      return project.name.toLowerCase == name.toLowerCase;
    });
    return projectByName;
  }
  /** ################################################### */
  /**-------------------EXPORT JSON---------------------- */
  /** ################################################### */
  exportAsJSON(fileName: string = "Projects") {
    /*  JSON.stringify converts any object or array of objects into JSON format
        Arg1 is for the object to be converted
        Arg2 is a replacer function to omit or change the original object
        Arg3 is a space value for stringification
    */
    const json = JSON.stringify(this.list, null, 2);
    /** A Blob() object takes a data value for conversion and a type to get rules for conversion to binary data
     */
    const blob = new Blob([json], { type: "application/json" });
    // Creates a url that can be tied to the blob
    const url = URL.createObjectURL(blob);
    // URL needs to be associated with a HTML element
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    // url is revoked to prevent memory leaks
    URL.revokeObjectURL(url);
  }
  /** ################################################### */
  /**-------------------IMPORT JSON---------------------- */
  /** ################################################### */
  importFromJSON() {
    // Create an input element to upload files
    const input = document.createElement("input");
    // Define the type of input
    input.type = "file";
    // Define what the input accepts
    input.accept = "application/json";
    // FileReader() is a class to read the files from any user input
    const reader = new FileReader();

    // when a user selects a file, the change event is fired
    input.addEventListener("change", () => {
      // input.files contains the required files
      const filesList = input.files;
      // exit the block if filesList is empty
      if (!filesList) {
        return;
      }
      //  file has been loaded in the reader as string data
      reader.readAsText(filesList[0]);
    });

    // once the reader has been loaded with the files
    reader.addEventListener("load", () => {
      // the string data can be used by accessing reader.result
      const json = reader.result;
      // return if result is empty
      if (!json) {
        return;
      }
      // feed the array back into the IProject format
      // json as string is type assertion
      // JSON.parse converts string to JSON
      const projects: Project[] = JSON.parse(json as string);
      // for loop to add all projects to the projectsManager
      for (const project of projects) {
        try {
          const projectIds = this.list.map((project) => {
            return project.id;
          });
          if (projectIds.includes(project.id)) {
            project.finishDate = new Date(project.finishDate);
            this.editProject(project.id, project);
          } else {
            this.newProject(project, project.id);
          }
        } catch (error) {
          new ErrorPopup(error.message);
        }
      }
    });
    input.click();
  }
  /** ################################################### */
  /**-------------------RANDOM COLOR---------------------- */
  /** ################################################### */
  private randomColor() {
    const colors = ["#EDAE49", "#D1495B", "#00798C", "#30638E", "#003D5B"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /** ################################################### */
  /**-------------------LESS THAN FIVE------------------- */
  /** ################################################### */
  private isLessThanFiveChars(title: string) {
    return title.length < 5 ? true : false;
  }
}
