# Aperture Signs Demo

This is a standalone, frontend-only prototype for sharing the interaction concept. It contains no backend, recognition model, model weights, training data, or production translation logic. The motion and capture indicators are synthetic; this is **not** a sign-language translator or recognizer.

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
