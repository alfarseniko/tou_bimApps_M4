import * as React from "react";
import * as BUI from "@thatopen/ui";

// declaring UI components as global to avoid recognition error by TS

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

  const sidebar = BUI.Component.create<BUI.Component>(() => {
    const buttonStyles = { height: "50px" };

    return BUI.html`
      <div style="padding: 4px">
        <bim-button
        style=${BUI.styleMap(buttonStyles)}
        icon='material-symbols:print-sharp'
        @click=${() => {
          console.log(userTable.value);
        }}
        >
        </bim-button>
        <bim-button
        style=${BUI.styleMap(buttonStyles)}
        icon='mdi:file'
        @click=${() => {
          const csvData = userTable.csv;
          const blob = new Blob([csvData], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "users.csv";
          a.click();
        }}
        >
        </bim-button>
      </div>
    `;
  });

  const footer = BUI.Component.create<BUI.Component>(() => {
    return BUI.html`
    <div style='display: flex; justify-content: center'>
      <bim-label>Made with ❤️ by Crewnix</bim-label>
    </div >
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
          const searchBox = BUI.Component.create<BUI.TextInput>(() => {
            return BUI.html`
            <bim-text-input style='padding: 4px', placeholder='Type to search users'>
          </bim-text-input>
            `;
          });

          searchBox.addEventListener("input", () => {
            userTable.queryString = searchBox.value;
          });
          return searchBox;
        })(),
        sidebar,
        content,
        footer,
      },
    },
  };

  // Initialize BIM components after mounting
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
