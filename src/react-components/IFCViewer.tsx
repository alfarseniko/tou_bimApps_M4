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

    const onShowProperties = () => {
      if (!fragmentsModel) {
        return;
      }
      // fragmentsManager -> list -> fragmentID -> fragmentInstance -> indexer
      const highlighter = components.get(OBCF.Highlighter);
      const selection = highlighter.selection.select;
      const indexer = components.get(OBC.IfcRelationsIndexer);
      const fragmentsManager = components.get(OBC.FragmentsManager);

      for (const fragmentID in selection) {
        const fragment = fragmentsManager.list.get(fragmentID);
        const model = fragment?.group;
        const expressIDs = selection[fragmentID];
        if (!model) continue;
        for (const id of expressIDs) {
          const psets = indexer.getEntitiesWithRelation(
            model,
            "ContainsElements",
            id
          );
          console.log(psets);
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

    const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
      const [loadIfcBtn] = CUI.buttons.loadIfc({ components: components });

      return BUI.html`
        <bim-toolbar style="justify-self: center">
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
