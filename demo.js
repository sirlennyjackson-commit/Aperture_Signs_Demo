(() => {
  const durationMs = 4800;
  const message = document.getElementById("message");
  const result = document.getElementById("result");
  const runButton = document.getElementById("runButton");
  const stopButton = document.getElementById("stopButton");
  const progress = document.getElementById("progress");
  const inputState = document.getElementById("inputState");
  const avatarState = document.getElementById("avatarState");
  const playbackTime = document.getElementById("playbackTime");
  const metricInput = document.getElementById("metricInput");
  const metricPipeline = document.getElementById("metricPipeline");
  const metricPlayback = document.getElementById("metricPlayback");
  const stages = [
    document.getElementById("stageInput"),
    document.getElementById("stageMotion"),
    document.getElementById("stageAvatar"),
  ];
  const arms = {
    left: {
      path: document.getElementById("leftArm"),
      elbow: document.getElementById("leftElbow"),
      wrist: document.getElementById("leftWrist"),
      hand: document.getElementById("leftHand"),
      shoulder: [108, 112],
      side: -1,
    },
    right: {
      path: document.getElementById("rightArm"),
      elbow: document.getElementById("rightElbow"),
      wrist: document.getElementById("rightWrist"),
      hand: document.getElementById("rightHand"),
      shoulder: [172, 112],
      side: 1,
    },
  };
  let animationTimer = 0;
  let animationDelay = 0;
  let animationStart = 0;
  let captureTimer = 0;

  function setStage(activeIndex) {
    stages.forEach((stage, index) => stage.classList.toggle("active", index === activeIndex));
  }

  function drawArm(arm, wave) {
    const [sx, sy] = arm.shoulder;
    const elbowX = sx + arm.side * (31 + wave * 4);
    const elbowY = 157 + wave * 5;
    const wristX = sx + arm.side * (49 + wave * 14);
    const wristY = 212 - wave * 43;
    arm.path.setAttribute("d", `M${sx} ${sy} L${elbowX} ${elbowY} L${wristX} ${wristY}`);
    arm.elbow.setAttribute("cx", elbowX);
    arm.elbow.setAttribute("cy", elbowY);
    arm.wrist.setAttribute("cx", wristX);
    arm.wrist.setAttribute("cy", wristY);
    const spread = 8 + Math.abs(wave) * 2;
    arm.hand.setAttribute(
      "d",
      `M${wristX} ${wristY} l${arm.side * -spread} -18 m${arm.side * spread} 18 l${arm.side * -3} -25 m${arm.side * 3} 25 l${arm.side * spread} -23 m${arm.side * -spread} 23 l${arm.side * spread} -17`,
    );
  }

  function tick(now) {
    const elapsed = now - animationStart;
    const progressRatio = Math.min(elapsed / durationMs, 1);
    const wave = progressRatio < 0.12 || progressRatio > 0.9
      ? 0
      : Math.sin((elapsed / 280) * Math.PI) * Math.min(1, (progressRatio - 0.12) * 5);
    drawArm(arms.left, 0);
    drawArm(arms.right, wave);
    progress.value = Math.round(progressRatio * 100);
    playbackTime.textContent = `${(elapsed / 1000).toFixed(1)} s`;
    if (progressRatio >= 1) finishPlayback();
  }

  function finishPlayback() {
    clearInterval(animationTimer);
    clearTimeout(animationDelay);
    animationTimer = 0;
    animationDelay = 0;
    drawArm(arms.left, 0);
    drawArm(arms.right, 0);
    runButton.disabled = false;
    stopButton.disabled = true;
    inputState.textContent = "READY";
    avatarState.textContent = "COMPLETE";
    metricPlayback.textContent = "COMPLETE";
    metricPipeline.textContent = "READY";
    result.textContent = "Synthetic motion sequence complete.";
    setStage(0);
  }

  function startDemo() {
    const text = message.value.trim();
    if (!text) {
      result.textContent = "Enter a short phrase to run the prototype.";
      message.focus();
      return;
    }
    if (captureTimer) {
      clearInterval(captureTimer);
      captureTimer = 0;
      document.getElementById("captureButton").textContent = "Simulate live input";
    }
    clearInterval(animationTimer);
    clearTimeout(animationDelay);
    animationTimer = 0;
    animationDelay = 0;
    const label = text.length > 18 ? `${text.slice(0, 17)}…` : text;
    animationStart = performance.now();
    progress.value = 0;
    playbackTime.textContent = "0.0 s";
    metricInput.textContent = "RECEIVED";
    metricPipeline.textContent = "SIMULATING";
    metricPlayback.textContent = "RUNNING";
    inputState.textContent = "PROCESSING";
    avatarState.textContent = "PLAYING";
    result.textContent = `Input received: “${text}” · generating synthetic motion`;
    runButton.disabled = true;
    stopButton.disabled = false;
    setStage(1);
    animationDelay = window.setTimeout(() => {
      if (!runButton.disabled) return;
      setStage(2);
      tick(performance.now());
      animationTimer = window.setInterval(() => tick(performance.now()), 50);
    }, 350);
    metricInput.textContent = label.toUpperCase();
  }

  function stopDemo() {
    if (!runButton.disabled) return;
    clearInterval(animationTimer);
    clearTimeout(animationDelay);
    animationTimer = 0;
    animationDelay = 0;
    drawArm(arms.left, 0);
    drawArm(arms.right, 0);
    runButton.disabled = false;
    stopButton.disabled = true;
    inputState.textContent = "STOPPED";
    avatarState.textContent = "IDLE";
    metricPlayback.textContent = "STOPPED";
    metricPipeline.textContent = "READY";
    result.textContent = "Playback stopped.";
    setStage(0);
  }

  function resetDemo() {
    stopDemo();
    progress.value = 0;
    playbackTime.textContent = "0.0 s";
    metricInput.textContent = "—";
    metricPipeline.textContent = "IDLE";
    metricPlayback.textContent = "READY";
    inputState.textContent = "READY";
    avatarState.textContent = "IDLE";
    result.textContent = "Ready. Choose an example or enter your own text.";
    clearInterval(captureTimer);
    captureTimer = 0;
    document.getElementById("captureButton").textContent = "Simulate live input";
  }

  function toggleCaptureSimulation(button) {
    if (captureTimer) {
      clearInterval(captureTimer);
      captureTimer = 0;
      button.textContent = "Simulate live input";
      result.textContent = "Simulated input stopped. No camera was accessed.";
      metricPipeline.textContent = "READY";
      metricPlayback.textContent = "READY";
      inputState.textContent = "READY";
      avatarState.textContent = "IDLE";
      return;
    }
    let tickCount = 0;
    button.textContent = "Stop input simulation";
    result.textContent = "Simulated live input is active. No camera was accessed.";
    metricPipeline.textContent = "SIMULATING";
    inputState.textContent = "SIMULATED";
    avatarState.textContent = "LIVE SIM";
    metricPlayback.textContent = "24 FPS";
    captureTimer = window.setInterval(() => {
      tickCount += 1;
      drawArm(arms.left, Math.sin(tickCount / 3) * 0.55);
      drawArm(arms.right, Math.cos(tickCount / 3) * 0.8);
      avatarState.textContent = "LIVE SIM";
      metricPlayback.textContent = `${Math.round(24 + Math.sin(tickCount / 2) * 3)} FPS`;
    }, 80);
  }

  document.querySelectorAll(".example").forEach((button) => {
    button.addEventListener("click", () => {
      message.value = button.dataset.text;
      message.focus();
    });
  });
  runButton.addEventListener("click", startDemo);
  stopButton.addEventListener("click", stopDemo);
  document.getElementById("resetButton").addEventListener("click", resetDemo);
  document.getElementById("captureButton").addEventListener("click", (event) => {
    toggleCaptureSimulation(event.currentTarget);
  });
  message.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) startDemo();
  });
})();
