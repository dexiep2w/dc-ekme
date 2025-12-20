const userId = "811619807459147776";

// Status ikonları
function getStatusIcon(status) {
  const mapping = {
    online: "games/online.png",
    idle: "games/bosta.png",
    dnd: "games/dnd.png",
    invisible: "games/invis.png",
    offline: "games/invis.png",
  };
  return mapping[status] || mapping.offline;
}

// Oyun logosu
function getGameLogo(name) {
  const mapping = {
    "Roblox": "games/roblox.jpg",
    "GTA V": "games/gta.png",
    "Minecraft": "games/minecraft.png",
    "SonOyuncu Client": "games/so.jpg",
    "SonOyuncu": "games/so.jpg",
    "Goose Goose Duck": "games/duck.jpg",
    "VrChat": "games/vrchat.jpg",
  };
  return mapping[name] || "";
}

// Discord verisini çek
async function loadDiscord() {
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
    const json = await res.json();
    const data = json.data;

    // Avatar
    const avatarHash = data.discord_user.avatar;
    document.getElementById("avatar").src = avatarHash
      ? `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.png?size=256`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;

    // Status icon
    document.getElementById("status-icon").src = getStatusIcon(data.discord_status);

    // Username
    document.getElementById("username").innerText = `${data.discord_user.username}#${data.discord_user.discriminator}`;

    // Oyun
    const activityBox = document.getElementById("activity");
    activityBox.classList.add("hidden");
    const game = data.activities?.find(a => a.type === 0); // oyun
    if (game) {
      document.getElementById("game").innerText = `${game.name} oynuyor`;

      // Başlama zamanı
      const startTime = game.timestamps?.start;
      if (startTime) {
        function updateGameTime() {
          const elapsedMs = Date.now() - startTime;
          const hours = Math.floor(elapsedMs / 3600000);
          const minutes = Math.floor((elapsedMs % 3600000) / 60000);
          document.getElementById("game-time").innerText = `⏱ ${hours}h ${minutes}m`;
        }
        updateGameTime();
        setInterval(updateGameTime, 60000);
      } else document.getElementById("game-time").innerText = "";

      // Logo
      const logoUrl = getGameLogo(game.name);
      const logoEl = document.getElementById("game-logo");
      if (logoUrl) {
        logoEl.src = logoUrl;
        logoEl.style.display = "block";
      } else logoEl.style.display = "none";

      activityBox.classList.remove("hidden");
    }

  } catch (err) {
    console.error("Discord verisi çekilemedi:", err);
  }
}

// Yenile
loadDiscord();
setInterval(loadDiscord, 3000);
