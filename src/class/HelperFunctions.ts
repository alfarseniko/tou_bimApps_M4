import { Status } from "./Project";

export function toggleModal(id: string) {
  const modal = document.getElementById(id) as HTMLDialogElement;
  if (modal.open) {
    modal.close();
  } else {
    modal.showModal();
  }
}

/*--------------------TODO COLOR------------------- */
export function todoColour(status: Status) {
  if (status == "Active") {
    return "#007bff";
  }
  if (status == "Finished") {
    return "#28a745";
  } else {
    return "#f4c542";
  }
}
