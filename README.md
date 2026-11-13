# Aperture Signs Demo

This is a standalone, frontend-only prototype for sharing the interaction concept. It contains no backend, recognition model, model weights, training data, or production translation logic. The motion and capture indicators are synthetic; this is **not** a sign-language translator or recognizer.

## Publish a public website

1. Create a **public** GitHub repository named `ApertureSigns-Demo`. Do not upload the parent project's files; this `demo` folder is the complete, isolated site source.
2. Push this folder's repository to the new repository's `main` branch.
3. In the repository, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source if it is not already selected.
4. Open **Actions** and wait for **Deploy demo to GitHub Pages** to complete. GitHub displays the website URL in the deployment details; for this repository name it will normally be `https://sirlennyjackson-commit.github.io/ApertureSigns-Demo/`.

The workflow publishes only `index.html` and `demo.js`; it does not upload the rest of the repository. The website is publicly accessible from phones and other devices with internet access after deployment completes.

## Run locally

From this directory, serve the static files:

```powershell
py -m http.server 8000
```

Open `http://localhost:8000` in a browser. On another device on the same network, open `http://<host-computer-ip>:8000` while the server is running and the host firewall allows that connection.

## Short partner walkthrough

1. Select an example phrase or enter your own.
2. Choose **Run demo** and follow the input, simulated-motion, and avatar-playback stages.
3. Choose **Simulate live input** to see motion indicators change without camera access.
4. Explain that this shows the proposed interaction flow only; it does not claim a valid sign-language output.

Suggested introduction: “Aperture Signs is exploring an assistive communication workflow that connects text input to visible motion. This prototype lets you try the interface and see a simulated avatar response. We’re sharing the interaction concept for feedback; real sign-language translation and recognition are not part of this demo.”
