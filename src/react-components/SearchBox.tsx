/** ################################################### */
/*--------------------IMPORTS-------------------------- */
/** ################################################### */
import * as React from "react";
import * as BUI from "@thatopen/ui";

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
  const searchInput = document.getElementById("search-input") as BUI.TextInput;
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      props.onChange(searchInput.value);
    });
  }

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
      <bim-text-input
        placeholder="Search projects..."
        id="search-input"
      ></bim-text-input>
    </div>
  );
}
