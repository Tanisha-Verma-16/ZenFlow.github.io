// Define a constant to toggle debugging mode
const DEBUG = false;

// Function to clear content of a DOM element with class 'content'
const clearContent = () => {
  const content = select(".content"); // Get reference to content element
  content.innerHTML = ""; // Clear inner HTML of content element
  return content; // Return cleared content element
};

// Function to retrieve tasks from localStorage
const getTasks = () => {
  return JSON.parse(localStorage.getItem("quotes")); // Retrieve tasks from localStorage and parse JSON
};

// Function to update tasks in localStorage
const updateTasks = (taskHolder, task) => {
  const tasks = getTasks(); // Retrieve tasks from localStorage
  tasks.push(task); // Add new task to tasks array
  localStorage.setItem("quotes", JSON.stringify(tasks)); // Store updated tasks in localStorage
  renderTasks(taskHolder); // Render updated tasks on UI
};

// Variable to keep track of last order of tasks
let lastOrder = 0;

// Function to render tasks on UI
const renderTasks = (taskHolder) => {
  // Define array of background colors for tasks
  const backgroundColors = [
    "#e97e40",
    "#a5d1e7",
    "#f4dd65",
    "#86c753",
    "#6fa0b2",
    "#e6bfb9",
  ];

  taskHolder.innerHTML = ""; // Clear existing tasks from task holder element

  // Iterate over each task in localStorage
  getTasks().forEach((taskData, i) => {
    const task = appendElem(taskHolder, "div", ["task-block"]); // Create task element
    const quoteWrapper = appendElem(task, "div", ["task-name-wrapper"]); // Create wrapper for task name
    appendElem(quoteWrapper, "span", ["task-name"], taskData.name); // Add task name to wrapper
    const icon = appendElem(quoteWrapper, "img", ["task-img"]); // Create icon element for task
    let num = getRandomInt(6) + 1; // Generate random number for icon

    icon.src = "img/icons/icon" + num + ".png"; // Set icon source

    // Set background color for task based on index and backgroundColors array
    task.style.backgroundColor = backgroundColors[i % backgroundColors.length];
  });
};

// Function to initialize home page
const initHome = () => {
  const content = clearContent(); // Clear content
  appendElem(content, "p", ["slight-header"], "Dashboard"); // Add dashboard header
  appendElem(content, "p", [], formatDate()); // Add formatted date
  const hiBlock = appendElem(content, "div", ["hi-block"]); // Create hi block
  appendElem(
    hiBlock,
    "p",
    ["slight-header"],
    "Hi, " + localStorage.getItem("userName")
  ); // Add personalized greeting
  appendElem(
    hiBlock,
    "p",
    ["gray-text"],
    "Don't worry, you'll get through it!"
  ); // Add motivational message
  appendElem(
    hiBlock,
    "p",
    ["gray-text"],
    "We prepared you some tips on how to stay mentally healthy!"
  ); // Add additional message
  const umbrellaCat = appendElem(hiBlock, "img", ["umbrella-cat"]); // Add umbrella cat image
  umbrellaCat.src = "img/cat-umbrella.png"; // Set image source

  const taskHolder = createElem("div", ["task-holder"]); // Create task holder element
  renderTasks(taskHolder); // Render tasks
  content.appendChild(taskHolder); // Add task holder to content

  const taskAdder = appendElem(content, "div", ["task-adder"]); // Create task adder element
  const addTask = appendElem(taskAdder, "div", ["task-block", "task-add"]); // Create add task block
  appendElem(addTask, "p", ["task-prompt"], "Something inspirational?"); // Add prompt for adding task
  const taskNameInput = appendElem(addTask, "input", ["task-name-input"]); // Create input for task name
  const addTaskButton = appendElem(
    addTask,
    "div",
    ["action-button"],
    "Add new thought"
  ); // Create button for adding task
  // Add event listener for adding task
  addTaskButton.addEventListener("click", () => {
    let name = taskNameInput.value; // Get task name from input
    updateTasks(taskHolder, {
      name: name,
    }); // Update tasks with new task
  });
};

// Function to compare two numbers for equality
const cmp = (a, b) => {
  return Math.abs(a - b) < 1e-5;
};

