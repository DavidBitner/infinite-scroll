const postsContainer = document.querySelector(`.posts`);
const loaderContainer = document.querySelector(`.loader`);
const searchInput = document.querySelector(`#search`);

let page = 1;

async function getPosts() {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=5&_page=${page}`
  );
  return response.json();
}

function generatePostsHtml(posts) {
  return posts
    .map(
      ({ id, title, body }) =>
        `
        <div class="post">
          <div class="post__id">${id}</div>
          <h2 class="post__title">${title}</h2>
          <p class="post__text">${body}</p>
        </div>
        `
    )
    .join("");
}

async function updatePosts() {
  const posts = await getPosts();
  const postsHtml = generatePostsHtml(posts);
  postsContainer.innerHTML += postsHtml;
}

function getNextPosts() {
  setTimeout(() => {
    page++;
    updatePosts();
  }, 300);
}

function removeLoader() {
  setTimeout(() => {
    loaderContainer.classList.remove("show");
    getNextPosts();
  }, 1000);
}

function showLoader() {
  loaderContainer.classList.add("show");
  removeLoader();
}

function handleInputValue(event) {
  const inputValue = event.target.value.toLowerCase();
  const posts = document.querySelectorAll(".post");

  posts.forEach((post) => {
    const postTitle = post
      .querySelector(".post__title")
      .textContent.toLowerCase();
    const postText = post
      .querySelector(".post__text")
      .textContent.toLowerCase();

    const postContainsInputValue =
      postTitle.includes(inputValue) || postText.includes(inputValue);

    if (postContainsInputValue) {
      post.style.display = "grid";
      return;
    }

    post.style.display = "none";
  });
}

function handleScroll() {
  const { clientHeight, scrollHeight, scrollTop } = document.documentElement;
  const isPageBottomReached = scrollTop + clientHeight >= scrollHeight - 10;

  if (isPageBottomReached) {
    showLoader();
  }
}

window.addEventListener("load", updatePosts);
window.addEventListener("scroll", handleScroll);
searchInput.addEventListener("input", handleInputValue);
