/** ################################################### */
/*--------------------IMPORTS-------------------------- */
/** ################################################### */
import * as React from "react";

/** ################################################### */
/*--------------------INTERFACE------------------------ */
/** ################################################### */
interface Props {
  onChange: (value: string) => void;
}

/** ################################################### */
/*--------------------REACT FUNCTION------------------- */
/** ################################################### */
export default function SearchBox(props: Props) {
  /** ################################################### */
  /*--------------JSX RETURN VALUE----------------------- */
  /** ################################################### */
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        columnGap: 10,
        width: "40%",
      }}
    >
      <input
        onChange={(e) => {
          props.onChange(e.target.value);
        }}
        type="text"
        placeholder="Search projects by name..."
        style={{
          width: "100%",
          height: "40px",
          backgroundColor: "var(--baackground-100)",
        }}
      />
    </div>
  );
}