// Function to initialize graph display
const initGraph = () => {
  const content = clearContent(); // Clear content
  appendElem(content, "p", ["slight-header"], "Graph of emotions"); // Add header for graph
  const graphHolder = appendElem(content, "div", ["graph-holder"]); // Create graph holder element

  // Retrieve diary entries from localStorage
  let diaryEntries = JSON.parse(localStorage.getItem("diary-entries"));
  console.log(diaryEntries); // Log diary entries to console

  // Define data for graph
  const graphData = {
    chart: {
      type: "area",
      colors: ["#e0b389"],
      toolbar: {
        show: false,
      },
    },
    theme: {
      palette: "palette3",
    },
    series: [],
    xaxis: {
      categories: [],
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          if (cmp(value, 3)) {
            return "good  ";
          }
          if (cmp(value, 2)) {
            return "neutral  ";
          }
          if (cmp(value, 1)) {
            return "bad  ";
          }
          return "";
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.9,
        stops: [0, 90, 100],
      },
    },
    stroke: {
      curve: "smooth",
    },
  };

  const seriesObj = {
    name: "mood",
    data: [],
  };

  const moodMap = {
    good: 3,
    neutral: 2,
    bad: 1,
  };

  // Sort diary entries by date
  let sortedDiaryEntries = diaryEntries.sort((a, b) => {
    let da = new Date(a.date);
    let db = new Date(b.date);
    return da.getTime() < db.getTime();
  });

  // Iterate over sorted diary entries
  sortedDiaryEntries.forEach((entry) => {
    seriesObj.data.push(moodMap[entry.mood]); // Add mood value to data array
    graphData.xaxis.categories.push(entry.date); // Add date to categories array
  });

  graphData.series.push(seriesObj); // Add series object to graph data

  const chart = new ApexCharts(graphHolder, graphData); // Create chart object
  chart.render(); // Render chart
};

// Function to initialize word cloud display
const initWordCloud = () => {
  let wordsData = localStorage.getItem("words"); // Retrieve word cloud data from localStorage
  const content = clearContent(); // Clear content
  appendElem(content, "p", ["slight-header"], "Word Cloud"); // Add header for word cloud

  // If word cloud data is available, display it
  if (!wordsData) {
    wordsData = "No data yet!"; // Set default message if no data available
  }
  const pleaseWait = appendElem(
    content,
    "p",
    ["gray-text"],
    "Generating your word cloud, please wait..."
  ); // Add message indicating word cloud generation

  const wordCloudWrapper = appendElem(content, "div", ["word-cloud-wrapper"]); // Create wrapper for word cloud
  const wordCloudImage = appendElem(
    wordCloudWrapper,
    "img",
    ["word-cloud-image"],
    ""
  ); // Create image element for word cloud

  // Call function to retrieve picture for word cloud
  getPicture(wordCloudWrapper, wordsData).then((result) => {
    wordCloudImage.src = result; // Set image source
    pleaseWait.innerHTML = ""; // Clear please wait message
  });
};

// Function to initialize article display
const initArticle = (article) => {
  showModalWindow(); // Show modal window
  const modalWindow = refresh(".modal-window"); // Refresh modal window
  modalWindow.classList.add("tall-modal"); // Add class for tall modal
  const crossWrapper = appendElem(modalWindow, "div", [
    "article-cross-wrapper",
  ]); // Create wrapper for close button
  const crossImg = appendElem(crossWrapper, "img", ["article-cross-img"]); // Create close button
  crossImg.src = "./img/cross.webp"; // Set close button image source
  crossImg.addEventListener("click", () => {
    modalWindow.classList.remove("tall-modal"); // Remove tall modal class
    hideModalWindow(); // Hide modal window
  });

  const articleWrapper = appendElem(modalWindow, "div", [
    "article-text-wrapper",
  ]); // Create wrapper for article content

  appendElem(articleWrapper, "p", ["big-header"], article.name); // Add article header
  // Iterate over content pieces in article
  article.content.forEach((piece) => {
    appendElem(articleWrapper, "p", ["slight-header"], piece.header); // Add piece header
    piece.text.split("\n").forEach((thispiece) => {
      appendElem(articleWrapper, "p", [], thispiece); // Add piece text
    });
  });
};

