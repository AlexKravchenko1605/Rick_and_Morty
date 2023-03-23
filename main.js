const init = function () {
  const out = document.querySelector("#root");
  const arrowUp = document.querySelector(".to_top");
  const loader = document.querySelector(".container_loader");
  const changeView = document.querySelector("input");

  let page = 1;

  window.addEventListener("load", () => loadCharacters(page));

  const loadCharacters = async function (page) {
    try {
      let response = await fetch(
        `https://rickandmortyapi.com/api/character/?page=${page}`
      );
      let data = await response.json();

      loader.classList.add("none");
      buildCharatersList(data.results);
    } catch (error) {
      alert(error);
    }
  };

  const buildCharatersList = function (data) {
    let charctersList = data;

    if (changeView.checked) {
      if (localStorage.getItem("characterPage") === null) {
        localStorage.setItem("characterPage", JSON.stringify(charctersList));
      } else {
        localStorage.setItem("characterPage", JSON.stringify(data));
      }

      let cards = document.querySelectorAll(".card");

      cards.forEach((el) => {
        el.remove();
      });
      charctersList.map((el) => {
        let div = document.createElement("div");
        div.className = "card";
        let img = document.createElement("img");
        img.setAttribute("src", `${el.image}`);
        div.appendChild(img);
        let name = document.createElement("p");
        name.textContent = el.name;
        div.append(name);

        out.appendChild(div);
      });
    } else {
      if (localStorage.getItem("characters") === null) {
        localStorage.setItem("characters", JSON.stringify(charctersList));
      } else {
        let temporaryArrayCharaters = [
          JSON.parse(localStorage.getItem("characters")),
        ];
        let newArray = temporaryArrayCharaters[0].concat(data);
        localStorage.setItem("characters", JSON.stringify(newArray));
      }

      charctersList.map((el) => {
        let div = document.createElement("div");
        div.className = "card";
        let img = document.createElement("img");
        img.setAttribute("src", `${el.image}`);
        div.appendChild(img);
        let name = document.createElement("p");
        name.textContent = el.name;
        div.append(name);

        out.appendChild(div);
      });
    }
  };
  //  add listner which show inform about character
  out.addEventListener("click", (event) => {
    let targetDiv = event.target.closest("div.card");

    if (targetDiv == null) return;
    if (changeView.checked) {
      showInform(JSON.parse(localStorage.getItem("characterPage")), targetDiv);
    } else {
      showInform(JSON.parse(localStorage.getItem("characters")), targetDiv);
    }
  });
  // looking for our character among all the characters
  const showInform = function (data, targetDiv) {
    const targetPersonName = targetDiv.innerText;

    const targetPersonFullInform = data.filter((el) => {
      return el.name === targetPersonName;
    });

    createModalWindow(targetPersonFullInform);
  };

  // create modal window
  const createModalWindow = function (person) {
    let div = document.createElement("div");
    div.className = "modalWindow";
    let img = document.createElement("img");
    img.setAttribute("src", person[0].image);
    img.setAttribute("alt", person[0].name);

    let wrapper = document.createElement("div");
    wrapper.className = "wrapper_info";

    let i = document.createElement("i");
    i.className = "fa fa-plus";

    let mainInfo = document.createElement("div");
    mainInfo.className = "main__info";
    let secondInfo = document.createElement("div");
    secondInfo.className = "second__info";
    let name = document.createElement("p");
    name.innerHTML = `<b>Name :</b></br>${person[0].name}`;
    let status = document.createElement("p");
    status.innerHTML = `<b>Status :</b></br>${person[0].status}`;
    let species = document.createElement("p");
    species.innerHTML = `<b>Species :</b></br>${person[0].species}`;
    mainInfo.append(name);
    mainInfo.append(status);
    mainInfo.append(species);

    let origin = document.createElement("p");
    origin.innerHTML = `<b>Origin :</b></br>${person[0].origin.name}`;
    let location = document.createElement("p");
    location.innerHTML = `<b>Location :</b></br>${person[0].location.name}`;
    let gender = document.createElement("p");
    gender.innerHTML = `<b>Gender :</b></br>${person[0].gender}`;
    let overlay = document.createElement("div");
    overlay.className = "modal_overlay";

    secondInfo.append(origin);
    secondInfo.append(location);
    secondInfo.append(gender);

    wrapper.append(mainInfo);
    wrapper.append(secondInfo);
    div.append(img);
    div.append(wrapper);
    div.append(i);

    out.after(div);
    out.after(overlay);

    i.addEventListener("click", () => {
      div.remove();
      overlay.remove();
    });

    document.addEventListener("keydown", (event) => {
      event.preventDefault();
      if (event.code === "Escape") {
        div.remove();
        overlay.remove();
      }
    });
  };
  const scrollingPageAndLoadContent = function () {
    const documentRect = document.documentElement.getBoundingClientRect();

    if (documentRect.bottom < document.documentElement.clientHeight + 150) {
      page++;
      loadCharacters(page);
      arrowUp.classList.add("active");
    }

    if (documentRect.top > -150) {
      arrowUp.classList.remove("active");
    }
  };
  changeView.addEventListener("click", () => {
    if (changeView.checked) {
      window.removeEventListener("scroll", scrollingPageAndLoadContent);
      loadCharacters(page);
      // create nav element under container
      let wrapperNaw = document.createElement("div");
      wrapperNaw.classList.add("wrapper_nav");
      wrapperNaw.classList.add("none");

      let buttonBack = document.createElement("button");
      buttonBack.classList.add("material-symbols-outlined");
      buttonBack.classList.add("back");
      buttonBack.innerText = "arrow_forward_ios";

      let spanOut = document.createElement("span");
      spanOut.innerHTML = page;
      let buttonForward = document.createElement("button");
      buttonForward.classList.add("material-symbols-outlined");
      buttonForward.classList.add("forward");
      buttonForward.innerText = "arrow_forward_ios";

      wrapperNaw.append(buttonBack);
      wrapperNaw.append(spanOut);
      wrapperNaw.append(buttonForward);
      out.after(wrapperNaw);

      document.querySelector(".wrapper_nav").classList.remove("none");

      let back = document.querySelector(".back");
      let forward = document.querySelector(".forward");

      back.addEventListener("click", () => {
        page--;
        if (page === 1) {
          buttonBack.setAttribute("disabled", "disabled");
        }
        loadCharacters(page);
        spanOut.innerHTML = page;
      });
      forward.addEventListener("click", () => {
        page++;
        if (page >= 2) {
          buttonBack.removeAttribute("disabled", "disabled");
        }
        loadCharacters(page);

        spanOut.innerHTML = page;
      });
    } else {
      document.querySelector(".wrapper_nav").classList.add("none");
      document.querySelector(".wrapper_nav").remove();
      window.addEventListener("scroll", scrollingPageAndLoadContent);
    }
  });

  // added a function that loads characters as the page scrolls down
  window.addEventListener("scroll", scrollingPageAndLoadContent);

  // scroll up
  const moveUp = function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  arrowUp.addEventListener("click", moveUp);
};

init();
