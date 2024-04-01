class GetMovies {
	API_URL_MOVIE_DETAILS = "https://kinopoiskapiunofficial.tech/api/v2.2/films/"
	API_KEY = "8c8e1a50-6322-4135-8875-5d40a5420d86";
	apiUri = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS'
	container
	modalContainer
	sliderContainer

	constructor(container, modalContainer, sliderContainer) {
		this.container = container
		this.modalContainer = modalContainer
		this.sliderContainer = sliderContainer
	}

	async fetchMovies() {
		try {
			const films = await fetch(this.apiUri, {
				headers: {
					"Content-Type": "application/json",
					"X-API-KEY": this.API_KEY,
				},
			})
			if (films.ok) {
				const body = await films.json()
				console.log(body)
				// 
				this.toHtml(body.films)
				this.renderSlider(body.films)
			}
		} catch (error) {
			console.log(error)
		}
	}

	toHtml(films = []) {
		films.forEach((film, i) => {
			const movieEl = document.createElement("div");
			movieEl.classList.add('movieEl')
			movieEl.innerHTML = this.html(film)
			movieEl.addEventListener('click', () => this.modal(film.filmId))
			this.container.appendChild(movieEl)
		})
	}

	/**
	 * Шаблон для фильомв
	 */
	html(movie) {
		const html = `
          <div class="movie-poster">
            <img
              src="${movie.posterUrl || movie.posterUrlPreview}"
              alt="${movie.nameRu || movie.nameOriginal || movie.nameEn}" />
          </div>
          <div class="movie-content">
            <div class="movie-info">
              <h2 class="movie-title">${movie.nameRu || movie.nameOriginal || movie.nameEn}</h2>
                <div class="item">
                  <span>Год производства: ${movie.year}</span>
                </div>
              </div>
            </div>
          </div>
       `
		return html
	}

	/**
	 * Показывает модальное окно с одним фильмо по его ID
	 */
	async modal(id) {
		const resp = await fetch(this.API_URL_MOVIE_DETAILS + id, {
			headers: {
				"Content-Type": "application/json",
				"X-API-KEY": this.API_KEY,
			},
		});
		const respData = await resp.json();

		this.modalContainer.classList.add("modal--show");
		document.body.classList.add("stop-scrolling");

		this.modalContainer.innerHTML = `
			<div class="modal__card">
				<img class="modal__movie-backdrop" src="${respData.posterUrl}" alt="">
				<h2>
					<span class="modal__movie-title">${respData.nameRu}</span>
					<span class="modal__movie-release-year"> - ${respData.year}</span>
				</h2>
				<ul class="modal__movie-info">
					<div class="loader"></div>
					<li class="modal__movie-genre">Жанр - ${respData.genres.map((el) => `<span>${el.genre}</span>`)}</li>
					${respData.filmLength ? `<li class="modal__movie-runtime">Время - ${respData.filmLength} минут</li>` : ''}
					<li >Сайт: <a class="modal__movie-site" href="${respData.webUrl}">${respData.webUrl}</a></li>
					<li class="modal__movie-overview">Описание - ${respData.description}</li>
				</ul>
				<button type="button" class="modal__button-close">Закрыть</button>
			</div>
		`
		const btnClose = document.querySelector(".modal__button-close");
		btnClose.addEventListener("click", () => this.closeModal());
		this.clickOutsideCloseModal()
	}

	/**
	 * Закрывает модальное окно при нажатии на кнопку закрыть
	 */
	closeModal() {
		this.modalContainer.classList.remove("modal--show");
		document.body.classList.remove("stop-scrolling");
	}


	/**
	 * Закрывает модальное окно при клике по любой области страницы
	 */
	clickOutsideCloseModal() {

		window.addEventListener("click", (e) => {
			if (e.target === this.modalContainer) {
				this.closeModal();
			}
		})

		window.addEventListener("keydown", (e) => {
			if (e.keyCode === 27) {
				this.closeModal();
			}
		})
	}

	renderSlider(movies) {
		movies.forEach((film, i) => {
			// movieEl.innerHTML = this.html(film)
			// movieEl.addEventListener('click', () => this.modal(film.filmId))
			this.sliderContainer.innerHTML += this.sliderHtml(film)
		})
	}

	sliderHtml(movie) {
		const html = `
			<div class="swiper-slide">
				<div class="slide">
					<div class="poster">
						<img src="${movie.posterUrl || movie.posterUrlPreview}" 
							alt="${movie.nameRu || movie.nameOriginal || movie.nameEn}"/>
					</div>
					<div class="content">
						<h4>${movie.nameRu || movie.nameOriginal || movie.nameEn}</h4>
					</div>
				</div>
			</div>
		`
		return html
	}
}

