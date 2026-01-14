document.addEventListener('DOMContentLoaded', () => {

    // 1. SCROLL ANIMATION LOGIC
    // This watches for elements with class "reveal" and makes them appear when scrolled to
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    });

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

    // 2. SERVER STATUS LOGIC
    async function fetchStats() {
        const pCount = document.getElementById('player-count');
        if(!pCount) return; // Stop if not on homepage

        try {
            const res = await fetch('/api/server-status');
            const data = await res.json();

            document.getElementById('player-count').innerText = `${data.players} / ${data.maxPlayers}`;
            document.getElementById('queue-count').innerText = data.queue;
            document.getElementById('uptime').innerText = data.uptime;

            setTimeout(() => {
                const pct = Math.floor((data.players / data.maxPlayers) * 100);
                document.getElementById('stat-fill').style.width = `${pct}%`;
            }, 200);

        } catch (error) { console.log("Status error"); }
    }

    fetchStats();
});