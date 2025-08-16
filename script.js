function switchLanguage(lang) {
  let target;
  if (lang === 'es') {
    target = 'index_spanish.html';
  } else if (lang === 'en') {
    target = 'index_english.html';
  } else {
    return; // keine Änderung
  }
  // Leitet den Browser auf die jeweilige Datei um
  window.location.href = target;
}

document.addEventListener('DOMContentLoaded', () => {
  // 1) Smooth-Scrolling für Navigations-Links
  const scrollLinks = document.querySelectorAll('nav ul li a');
  scrollLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // 2) Hamburger-Toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  document.addEventListener('click', (e) => {
    // wenn Menü offen ist und Klick weder auf Toggle noch im Menü
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) {
      navLinks.classList.remove('open');
    }
  });

  // 2) Sound-Toggle über Lautsprecher-Icon
  const ambientSound = document.getElementById('ambient-sound');
  const clickSound = document.getElementById('click-sound');
  const soundIcon = document.getElementById('sound-toggle');
  let soundOn = false;

  soundIcon.addEventListener('click', () => {
    soundOn = !soundOn;
    if (soundOn) {
      ambientSound.play().catch(() => {});
      soundIcon.src = 'assets/icons/sound.png';
    } else {
      ambientSound.pause();
      soundIcon.src = 'assets/icons/nosound.png';
    }
    clickSound.play().catch(() => {});
  });

  // 3) Universal Modal-Funktion für Bilder & Videos
  function initGalleryModal(modalId, selector) {
    const modal = document.getElementById(modalId);
    const modalImg = modal.querySelector('img.modal-content');
    const modalVideo = modal.querySelector('video.modal-content');
    const items = document.querySelectorAll(selector);
    const closeBtn = modal.querySelector('.close');
    const nextBtn = modal.querySelector('.next');
    const prevBtn = modal.querySelector('.prev');

    let currentIndex = 0;
    const srcList = Array.from(items).map((el) => (el.tagName === 'IMG' ? el.src : el.querySelector('source').src));
    const typeList = Array.from(items).map((el) => el.tagName);

    function showMedia(idx) {
      const src = srcList[idx];
      const type = typeList[idx];
      if (type === 'IMG') {
        modalVideo.pause();
        modalVideo.style.display = 'none';
        modalImg.src = src;
        modalImg.style.display = '';
      } else {
        modalImg.style.display = 'none';
        modalVideo.src = src;
        modalVideo.style.display = '';
        modalVideo.load();
        modalVideo.play().catch(() => {});
      }
    }

    items.forEach((el, idx) => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        currentIndex = idx;
        showMedia(currentIndex);
        modal.style.display = 'flex';
      });
    });

    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % srcList.length;
      showMedia(currentIndex);
    });
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + srcList.length) % srcList.length;
      showMedia(currentIndex);
    });
    window.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
  }

  // Initialisierung aller drei Galerien
  initGalleryModal('modal', '.gallery img, .gallery video');
  initGalleryModal('accommodationModal', '.accommodation-gallery img, .accommodation-gallery video');
  initGalleryModal('ayahuascaModal', '.ayahuasca-gallery img, .ayahuasca-gallery video');

  // 4) Video-Click zum Abspielen von Video-Audio
  document.querySelectorAll('video').forEach((video) => {
    video.muted = true;
    video.style.cursor = 'pointer';
    video.addEventListener('click', () => {
      video.muted = false;
      video.play().catch(() => {});
    });
  });

  // // 5) Rezensionen-Carousel steuern
  // document.querySelectorAll('.reviews-container').forEach((container) => {
  //   const carousel = container.querySelector('.reviews-carousel');
  //   const items = Array.from(carousel.children);
  //   let index = 0;

  //   container.querySelector('.next-review').addEventListener('click', () => {
  //     if (index < items.length - 1) {
  //       index++;
  //       items[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  //     }
  //   });

  //   container.querySelector('.prev-review').addEventListener('click', () => {
  //     if (index > 0) {
  //       index--;
  //       items[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  //     } else {
  //       // ganz nach links scrollen, damit der linke Rand sichtbar wird
  //       carousel.scrollTo({ left: 0, behavior: 'smooth' });
  //     }
  //   });
  // });

  // 5) Rezensionen-Carousel steuern
  document.querySelectorAll('.reviews-container').forEach((container) => {
    const carousel = container.querySelector('.reviews-carousel');
    const items = Array.from(carousel.children);

    // Die Anzahl der sichtbaren Elemente pro Klick berechnen
    const getVisibleItemsCount = () => {
      // Hole die Breite des Carousels und eines einzelnen Review-Elements
      const carouselWidth = carousel.offsetWidth;
      const itemWidth = items[0].offsetWidth; // Nehmen wir an, alle haben die gleiche Breite
      const gap = parseFloat(getComputedStyle(carousel).gap);

      // Berechne, wie viele Elemente in den sichtbaren Bereich passen
      // Nutze Math.floor(), um eine ganze Zahl zu erhalten
      // Wir addieren das Gap zur itemWidth
      return Math.floor(carouselWidth / (itemWidth + gap));
    };

    container.querySelector('.next-review').addEventListener('click', () => {
      const itemsToScroll = getVisibleItemsCount();
      const currentScroll = carousel.scrollLeft;
      const itemWidth = items[0].offsetWidth;
      const gap = parseFloat(getComputedStyle(carousel).gap);

      // Berechne die neue Scroll-Position
      // Die aktuelle Position + die Breite der zu scrollenden Elemente
      const newScrollPosition = currentScroll + (itemWidth + gap) * itemsToScroll;

      // Führe das Scrollen aus
      carousel.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    });

    container.querySelector('.prev-review').addEventListener('click', () => {
      const itemsToScroll = getVisibleItemsCount();
      const currentScroll = carousel.scrollLeft;
      const itemWidth = items[0].offsetWidth;
      const gap = parseFloat(getComputedStyle(carousel).gap);

      // Berechne die neue Scroll-Position
      const newScrollPosition = currentScroll - (itemWidth + gap) * itemsToScroll;

      // Führe das Scrollen aus
      carousel.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
    });
  });

  // 6) Affen-Sprite-Animation & Bewegung
  const monkey = document.getElementById('monkey');
  const main = document.querySelector('main');
  const frames = [];
  for (let i = 1; i <= 7; i++) frames.push(`assets/images/monkey_frames/monkey_${i}.png`);

  let frameIdx = 0;
  let animationInterval = null;

  // Funktion zum Starten der Bild-Sequenz (Animation).
  function startAnimation(duration) {
    const frameRate = Math.max(100, duration / frames.length);
    stopAnimation();
    animationInterval = setInterval(() => {
      monkey.src = frames[frameIdx];
      frameIdx = (frameIdx + 1) % frames.length;
    }, frameRate);
  }

  // Funktion zum Stoppen der Animation.
  function stopAnimation() {
    if (animationInterval) {
      clearInterval(animationInterval);
      animationInterval = null;
    }
  }

  // === Logik für "Forbidden Zones" ===
  const forbiddenEls = main.querySelectorAll('img, video, .text');
  let forbiddenRects = [];

  function updateForbidden() {
    forbiddenRects = Array.from(forbiddenEls).map((el) => el.getBoundingClientRect());
  }
  updateForbidden();
  window.addEventListener('resize', updateForbidden);
  window.addEventListener('scroll', updateForbidden);

  function isAllowed(x, y) {
    return !forbiddenRects.some((r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom);
  }

  // === Logik für die Bewegungspunkte (Waypoints) ===
  // Generiert zufällige Punkte, zu denen sich der Affe bewegen soll.
  function generateWaypoints(count = 12) {
    const viewportWidth = window.innerWidth;
    // Wir nutzen die gesamte Höhe des Dokuments als vertikale Grenze
    const documentHeight = document.body.scrollHeight;

    // Horizontale Begrenzung (5% Puffer an den Seiten)
    const paddingX = viewportWidth * 0.05;
    const minX = paddingX;
    const maxX = viewportWidth - paddingX - monkey.offsetWidth;

    // Vertikale Begrenzung: Vom oberen Rand bis zum unteren Rand der gesamten Seite
    const paddingY = 200; // Ein kleiner Puffer oben und unten, um nicht direkt am Rand zu sein
    const minY = paddingY;
    const maxY = documentHeight - paddingY - monkey.offsetHeight;

    const pts = [];
    let attempts = 0;
    while (pts.length < count && attempts < count * 20) {
      attempts++;
      // Generiert eine zufällige X-Koordinate innerhalb der 90% Breite
      const x = Math.random() * (maxX - minX) + minX;
      // Generiert eine zufällige Y-Koordinate über die gesamte Dokumenthöhe
      const y = Math.random() * (maxY - minY) + minY;

      // Da 'isAllowed' Viewport-Koordinaten erwartet, subtrahieren wir den aktuellen Scroll-Offset
      if (isAllowed(x, y - window.scrollY)) {
        pts.push({ x, y });
      }
    }
    return pts;
  }

  const waypoints = generateWaypoints();

  Object.assign(monkey.style, {
    position: 'absolute', // WICHTIG: position: absolute, damit er sich mit dem Scrollen bewegt
    transition: 'left 5s linear, top 5s linear',
    pointerEvents: 'none',
  });

  let idx = 0;
  let lastX = window.innerWidth / 2;
  let lastY = document.body.scrollHeight / 2;

  // Hauptfunktion: Bewegt den Affen zum nächsten Zielpunkt.
  function moveTo(pt) {
    const flip = pt.x < lastX ? -1 : 1;
    monkey.style.transform = `scaleX(${flip})`;

    const dx = pt.x - lastX;
    const dy = pt.y - lastY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const baseSpeed = 2000;
    const speedPerPixel = 2.5;
    const maxBaseSpeed = 3000;
    let moveDuration = baseSpeed + distance * speedPerPixel;

    moveDuration = Math.min(moveDuration, baseSpeed + 1000);
    moveDuration = Math.max(moveDuration, maxBaseSpeed);

    monkey.style.transitionDuration = `${moveDuration}ms`;
    startAnimation(moveDuration);

    lastX = pt.x;
    lastY = pt.y;
    monkey.style.left = `${pt.x}px`;
    monkey.style.top = `${pt.y}px`;
  }

  // Event-Listener: Wartet, bis die aktuelle Bewegung beendet ist.
  monkey.addEventListener('transitionend', () => {
    stopAnimation();
    idx = (idx + 1) % waypoints.length;
    const pauseDuration = 2000 + Math.random() * 3000;
    setTimeout(() => {
      moveTo(waypoints[idx]);
    }, pauseDuration);
  });

  // Startet die erste Bewegung des Affen zum ersten Wegpunkt.
  moveTo(waypoints[0]);

  // // 6) Affen-Sprite-Animation & Bewegung
  // const monkey = document.getElementById('monkey');
  // const main = document.querySelector('main');
  // const frames = [];
  // for (let i = 1; i <= 7; i++) frames.push(`assets/images/monkey_frames/monkey_${i}.png`);

  // let frameIdx = 0;
  // let animationInterval = null;

  // // Bildanimation starten
  // function startAnimation(duration) {
  //   const frameRate = Math.max(100, duration / frames.length);
  //   stopAnimation(); // Vorher stoppen
  //   animationInterval = setInterval(() => {
  //     monkey.src = frames[frameIdx];
  //     frameIdx = (frameIdx + 1) % frames.length;
  //   }, frameRate);
  // }

  // // Bildanimation stoppen
  // function stopAnimation() {
  //   if (animationInterval) {
  //     clearInterval(animationInterval);
  //     animationInterval = null;
  //   }
  // }

  // // Forbidden-Zonen
  // const forbiddenEls = main.querySelectorAll('img, video, .text');
  // let forbiddenRects = [];
  // function updateForbidden() {
  //   forbiddenRects = Array.from(forbiddenEls).map((el) => el.getBoundingClientRect());
  // }
  // updateForbidden();
  // window.addEventListener('resize', updateForbidden);
  // window.addEventListener('scroll', updateForbidden);

  // function isAllowed(x, y) {
  //   return !forbiddenRects.some((r) => x >= r.left && x <= r.right && y >= r.top && y <= r.bottom);
  // }

  // // Waypoints erzeugen mit Abstand vom Rand
  // function generateWaypoints(count = 12) {
  //   const rect = main.getBoundingClientRect();
  //   const padding = 100; // Abstand zum Rand in px
  //   const pts = [];
  //   let attempts = 0;
  //   while (pts.length < count && attempts < count * 20) {
  //     attempts++;
  //     const x = window.scrollX + rect.left + padding + Math.random() * (rect.width - 2 * padding);
  //     const y = window.scrollY + rect.top + padding + Math.random() * (rect.height - 2 * padding);
  //     if (isAllowed(x, y)) pts.push({ x, y });
  //   }
  //   return pts;
  // }

  // const waypoints = generateWaypoints();

  // Object.assign(monkey.style, {
  //   position: 'absolute',
  //   transition: 'left 5s linear, top 5s linear', // langsamere Standard-Geschwindigkeit
  //   pointerEvents: 'none',
  // });

  // let idx = 0,
  //   lastX = window.innerWidth / 2,
  //   lastY = window.innerHeight / 2;

  // // Bewegung zum nächsten Punkt
  // function moveTo(pt) {
  //   const flip = pt.x < lastX ? -1 : 1;
  //   monkey.style.transform = `translate(-50%, -50%) scaleX(${flip})`;

  //   const dx = pt.x - lastX;
  //   const dy = pt.y - lastY;
  //   const distance = Math.sqrt(dx * dx + dy * dy);

  //   // Geschwindigkeit steuern: längere Wege dauern länger
  //   const baseSpeed = 2000; // in ms, neue Basis-Geschwindigkeit = langsamer
  //   const speedPerPixel = 2.5; // je Pixel zusätzliche Zeit
  //   const maxBaseSpeed = 3000; // maximale Basisgeschwindigkeit (schneller als 3s soll es nicht sein)

  //   let moveDuration = baseSpeed + distance * speedPerPixel;

  //   // Hier begrenzen wir die maximale Dauer
  //   moveDuration = Math.min(moveDuration, baseSpeed + 1000); // z.B. Basis + max 1000ms extra
  //   moveDuration = Math.max(moveDuration, maxBaseSpeed); // nicht kleiner als maxBaseSpeed

  //   monkey.style.transitionDuration = `${moveDuration}ms`;

  //   startAnimation(moveDuration);

  //   lastX = pt.x;
  //   lastY = pt.y;
  //   monkey.style.left = `${pt.x}px`;
  //   monkey.style.top = `${pt.y}px`;
  // }

  // // Wenn Bewegung beendet ist
  // monkey.addEventListener('transitionend', () => {
  //   stopAnimation();
  //   idx = (idx + 1) % waypoints.length;

  //   // zufällige Pause zwischen 2 und 5 Sekunden
  //   const pauseDuration = 2000 + Math.random() * 3000;

  //   setTimeout(() => {
  //     moveTo(waypoints[idx]);
  //   }, pauseDuration);
  // });

  // // erster Start der Bewegung
  // moveTo(waypoints[0]);
});

// 7) JavaScript zum Validieren des Captchas
document.getElementById('captcha-form').addEventListener('submit', function (event) {
  event.preventDefault(); // Verhindert das Neuladen der Seite

  const sicherheitscode = document.getElementById('sicherheitscode').value;
  const formData = new FormData();
  formData.append('sicherheitscode', sicherheitscode);

  fetch('validate-captcha.php', {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.text())
    .then((result) => {
      if (result.trim() === 'success') {
        // Bei Erfolg den WhatsApp-Bereich anzeigen
        document.getElementById('captcha-form').style.display = 'none';
        document.getElementById('whatsapp-link-container').style.display = 'block';
      } else {
        alert('Der Sicherheitscode ist falsch. Bitte versuche es erneut.');
        // Captcha-Bild neu laden
        reloadCaptcha();
      }
    })
    .catch((error) => {
      console.error('Fehler:', error);
      alert('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    });
});

function reloadCaptcha() {
  document.getElementById('captcha-image').src = '/captcha/captcha.php?' + new Date().getTime();
}
