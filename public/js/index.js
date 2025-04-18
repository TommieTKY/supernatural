const initPage = async () => {
  const cardAudioElem = document.getElementById("card-audio");
  cardAudioElem.currentTime = 0;

  const audioPlayElem = document.getElementById("audio-play");
  audioPlayElem.addEventListener("click", (event) => {
    event.stopPropagation();
    cardAudioElem.play();
  });

  const audioPauseElem = document.getElementById("audio-pause");
  audioPauseElem.addEventListener("click", (event) => {
    event.stopPropagation();
    cardAudioElem.pause();
  });

  const audioProgressBarElem = document.getElementById("audio-progress-bar");

  audioProgressBarElem.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  audioProgressBarElem.addEventListener("input", (event) => {
    event.stopPropagation();

    if (cardAudioElem.duration) {
      cardAudioElem.currentTime =
        (audioProgressBarElem.value / 100) * cardAudioElem.duration;

      cardAudioElem.play();
    }
  });

  cardAudioElem.addEventListener("timeupdate", () => {
    if (cardAudioElem.duration) {
      audioProgressBarElem.value =
        (cardAudioElem.currentTime / cardAudioElem.duration) * 100;
    }
  });

  const muted = localStorage.getItem("muted") === "true";
  cardAudioElem.muted = muted;

  let volume = parseFloat(localStorage.getItem("volume"));
  volume = isNaN(volume) ? 0.5 : volume;
  cardAudioElem.volume = volume;

  const audioMoreElem = document.getElementById("audio-more");
  const volumeControlElem = document.getElementById("volume-control");
  const volumeSliderElem = document.getElementById("volume-slider");
  const volumeButton = document.getElementById("volume-button");

  volumeSliderElem.value = volume * 100;

  volumeButton.innerHTML = muted
    ? '<i class="fas fa-volume-mute"></i>'
    : volume <= 0.0
    ? '<i class="fas fa-volume-off"></i>'
    : volume >= 0.5
    ? '<i class="fas fa-volume-up"></i>'
    : '<i class="fas fa-volume-down"></i>';

  audioMoreElem.addEventListener("click", (event) => {
    event.stopPropagation();

    if (
      volumeControlElem.style.display === "none" ||
      volumeControlElem.style.display === ""
    ) {
      volumeControlElem.style.display = "flex";
    } else {
      volumeControlElem.style.display = "none";
    }
  });

  volumeControlElem.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  volumeSliderElem.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  volumeSliderElem.addEventListener("input", (event) => {
    event.stopPropagation();
    localStorage.setItem("muted", "false");
    cardAudioElem.muted = false;
    cardAudioElem.volume = volumeSliderElem.value / 100;

    volumeButton.innerHTML =
      volumeSliderElem.value <= 0.0
        ? '<i class="fas fa-volume-off"></i>'
        : volumeSliderElem.value >= 50
        ? '<i class="fas fa-volume-up"></i>'
        : '<i class="fas fa-volume-down"></i>';

    localStorage.setItem("volume", (volumeSliderElem.value / 100).toString());
  });

  volumeButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const muted = localStorage.getItem("muted") === "true";
    localStorage.setItem("muted", (!muted).toString());

    volumeButton.innerHTML = !muted
      ? '<i class="fas fa-volume-mute"></i>'
      : volume >= 0.5
      ? '<i class="fas fa-volume-up"></i>'
      : '<i class="fas fa-volume-down"></i>';

    cardAudioElem.muted = !muted;
  });

  document.body.addEventListener(
    "click",
    () => (volumeControlElem.style.display = "none")
  );

  const modalElem = document.getElementById("modal");
  const solveNowButtonElem = document.getElementById("solve-now");
  const modalCloseButtonElem = document.getElementById("modal-close");

  solveNowButtonElem.addEventListener("click", (event) => {
    event.stopPropagation();
    modalElem.style.display = "flex";
  });

  modalCloseButtonElem.addEventListener("click", (event) => {
    event.stopPropagation();
    cardAudioElem.pause();
    modalElem.style.display = "none";
  });
};

window.initPage = initPage;
