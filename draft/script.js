function loco() {
  gsap.registerPlugin(ScrollTrigger);

  const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
    smartphone: { smooth: true },
    tablet: { smooth: true }
  });

  let rafId;
  ScrollTrigger.addEventListener("refresh", () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => locoScroll.update());
  });

  locoScroll.on("scroll", ScrollTrigger.update);

  ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, 0, 0)
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight
      };
    },
    pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
  });

  ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
  ScrollTrigger.refresh();
}

function swiperWorking() {
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      type: "fraction"
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev"
    }
  });
}

loco();
swiperWorking();

// Initial page animations
var tl = gsap.timeline();
tl.from("#page1 svg", {
  y: -40,
  opacity: 0,
  delay: 0.3,
  duration: 0.7
})
  .from("#page1 img", {
    scale: 0.5,
    borderRadius: "10px",
    duration: 1,
    ease: Power4.easeOut
  })
  .from("#nav", {
    y: -50,
    opacity: 0,
    duration: 0.6
  });

// Animate each h2 in #page2 by wrapping in <span>
document.querySelectorAll("#page2 h2").forEach(function (elem) {
  var splitedText = elem.textContent.split("");
  elem.innerHTML = splitedText.map(letter => `<span>${letter}</span>`).join("");
});

// Animate letters on scroll
gsap.to("#page2 h2 span", {
  color: "#E3E3C4",
  stagger: 0.1,
  scrollTrigger: {
    trigger: "#page2",
    scroller: "#main",
    start: "top 20%",
    end: "top 10%",
    scrub: 2,
    // markers: true
  }
});

// Page 3 Text Animations
var tl3 = gsap.timeline({
  scrollTrigger: {
    trigger: "#page3",
    scroller: "#main",
    start: "top 10%",
    end: "top 40%",
    scrub: 1.5,
    // markers: true
  }
});

tl3.from("#page3 h2", {
  y: 10,
  opacity: 0,
  duration: 2,
  ease: "power4.in"
}, "h2-anim");

tl3.from("#page3 p", {
  y: 40,
  opacity: 0,
  duration: 2,
  ease: "power4.in"
}, "h2-anim");

// SVG scroll animation in Page 2
gsap.to("#page2 #svg2, #page2 #svg3", {
  left: "-100vw",
  scrollTrigger: {
    trigger: "#page2 #svg2",
    scroller: "#main",
    scrub: 2
  }
});

// Page 4 Timeline
var tl2 = gsap.timeline({
  scrollTrigger: {
    trigger: "#page4-left",
    scroller: "#main",
    start: "top 50%",
    end: "top 35%",
    scrub: 3,
    // markers: true
  }
});

tl2.to("#page4-left", {
  transform: "translateX(-10%)",
  duration: 2
}, "anim2");

tl2.to("#page4-right", {
  transform: "translateX(10%)",
  duration: 2
}, "anim2");

tl2.from("#page4-center", {
  transform: "translateY(20%)",
  opacity: 0,
  duration: 1
}, "anim2");


