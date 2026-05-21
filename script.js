/* ============================================
   WIJHA — Interactive JavaScript
   Particles · Scroll Reveals · Counter · Nav
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────── LOADER ─────────── */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 800);
  });
  // Fallback: hide after 3s even if load never fires
  setTimeout(() => loader.classList.add('hidden'), 3000);

  /* ─────────── CURSOR GLOW ─────────── */
  const cursorGlow = document.getElementById('cursorGlow');
  let cursorX = 0, cursorY = 0, glowX = 0, glowY = 0;

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
  });

  function animateCursor() {
    glowX += (cursorX - glowX) * 0.08;
    glowY += (cursorY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  /* ─────────── PARTICLES ─────────── */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseParticle = { x: -999, y: -999 };

    function resizeCanvas() {
      const hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    canvas.parentElement.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseParticle.x = e.clientX - rect.left;
      mouseParticle.y = e.clientY - rect.top;
    });

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2.2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.15;
        this.pulse = Math.random() * Math.PI * 2;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += 0.02;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        const pulseFactor = Math.sin(this.pulse) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * pulseFactor, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${this.opacity * pulseFactor})`;
        ctx.fill();
      }
    }

    const particleCount = Math.min(80, Math.floor(canvas.width * canvas.height / 12000));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.12;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
        // Mouse connection
        const mdx = particles[i].x - mouseParticle.x;
        const mdy = particles[i].y - mouseParticle.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 180) {
          const alpha = (1 - mdist / 180) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mouseParticle.x, mouseParticle.y);
          ctx.stroke();
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ─────────── NAVBAR ─────────── */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('[data-nav]');

  // Scroll class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Mobile toggle with backdrop overlay
  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  function openMobileNav() {
    navToggle.classList.add('open');
    navLinks.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    navToggle.classList.remove('open');
    navLinks.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    if (navLinks.classList.contains('open')) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  overlay.addEventListener('click', closeMobileNav);

  // Close mobile on link click
  navItems.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Close on lang-switch click too
  const langSwitch = document.querySelector('.lang-switch');
  if (langSwitch) {
    langSwitch.addEventListener('click', closeMobileNav);
  }

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  function setActiveNav() {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`[data-nav][href="#${id}"]`);
      if (link) {
        if (scrollY >= top && scrollY < top + height) {
          navItems.forEach(n => n.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  }
  window.addEventListener('scroll', setActiveNav);

  /* ─────────── SCROLL REVEAL ─────────── */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ─────────── COUNTER ANIMATION ─────────── */
  const statNumbers = document.querySelectorAll('.stat-number');
  let countersStarted = false;

  function animateCounters() {
    if (countersStarted) return;
    countersStarted = true;

    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
      const suffix = stat.textContent.replace(/[0-9]/g, '');
      let current = 0;
      const increment = target / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        stat.textContent = Math.floor(current) + suffix;
      }, 25);
    });
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) animateCounters();
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => statsObserver.observe(el));

  /* ─────────── SERVICE CARD MOUSE GLOW ─────────── */
  const servicesGrid = document.getElementById('servicesGrid');
  if (servicesGrid) {
    servicesGrid.addEventListener('mousemove', (e) => {
      const cards = servicesGrid.querySelectorAll('.service-card');
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mouse-x', x + '%');
        card.style.setProperty('--mouse-y', y + '%');
      });
    });

    // "En savoir plus" / "اعرف المزيد" → scroll to contact
    servicesGrid.querySelectorAll('.service-arrow').forEach(arrow => {
      arrow.style.cursor = 'pointer';
      arrow.addEventListener('click', () => {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ─────────── CONTACT FORM ─────────── */
  const contactForm = document.getElementById('contactForm');
  const toast = document.getElementById('toast');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isArabic = document.documentElement.lang === 'ar';
      const sendingText = isArabic ? 'جارٍ الإرسال...' : 'Envoi en cours...';
      const successText = isArabic ? 'تم إرسال رسالتكم بنجاح!' : 'Message envoyé avec succès !';
      const errorText = isArabic ? 'حدث خطأ، يرجى المحاولة لاحقاً.' : 'Erreur, veuillez réessayer.';
      const btn = contactForm.querySelector('.btn');
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> ' + sendingText;
      btn.disabled = true;

      const formData = new FormData(contactForm);

      fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        if (response.ok) {
          contactForm.reset();
          const toastMsg = document.getElementById('toast-message');
          if (toastMsg) toastMsg.textContent = successText;
          toast.classList.add('show');
          setTimeout(() => toast.classList.remove('show'), 3500);
        } else {
          alert(errorText);
        }
      })
      .catch(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        alert(errorText);
      });
    });
  }

  /* ─────────── BACK TO TOP ─────────── */
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─────────── SMOOTH SCROLL ─────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─────────── TILT EFFECT ON SERVICE CARDS ─────────── */
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -4;
      const rotateY = (x - centerX) / centerX * 4;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─────────── TYPING EFFECT ON HERO (optional flair) ─────────── */
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    heroTitle.style.opacity = '0';
    heroTitle.style.transform = 'translateY(30px)';
    heroTitle.style.transition = 'opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1)';
    
    setTimeout(() => {
      heroTitle.style.opacity = '1';
      heroTitle.style.transform = 'translateY(0)';
    }, 900);
  }

  const heroDesc = document.querySelector('.hero-desc');
  if (heroDesc) {
    heroDesc.style.opacity = '0';
    heroDesc.style.transform = 'translateY(20px)';
    heroDesc.style.transition = 'opacity .8s ease .3s, transform .8s ease .3s';
    setTimeout(() => {
      heroDesc.style.opacity = '1';
      heroDesc.style.transform = 'translateY(0)';
    }, 1200);
  }

  const heroButtons = document.querySelector('.hero-buttons');
  if (heroButtons) {
    heroButtons.style.opacity = '0';
    heroButtons.style.transform = 'translateY(20px)';
    heroButtons.style.transition = 'opacity .8s ease .5s, transform .8s ease .5s';
    setTimeout(() => {
      heroButtons.style.opacity = '1';
      heroButtons.style.transform = 'translateY(0)';
    }, 1400);
  }

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    heroStats.style.opacity = '0';
    heroStats.style.transform = 'translateY(20px)';
    heroStats.style.transition = 'opacity .8s ease .7s, transform .8s ease .7s';
    setTimeout(() => {
      heroStats.style.opacity = '1';
      heroStats.style.transform = 'translateY(0)';
    }, 1600);
  }

  /* ─────────── PORTFOLIO FILTERS ─────────── */
  const filterBtns = document.querySelectorAll('.pf-filter');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity .5s ease, transform .5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ─────────── MODAL ESCAPE KEY ─────────── */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeProjectModal();
  });

});

/* ============================================
   PORTFOLIO MODAL — Global Functions
   ============================================ */

const projectData = {
  bassira: {
    fr: {
      title: 'Bassira',
      badge: 'IA Embarquée',
      image: 'assets/bassira.png?v=2',
      desc: "Bassira est un système de surveillance intelligent conçu par Wijha, combinant l'intelligence artificielle et les systèmes embarqués pour offrir une sécurité proactive. Le système détecte automatiquement les tentatives de vol et d'intrusion en temps réel, et déclenche des alertes instantanées pour une intervention rapide. Grâce à des algorithmes de deep learning optimisés pour le edge computing, Bassira fonctionne de manière autonome sans dépendre du cloud.",
      techs: ['Python', 'TensorFlow Lite', 'OpenCV', 'Raspberry Pi', 'MQTT', 'React Dashboard'],
      features: [
        "Détection d'intrusion en temps réel par IA",
        'Alertes instantanées (SMS, notification push, sirène)',
        'Reconnaissance faciale et identification',
        'Heatmap de mouvement et analytiques',
        'Fonctionnement hors-ligne (edge computing)',
        'Dashboard de monitoring en temps réel'
      ]
    },
    ar: {
      title: 'بصيرة',
      badge: 'الذكاء الاصطناعي المدمج',
      image: 'assets/bassira.png?v=2',
      desc: '"بصيرة" هو نظام مراقبة متطور من ابتكار "وجهة"، يدمج بسلاسة بين تقنيات الذكاء الاصطناعي والأنظمة المدمجة لتقديم حلول أمنية استباقية. يقوم النظام برصد محاولات التسلل والسرقة في الوقت الفعلي، مُصدراً تنبيهات فورية لضمان سرعة الاستجابة. وبفضل خوارزميات التعلم العميق المحسّنة للعمل على الحوسبة الطرفية (Edge Computing)، تعمل "بصيرة" باستقلالية تامة دون الحاجة للاتصال بالخوادم السحابية.',
      techs: ['Python', 'TensorFlow Lite', 'OpenCV', 'Raspberry Pi', 'MQTT', 'React Dashboard'],
      features: [
        "رصد التسلل الفوري بالاعتماد على الذكاء الاصطناعي",
        "إرسال تنبيهات لحظية (رسائل نصية، إشعارات، إنذار صوتي)",
        "تقنية التعرف على الوجوه وتحديد الهوية بدقة",
        "توليد خرائط حرارية للحركة مع تحليلات متقدمة",
        "التشغيل المستقل دون الحاجة للإنترنت (الحوسبة الطرفية)",
        "لوحة تحكم تفاعلية للمراقبة الحية"
      ]
    }
  },
  tijarti: {
    fr: {
      title: 'Tijarti',
      badge: 'Application Mobile ERP',
      image: 'assets/tijarti.png?v=2',
      desc: "Tijarti (تجارتي) est une application mobile ERP complète développée par Wijha pour simplifier la gestion commerciale des entreprises. Elle offre une suite d'outils intégrés pour la gestion des ventes, de l'inventaire, de la facturation et des analytiques métier. Avec une interface intuitive et moderne, Tijarti permet aux entrepreneurs de piloter leur activité depuis leur smartphone, partout et à tout moment.",
      techs: ['Flutter', 'Dart', 'Firebase', 'Node.js', 'MongoDB', 'REST API'],
      features: [
        'Tableau de bord analytique en temps réel',
        'Gestion des ventes et suivi des commandes',
        "Gestion d'inventaire avec alertes de stock",
        'Facturation automatisée et suivi des paiements',
        'Rapports détaillés et exportation de données',
        'Support multilingue (Français, Arabe, Anglais)'
      ]
    },
    ar: {
      title: 'تجارتي',
      badge: 'تطبيق موبايل ERP',
      image: 'assets/tijarti.png?v=2',
      desc: '"تجارتي" هو تطبيق هاتف محمول شامل لتخطيط موارد المؤسسات (ERP)، تم تصميمه وتطويره بواسطة "وجهة" بهدف تبسيط منظومة الإدارة التجارية للشركات. يتيح التطبيق باقة من الأدوات المتكاملة لإدارة المبيعات، ضبط المخزون، إصدار الفواتير، وتحليل الأداء التجاري. وبفضل واجهته العصرية والبديهية، يُمكّن "تجارتي" رواد الأعمال من إدارة أعمالهم بكفاءة عبر هواتفهم الذكية، في أي وقت ومن أي مكان.',
      techs: ['Flutter', 'Dart', 'Firebase', 'Node.js', 'MongoDB', 'REST API'],
      features: [
        "لوحة تحكم تفاعلية تقدم تحليلات فورية",
        "إدارة المبيعات وتتبع مسار الطلبات بدقة",
        "إدارة دقيقة للمخزون مع تنبيهات استباقية للنواقص",
        "أتمتة الفواتير ومتابعة دورة المدفوعات",
        "استخراج تقارير تفصيلية مع إمكانية تصدير البيانات",
        "دعم متكامل لعدة لغات (الفرنسية، العربية، والإنجليزية)"
      ]
    }
  },
  websites: {
    fr: {
      title: 'Sites Web Réalisés',
      badge: 'Développement Web',
      image: 'assets/websites.png',
      desc: "Wijha a conçu et développé une variété de sites web modernes pour des clients issus de différents secteurs d'activité. De sites vitrines élégants à des plateformes e-commerce complètes, en passant par des applications web sur mesure, chaque projet est réalisé avec les dernières technologies et les meilleures pratiques du web design pour garantir performance, responsive design et expérience utilisateur optimale.",
      techs: ['React', 'Next.js', 'Vue.js', 'WordPress', 'Node.js', 'Figma'],
      features: [
        'Sites vitrines corporate et landing pages',
        'Plateformes e-commerce complètes',
        'Applications web sur mesure (SPA/PWA)',
        'Design responsive et mobile-first',
        'Optimisation SEO et performances',
        'Intégration CMS et back-office personnalisé'
      ]
    },
    ar: {
      title: 'مواقع الويب',
      badge: 'تطوير الويب',
      image: 'assets/websites.png',
      desc: 'أنجزت "وجهة" تصميم وتطوير طيف واسع من المنصات والمواقع الإلكترونية الحديثة لعملاء من شتى القطاعات الحيوية. ابتداءً من المواقع المؤسسية الراقية، مروراً بمنصات التجارة الإلكترونية المتكاملة، وصولاً إلى تطبيقات الويب المخصصة؛ نلتزم في كل مشروع بتوظيف أحدث التقنيات وأفضل الممارسات العالمية لضمان الأداء الفائق، التصميم المتجاوب، وتجربة المستخدم الاستثنائية.',
      techs: ['React', 'Next.js', 'Vue.js', 'WordPress', 'Node.js', 'Figma'],
      features: [
        "تطوير مواقع مؤسسية تعريفية وصفحات هبوط تفاعلية",
        "بناء منصات متكاملة للتجارة الإلكترونية",
        "برمجة تطبيقات ويب مخصصة وعالية الاستجابة (SPA/PWA)",
        "تصميم متجاوب يعتمد نهج الأولوية للهواتف المحمولة",
        "تحسين الأداء العام وتهيئة المواقع لمحركات البحث (SEO)",
        "دمج أنظمة إدارة المحتوى (CMS) وتوفير لوحات تحكم مخصصة"
      ]
    }
  }
};

function openProjectModal(projectId) {
  const lang = document.documentElement.lang || 'fr';
  const data = projectData[projectId][lang];
  if (!data) return;

  const modal = document.getElementById('projectModal');
  const modalImage = document.getElementById('modalImage');
  const modalBadge = document.getElementById('modalBadge');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTechs = document.getElementById('modalTechs');
  const modalFeatures = document.getElementById('modalFeatures');

  modalImage.innerHTML = '<img src="' + data.image + '" alt="' + data.title + '" />';
  modalBadge.textContent = data.badge;
  modalTitle.textContent = data.title;
  modalDesc.textContent = data.desc;
  modalTechs.innerHTML = data.techs.map(function(t) { return '<span class="ptag">' + t + '</span>'; }).join('');
  modalFeatures.innerHTML = data.features.map(function(f) { return '<li>' + f + '</li>'; }).join('');

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}
