# Apnastocks.in

This is a Next.js application built with Firebase Studio that provides AI-powered portfolio analysis.

## Getting Started

To run this application on your local machine, please follow the steps below.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 20 or later) and [npm](https://www.npmjs.com/) installed on your computer.

### 1. Set up your Environment Variables

The application uses Google's Generative AI. You'll need to get an API key to use it.

1.  Visit [Google AI Studio](https://aistudio.google.com/app/apikey) to get your API key.
2.  In the root directory of the project, create a new file named `.env`.
3.  Add the following line to the `.env` file, replacing `<YOUR_API_KEY>` with the key you obtained:

```
GEMINI_API_KEY=<YOUR_API_KEY>
```

### 2. Install Dependencies

Open your terminal, navigate to the project directory, and run the following command to install the necessary packages:

```bash
npm install
```

### 3. Run the Application

This application consists of a Next.js frontend and a Genkit backend for the AI features. You'll need to run both for the app to work correctly.

First, run the Next.js development server:

```bash
npm run dev
```

This will start the web application, usually on [http://localhost:9002](http://localhost:9002).

For a better development experience with AI features, you can also run the Genkit inspector in a separate terminal:

```bash
npm run genkit:watch
```

This will start the Genkit development UI on [http://localhost:4000](http://localhost:4000), where you can inspect and debug your AI flows.

Now you can open your browser and navigate to [http://localhost:9002](http://localhost:9002) to use the application.
