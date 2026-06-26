/* Interactive Features for Yashika Gautam's Portfolio */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initStatsCounter();
  initShareButton();
  init3dTilt();
  initSmoothScroll();
  initModal();
  initTimelineTabs();
  initContactModal();
});

/* 1. Theme Management (Default: Light Theme) */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  // Set default theme to light if not stored in localStorage
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon(currentTheme);

  themeToggle.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  
  if (theme === 'light') {
    // Moon Icon (click to go dark)
    toggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  } else {
    // Sun Icon (click to go light)
    toggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="18.36" x2="5.64" y2="19.78"></line>
        <line x1="18.36" y1="4.22" x2="19.78" y2="5.64"></line>
      </svg>
    `;
  }
}

/* 2. Stats Counter Animation on Scroll */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  if (stats.length === 0) return;

  const observerOptions = {
    root: null,
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetVal = parseInt(target.getAttribute('data-target'), 10);
        animateCounter(target, targetVal);
        observer.unobserve(target);
      }
    });
  }, observerOptions);

  stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, targetValue) {
  let currentValue = 0;
  const duration = 1500; // 1.5s
  const frameRate = 60;
  const totalFrames = Math.round(duration / (1000 / frameRate));
  const step = targetValue / totalFrames;
  let frame = 0;

  const timer = setInterval(() => {
    frame++;
    currentValue += step;

    if (frame >= totalFrames) {
      clearInterval(timer);
      element.innerText = formatNumber(targetValue);
    } else {
      element.innerText = formatNumber(Math.floor(currentValue));
    }
  }, 1000 / frameRate);
}

function formatNumber(num) {
  if (num >= 100000) {
    return (num / 1000).toLocaleString() + 'K+';
  }
  if (num >= 1000) {
    return num.toLocaleString() + '+';
  }
  return num + '+';
}

/* 3. Share Button Clipboard Copying & Toast Notification */
function initShareButton() {
  const shareBtns = document.querySelectorAll('.share-btn');
  shareBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const portfolioUrl = window.location.href;
      
      navigator.clipboard.writeText(portfolioUrl).then(() => {
        showToast('Portfolio URL copied to clipboard! 📋');
      }).catch(() => {
        const textArea = document.createElement('textarea');
        textArea.value = portfolioUrl;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          showToast('Portfolio URL copied! 📋');
        } catch (err) {
          showToast('Failed to copy. URL: ' + portfolioUrl);
        }
        document.body.removeChild(textArea);
      });
    });
  });
}

function showToast(message) {
  const toast = document.getElementById('copy-toast');
  if (!toast) return;

  toast.querySelector('span').innerText = message;
  toast.classList.add('active');

  setTimeout(() => {
    toast.classList.remove('active');
  }, 3000);
}

/* 4. 3D Tilt Effect on Photo Hover */
function init3dTilt() {
  const avatar = document.querySelector('.profile-avatar');
  const container = document.querySelector('.profile-avatar-container');
  if (!avatar || !container) return;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const maxRotate = 8;
    const rotateY = ((x - centerX) / centerX) * maxRotate;
    const rotateX = -((y - centerY) / centerY) * maxRotate;
    
    avatar.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });

  container.addEventListener('mouseleave', () => {
    avatar.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    avatar.style.transition = 'transform 0.5s ease';
  });

  container.addEventListener('mouseenter', () => {
    avatar.style.transition = 'none';
  });
}

/* 5. Smooth Scroll Navigation Links */
function initSmoothScroll() {
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* 6. Career Timeline Tab Switcher */
function initTimelineTabs() {
  const tabs = document.querySelectorAll('.timeline-tab');
  const containers = document.querySelectorAll('.timeline-container');

  if (tabs.length === 0) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');
      
      // Remove active class from all tabs and containers
      tabs.forEach(t => t.classList.remove('active'));
      containers.forEach(c => c.classList.remove('active'));

      // Add active class to clicked tab and target container
      tab.classList.add('active');
      const targetContainer = document.getElementById(targetId);
      if (targetContainer) {
        targetContainer.classList.add('active');
      }
    });
  });
}

/* 7. Modal Control for Case Study */
function initModal() {
  const openBtn = document.getElementById('open-bravo-modal');
  const closeBtn = document.getElementById('close-bravo-modal');
  const modal = document.getElementById('bravo-modal');

  if (!openBtn || !closeBtn || !modal) return;

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* 8. Contact Options Modal */
function initContactModal() {
  const openBtn = document.getElementById('open-contact-modal');
  const closeBtn = document.getElementById('close-contact-modal');
  const modal = document.getElementById('contact-modal');

  if (!openBtn || !closeBtn || !modal) return;

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Also close modal if clicking a contact option inside it
  const optionItems = modal.querySelectorAll('.contact-option-item');
  optionItems.forEach(item => {
    item.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}
