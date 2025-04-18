const assetsPath = "./public/assets/";
const imagesPath = assetsPath + "images/";
const audiosPath = assetsPath + "audios/";

const initPage = async () => {
  const data = await fetch("data.json", {
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }).then((res) => res.json());

  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());
  const mode = ["qr", "audio"].includes(params.mode) ? params.mode : "audio";

  const type = ["chapter", "fragment"].includes(params.type)
    ? params.type
    : "chapter";

  const description = params.description ?? data[`${type}s`][0].description;

  const card = data[`${type}s`].find(
    (card) => card.description === description
  );

  const cardImageElem = document.getElementById("card-image");
  cardImageElem.src = imagesPath + card.image;
  cardImageElem.alt = card.description;

  if (mode === "qr") {
    await fetch(
      `https://api.qrserver.com/v1/create-qr-code/?size=128x128&data=http%3A%2F%2Fsupernatural%2Einfinityfreeapp%2Ecom%2Fcard%2Ehtml%3Ftype%3D${type}%26description%3D${description}`
    )
      .then((res) => res.blob())
      .then((blob) => {
        const img = URL.createObjectURL(blob);
        const qrCodeElem = document.getElementById("qr-code");
        qrCodeElem.src = img;
        qrCodeElem.style.display = "block";
      });

    document.getElementById("audio").style.display = "none";
    document.getElementById("solution-link").style.display = "none";
  } else {
    const cardAudioElem = document.getElementById("card-audio");
    cardAudioElem.src = audiosPath + card.audio;
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
  }
};

window.initPage = initPage;