// Function to initialize test section
const initTest = () => {
  const content = clearContent(); // Clear content
  appendElem(content, "p", ["big-header"], "Mental diseases"); // Add header for mental diseases
  appendElem(
    content,
    "p",
    ["gray-text"],
    "If you notice some of the following symptoms,"
  ); // Add message about symptoms
  appendElem(
    content,
    "p",
    ["gray-text"],
    "you should probably go see a doctor."
  ); // Add message about seeing a doctor
  const articleWrapper = appendElem(content, "div", ["article-wrapper"]); // Create wrapper for articles
  const articles = getArticles(); // Retrieve articles
  // Iterate over articles
  articles.forEach((article) => {
    const articleBlock = appendElem(articleWrapper, "div", ["article"]); // Create block for article
    const apiw = appendElem(articleBlock, "div", [
      "article-preview-image-wrapper",
    ]); // Create wrapper for article preview image
    const api = appendElem(apiw, "img", ["article-preview-image"]); // Create article preview image
    api.src = "./img/articles/" + article.picname + ".jpg"; // Set image source
    appendElem(articleBlock, "p", ["article-header"], article.artname); // Add article header

    // Add event listener to view full article
    articleBlock.addEventListener("click", () => initArticle(article));
  });
};

// Function to initialize about section
const initAbout = () => {
  const content = clearContent(); // Clear content
  const articleContent = [
    "Not surprisingly, the coronavirus pandemic and resulting economic \
         downturn have taken a toll on the mental health of adults of all ages \
         in the U.S. In July, a majority of U.S. adults 18 and older (53%) said \
         that worry and stress related to coronavirus has had a negative impact on \
         their mental health.",
    "This is why we created Mental Health - a lightweight and efficient mood \
         tracker, advisor and general motivation keeper for you to get through the \
         pandemic.",
    "",
    "Contributors:",
    "Ania Tselikova",
    "Arlyn Miles",
    "Egor Tarasov",
  ]; // Define about section content

  appendElem(
    content,
    "p",
    ["slight-header"],
    "One in Four Older Adults Report Anxiety or Depression Amid the COVID-19 Pandemic"
  ); // Add header for about section
  // Iterate over article content
  articleContent.forEach((text) => {
    appendElem(content, "p", ["about-text"], text); // Add text to about section
  });
};

// Function to initialize navigation buttons
const initNavigation = () => {
  const buttons = ["home", "graph", "word-cloud", "test", "about"]; // Define navigation button labels
  const initers = [initHome, initGraph, initWordCloud, initTest, initAbout]; // Define corresponding initialization functions
  const buttonsContainer = select(".nav-buttons-container"); // Get reference to buttons container

  // Iterate over buttons
  buttons.forEach((button, i) => {
    let curButton = appendElem(buttonsContainer, "div", ["nav-button", button]); // Create navigation button
    let navIcon = appendElem(curButton, "img", ["nav-icon"]); // Create icon for button
    navIcon.src = "./img/nav-icons/" + button + ".png"; // Set icon source
    // Add event listener to button
    curButton.addEventListener("click", () => {
      const prev = select(".cur-section"); // Get reference to previously selected section
      if (prev) {
        prev.classList.remove("cur-section"); // Remove current section class
      }
      curButton.classList.add("cur-section"); // Add class to indicate current section
      initers[i](); // Initialize corresponding section
    });
  });
};

// Function to process note data
const processNoteData = (badGoodNeutral, noteText, dateString) => {
  updateWordCloud(noteText); // Update word cloud with note text
  updateDiaryEntry(badGoodNeutral, dateString); // Update diary entry with mood and date
};

