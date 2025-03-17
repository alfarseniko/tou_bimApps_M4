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
          <bim-label
            style={{ fontSize: "16px", color: "#fff", fontWeight: "bold" }}
          >
            {props.project.name}
          </bim-label>
          <bim-label style={{ color: "#fff" }}>
            {props.project.description}
          </bim-label>
        </div>
      </div>
      <div className="card-content">
        <div className="card-property">
          <p style={{ color: "#969696" }}>Status</p>
          <bim-label style={{ color: "#fff" }}>
            {props.project.status}
          </bim-label>
        </div>
        <div className="card-property">
          <p style={{ color: "#969696" }}>Role</p>
          <bim-label style={{ color: "#fff" }}>{props.project.role}</bim-label>
        </div>
        <div className="card-property">
          <p style={{ color: "#969696" }}>Cost</p>
          <bim-label style={{ color: "#fff" }}>
            ${Math.ceil(props.project.cost)}
          </bim-label>
        </div>
        <div className="card-property">
          <p style={{ color: "#969696" }}>Estimated Progress</p>
          <bim-label style={{ color: "#fff" }}>
            {Math.floor(props.project.progress)}%
          </bim-label>
        </div>
      </div>
    </div>
  );
}
