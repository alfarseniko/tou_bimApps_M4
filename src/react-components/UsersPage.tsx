import * as React from "react";
import * as BUI from "@thatopen/ui";

// declaring UI components as global to avoid recognition error by TS
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "bim-grid": any;
    }
  }
}

export default function UsersPage() {
  // Create user table
  const userTable = BUI.Component.create<BUI.Table>(() => {
    const onTableCreated = (element?: Element) => {
      const table = element as BUI.Table;
      table.data = [
        {
          data: {
            Name: "Haris Waheed Bhatti",
            Task: "Become a BIM SWE",
            Role: "BIM SWE Student",
          },
        },
        {
          data: {
            Name: "Haris Waheed Bhatti",
            Task: "Become a BIM SWE",
            Role: "BIM SWE Student",
          },
        },
        {
          data: {
            Name: "Haris Waheed Bhatti",
            Task: "Become a BIM SWE",
            Role: "BIM SWE Student",
          },
        },
        {
          data: {
            Name: "Haris Waheed Bhatti",
            Task: "Become a BIM SWE",
            Role: "BIM SWE Student",
          },
        },
      ];
    };
    return BUI.html`
        <bim-table ${BUI.ref(onTableCreated)}></bim-table>
    `;
  });

  // create the panel component
  const content = BUI.Component.create<BUI.Panel>(() => {
    return BUI.html`
    <bim-panel>
        <bim-panel-section label='Tasks'>
            ${userTable}
        </bim-panel-section>
    </bim-panel>
    `;
  });

  // a set of layouts passed to bim-grid
  const gridLayout: BUI.Layouts = {
    primary: {
      template: `
        "header header" 40px
        "content sidebar" 1fr
        "footer footer" 40px
        / 1fr 60px
      `,
      elements: {
        header: (() => {
          const header = document.createElement("div");
          header.style.backgroundColor = "#641b1b66";
          return header;
        })(),
        sidebar: (() => {
          const sidebar = document.createElement("div");
          sidebar.style.backgroundColor = "#1b641b66";
          return sidebar;
        })(),
        content,
        footer: (() => {
          const footer = document.createElement("div");
          footer.style.backgroundColor = "#ff440066";
          return footer;
        })(),
      },
    },
  };

  // Initialize BIM components
  React.useEffect(() => {
    BUI.Manager.init();
    const grid = document.getElementById("bimGrid") as BUI.Grid;
    grid.layouts = gridLayout;
    grid.layout = "primary";
  }, []);
  return (
    <div>
      <bim-grid id="bimGrid"></bim-grid>
    </div>
  );
}
