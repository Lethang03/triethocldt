# Netlify Build Fix Report

## Root cause

`package.json` registered a `preinstall` script:

```json
"preinstall": "node extract.js"
```

During Netlify dependency installation, this script attempted to read the developer-machine path `E:\bo_de_02_15_4_bo_70_cau.html`. That path is unavailable in Netlify's Linux build environment, causing `npm install` to exit with code 1 before the Vite build began.

## Fix applied

- Removed only `preinstall` from `package.json`.
- Kept the deployment build command as `npm run build`.
- Checked package/build configuration for other `E:\`, `C:\`, `E:/`, and `C:/` references. None were found.

## Validation

- `npm.cmd install` completed successfully.
- `npm.cmd run build` completed successfully.
- No exam data, `questions.json`, UI, or scoring code was changed.

## Deployment readiness

Netlify can now install dependencies without executing the local-only extractor. The project is ready to deploy with its standard Vite build command.

Vite emits its existing advisory warning about a JavaScript bundle over 500 kB; this does not fail the build or block deployment.
