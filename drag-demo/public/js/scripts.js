const pageReady = () => {
  $(".card").draggable();

  $(".slot").droppable({
    drop: function (event, ui) {
      const originalSlot = $(event.target);
      const originalCard = originalSlot.find(".card");
      const incomingCard = ui.draggable;
      const incomingSlot = incomingCard.parent();

      originalCard.detach().css({ top: 0, left: 0 }).appendTo(incomingSlot);
      incomingCard.detach().css({ top: 0, left: 0 }).appendTo(originalSlot);
    },
  });
};

window.onload = pageReady;
