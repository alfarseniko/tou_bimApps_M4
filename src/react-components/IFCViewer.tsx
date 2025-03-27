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
import { modelNormalMatrix } from "three/examples/jsm/nodes/Nodes.js";

export default function IFCViewer() {
  const components = new OBC.Components();
  let fragmentsModel: FG.FragmentsGroup | undefined;
  const [classificationTree, updateClassificationTree] =
    CUI.tables.classificationTree({ components, classifications: [] }, true);

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

    const cullers = components.get(OBC.Cullers);
    const culler = cullers.create(world);

    const fragmentsManager = components.get(OBC.FragmentsManager);
    fragmentsManager.onFragmentsLoaded.add(async (model) => {
      world.scene.three.add(model);

      if (model.hasProperties) {
        processModel(model);
      }

      for (const frag of model.items) {
        culler.add(frag.mesh);
      }
      culler.needsUpdate = true;

      fragmentsModel = model;
    });

    world.camera.controls.addEventListener("controlend", () => {
      culler.needsUpdate = true;
    });

    const processModel = async (model) => {
      const indexer = components.get(OBC.IfcRelationsIndexer);
      await indexer.process(model);

      const classifier = components.get(OBC.Classifier);
      await classifier.byPredefinedType(model);
      await classifier.bySpatialStructure(model);

      console.log(classifier.list);

      const classifications = [
        {
          system: "predefinedTypes",
          label: "Predefined Types",
        },
        {
          system: "spatialStructures",
          label: "Spatial Containers",
        },
      ];

      if (updateClassificationTree) {
        updateClassificationTree({ classifications });
        console.log(classificationTree);
      }
    };
    const highlighter = components.get(OBCF.Highlighter);
    highlighter.setup({ world });
    highlighter.zoomToSelection = true;

    viewerContainer.addEventListener("resize", () => {
      rendererComponent.resize();
      cameraComponent.updateAspect();
    });

    const { postproduction } = world.renderer;
    postproduction.enabled = true;
  }

  function setUI() {
    const onFragmentDispose = () => {
      const fragmentsManager = components.get(OBC.FragmentsManager);
      for (const [, group] of fragmentsManager.groups) {
        fragmentsManager.disposeGroup(group);
      }
      fragmentsModel = undefined;
    };

    const onFragmentExport = () => {
      if (!fragmentsModel) return;
      const fragmentsManager = components.get(OBC.FragmentsManager);
      const fragmentBinary = fragmentsManager.export(fragmentsModel);
      const blob = new Blob([fragmentBinary]);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fragmentsModel.name}.frag`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const onFragmentImport = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".frag";
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const binary = reader.result;
        if (!(binary instanceof ArrayBuffer)) {
          return;
        }
        const fragmentBinary = new Uint8Array(binary);
        const fragmentsManager = components.get(OBC.FragmentsManager);
        fragmentsManager.load(fragmentBinary);
      });
      input.addEventListener("change", () => {
        const filesList = input.files;
        if (!filesList) {
          return;
        }
        reader.readAsArrayBuffer(filesList[0]);
      });
      input.click();
    };
    const onPropertiesExport = () => {
      if (!fragmentsModel) return;
      const properties = JSON.stringify(
        fragmentsModel.getLocalProperties(),
        null,
        2
      );
      const blob = new Blob([properties], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fragmentsModel.name}.json`;
      a.click();
      URL.revokeObjectURL(url);
    };

    const onPropertiesImport = () => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const json = reader.result;
        if (!json) {
          return;
        }
        const properties = JSON.parse(json as string) as FG.IfcProperties;

        fragmentsModel?.setLocalProperties(properties);
      });
      input.addEventListener("change", () => {
        const filesList = input.files;
        if (!filesList) {
          return;
        }
        reader.readAsText(filesList[0]);
      });
      input.click();
    };

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
      highlighter.events.select.onClear.add(() => {
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

    const onClassifier = () => {
      if (!floatingGrid) return;
      if (floatingGrid.layout !== "classifier") {
        floatingGrid.layout = "classifier";
      } else {
        floatingGrid.layout = "main";
      }
    };

    const classifierPanel = BUI.Component.create<BUI.Panel>(() => {
      return BUI.html`
      <bim-panel>
        <bim-panel-section
        name='classifier'
        label='Classifier'
        icon='solar:document-bold'
        fixed
        >
          <bim-lable>Classification</bim-label>
          ${classificationTree}
        </bim-panel-section>
      </bim-panel>
      `;
    });

    const onWorldUpdate = () => {
      if (!floatingGrid) return;
      if (floatingGrid.layout !== "world") {
        floatingGrid.layout = "world";
      } else {
        floatingGrid.layout = "main";
      }
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

    const onSpatialUpdate = () => {
      if (floatingGrid.layout != "spatial") {
        floatingGrid.layout = "spatial";
      } else {
        floatingGrid.layout = "main";
      }
    };
    const spatialPanel = BUI.Component.create<BUI.Panel>(() => {
      const [relationsTree] = CUI.tables.relationsTree({
        components,
        models: [],
      }); // 2nd attr 'false' if no auto-update
      relationsTree.preserveStructureOnFilter = true;
      const search = (e: Event) => {
        const input = e.target as BUI.TextInput;
        relationsTree.queryString = input.value;
      };

      return BUI.html`
      <bim-panel>
        <bim-panel-section
        name = 'spatial'
        label= 'Spatial Information'
        icon = 'solar:document-bold'
        fixed>
        <bim-text-input placeholder="Search..." @input=${search}></bim-text-input>
        ${relationsTree}
        </bim-panel-section>
      </bim-panel>

      `;
    });

    const toolbar = BUI.Component.create<BUI.Toolbar>(() => {
      const [loadIfcBtn] = CUI.buttons.loadIfc({ components: components });
      loadIfcBtn.tooltipTitle = "Load IFC";
      loadIfcBtn.label = "";

      return BUI.html`
        <bim-toolbar style="justify-self: center">
          <bim-toolbar-section label="Import">
            ${loadIfcBtn}
          </bim-toolbar-section>
          <bim-toolbar-section label="Fragments">
            <bim-button
            tooltip="Export"
            icon="mdi:cube"
            @click=${onFragmentExport}>
            </bim-button>
            <bim-button
            tooltip="Import"
            icon="tabler:package-export"
            @click=${onFragmentImport}>
            </bim-button>
            <bim-button
            tooltip="Dispose"
            icon="tabler:trash"
            @click=${onFragmentDispose}>
            </bim-button>
          </bim-toolbar-section>
          <bim-toolbar-section label="Model Properties">
            <bim-button
            tooltip="Export"
            icon="mdi:cube"
            @click=${onPropertiesExport}>
            </bim-button>
            <bim-button
            tooltip="Import"
            icon="tabler:package-export"
            @click=${onPropertiesImport}>
            </bim-button>
          </bim-toolbar-section>
          <bim-toolbar-section label="App">
            <bim-button
            tooltip="World"
            icon="tabler:brush"
            @click=${onWorldUpdate}>
            </bim-button>
            <bim-button
            tooltip="Spatial Data"
            icon="tabler:brush"
            @click=${onSpatialUpdate}>
            </bim-button>
          </bim-toolbar-section>
          <bim-toolbar-section label="Selection">
            <bim-button tooltip="Visibility" icon="material-symbols:visibility-outline" @click=${onToggleVisibility}>
              </bim-button>
              <bim-button tooltip="Isolate" icon="mdi:filter" @click=${onIsolate}>
                </bim-button>
                <bim-button tooltip="Show All" icon="tabler:eye-filled" @click=${onShowAll}>
                  </bim-button>
                </bim-toolbar-section>
              
              <bim-toolbar-section collapsed label="Property">
                  <bim-button tooltip="Show" icon="clarity:list-line" @click=${onShowProperties}>
                  </bim-button>
              </bim-toolbar-section>
              <bim-toolbar-section collapsed label="Groups">
                  <bim-button tooltip="Classifier" icon="tabler:eye-filled" @click=${onClassifier}>
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
      spatial: {
        template: `
            "empty spatialPanel" 1fr
            "toolbar toolbar" auto
            /1fr 20rem
        `,
        elements: { toolbar, spatialPanel },
      },
      classifier: {
        template: `
            "empty classifierPanel" 1fr
            "toolbar toolbar" auto
            /1fr 20rem
        `,
        elements: { toolbar, classifierPanel },
      },
    };

    floatingGrid.layout = "main";
    const viewerContainer = document.getElementById(
      "viewer-container"
    ) as HTMLElement;
    viewerContainer.appendChild(floatingGrid);
  }

  React.useEffect(() => {
    setTimeout(() => {
      setViewer();
      setUI();
    });

    return () => {
      components.dispose();
      fragmentsModel?.dispose();
      fragmentsModel = undefined;
    };
  }, []);

  return <bim-viewport id="viewer-container" />;
}
