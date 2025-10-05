# GenAI4Health 2025 Workshop Website

This is the official website for **The Second Workshop on GenAI for Health: Potential, Trust, and Policy Compliance** at NeurIPS 2025.

## 🚀 Quick Start

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone https://github.com/jiaweixu98/genai4health2025neurips.git
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
- `npm test` - Run tests (if configured)

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

## 🚀 Deployment

The website works for both deployment locations:
- **GitHub Pages**: https://genai4health.github.io/ 
- **University of Texas**: https://aihealth.ischool.utexas.edu/GenAI4HealthNeurips2025/

### Simple Deployment Steps

1. **Build the site:**
   ```bash
   npm run build
   ```

 **For University of Texas:**
   - Upload the contents of the `build` folder to your server

The site uses relative paths for assets, so it works in both root domains and subdirectories without any configuration changes needed.

## 📄 License

This project is part of the NeurIPS 2025 workshop. All rights reserved. 