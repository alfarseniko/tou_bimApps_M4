export class ErrorPopup {
  /** This class contains two private functions and
   *  a constructor to render a popup error for any
   *  custom message.
   */
  constructor(errorMessage: string) {
    // constructor() only takes one input which is the error message
    this.popup(errorMessage);
  }

  /**   This function creates all the necessary HTML and
   *    injects it into the main file to render a popup
   *    error
   */
  private popup(errorMessage: string) {
    // PARENT element details
    const errorContainer = document.createElement("dialog");
    errorContainer.id = "error-modal";
    errorContainer.style.cssText = `    
    width: 320px;
    background: #26282b;
    border-radius: 12px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    overflow: hidden;
`;

    // CHILDREN 1st gen details
    const errorHeader = document.createElement("div");
    errorHeader.style.cssText = `
    background-color: #e74c3c;
    padding: 10px 0px 8px 0px;`;

    const errorBody = document.createElement("div");
    errorBody.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;`;

    errorContainer.appendChild(errorHeader);
    errorContainer.appendChild(errorBody);

    // CHILDREN 2nd gen (Header) details
    const errorIcon = document.createElement("img");
    errorIcon.src = "https://img.icons8.com/ios-filled/50/ffffff/error.png";
    errorIcon.alt = "Warning Icon";
    errorIcon.style.cssText = `
    width: 40px;`;

    errorHeader.appendChild(errorIcon);

    // CHILDREN 2nd gen (Body) details
    const errorTitle = document.createElement("h2");
    errorTitle.innerText = "Warning!";
    errorTitle.style.cssText = `
    color:rgb(211, 212, 212);
    margin: 10px 0;
    font-size: 22px;`;

    const errorText = document.createElement("p");
    errorText.innerText = errorMessage;
    errorText.style.cssText = `
    color: #7f8c8d;
    font-size: 14px;`;

    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.type = "button";
    closeButton.style.cssText = `
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 10px 20px;
    margin-top: 20px;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    border-radius: 6px;
    cursor: pointer;`;
    closeButton.addEventListener("click", () => {
      this.toggleModal("error-modal");
    });

    errorBody.appendChild(errorTitle);
    errorBody.appendChild(errorText);
    errorBody.appendChild(closeButton);

    // Adding errorContainer dialog to main HTML

    const page = document.getElementById("projects-page") as HTMLDivElement;
    page.appendChild(errorContainer);
    this.toggleModal("error-modal");
  }

  /**   Function to open and close the error popup */
  private toggleModal(id: string) {
    const modal = document.getElementById(id) as HTMLDialogElement;
    if (modal.open) {
      modal.close();
    } else {
      modal.showModal();
    }
  }
}
