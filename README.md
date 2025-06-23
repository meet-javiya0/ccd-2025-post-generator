# CCD 2025 Post Generator

This is a Next.js application that helps attendees of Cloud Community Days 2025 generate personalized social media posts about their experience. It uses Google's Gemini AI via Genkit to craft posts for LinkedIn and X (formerly Twitter).

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/meet-javiya0/ccd-2025-post-generator.git
    cd https://github.com/meet-javiya0/ccd-2025-post-generator.git
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a file named `.env` in the root of your project and add your Google AI API key. You can get a key from [Google AI Studio](https://aistudio.google.com/app/apikey).

    ```env
    GOOGLE_API_KEY=your_google_api_key_here
    ```

### Running Locally

To run the application, you need to start both the Next.js development server and the Genkit development server in separate terminal windows.

1.  **Start the Next.js server:**
    ```bash
    npm run dev
    ```
    This will start the web application, typically on `http://localhost:9002`.

2.  **Start the Genkit server:**
    In a new terminal window, run:
    ```bash
    npm run genkit:dev
    ```
    This starts the Genkit AI flows, which are used by the application to generate posts. By default, this will be available for the Next.js server to call.

Now, you can open your browser and navigate to `http://localhost:9002` to use the application.
