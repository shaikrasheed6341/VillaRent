# Villa Rent Project

## Overview
The Villa Rent Project is a web application that allows users to manage a list of villas available for rent. Users can add villa details, including the price and location, view the list of villas, update villa information, and delete entries as needed. The application also features form validation to ensure proper data input.

## Features
- **CRUD Operations**: 
  - Create: Add new villas with details like price and location.
  - Read: View a list of all villas.
  - Update: Edit existing villa information.
  - Delete: Remove villas from the list.
- **Form Validation**: Ensures accurate data entry when adding or updating villas.
- **Responsive Design**: User-friendly interface to navigate villa listings.

## Tech Stack
- **Backend**: Express.js
- **Database**: MongoDB
- **Frontend**: EJS (Embedded JavaScript) templates
- **Languages**: JavaScript, HTML, CSS

## Getting Started

### Prerequisites
Ensure you have the following installed:
- Node.js
- MongoDB

### Installation
1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```
2. Navigate to the project directory:
   ```bash
   cd villa-rent-project
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the MongoDB server locally:
   ```bash
   mongod
   ```

### Configuration
1. Create a `.env` file in the root directory and set up the following variables:
   ```env
   MONGO_URI=<your_mongodb_connection_string>
   PORT=3000
   ```

### Running the Application
1. Start the server:
   ```bash
   npm start
   ```
2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure
```
|-- public
|   |-- css
|-- views
|   |-- index.ejs
|   |-- add-villa.ejs
|   |-- edit-villa.ejs
|-- routes
|   |-- villaRoutes.js
|-- models
|   |-- Villa.js
|-- app.js
|-- package.json
```

## How to Contribute
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Description of changes"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.

## License
This project is licensed under the [MIT License](LICENSE).

## Acknowledgments
- Thanks to the open-source community for the tools and resources used in this project.
