# ProDevOpsGuy Status Dashboard

A modern, responsive status dashboard for monitoring the health and uptime of web services and applications. Built with Next.js and Tailwind CSS.

## Features

- 🚦 Real-time service status monitoring
- 📊 Uptime statistics and historical data
- 🔔 Incident reporting and history
- 🌓 Dark/light mode support
- 📱 Fully responsive design
- 🔄 Automatic refresh of status data

## Getting Started

### Prerequisites

- Node.js (v14.x or newer)
- npm or yarn

### Installation

1. Clone this repository
```bash
git clone https://github.com/yourusername/status.prodevopsguytech.com.git
cd status.prodevopsguytech.com
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the dashboard

## Project Structure

- `/components` - Reusable UI components
- `/pages` - Next.js pages and API routes
- `/lib` - Utility functions and helpers
- `/public` - Static assets
- `/styles` - Global styles and Tailwind configuration

## Customization

### Service Configuration

To add or modify the services displayed on the dashboard, edit the data source in one of these places:

- For development with mock data: `/lib/utils.js` in the `fetchMockData` function
- For API integration: `/pages/api/status.js`

### Theming

The project uses Tailwind CSS for styling. You can customize colors, fonts, and other design elements in the `tailwind.config.js` file.

## Deployment

This application can be deployed to any platform that supports Next.js applications, such as Vercel, Netlify, or a custom server.

### Deploy to Vercel

The easiest way to deploy:

```bash
npm run build
vercel --prod
```

## License

MIT

## Author

ProDevOpsGuy Tech - [https://prodevopsguytech.com](https://prodevopsguytech.com)
