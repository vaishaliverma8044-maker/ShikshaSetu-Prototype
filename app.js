/* =================================
   SHIKSHASETU - JAVASCRIPT
   ================================= */

// Check internet connection
function updateNetworkStatus() {
  const badge = document.getElementById("networkBadge");

  if (!badge) return;

  if (navigator.onLine) {
    badge.textContent = "● Online";
    badge.style.color = "#23834b";
    badge.style.background = "#edf9f1";
  } else {
    badge.textContent = "● Offline";
    badge.style.color = "#c25b35";
    badge.style.background = "#fff1eb";
  }
}


// Run when page loads
document.addEventListener("DOMContentLoaded", function () {

  updateNetworkStatus();

  console.log("ShikshaSetu loaded successfully.");

});


// Detect internet changes
window.addEventListener("online", updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);


// Save selected language
function setLanguage(language) {
  localStorage.setItem("shikshaSetuLanguage", language);

  console.log("Selected language:", language);
}


// Get saved language
function getLanguage() {
  return localStorage.getItem("shikshaSetuLanguage") || "English";
}


// Save offline learning pack
function saveOfflinePack(packName) {

  let packs =
    JSON.parse(localStorage.getItem("offlinePacks")) || [];

  if (!packs.includes(packName)) {
    packs.push(packName);
  }

  localStorage.setItem(
    "offlinePacks",
    JSON.stringify(packs)
  );

  alert(packName + " added to Offline Library!");
}


// Get saved offline packs
function getOfflinePacks() {

  return JSON.parse(
    localStorage.getItem("offlinePacks")
  ) || [];

}


// Simple notification
function showMessage(message) {
  alert(message);
}
getData() {
    try {
        return JSON.parse(
            localStorage.getItem("shikshaSetuActivity")
        ) || {
            visited: {},
            resources: {},
            offline: {},
            quizzes: {},
            recent: []
        };
    } catch (error) {
        return {
            visited: {},
            resources: {},
            offline: {},
            quizzes: {},
            recent: []
        };
    }
},

save(data) {
    localStorage.setItem(
        "shikshaSetuActivity",
        JSON.stringify(data)
    );
},

addRecent(item) {
    const data = this.getData();

    data.recent = data.recent.filter(
        x => x.id !== item.id
    );

    data.recent.unshift({
        ...item,
        time: Date.now()
    });

    // Keep only last 6 activities
    data.recent = data.recent.slice(0, 6);

    this.save(data);
},

visitPage(id, title, category = "Learning") {
    const data = this.getData();

    if (!data.visited[id]) {
        data.visited[id] = {
            title: title,
            category: category,
            visits: 0
        };
    }

    data.visited[id].visits++;

    this.addRecent({
        id: id,
        title: title,
        category: category
    });

    this.save(data);
},

resourceOpened(id, title, subject = "") {
    const data = this.getData();

    if (!data.resources[id]) {
        data.resources[id] = {
            title: title,
            subject: subject,
            opened: 0,
            completed: false
        };
    }

    data.resources[id].opened++;

    this.addRecent({
        id: id,
        title: title,
        category: "Learning",
        subject: subject
    });

    this.save(data);
},

completeResource(id) {
    const data = this.getData();

    if (data.resources[id]) {
        data.resources[id].completed = true;
    }

    this.save(data);
},

offlineOpened(id, title) {
    const data = this.getData();

    if (!data.offline[id]) {
        data.offline[id] = {
            title: title,
            opened: 0
        };
    }

    data.offline[id].opened++;

    this.addRecent({
        id: id,
        title: title,
        category: "Offline Library"
    });

    this.save(data);
},

quizCompleted(id, title) {
    const data = this.getData();

    if (!data.quizzes[id]) {
        data.quizzes[id] = {
            title: title,
            completedAt: Date.now()
        };
    }

    this.addRecent({
        id: id,
        title: title,
        category: "Quiz"
    });

    this.save(data);
},

getStats() {
    const data = this.getData();

    const resources = Object.values(data.resources);
    const offline = Object.values(data.offline);
    const quizzes = Object.values(data.quizzes);

    const resourceCount = resources.length;

    const completedCount = resources.filter(
        r => r.completed
    ).length;

    let progress = 0;

    if (resourceCount > 0) {
        progress = Math.round(
            (completedCount / resourceCount) * 100
        );
    }

    return {
        resourcesViewed: resourceCount,
        offlineUsed: offline.length,
        progress: progress,
        quizzesCompleted: quizzes.length,
        recent: data.recent
    };
}