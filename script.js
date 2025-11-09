document.addEventListener('DOMContentLoaded', () => {
  const scheduleContainer = document.getElementById('schedule');
  const searchInput = document.getElementById('search');
  let talks = [];

  fetch('talks.json')
    .then(response => response.json())
    .then(data => {
      talks = data;
      displayTalks(talks);
    });

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTalks = talks.filter(talk => {
      return talk.category.some(category => category.toLowerCase().includes(searchTerm));
    });
    displayTalks(filteredTalks);
  });

  function displayTalks(talksToDisplay) {
    scheduleContainer.innerHTML = '';
    let currentTime = new Date();
    currentTime.setHours(10, 0, 0, 0);

    talksToDisplay.forEach((talk, index) => {
      if (index === 3) {
        const lunchBreakDiv = document.createElement('div');
        lunchBreakDiv.className = 'lunch-break';
        const lunchStartTime = new Date(currentTime.getTime());
        const lunchEndTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
        lunchBreakDiv.innerHTML = `
          <div class="time">${formatTime(lunchStartTime)} - ${formatTime(lunchEndTime)}</div>
          <div>Lunch Break</div>
        `;
        scheduleContainer.appendChild(lunchBreakDiv);
        currentTime.setMinutes(currentTime.getMinutes() + 60);
      }

      const talkDiv = document.createElement('div');
      talkDiv.className = 'talk';

      const startTime = new Date(currentTime.getTime());
      const endTime = new Date(currentTime.getTime() + talk.duration * 60 * 1000);

      talkDiv.innerHTML = `
        <div class="time">${formatTime(startTime)} - ${formatTime(endTime)}</div>
        <h2>${talk.title}</h2>
        <div class="speakers">${talk.speakers.join(', ')}</div>
        <p>${talk.description}</p>
        <div class="category">
          ${talk.category.map(cat => `<span>${cat}</span>`).join('')}
        </div>
      `;
      scheduleContainer.appendChild(talkDiv);

      currentTime.setMinutes(currentTime.getMinutes() + talk.duration + 10);
    });
  }

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
});
