# Campus Scribe Insights

## Cross-Platform Compatibility

This project has been configured to work seamlessly on both Windows and Linux environments. The platform-specific dependencies have been removed, and the configuration has been standardized.

## Development

To start the development server:

```bash
npm run dev
```

## Building for Production

To build the project for production:

```bash
npm run build
```

## Deployment

To prepare the project for deployment:

```bash
npm run pre-deploy
```

This will:
1. Update the `.npmrc` file with platform-agnostic settings
2. Build the project for production

## Key Changes for Cross-Platform Compatibility

1. Removed platform-specific rollup packages
2. Added optional dependencies for SWC bindings for both Windows and Linux
3. Created a platform-agnostic `.npmrc` configuration
4. Updated the `deploy.js` script to use ES modules and create a cross-platform compatible configuration

## Environment Setup

The project now uses the following configuration:
- Node.js with ES modules
- Vite for building and bundling
- React with TypeScript
- SWC for fast compilation

No manual changes are required when switching between development environments or deploying to production servers.

# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/46ace477-9b09-4f55-89cc-b2dd250617c3

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/46ace477-9b09-4f55-89cc-b2dd250617c3) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/46ace477-9b09-4f55-89cc-b2dd250617c3) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
