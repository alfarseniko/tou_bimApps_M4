/** ################################################### */
/*--------------------IMPORTS-------------------------- */
/** ################################################### */
import * as React from "react";
import * as THREE from "three";
import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";
import * as BUI from "@thatopen/ui";
import * as CUI from "@thatopen/ui-obc";
import * as FG from "@thatopen/fragments";

export default function IFCViewer() {
  const components = new OBC.Components();
  let fragmentsModel: FG.FragmentsGroup | undefined;

  function setViewer() {
    const worlds = components.get(OBC.Worlds);
    const world = worlds.create<
      OBC.SimpleScene,
      OBC.OrthoPerspectiveCamera,
      OBCF.PostproductionRenderer
    >();
    const sceneComponent = new OBC.SimpleScene(components);
    world.scene = sceneComponent;
    world.scene.setup();

    const viewerContainer = document.getElementById(
      "viewer-container"
    ) as HTMLElement;
    const rendererComponent = new OBCF.PostproductionRenderer(
      components,
      viewerContainer
    );
    world.renderer = rendererComponent;

    const cameraComponent = new OBC.OrthoPerspectiveCamera(components);
    world.camera = cameraComponent;
    cameraComponent.updateAspect();
    cameraComponent.controls.setLookAt(10, 10, 10, 0, 0, 0);

    components.init();

    const ifcLoader = components.get(OBC.IfcLoader);
    ifcLoader.setup();

    const fragmentsManager = components.get(OBC.FragmentsManager);
    fragmentsManager.onFragmentsLoaded.add(async (model) => {
      world.scene.three.add(model);

      fragmentsModel = model;

      const indexer = components.get(OBC.IfcRelationsIndexer);
      await indexer.process(model);
    });

    const highlighter = components.get(OBCF.Highlighter);
    highlighter.setup({ world });
    highlighter.zoomToSelection = true;

    viewerContainer.addEventListener("resize", () => {
      rendererComponent.resize();
      cameraComponent.updateAspect();
    });

    const { postproduction } = world.renderer;
    postproduction.enabled = true;

    const onToggleVisibility = () => {
      // highlighter component
      const highlighter = components.get(OBCF.Highlighter);
      // hider component
      const hider = components.get(OBC.Hider);
      // fragments manager component
      const fragments = components.get(OBC.FragmentsManager);
      // FragmentIdMap {{fragmentId} : [ExpressIds], ..., ...}
      const selection = highlighter.selection.select;
      if (Object.keys(selection).length === 0) {
        return;
      }
      for (const fragmentID in selection) {
        const fragment = fragments.list.get(fragmentID);
        const expressIDs = selection[fragmentID];
        for (const id of expressIDs) {
          if (!fragment) continue;
          const isHidden = fragment.hiddenItems.has(id);
          if (isHidden) {
            hider.set(true, selection);
          } else {
            hider.set(false, selection);
          }
        }
      }
    };

    const onIsolate = () => {
      const highlighter = components.get(OBCF.Highlighter);
      const hider = components.get(OBC.Hider);
      const selection = highlighter.selection.select;
      hider.isolate(selection);
    };

    const onShowAll = () => {
      const hider = components.get(OBC.Hider);
      hider.set(true);
    };

    const onShowProperties = async () => {
      // fragmentsManager -> list -> fragmentID -> fragmentInstance -> indexer
      const highlighter = components.get(OBCF.Highlighter);
      const selection = highlighter.selection.select;
      const indexer = components.get(OBC.IfcRelationsIndexer);
      const fragmentsManager = components.get(OBC.FragmentsManager);

      for (const fragmentID in selection) {
        const fragment = fragmentsManager.list.get(fragmentID);
        console.log(fragment);
        const model = fragment?.group;
        const expressIDs = selection[fragmentID];
        if (!model) continue;
        for (const id of expressIDs) {
          const psets = indexer.getEntitiesWithRelation(
            model,
            "ContainsElements",
            id
          );
          if (psets) {
            for (const expressID of psets) {
              const prop = await model.getProperties(expressID);
              console.log(prop);
            }
          }
        }
      }
    };

    const floatingGrid = BUI.Component.create<BUI.Grid>(() => {
      return BUI.html`
        <bim-grid
        floating
        style = 'padding: 20px'
        ></bim-grid>
      `;
    });

    const elementPropertyPanel = BUI.Component.create<BUI.Panel>(() => {
      const [propsTable, updatePropsTable] = CUI.tables.elementProperties({
        components,
        fragmentIdMap: {},
      });

      const highlighter = components.get(OBCF.Highlighter);
      highlighter.events.select.onHighlight.add((fragmentIdMap) => {
        if (!floatingGrid) return;
        floatingGrid.layout = "secondary";
        updatePropsTable({ fragmentIdMap });
        propsTable.expanded = false;
      });
      highlighter.events.select.onClear.add((fragmentIdMap) => {
        updatePropsTable({ fragmentIdMap: {} });
        if (!floatingGrid) return;
        floatingGrid.layout = "main";
      });

      const search = (e: Event) => {
        const input = e.target as BUI.TextInput;
        propsTable.queryString = input.value;
      };

      return BUI.html`
      <bim-panel>
        <bim-panel-section
        name = 'property'
        label= 'Property Information'
        icon = 'solar:document-bold'
        fixed>
        <bim-text-input placeholder="Search..." @input=${search}></bim-text-input>
        ${propsTable}
        </bim-panel-section>
      </bim-panel>

      `;
    });

    const onWorldUpdate = () => {
      if (!floatingGrid) return;
      floatingGrid.layout = "world";
    };

    const worldPanel = BUI.Component.create<BUI.Panel>(() => {
      const [worldTable] = CUI.tables.worldsConfiguration({ components });
      const search = (e: Event) => {
        const input = e.target as BUI.TextInput;
        worldTable.queryString = input.value;
      };

      return BUI.html`
      <bim-panel>
        <bim-panel-section
        name = 'world'
        label= 'World Information'
        icon = 'solar:document-bold'
        fixed>
        <bim-text-input placeholder="Search..." @input=${search}></bim-text-input>
        ${worldTable}
        </bim-panel-section>
      </bim-panel>

      `;
    });

    const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
      const [loadIfcBtn] = CUI.buttons.loadIfc({ components: components });

      return BUI.html`
        <bim-toolbar style="justify-self: center">
          <bim-toolbar-section label="App">
            <bim-button
            label="World"
            icon="tabler:brush"
            @click=${onWorldUpdate}>
            </bim-button>
          </bim-toolbar-section>
          <bim-toolbar-section label="Import">
            ${loadIfcBtn}
          </bim-toolbar-section>
          <bim-toolbar-section collapsed label="Ambient Oclussion">
            <bim-checkbox label="AO enabled"
              @change=${({ target }: { target: BUI.Checkbox }) => {
                postproduction.setPasses({ ao: target.value });
              }}>
            </bim-checkbox> 
          </bim-toolbar-section>
          <bim-toolbar-section label="Selection">
            <bim-button label="Visibility" icon="material-symbols:visibility-outline" @click=${onToggleVisibility}>
              </bim-button>
              <bim-button label="Isolate" icon="mdi:filter" @click=${onIsolate}>
                </bim-button>
                <bim-button label="Show All" icon="tabler:eye-filled" @click=${onShowAll}>
                  </bim-button>
                </bim-toolbar-section>
              
              <bim-toolbar-section collapsed label="Property">
                  <bim-button label="Show" icon="clarity:list-line" @click=${onShowProperties}>
                  </bim-button>
              </bim-toolbar-section>
              </bim-toolbar>
              `;
    });

    floatingGrid.layouts = {
      main: {
        template: `
            "empty" 1fr
            "toolbar" auto
            /1fr
        `,
        elements: { toolbar },
      },
      secondary: {
        template: `
            "empty elementPropertyPanel" 1fr
            "toolbar toolbar" auto
            /1fr 20rem
        `,
        elements: { toolbar, elementPropertyPanel },
      },
      world: {
        template: `
            "empty worldPanel" 1fr
            "toolbar toolbar" auto
            /1fr 20rem
        `,
        elements: { toolbar, worldPanel },
      },
    };

    floatingGrid.layout = "main";

    viewerContainer.appendChild(floatingGrid);
  }

  function renderScene() {}

  React.useEffect(() => {
    setViewer();
    // setupUI();

    return () => {
      components.dispose();
      fragmentsModel?.dispose();
      fragmentsModel = undefined;
    };
  }, []);

  return <bim-viewport id="viewer-container" />;
}
