# Pokedex Challenge
Technical Challenge for job interview.

**Autor:** Leandro Cortese
**Email:** [leandrocortese@gmail.com](mailto:leandrocortese@gmail.com "leandrocortese@gmail.com")

## Getting started

### Prerequisites
- NodeJs ^16.0.0
- npm ^8.0.0

Follow the next steps to intilizate the app:

#### 1. Clone Repository and go to the folder
```bash
$ git clone git@gitlab.com:AriX/pokedex.git
cd pokedex
```

#### 2. Install dependencies
```bash
npm i
```

#### 3. Run web server
```bash
npm start
```
The web server will runs on http://localhost:3000, just open that url with your browser and it will be ready to works.

### Other tasks
```bash
npm run lint
```
Runs a lint validation, it will returns 1 if there is any issue

```bash
npm run lint:script
```
Runs a lint validation just in script files, it will returns 1 if there is any issue.

```bash
npm run lint:script:fix
```
Runs a lint validation just in script files, it will try to fix the issues and it will returns 1 if there are issues that need to be solved manually.

```bash
npm run build
```
Builds a bundle app into ./build folder.

**Thanks!**

-- Leandro Cortese