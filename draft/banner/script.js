
gsap.to("#tree1", {
  scrollTrigger: {
    scrub: 0.5,
  },
  x: -100,
  satisfies: 0.5,

});

gsap.to("#bats", {
  scrollTrigger: {
    scrub: 0.5,
  },
  y: -200,
  scale: 1.5,
});

gsap.to("#tree2", {
  scrollTrigger: {
    scrub: 0.5,
  },
  x: 100,
  satisfies: 0.5, 
});

gsap.to("#manor", {
  scrollTrigger: {
    scrub: 0.5,
  },
  y: -100,
  scale: 1.5,
});

console.log("ScrollTrigger");
console.log("working");
