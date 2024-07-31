# SiaPeopleLearn File Service Documentation

![Sia Renterd Uploaded Files](./screenshots/0.png)

## Overview

The SiaPeopleLearn File Service is a Node.js application designed to provide a centralized service for managing files. It abstracts away the complexities of file handling and provides a clean interface for interacting with files, particularly for uploading, downloading, and streaming files from the Sia Network.

## Environment Variables

The application relies on several environment variables to function correctly. These variables are used to configure the connection to the Sia Network and to set up the application's behavior.

- `SIA_BUCKET`: The name of the Sia bucket where files will be stored.
- `SIA_BASE_URL`: The base URL of the Sia service API.
- `SIA_API_PASSWORD`: The API password required to authenticate with the Sia service.
- `ORIGIN`: The origin URL that will be used to construct the download URLs for files.
- `DOMAIN_WHITELIST`: A comma-separated list of domains that are allowed to access the file service.

## Application Structure

The application is structured around the Express.js framework and uses TypeScript for static typing. It is organized into several key components:

### `index.ts`

This is the entry point of the application. It sets up the Express server, configures middleware, and defines the routes for handling file uploads and downloads.

- The `cors` middleware is used to enable Cross-Origin Resource Sharing.
- The `fileupload` middleware is used to handle file uploads.
- Routes are defined for uploading files (`/upload`), downloading files (`/download/image/:fileId` and `/download/:folder/:fileId`), and a root route (`/`) that returns a welcome message.

### `sia.service.ts`

This service class is responsible for interacting with the Sia Network. It provides methods for uploading and downloading files.

- `uploadFile`: Handles the process of uploading a file to the Sia Network. It generates a unique identifier for the file, saves it to a local cache, and then uploads it to the Sia service.
- `downloadFile`: Retrieves a file from the Sia Network. It first checks if the file is available in the local cache and, if not, downloads it from the Sia service and saves it to the cache.

### `background.service.ts`

This service class is responsible for running background tasks that are essential for the operation of the file service. It includes a cron job that is scheduled to run daily to perform cleanup tasks.

- `deleteOldFiles`: This method is scheduled to run daily at midnight. It scans the cache directory and deletes files that have expired based on their creation time. The expiration time is set to  7 days from the file's creation.

The background service is initialized when the application starts, and it logs the start and completion of the cleanup job to the console. This ensures that the cache remains clean and that old files do not consume unnecessary storage space.

### `deserialiseUser.middleware.ts`

This middleware function is used to verify the access token provided in the request header. If the token is valid, the user's information is attached to the request object for use in subsequent middleware or route handlers.

### `filterDomains.middleware.ts`

This middleware function checks if the request origin is included in the `DOMAIN_WHITELIST`. If the origin is not whitelisted, the middleware responds with a `401 Unauthorized` status.

## Usage

To use the SiaPeopleLearn File Service, you need to set the environment variables as described above. Once configured, you can start the application using the `npm start` command. The application will listen on the port specified by the `PORT` environment variable and will be ready to handle file upload and download requests.

## Deployment

The application is containerized using Docker, which simplifies deployment and ensures consistency across different environments. The `Dockerfile` in the project root provides instructions for building a Docker image of the application.

## Contributing

Contributions to the SiaPeopleLearn File Service are welcome. Please follow the standard Git workflow for submitting pull requests and ensure that all tests pass before submitting your changes.

## License

The SiaPeopleLearn File Service is open-source software licensed under the MIT License.
