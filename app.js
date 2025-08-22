// Menü működtetése
document.querySelector(".menu-toggle").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("show");
});

// Oldalak váltása
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.getAttribute("href").substring(1);

    document.querySelectorAll("main section").forEach(sec => {
      sec.style.display = "none";
    });
    document.getElementById(target).style.display = "block";

    // Menü becsukása mobilon
    document.querySelector(".nav-links").classList.remove("show");
  });
});

// Service Worker regisztráció
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(() => {
    console.log("Service Worker regisztrálva");
  });
}
