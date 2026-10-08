```markdown
# Open Source MRI

Open Source MRI is a GitHub repository analysis tool that helps developers understand unfamiliar codebases faster.

It analyzes a repository and provides information about its structure, technologies, architecture, dependencies, code flow, and file relationships through an interactive dashboard.

## Features

- GitHub repository scanning
- Repository statistics
- Programming language detection
- Directory structure analysis
- Important file detection
- Architecture detection
- Interactive code flow visualization
- Dependency analysis
- Dependent file analysis
- Change impact analysis
- Risk level calculation
- File inspector
- AI-powered repository analysis
- AI-powered file explanation
- Repository insights
- Engineering recommendations

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- React Flow
- Lucide React
- CSS

### Backend

- Node.js
- Express.js
- GitHub REST API
- REST API

### AI

- Google Gemini API
- @google/genai

## Project Structure

```text
open_source_mri/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RepoInput.jsx
│   │   │   ├── ReportDashboard.jsx
│   │   │   ├── ArchitectureGraph.jsx
│   │   │   ├── AnalyzePanel.jsx
│   │   │   ├── ExplorePanel.jsx
│   │   │   └── InsightsPanel.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── scanController.js
│   │   ├── services/
│   │   │   ├── githubService.js
│   │   │   ├── repositoryService.js
│   │   │   ├── languageService.js
│   │   │   ├── architectureService.js
│   │   │   └── aiService.js
│   │   ├── analyzers/
│   │   │   ├── fileAnalyzer.js
│   │   │   ├── dependencyAnalyzer.js
│   │   │   ├── structureAnalyzer.js
│   │   │   └── codeFlowAnalyzer.js
│   │   ├── routes/
│   │   │   └── scanRoutes.js
│   │   ├── utils/
│   │   │   ├── githubParser.js
│   │   │   └── languageDetector.js
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
└── README.md
```

## How It Works

```text
GitHub Repository
        ↓
Repository Scanner
        ↓
File & Structure Analysis
        ↓
Language Analysis
        ↓
Architecture Analysis
        ↓
Dependency Analysis
        ↓
Code Flow Analysis
        ↓
Impact Analysis
        ↓
AI Analysis
        ↓
Interactive Dashboard
```

## Getting Started

### Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd open_source_mri
```

### Backend

```bash
cd backend
npm install
```

Create a `.env` file:

```env
PORT=5001
GITHUB_TOKEN=your_github_token
GEMINI_API_KEY=your_gemini_api_key
```

Start the backend:

```bash
npm run dev
```

Backend:

```text
http://localhost:5001
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5001
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Usage

1. Open the frontend.
2. Enter a GitHub repository URL.
3. Click `Scan Repository`.
4. Wait for the repository analysis.
5. Explore the Dashboard, Explore, Analyze, Insights, and Code Flow sections.
6. Select files to view dependencies, dependents, impact score, risk level, source code, and AI explanation.

## Impact Analysis

Open Source MRI calculates the impact of a file using its dependencies and dependents.

```text
Impact Score = Dependencies + (Dependents × 2)
```

Risk levels:

```text
LOW
MEDIUM
HIGH
```

This helps developers understand which files may have a larger effect on the rest of the application when modified.

## AI File Analysis

Google Gemini is used to analyze selected source files and provide a technical explanation of the code.

The AI analysis can explain:

- File purpose
- Code structure
- Important functions
- Dependencies
- Data flow
- Implementation details

## Security

API keys and tokens should never be committed to the repository.

Use environment variables for:

```env
GITHUB_TOKEN=your_github_token
GEMINI_API_KEY=your_gemini_api_key
```

Make sure `.env` is included in `.gitignore`.

## Future Scope

- Function-level code flow
- Pull request impact analysis
- Git diff analysis
- Security analysis
- Code smell detection
- Technical debt analysis
- Repository comparison
- Deeper architecture analysis
- Multi-language AST analysis
- AI-generated architecture diagrams

## License

This project is developed for educational, experimental, and hackathon purposes.
```