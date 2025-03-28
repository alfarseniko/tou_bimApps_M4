# BIM Project Manager

This project is a web application for managing BIM (Building Information Modeling) projects. It allows users to create, edit, delete, and track the progress of their projects, along with associated tasks. The application integrates with Firebase for data persistence and uses Three.js for 3D model visualization.

## Features

* **Project Management:** Create, edit, and delete BIM projects.  Each project includes a name, description, assigned role, status, finish date, estimated cost, and progress.
* **Task Management (To-Do's):** Add, edit, and delete tasks associated with each project.  Tasks include a description, status (Pending, Active, Finished), priority (Urgent, Normal Priority, Not Urgent), and due date.
* **Progress Tracking:**  Visualize project progress with a progress bar.
* **Cost Estimation:**  Estimate the cost of each project.
* **3D Model Viewer:** View and interact with IFC models associated with projects (using @thatopen/components).
* **Data Export/Import:** Export and import project data as JSON files.
* **Firebase Integration:**  Project and task data are stored securely in a Firebase Firestore database.
* **User Interface:** A clean and intuitive user interface built with React and styled with CSS.

## Usage

1.  **Navigate to the application:** Access the application through a web browser.
2.  **Create a new project:** Click the "New Project" button, fill out the form, and submit.
3.  **View existing projects:** The main page displays a list of existing projects. Click on a project to view its details.
4.  **Manage tasks:** In the project details view, add, edit, or delete tasks (To-Do's) associated with that project.
5.  **View 3D model (IFC):**  The project details view also includes an IFC viewer to display 3D models related to the project.
6.  **Export/Import:** Use the export/import buttons to manage project data.


## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd <project_directory>
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Start the development server:**
    ```bash
    npm run dev
    ```

## Technologies Used

* **React:** A JavaScript library for building user interfaces. Used for the frontend of the application.
* **Three.js:** A JavaScript 3D library. Used to render the 3D model viewer.
* **@thatopen/components:** A set of components for working with IFC models.  Used for the IFC model loading, rendering, and interaction in the 3D viewer.
* **@thatopen/components-front:** Frontend components related to IFC interaction.
* **@thatopen/ui:**  UI components for the application (buttons, inputs, etc.).
* **@thatopen/ui-obc:**  UI components specifically for integration with @thatopen/components.
* **Firebase:** A backend platform for developing mobile and web applications. Used for database management (Firestore).
* **TypeScript:** A superset of JavaScript that adds static typing. Used for improved code maintainability.
* **React Router:**  For handling routing and navigation between different pages (Projects and Users).
* **UUID:**  For generating unique identifiers for projects.
* **CSS:** For styling the application.
* **Vite:**  A fast build tool for frontend development.


## Dependencies

The project dependencies are listed in the `package.json` file.  A summary is as follows:

```json
{
  "@thatopen/components": "~2.2.0",
  "@thatopen/components-front": "~2.2.0",
  "@thatopen/ui": "~2.2.0",
  "@thatopen/ui-obc": "~2.2.0",
  "firebase": "10.5.2",
  "react": "18.2.0",
  "react-dom": "18.2.0",
  "react-router-dom": "6.18.0",
  "three": "0.160.1",
  "uuid": "^9.0.1"
}
```


## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Testing

No formal testing framework is currently implemented.  Testing should be added as part of future development.


*README.md was made with [Etchr](https://etchr.dev)*