/** ################################################### */
/*---------------------IMPORTS------------------------- */
/** ################################################### */
import { Timestamp } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

/** ################################################### */
/*---------------------TYPES--------------------------- */
/** ################################################### */
export type Status = "Pending" | "Active" | "Finished";
export type Role = "Architect" | "Engineer" | "Developer";
export type Priority = "Urgent" | "Normal Priority" | "Not Urgent";

/** ################################################### */
/*---------------------INTERFACES---------------------- */
/** ################################################### */
export interface IProject {
  name: string;
  description: string;
  role: Role;
  status: Status;
  finishDate: Date;
}
export interface ITodo {
  description: string;
  status: Status;
  priority: Priority;
  finishDate: Date;
  id: number;
}

export class Project implements IProject {
  /** ################################################### */
  /*----------------IPROJECT PROPERTIES------------------ */
  /** ################################################### */
  name: string;
  description: string;
  status: Status;
  role: Role;
  finishDate: Date;

  /** ################################################### */
  /*----------------INTERNAL PROPERTIES------------------ */
  /** ################################################### */
  ui: HTMLDivElement;
  cost: number = Math.random() * 100000000;
  progress: number = Math.random() * 100;
  id: string;
  todo: ITodo[];
  todoUI: HTMLDivElement[];

  /** ################################################### */
  /*--------------------CONSTRUCTOR---------------------- */
  /** ################################################### */
  constructor(data: IProject, id = uuidv4()) {
    for (const key in data) {
      this[key] = data[key];
    }
    if (this.finishDate instanceof Date && isNaN(this.finishDate.getTime())) {
      this.finishDate = new Date("December 25, 2000 03:24:00");
    }
    this.id = id;
    this.todo = []; // Initialize todo array
    this.todoUI = []; // Initialize todoUI array
  }

  /** ################################################### */
  /*--------------------EDIT PROJECT--------------------- */
  /** ################################################### */
  editProject(data: IProject) {
    // time to start working again

    for (const key in data) {
      this[key] = data[key];
    }

    return this;
  }

  /** ################################################### */
  /*--------------------ADD TODO------------------------- */
  /** ################################################### */
  addTodo(data: ITodo) {
    console.log(data.finishDate);
    const dataWithId = {
      ...data,
      finishDate:
        data.finishDate instanceof Date
          ? data.finishDate
          : (data.finishDate as unknown as Timestamp).toDate(),
      id: this.todo.length + 1,
    };
    this.todo.push(dataWithId);
  }

  /** ################################################### */
  /*--------------------EDIT TODO------------------------- */
  /** ################################################### */
  editTodo(data: ITodo, id: number) {
    this.todo[id - 1] = data;
  }

  /** ################################################### */
  /*--------------------RANDOM COLOR--------------------- */
  /** ################################################### */
  randomColor() {
    const colors = ["#EDAE49", "#D1495B", "#00798C", "#30638E", "#003D5B"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  filterTodos(value: string) {
    const filteredTodos = this.todo.filter((todo) => {
      return todo.description.includes(value);
    });
    return filteredTodos;
  }
}