// Function to initialize modal window
const initModalWindow = () => {
  const modalWindow = refresh(".modal-window"); // Refresh modal window
  appendElem(modalWindow, "p", ["slight-header"], "How was your day?"); // Add prompt for mood
  const emoticonsHolder = appendElem(modalWindow, "div", ["emoticons-holder"]); // Create holder for emoticons

  let selected = null; // Variable to store selected emoticon
  let selectedValue = null; // Variable to store value of selected emoticon
  // Iterate over emoticons
  ["bad", "neutral", "good"].forEach((name) => {
    const emoteWrapper = appendElem(emoticonsHolder, "div", ["emoticon"]); // Create wrapper for emoticon
    const emoteImage = appendElem(emoteWrapper, "img", [
      "emoticon-image",
      "emoticon-" + name,
    ]); // Create emoticon image
    emoteImage.src = "img/emotions/" + name + ".png"; // Set image source
    // Add event listener for selecting emoticon
    emoteWrapper.addEventListener("click", () => {
      if (selected == emoteWrapper) {
        emoteWrapper.classList.remove("selected-emoticon"); // Deselect emoticon
        selected = null; // Clear selected emoticon
      } else {
        if (selected) {
          selected.classList.remove("selected-emoticon"); // Deselect previously selected emoticon
        }
        emoteWrapper.classList.add("selected-emoticon"); // Select emoticon
        selected = emoteWrapper; // Set selected emoticon
        selectedValue = name; // Set selected emoticon value
      }
    });
  });

  appendElem(
    modalWindow,
    "p",
    ["slight-header", "on-your-mind"],
    "Write about your day"
  ); // Add prompt for writing about day
  appendElem(
    modalWindow,
    "p",
    ["gray-text"],
    "You can create word cloud out of these notes later."
  ); // Add message about word cloud
  const noteArea = appendElem(modalWindow, "textarea", ["note-area"]); // Create text area for note
  const calendar = appendElem(modalWindow, "input", ["datepicker"]); // Create input for date
  calendar.setAttribute("type", "date"); // Set input type to date

  const submitContainer = appendElem(modalWindow, "div", ["submit-container"]); // Create container for submit buttons
  appendElem(
    submitContainer,
    "p",
    ["gray-text"],
    "We'll take your note from there!"
  ); // Add message about note submission
  const discard = appendElem(
    submitContainer,
    "div",
    ["action-button"],
    "Discard"
  ); // Create discard button
  const submitNote = appendElem(
    submitContainer,
    "div",
    ["action-button"],
    "Save"
  ); // Create save button

  // Add event listener for discard button
  discard.addEventListener("click", () => {
    hideModalWindow(); // Hide modal window
  });

  // Add event listener for save button
  submitNote.addEventListener("click", () => {
    let good = true; // Flag to check if data is valid
    if (calendar.value == "") {
      pulseRed(calendar); // Highlight calendar if empty
      good = false; // Set flag to false
    }

    if (selected == null) {
      pulseRed(emoticonsHolder); // Highlight emoticons if none selected
      good = false; // Set flag to false
    }

    if (good) {
      processNoteData(selectedValue, noteArea.value, calendar.value); // Process note data
      hideModalWindow(); // Hide modal window
    }
  });
};

// Function to initialize user profile
const initProfile = (username) => {
  let userGender = localStorage.getItem("userGender"); // Retrieve user gender from localStorage
  if (!userGender) {
    userGender = "octo_shifted"; // Set default user gender if not available
  }

  const profile = select(".profile"); // Get reference to profile element
  profile.innerHTML = ""; // Clear profile content

  appendElem(profile, "p", ["profile__title"], "My profile"); // Add profile title
  const pictureWrapper = createElem("div", ["profile__avatar-wrapper"]); // Create wrapper for profile picture
  const picture = createElem("img", ["profile__avatar-picture"]); // Create profile picture
  picture.setAttribute("src", "img/" + userGender + ".png"); // Set profile picture source
  pictureWrapper.appendChild(picture); // Add profile picture to wrapper
  profile.appendChild(pictureWrapper); // Add profile picture wrapper to profile
  appendElem(profile, "p", ["profile__username"], username); // Add username to profile

  // If user is logged in, add option to add mood
  if (username !== "Who are you?") {
    const addMoodForm = appendElem(profile, "div", ["profile__add-mood"]); // Create form for adding mood
    appendElem(addMoodForm, "p", ["slight-header"], "Add note"); // Add header for form
    const addMoodImage = appendElem(addMoodForm, "img", [
      "profile__add-mood-image",
    ]); // Add image for adding mood
    addMoodImage.setAttribute("src", "img/calendar.png"); // Set image source

    // Add event listener for adding mood
    addMoodForm.addEventListener("click", () => {
      showModalWindow(); // Show modal window
      initModalWindow(); // Initialize modal window
    });
  }
};

// Function to initialize the app
const init = () => {
  const userName = localStorage.getItem("userName"); // Retrieve username from localStorage
  initProfile(userName); // Initialize profile
  initNavigation(); // Initialize navigation buttons
  initHome(); // Initialize home section
};

// Function to refresh element with specified selector
const refresh = (selector) => {
  const elem = select(selector); // Get reference to element with specified selector
  elem.innerHTML = ""; // Clear element content
  return elem; // Return cleared element
};

// Function to select element with specified selector
const select = (selector) => {
  return document.querySelector(selector); // Return reference to selected element
};

// Function to create element with specified tag and classes
const createElem = (tag, classes) => {
  const elem = document.createElement(tag); // Create element with specified tag
  if (Array.isArray(classes)) {
    elem.classList.add(...classes); // Add specified classes to element
  } else {
    elem.classList.add(classes); // Add single specified class to element
  }
  return elem; // Return created element
};

