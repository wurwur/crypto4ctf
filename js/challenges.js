/* ============================================================
   Challenges - Mini-challenge logic
   ============================================================ */

const Challenges = {
  init() {
    document.querySelectorAll('.challenge-card').forEach(card => {
      const checkBtn = card.querySelector('.btn-check');
      const hintBtn = card.querySelector('.btn-hint');
      const input = card.querySelector('.challenge-input');

      if (checkBtn) {
        checkBtn.addEventListener('click', () => this.checkAnswer(card));
      }
      if (input) {
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter') this.checkAnswer(card);
        });
      }
      if (hintBtn) {
        hintBtn.addEventListener('click', () => this.toggleHint(card));
      }
    });
  },

  checkAnswer(card) {
    const input = card.querySelector('.challenge-input');
    const feedback = card.querySelector('.challenge-feedback');
    const expected = card.dataset.answer;
    const type = card.dataset.type || 'exact';
    const userAnswer = input.value.trim();

    if (!userAnswer) {
      feedback.textContent = '[!] Type your answer above';
      feedback.className = 'challenge-feedback incorrect';
      return;
    }

    let correct = false;
    if (type === 'exact') {
      correct = userAnswer.toLowerCase() === expected.toLowerCase();
    } else if (type === 'number') {
      correct = parseInt(userAnswer) === parseInt(expected);
    } else if (type === 'any-of') {
      const options = expected.split('|').map(s => s.toLowerCase());
      correct = options.includes(userAnswer.toLowerCase());
    }

    if (correct) {
      feedback.textContent = '[ok] Correct!';
      feedback.className = 'challenge-feedback correct';
      card.style.borderColor = 'rgba(0, 255, 136, 0.3)';
      input.style.borderColor = 'var(--green)';
    } else {
      feedback.textContent = '[x] Not quite - try again!';
      feedback.className = 'challenge-feedback incorrect';
      input.style.animation = 'shake 0.4s ease';
      setTimeout(() => input.style.animation = '', 400);
    }
  },

  toggleHint(card) {
    const hint = card.querySelector('.challenge-hint');
    if (hint) hint.classList.toggle('show');
  },

};
