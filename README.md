# Setting up IQDSTEAM22 Environment

This guide will walk you through setting up the IQDSTEAM22 environment. Follow these steps carefully to ensure a smooth setup process.

## Prerequisites

Before you begin, make sure you have the following installed on your system:

- [Node.js](https://nodejs.org/en/download)
- [Python](https://www.python.org/downloads/) (added to PATH)

## Installation Steps

1. **Install Node.js:**

   Download and install Node.js from the [official website](https://nodejs.org/en/download) according to your operating system.

2. **Install Python:**

   Download and install Python from the [official website](https://www.python.org/downloads/). Make sure to add Python to your system's PATH during installation.

3. **Install React Scripts:**

   Open your terminal and navigate to the `IQDSTEAM22-MASTER` directory.

   ```bash
   npm install react-scripts
   ```

   No need to audit or fix any problems that may arise during installation.

4. **Install AWS Amplify CLI:**

   ```bash
   npm install -g @aws-amplify/cli
   ```

5. **Configure AWS Amplify:**

   Run the following command:

   ```bash
   amplify pull
   ```

   Follow the prompts:

   - Select "AWS access keys" as the authentication method.
   - Enter the provided access key ID and secret access key:

     - Access Key ID: (provided in project hand off)
     - Secret Access Key: (provided in project hand off)

   - Choose the region as `us-east-1`.
   - Select the app you're working on (`QAdetection`).
   - Choose your default editor (e.g., Visual Studio Code).

6. **Initialize Backend Environment:**

   After configuring AWS Amplify, the backend environment 'dev' will be found and initialized. Follow any additional prompts as needed.

7. **Specify Project Details:**

   Provide information about your project:

   - Select the type of app you're building (e.g., JavaScript).
   - Specify the source directory path (`src`).
   - Specify the distribution directory path (`build`).
   - Provide the build command (`npm run-script build`).
   - Provide the start command (`npm run-script start`).
   - If you don't plan on modifying the backend, choose "No" when prompted.

8. **Start the Application:**

   Finally, start the application using the following command:

   ```bash
   npm start
   ```

   This command will start the development server and open the application in your default web browser.

## Additional Notes

- Make sure to follow each step carefully to ensure proper setup.
- If you encounter any issues during setup, feel free to reach out for assistance.