// Function to append element to parent with specified classes
const appendElem = (parent, tag, classes, textContent) => {
  const elem = createElem(tag, classes); // Create element with specified tag and classes
  if (textContent) {
    elem.textContent = textContent; // Set text content of element
  }
  parent.appendChild(elem); // Append element to parent
  return elem; // Return appended element
};

// Function to generate random integer between 0 and max (exclusive)
const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

// Function to format date
const formatDate = () => {
  const date = new Date(); // Get current date
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }; // Define date options
  return date.toLocaleDateString("en-US", options); // Return formatted date
};

// Function to pulse element with red color
const pulseRed = (elem) => {
  elem.classList.add("red-pulse"); // Add class for red pulse animation
  setTimeout(() => {
    elem.classList.remove("red-pulse"); // Remove class for red pulse animation after timeout
  }, 1000);
};

// Function to retrieve articles
const getArticles = () => {
  return [
    {
      artname: "Depression",
      picname: "depression",
      content: [
        {
          header: "What is depression?",
          text: "Depression is a common mental health disorder characterized by persistent feelings of sadness, hopelessness, and disinterest in activities.",
        },
        {
          header: "Causes of depression",
          text: "Depression can be caused by a combination of genetic, biological, environmental, and psychological factors.",
        },
        {
          header: "Symptoms of depression",
          text: "Symptoms of depression include persistent sadness, loss of interest in activities, changes in appetite or weight, sleep disturbances, fatigue, feelings of worthlessness or guilt, difficulty concentrating, and thoughts of death or suicide.",
        },
      ],
    },
    {
      artname: "Anxiety",
      picname: "anxiety",
      content: [
        {
          header: "What is anxiety?",
          text: "Anxiety is a normal human emotion characterized by feelings of worry, nervousness, or fear about future events or situations.",
        },
        {
          header: "Causes of anxiety",
          text: "Anxiety can be caused by a variety of factors, including genetics, brain chemistry, personality, and life events.",
        },
        {
          header: "Symptoms of anxiety",
          text: "Symptoms of anxiety include excessive worry, restlessness, fatigue, difficulty concentrating, irritability, muscle tension, and sleep disturbances.",
        },
      ],
    },
    {
      artname: "Stress",
      picname: "stress",
      content: [
        {
          header: "What is stress?",
          text: "Stress is the body's response to demands or pressures from the environment. It can be triggered by both positive and negative events.",
        },
        {
          header: "Causes of stress",
          text: "Common causes of stress include work or school pressures, financial difficulties, relationship problems, major life changes, and traumatic events.",
        },
        {
          header: "Effects of stress",
          text: "Chronic stress can have negative effects on both physical and mental health, including increased risk of heart disease, obesity, diabetes, depression, and anxiety.",
        },
      ],
    },
  ];
};

// Function to show modal window
const showModalWindow = () => {
  const modal = select(".modal-window"); // Get reference to modal window
  modal.style.display = "block"; // Set display style to block to show modal window
};

// Function to hide modal window
const hideModalWindow = () => {
  const modal = select(".modal-window"); // Get reference to modal window
  modal.style.display = "none"; // Set display style to none to hide modal window
};

// Function to retrieve picture for word cloud
const getPicture = async (wrapper, words) => {
  const url = "https://api.wordcloudy.net/wordcloud"; // Define API endpoint URL
  const data = { text: words, width: 500, height: 500 }; // Define data to send to API
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }); // Send POST request to API
  const result = await response.json(); // Parse response as JSON
  return result.picture; // Return picture URL from response
};

// Function to update word cloud with note text
const updateWordCloud = (note) => {
  let words = localStorage.getItem("words"); // Retrieve word cloud data from localStorage
  if (!words) {
    words = ""; // Set empty string as default value if no data available
  }
  words += " " + note; // Append note to word cloud data
  localStorage.setItem("words", words); // Store updated word cloud data in localStorage
};

// Function to update diary entry with mood and date
const updateDiaryEntry = (mood, date) => {
  let diaryEntries = JSON.parse(localStorage.getItem("diary-entries")); // Retrieve diary entries from localStorage
  if (!diaryEntries) {
    diaryEntries = []; // Set empty array as default value if no data available
  }
  diaryEntries.push({ mood: mood, date: date }); // Add new entry to diary entries
  localStorage.setItem("diary-entries", JSON.stringify(diaryEntries)); // Store updated diary entries in localStorage
};

// Function to initialize the app when the DOM content is loaded
document.addEventListener("DOMContentLoaded", init);
