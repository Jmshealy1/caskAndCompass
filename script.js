document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quickAddForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="text"]');
    const category = form.querySelector('select').value;
    const goal = {
      id: Date.now(),
      title: input.value.trim(),
      category,
    };

    if (!goal.title) return;

    // Store in localStorage (swap with MongoDB later)
    let goals = JSON.parse(localStorage.getItem('quickGoals') || '[]');
    goals.push(goal);
    localStorage.setItem('quickGoals', JSON.stringify(goals));

    alert(`Goal added: ${goal.title}`);
    input.value = '';
  });
});
