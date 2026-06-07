const navToggle = document.querySelector('[data-nav-toggle]');
const navLinks = document.querySelector('[data-nav-links]');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      document.body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const revealItems = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);
revealItems.forEach((item) => observer.observe(item));

const quizForm = document.querySelector('[data-quiz-form]');
if (quizForm) {
  const questions = [...quizForm.querySelectorAll('[data-question]')];
  const nextButton = quizForm.querySelector('[data-quiz-next]');
  const previousButton = quizForm.querySelector('[data-quiz-prev]');
  const progress = quizForm.querySelector('[data-quiz-progress]');
  const resultBox = quizForm.querySelector('[data-quiz-result]');
  let currentQuestion = 0;

  const results = {
    safety: {
      title: 'Safety First',
      text: 'Il vostro primo bisogno è creare più sicurezza percepita. Parti da routine brevi, prevedibili e da pause di regolazione prima di chiedere collaborazione.'
    },
    listening: {
      title: 'Deep Listening',
      text: 'Il vostro primo passo è osservare meglio. Prima di intervenire, raccogli segnali su contesto, postura, distanza, ritmo e micro-cambiamenti.'
    },
    movement: {
      title: 'Movement Matters',
      text: 'Il corpo sta dando informazioni importanti. Lavora su comfort, equilibrio, movimento funzionale e consulta professionisti qualificati quando serve.'
    },
    education: {
      title: 'Clear Education',
      text: 'Serve più chiarezza nella comunicazione. Riduci la pressione, semplifica le richieste e costruisci apprendimento attraverso fiducia e progressione.'
    }
  };

  const showQuestion = (index) => {
    questions.forEach((question, questionIndex) => {
      question.hidden = questionIndex !== index;
    });
    previousButton.disabled = index === 0;
    nextButton.textContent = index === questions.length - 1 ? 'Vedi risultato' : 'Avanti';
    progress.style.width = `${((index + 1) / questions.length) * 100}%`;
  };

  const getSelectedValue = () => {
    const activeFieldset = questions[currentQuestion];
    const checked = activeFieldset.querySelector('input:checked');
    return checked ? checked.value : null;
  };

  const calculateResult = () => {
    const scores = { safety: 0, listening: 0, movement: 0, education: 0 };
    new FormData(quizForm).forEach((value) => {
      scores[value] += 1;
    });
    const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    return results[winner];
  };

  nextButton.addEventListener('click', () => {
    if (!getSelectedValue()) {
      resultBox.hidden = false;
      resultBox.innerHTML = '<strong>Prima scegli una risposta.</strong>';
      return;
    }

    resultBox.hidden = true;
    if (currentQuestion < questions.length - 1) {
      currentQuestion += 1;
      showQuestion(currentQuestion);
      return;
    }

    const result = calculateResult();
    resultBox.hidden = false;
    resultBox.innerHTML = `<h3>${result.title}</h3><p>${result.text}</p><a class="text-link" href="#newsletter">Ricevi la guida gratuita →</a>`;
  });

  previousButton.addEventListener('click', () => {
    if (currentQuestion > 0) {
      currentQuestion -= 1;
      showQuestion(currentQuestion);
      resultBox.hidden = true;
    }
  });

  showQuestion(currentQuestion);
}

const signupForm = document.querySelector('[data-signup-form]');
if (signupForm) {
  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = signupForm.querySelector('[data-signup-message]');
    message.textContent = 'Grazie. In una versione collegata a un email provider, qui partirà la guida gratuita.';
  });
}
