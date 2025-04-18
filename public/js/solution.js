const assetsPath = "./public/assets/";
const imagesPath = assetsPath + "images/";
const audiosPath = assetsPath + "audios/";

function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
}

function hasSameElements(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  let sorted1 = [...arr1].sort();
  let sorted2 = [...arr2].sort();

  return sorted1.every((val, index) => val === sorted2[index]);
}

function isExactlySame(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  return arr1.every((val, index) => val === arr2[index]);
}

const initPage = async () => {
  const data = await fetch("data.json", {
    mode: "cors",
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }).then((res) => res.json());

  const chapters = data["chapters"];
  const fragments = data["fragments"];
  const chaptersElem = document.getElementById("chapters");
  const notificationElem = document.getElementById("notification");

  const modalElem = document.getElementById("modal");
  const modalHeadingElem = document.getElementById("modal-heading");
  const modalCloseButtonElem = document.getElementById("modal-close");
  const cardImageElem = document.getElementById("card-image");
  const cardAudioElem = document.getElementById("card-audio");

  modalCloseButtonElem.addEventListener("click", (event) => {
    event.stopPropagation();
    cardAudioElem.pause();
    cardAudioElem.currentTime = 0;
    modalElem.style.display = "none";
    $("#end-link").css("display", "none");
  });

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

  let storedChapters = null;
  let storedFragments = null;

  try {
    storedChapters = localStorage.getItem("chapters");
    storedChapters =
      storedChapters === null ? null : JSON.parse(storedChapters);

    storedFragments = localStorage.getItem("fragments");
    storedFragments =
      storedFragments === null ? null : JSON.parse(storedFragments);
  } catch {
    storedChapters = null;
    storedFragments = null;
  }

  let boardChapters = null;
  let boardFragments = null;

  if (storedChapters === null || storedFragments === null) {
    const randomChapters = JSON.parse(JSON.stringify(chapters));
    const randomFragments = JSON.parse(JSON.stringify(fragments));
    shuffle(randomChapters);
    shuffle(randomFragments);
    boardChapters = randomChapters;
    boardFragments = randomFragments;
    localStorage.setItem("chapters", JSON.stringify(boardChapters));
    localStorage.setItem("fragments", JSON.stringify(boardFragments));
  } else {
    boardChapters = storedChapters;
    boardFragments = storedFragments;
  }

  boardChapters.forEach((chapter, i) => {
    const chapterSlotElem = document.createElement("div");
    chapterSlotElem.classList.add("chapter-slot");

    const chapterElem = document.createElement("div");
    chapterElem.classList.add("chapter");
    chapterElem.id = `chapter-${chapter.id}`;

    const chapterCardSlot = document.createElement("div");
    chapterCardSlot.classList.add("chapter-card-slot");

    const chapterImageElem = document.createElement("img");
    chapterImageElem.src = imagesPath + chapter.image;
    chapterImageElem.id = `chapter-${chapter.id}-img`;
    chapterImageElem.classList.add("chapter-card");

    const cardsElem = document.createElement("div");
    cardsElem.classList.add("cards");

    boardFragments.slice(i * 3, i * 3 + 3).forEach((fragment) => {
      const cardSlotElem = document.createElement("div");
      cardSlotElem.classList.add("fragment-card-slot");

      const fragmentImageElem = document.createElement("img");
      fragmentImageElem.src = imagesPath + fragment.image;
      fragmentImageElem.id = `fragment-${fragment.id}-img`;
      fragmentImageElem.classList.add("fragment-card");

      cardSlotElem.appendChild(fragmentImageElem);
      cardsElem.appendChild(cardSlotElem);
    });

    const chapterCheckButtonElem = document.createElement("button");
    chapterCheckButtonElem.type = "button";
    chapterCheckButtonElem.classList.add("check");
    chapterCheckButtonElem.classList.add("check-chapter");
    chapterCheckButtonElem.innerText = "Check";

    chapterCheckButtonElem.addEventListener("click", function (event) {
      event.stopPropagation();
      const chapterElem = $(this).parent();
      const cardsElem = chapterElem.find(".cards");

      const chapterId = parseInt(
        chapterElem.attr("id").replace("chapter-", "")
      );

      const chapter = chapters[chapterId - 1];
      const correct = cardsElem.data("correct") === "true";

      if (correct) {
        modalElem.style.display = "flex";
        modalHeadingElem.innerText = "Chapter Full";
        cardImageElem.src = imagesPath + chapter.image;
        cardImageElem.alt = chapter.description;
        cardAudioElem.src = audiosPath + `c${chapterId}-full.mp3`;
        cardAudioElem.currentTime = 0;
      } else {
        const fragmentIds = chapterElem
          .find(".fragment-card")
          .map(function () {
            return parseInt(
              $(this).attr("id").replace("fragment-", "").replace("-img", "")
            );
          })
          .get();

        if (isExactlySame(chapter.fragments, fragmentIds)) {
          notificationElem.innerText = "Fragments Correct!";
          notificationElem.className = "";

          chapterElem.find(".fragment-card").each(function () {
            $(this).css("opacity", "0.5");
          });

          $(this).text("Listen");
          $(this).addClass("correct");
          chapterElem.find(".fragment-card").draggable("disable");
          chapterElem.find(".fragment-card-slot").droppable("disable");
          cardsElem.data("correct", "true");
          localStorage.setItem(`chapter-${chapterId}-correct`, "true");
        } else if (hasSameElements(chapter.fragments, fragmentIds)) {
          notificationElem.innerText = "Fragments' Order Incorrect!";
          notificationElem.className = "warning";
        } else {
          notificationElem.innerText = "Fragments Incorrect!";
          notificationElem.className = "error";
        }
      }
    });

    chapterCardSlot.appendChild(chapterImageElem);
    chapterElem.appendChild(chapterCardSlot);
    chapterElem.appendChild(cardsElem);
    chapterElem.appendChild(chapterCheckButtonElem);
    chapterSlotElem.appendChild(chapterElem);
    chaptersElem.appendChild(chapterSlotElem);
  });

  $(".chapter-card").draggable({
    revert: "invalid",
    start: function () {
      $(this).css("z-index", 99);
    },
    stop: function () {
      $(this).css("z-index", 0);
    },
  });

  $(".chapter-card-slot").droppable({
    accept: ".chapter-card",
    drop: function (event, ui) {
      const originalChapterCardSlot = $(event.target);
      const originalChapterCardImg =
        originalChapterCardSlot.find(".chapter-card");
      const originalChapter = originalChapterCardSlot.parent();
      const originalChapterSlot = originalChapter.parent();

      const incomingChapterCardImg = ui.draggable;
      const incomingChapterCardSlot = incomingChapterCardImg.parent();
      const incomingChapter = incomingChapterCardSlot.parent();
      const incomingChapterSlot = incomingChapter.parent();

      originalChapter.detach().appendTo(incomingChapterSlot);
      incomingChapter.detach().appendTo(originalChapterSlot);
      originalChapterCardImg.css({ top: 0, left: 0, zIndex: 0 });
      incomingChapterCardImg.css({ top: 0, left: 0, zIndex: 0 });

      localStorage.setItem(
        "chapters",
        JSON.stringify(
          $("#chapters")
            .find(".chapter")
            .map(function () {
              const chapterId = parseInt(
                $(this).attr("id").replace("chapter-", "")
              );
              return chapters[chapterId - 1];
            })
            .get()
        )
      );

      localStorage.setItem(
        "fragments",
        JSON.stringify(
          $("#chapters")
            .find(".fragment-card")
            .map(function () {
              const fragmentId = parseInt(
                $(this).attr("id").replace("fragment-", "").replace("-img", "")
              );

              return fragments[fragmentId - 1];
            })
            .get()
        )
      );
    },
  });

  $(".fragment-card").draggable({
    revert: "invalid",
    start: function () {
      $(this).css("z-index", 99);
    },
    stop: function () {
      $(this).css("z-index", 0);
    },
  });

  $(".fragment-card-slot").droppable({
    accept: ".fragment-card",
    drop: function (event, ui) {
      const originalSlot = $(event.target);
      const originalCard = originalSlot.find(".fragment-card");
      const incomingCard = ui.draggable;
      const incomingSlot = incomingCard.parent();

      originalCard
        .detach()
        .css({ top: 0, left: 0, zIndex: 0 })
        .appendTo(incomingSlot);

      incomingCard
        .detach()
        .css({ top: 0, left: 0, zIndex: 0 })
        .appendTo(originalSlot);

      localStorage.setItem(
        "fragments",
        JSON.stringify(
          $("#chapters")
            .find(".fragment-card")
            .map(function () {
              const fragmentId = parseInt(
                $(this).attr("id").replace("fragment-", "").replace("-img", "")
              );

              return fragments[fragmentId - 1];
            })
            .get()
        )
      );
    },
  });

  $("#chapters")
    .find(".check-chapter")
    .map(function () {
      const chapterElem = $(this).parent();
      const cardsElem = chapterElem.find(".cards");

      const chapterId = parseInt(
        chapterElem.attr("id").replace("chapter-", "")
      );

      const chapterCorrect =
        localStorage.getItem(`chapter-${chapterId}-correct`) === "true";

      if (chapterCorrect) {
        chapterElem.find(".fragment-card").each(function () {
          $(this).css("opacity", "0.5");
        });

        $(this).text("Listen");
        $(this).addClass("correct");
        chapterElem.find(".fragment-card").draggable("disable");
        chapterElem.find(".fragment-card-slot").droppable("disable");
        cardsElem.data("correct", "true");
      }
    });

  const checkButtonElem = $("#full-check");

  checkButtonElem.on("click", function () {
    const correct = $("#chapters").data("correct") === "true";

    if (correct) {
      modalElem.style.display = "flex";
      modalHeadingElem.innerText = "Game Full";
      cardImageElem.src = imagesPath + "logo.png";
      cardImageElem.alt = "Logo";
      cardAudioElem.src = audiosPath + "full.mp3";
      cardAudioElem.currentTime = 0;
      $("#end-link").css("display", "flex");
    } else {
      const allFragmentsCorrect = $("#chapters")
        .find(".cards")
        .map(function () {
          return $(this).data("correct") === "true";
        })
        .get()
        .every((v) => v === true);

      const allChaptersCorrect = isExactlySame(
        chapters.map((chapter) => chapter.id),
        $("#chapters")
          .find(".chapter")
          .map(function () {
            return parseInt($(this).attr("id").replace("chapter-", ""));
          })
          .get()
      );

      if (allFragmentsCorrect && allChaptersCorrect) {
        notificationElem.innerText = "Chapters Correct!";
        notificationElem.className = "";

        $("#chapters")
          .find(".chapter-card")
          .each(function () {
            $(this).css("opacity", "0.75");
          });

        $(this).text("Listen");
        $(this).addClass("correct");
        $("#chapters").find(".chapter-card").draggable("disable");
        $("#chapters").find(".chapter-card-slot").droppable("disable");
        $("#chapters").data("correct", "true");
        localStorage.setItem("chapters-correct", "true");
      } else {
        notificationElem.innerText = "Chapters Incorrect!";
        notificationElem.className = "Error";
      }
    }
  });

  const chaptersCorrect = localStorage.getItem("chapters-correct") === "true";

  if (chaptersCorrect) {
    notificationElem.innerText = "Game End!";
    notificationElem.className = "";

    $("#chapters")
      .find(".chapter-card")
      .each(function () {
        $(this).css("opacity", "0.75");
      });

    checkButtonElem.text("Listen");
    checkButtonElem.addClass("correct");
    $("#chapters").find(".chapter-card").draggable("disable");
    $("#chapters").find(".chapter-card-slot").droppable("disable");
    $("#chapters").data("correct", "true");
  }
};

window.initPage = initPage;
