// Menü működtetése
document.querySelector(".menu-toggle").addEventListener("click", () => {
  document.querySelector(".nav-links").classList.toggle("show");
});

// Oldalak váltása
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.getAttribute("href").substring(1);
    console.log(target);

    document.querySelectorAll("main section").forEach(sec => {
      sec.style.display = "none";
    });
    document.getElementById(target).style.display = "block";

    // Ha az info oldalra megyünk, töltsük be a README.md-t
    if (target === "info") {
      loadReadme();
    } else if (target === "lista") {
      loadSheetData();
    }

    // Menü becsukása mobilon
    document.querySelector(".nav-links").classList.remove("show");
  });
});

// README.md betöltése és renderelése
async function loadReadme() {
  const container = document.getElementById("info");
  container.innerHTML = "Betöltés folyamatban...";
  try {
    const res = await fetch("README.md", {cache: "no-cache"});
    if (!res.ok) throw new Error("HTTP hiba: " + res.status);
    const md = await res.text();
    container.innerHTML = window.marked.parse(md);
  } catch (err) {
    container.innerHTML = "❌ Nem sikerült betölteni a README.md fájlt.";
    console.error("README betöltési hiba:", err);
  }
}

// Google sheet adatok betöltése
async function loadSheetData() {
  const container = document.getElementById("lista");
  container.innerHTML = "<h1>Listázás</h1><p>Betöltés...</p>";

  try {
    const sheetId = "1w0JIPTdSvPST0BVbeNwkUuVr4ASntl-Ima3efw4g6v0";
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

    const res = await fetch(url);
    const text = await res.text();

    const json = JSON.parse(text.substr(47).slice(0, -2));
    const rows = json.table.rows;

    // Az első sor a fejléc
    const headerRow = rows.shift();

    let html = `
      <h1>Listázás</h1>
      <table border="1" style="width:100%; border-collapse: collapse;">
        <thead>
          <tr>
    `;

    // Fejléc cellák generálása
    headerRow.c.forEach(c => {
      html += `<th>${c ? c.v : ""}</th>`;
    });

    html += `
          </tr>
        </thead>
        <tbody>
    `;

    // Adat sorok generálása
    rows.forEach(r => {
      html += `<tr>`;
      r.c.forEach(c => {
        html += `<td>${c ? c.v : ""}</td>`;
        let cellValue = c ? c.v : "";
        console.log(cellValue);
      });
      html += `</tr>`;
    });

    html += `
        </tbody>
      </table>
    `;

    container.innerHTML = html;

  } catch (err) {
    container.innerHTML = "<p>❌ Nem sikerült betölteni a Google Sheet-et.</p>";
    console.error(err);
  }
}

// Service Worker regisztráció
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").then(() => {
    console.log("Service Worker regisztrálva");
  });
}
