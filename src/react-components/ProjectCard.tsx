/** ################################################### */
/*--------------------IMPORTS-------------------------- */
/** ################################################### */
import * as React from "react";
import { Project } from "../class/Project";

/** ################################################### */
/*--------------------INTERFACE------------------------ */
/** ################################################### */
interface Props {
  project: Project;
}
/** ################################################### */
/*--------------------REACT FUNCTION------------------- */
/** ################################################### */
export function ProjectCard(props: Props) {
  /** ################################################### */
  /*--------------JSX RETURN VALUE----------------------- */
  /** ################################################### */
  return (
    <div className="project-card">
      <div className="card-header">
        <p
          style={{
            backgroundColor: props.project.randomColor(),
            padding: 10,
            borderRadius: 8,
            aspectRatio: 1,
            textTransform: "uppercase",
          }}
        >
          {props.project.name[0] + props.project.name[1]}
        </p>
        <div>
          <h5>{props.project.name}</h5>
          <p>{props.project.description}</p>
        </div>
      </div>
      <div className="card-content">
        <div className="card-property">
          <p style={{ color: "#969696" }}>Status</p>
          <p>{props.project.status}</p>
        </div>
        <div className="card-property">
          <p style={{ color: "#969696" }}>Role</p>
          <p>{props.project.role}</p>
        </div>
        <div className="card-property">
          <p style={{ color: "#969696" }}>Cost</p>
          <p>{props.project.cost}</p>
        </div>
        <div className="card-property">
          <p style={{ color: "#969696" }}>Estimated Progress</p>
          <p>{props.project.progress}</p>
        </div>
      </div>
    </div>
  );
}
