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
    audioPlayElem.addEventListener("click", () => cardAudioElem.play());

    const audioPauseElem = document.getElementById("audio-pause");
    audioPauseElem.addEventListener("click", () => cardAudioElem.pause());

    const audioProgressBarElem = document.getElementById("audio-progress-bar");

    audioProgressBarElem.addEventListener("input", () => {
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

    const audioMoreElem = document.getElementById("audio-more");
    audioMoreElem.addEventListener("click", () => console.log("more"));
  }
};

window.initPage = initPage;
