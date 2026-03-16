# IVR Elderly Reminder System

This is a comprehensive Interactive Voice Response (IVR) and Reminder System built using Java and Spring Boot. The primary goal of this application is to manage user profiles, handle emergency contacts, and schedule reminders for the elderly.

## Features

* **User Management**: Register and manage elderly user profiles including their contact information, location, and preferred language.
* **Authentication and Security**: Secured endpoints using Spring Security with basic authentication.
* **Emergency Contacts**: Manage emergency contact information for users.
* **Reminders & Scheduling**: Set up and manage automated reminders using Spring's scheduling capabilities.
* **Frontend Dashboard**: A responsive, mobile-friendly web interface (HTML/CSS/JS) to interact with the backend APIs.
* **In-Memory Database**: Utilizes an H2 in-memory database for rapid development and testing without external database dependencies.

## Technologies Used

* **Backend**: Java, Spring Boot, Spring Web
* **Security**: Spring Security
* **Data Access**: Spring Data JPA, Hibernate
* **Database**: H2 Database (In-Memory)
* **Frontend**: HTML5, Vanilla CSS, JavaScript
* **Build Tool**: Maven

## Getting Started

### Prerequisites

* Java Development Kit (JDK) 17 or higher
* Maven 3.6+

### Running the Application Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ragampudi7/Ivr_jfs.git
   cd Ivr_jfs
   ```

2. **Run with Maven:**
   You can start the Spring Boot application using the Maven Wrapper or your local Maven installation:
   ```bash
   mvn spring-boot:run
   ```

3. **Access the Frontend:**
   Once the application is running, open your web browser and navigate to:
   * **URL**: [http://localhost:8080](http://localhost:8080)

4. **Login Credentials:**
   By default, the application is protected by Spring Security. Use the following credentials to access the frontend or API endpoints:
   * **Username**: `admin`
   * **Password**: `admin123`

### Accessing the H2 Database Console

The H2 database console is enabled for development and debugging purposes.
* **URL**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
* **JDBC URL**: `jdbc:h2:mem:ivrdb`
* **Username**: `sa`
* **Password**: `password`

## Project Structure

* `src/main/java/com/ivr/`: Contains the core Java source code (Controllers, Services, Models, Repositories, Security Configurations).
* `src/main/resources/`: Contains configuration files like `application.properties` and the `static/` directory for frontend assets (`index.html`, `app.js`, `styles.css`).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-source and available under the MIT License.
