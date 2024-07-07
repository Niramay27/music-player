let currentsong = new Audio();
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch songs: ${response.status}`);
    }
    const html = await response.text();
    const div = document.createElement("div");
    div.innerHTML = html;
    const songs = [];
    for (const element of div.getElementsByTagName("a")) {
      if (element.href.endsWith(".mp3")) {
        songs.push(element.href);
      }
    }
    return songs;
  } catch (error) {
    console.error("Error fetching songs:", error);
    return [];
  }
}

async function main() {
  const songs = await getSongs("http://192.0.0.2:5500/songs.html");
  if (songs.length === 0) {
    console.warn("No songs found!");
    return;
  }

  const buttons = document.getElementsByClassName("song");
  const arr = [...buttons];

  arr.forEach((button, index) => {
    button.addEventListener("click", () => {
      currentsong.src = songs[index];
      console.log(index)
      console.log(currentsong.src)
      play.src = "pause.svg";
      const audio = new Audio(songs[index]);
      currentsong.play();
      let songname = songs[index].substring(28);
      document.querySelector(".songinfo").innerHTML = songname.replaceAll("%20", " ");
      document.querySelector(".songtime").innerHTML = "00:00/00:00";
    });
  });

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play()
      play.src = "pause.svg"
    }
    else {
      currentsong.pause()
      play.src = "play.svg"
    }
  })

  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} / ${secondsToMinutesSeconds(currentsong.duration)}`
    document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
  })

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = ((currentsong.duration) * percent) / 100;
  })

  previous.addEventListener("click", e => {
    let index = songs.indexOf(currentsong.src);
    if ((index - 1) > -1) {
      newIndex = index - 1;
      currentsong.src = songs[newIndex];
      const audio = new Audio(songs[newIndex]);
      currentsong.play();
      let songname = songs[newIndex].substring(28);
      document.querySelector(".songinfo").innerHTML = songname.replaceAll("%20", " ");
      document.querySelector(".songtime").innerHTML = "00:00/00:00";
    }
  })

  next.addEventListener("click", e => {
    let index = songs.indexOf(currentsong.src);
    if ((index + 1) < songs.length) {
      newIndex = index + 1;
      currentsong.src = songs[newIndex];
      const audio = new Audio(songs[newIndex]);
      currentsong.play();
      let songname = songs[newIndex].substring(28);
      document.querySelector(".songinfo").innerHTML = songname.replaceAll("%20", " ");
      document.querySelector(".songtime").innerHTML = "00:00/00:00";
    }
  })
  const volumeBar = document.querySelector(".updown");
  volumeBar.addEventListener("input", (e) => {
    currentsong.volume = e.target.value / 100;

  });
  document.querySelector(".app").addEventListener("click", () => {
    window.open('https://www.spotify.com/us/download/android/', '_blank');
  })
  document.querySelector(".premium").addEventListener("click", () => {
    window.open('https://www.spotify.com/in-en/premium/', '_blank');
  });
}
main();


