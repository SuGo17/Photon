const gallery = document.querySelector(".gallery");
const loadEle = document.querySelector(".load");
const form = document.querySelector("form");
const nextBtn = document.querySelector("#next-btn");
const prevBtn = document.querySelector("#prev-btn");
const inpEle = document.querySelector("#search-text");
const searchTitle = document.querySelector(".title");
const logo = document.querySelector(".logo");
const noResult = document.querySelector(".no-result");
const searchQuery = document.querySelector(".title span");
const pageNo = document.querySelector(".page-no span");

class App {
  page = 1;
  #apiKey = "22412108-d5b5c1ad1952ffb80f821c681";
  #keyword = "nature";
  constructor() {
    this.display();
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this._onSubmit();
    });
    nextBtn.addEventListener("click", () => {
      this.page += 1;
      this.display();
      logo.scrollIntoView({ behavior: "smooth" });
      pageNo.innerHTML = this.page;
    });
    prevBtn.addEventListener("click", () => {
      if (this.page - 1 <= 0) return;
      this.page -= 1;
      this.display();
      logo.scrollIntoView({ behavior: "smooth" });
      pageNo.innerHTML = this.page;
    });
  }
  async _fetchData() {
    //prettier-ignore
    const dataFetch = await fetch(`https://pixabay.com/api/?key=${this.#apiKey}&q=${this.#keyword}&image_type=photo&page=${"" + this.page}&per_page=30`
    );
    const data = await dataFetch.json();
    return data;
  }
  async display() {
    loadEle.style.display = "flex";
    gallery.innerHTML = "";
    const data = await this._fetchData();
    const { hits: images, id } = data;
    if (images.length === 0) {
      noResult.style.display = "flex";
      noResult.innerHTML = `No Search Result For: <span>${
        this.#keyword
      }</span>`;
      setTimeout(() => {
        loadEle.style.display = "none";
      }, 1000);
      return;
    }
    setTimeout(() => {
      loadEle.style.display = "none";
    }, 1000);
    images.forEach((ele, i) => {
      this._addImgToGallery(ele, id);
    });
    noResult.style.display = "none";
  }
  //adding image to gallery element
  _addImgToGallery(arr, query) {
    //prettier-ignore
    let {
      webformatURL: sourceUrl,
      largeImageURL: downloadUrl,
      imageWidth: width,
      imageHeight: height,
    } = arr;
    const htmlContent = `
      <div class="img-box">
        <div class="img-data">
          <p>${width} x ${height}</p>
          <a href = '${downloadUrl}' target="blank" download> Download </a>
        </div>
        <img src=${sourceUrl} alt= #${query}>
      </div>`;
    gallery.insertAdjacentHTML("beforeend", htmlContent);
  }
  _onSubmit() {
    if (!inpEle.value) return;
    this.#keyword = inpEle.value;
    this.page = 1;
    inpEle.value = "";
    inpEle.blur();
    this.display();
    searchTitle.innerHTML = `Seacrh Results for:- <span>${
      this.#keyword
    }</span>`;
    pageNo.innerHTML = this.page;
  }
}

const app = new App();
