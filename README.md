# GenAI4Health 2025 Workshop Website

This is the official website for **The Second Workshop on GenAI for Health: Potential, Trust, and Policy Compliance** at NeurIPS 2025.

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd GenAI4Health2025
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` to view the website.

The development server will automatically reload when you make changes to the code.

## 📱 Testing on Different Devices with ngrok

To test the website on mobile devices or share it with others, you can use ngrok to create a public tunnel.

### Setup ngrok

1. **Install ngrok**
   - Download from [ngrok.com](https://ngrok.com/)
   - Or install via npm: `npm install -g ngrok`

2. **Start your local development server**
   ```bash
   npm start
   ```

3. **Create a public tunnel**
   ```bash
   ngrok http 3000
   ```

4. **Access your website**
   - ngrok will provide a public URL (e.g., `https://abc123.ngrok.io`)
   - Share this URL with others or use it to test on different devices
   - The tunnel will automatically forward all requests to your local server

### ngrok Tips
- The free version of ngrok provides a random URL each time
- For consistent URLs, consider upgrading to a paid ngrok account
- The tunnel will close when you stop the ngrok process

## 🌐 Deploy to GitHub Pages

### Automatic Deployment (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **Deploy from a branch**
   - Choose the **main** branch and **root** folder
   - Click **Save**

3. **Build and deploy**
   ```bash
   npm run build
   npm run deploy
   ```

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

3. **Access your deployed site**
   Your website will be available at: `https://<your-username>.github.io/<repo-name>`

### GitHub Pages Configuration

Make sure your `package.json` includes the `homepage` field:

```json
{
  "homepage": "https://<your-username>.github.io/<repo-name>",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

## 📁 Project Structure

```
GenAI4Health2025/
├── public/
│   ├── data/
│   │   └── images/
│   │       ├── bg/
│   │       ├── logo/
│   │       ├── organizers/
│   │       └── speakers/
│   └── index.html
├── src/
│   ├── App.js          # Main application component
│   ├── index.js        # Entry point
│   └── index.css       # Global styles
├── package.json
└── README.md
```

## 🛠️ Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run deploy` - Deploy to GitHub Pages
- `npm test` - Run tests (if configured)
- `npm run eject` - Eject from Create React App (not recommended)

## 🎨 Features

- **Responsive Design** - Works on desktop, tablet, and mobile
- **Smooth Scrolling** - Navigation with smooth scroll animations
- **Speaker Information** - Detailed speaker profiles and keynote information
- **Interactive Agenda** - Complete workshop schedule
- **Call for Papers** - Submission guidelines and important dates
- **Organizer Profiles** - Information about workshop organizers

## 📞 Contact

For questions about the workshop:
- **Jiawei Xu**: jiaweixu@utexas.edu
- **Tiange Xiang**: xtiange@stanford.edu

For technical issues with the website, please open an issue on GitHub.

## 📄 License

This project is part of the NeurIPS 2025 workshop. All rights reserved. 