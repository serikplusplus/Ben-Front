$(document).ready(function () {
	const _slideUp = (target, duration = 500, showmore = 0) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide')
			target.style.transitionProperty = 'height, margin, padding'
			target.style.transitionDuration = `${duration}ms`
			target.style.height = `${target.offsetHeight}px`
			target.offsetHeight
			target.style.overflow = 'hidden'
			target.style.height = showmore ? `${showmore}px` : '0px'
			target.style.paddingTop = 0
			target.style.paddingBottom = 0
			target.style.marginTop = 0
			target.style.marginBottom = 0
			window.setTimeout(() => {
				target.hidden = !showmore
				!showmore ? target.style.removeProperty('height') : null
				target.style.removeProperty('padding-top')
				target.style.removeProperty('padding-bottom')
				target.style.removeProperty('margin-top')
				target.style.removeProperty('margin-bottom')
				!showmore ? target.style.removeProperty('overflow') : null
				target.style.removeProperty('transition-duration')
				target.style.removeProperty('transition-property')
				target.classList.remove('_slide')
				// Создаем событие
				document.dispatchEvent(
					new CustomEvent('slideUpDone', {
						detail: {
							target,
						},
					})
				)
			}, duration)
		}
	}

	const _slideDown = (target, duration = 500, showmore = 0) => {
		if (!target.classList.contains('_slide')) {
			target.classList.add('_slide')
			target.hidden = target.hidden ? false : null
			showmore ? target.style.removeProperty('height') : null
			const height = target.offsetHeight
			target.style.overflow = 'hidden'
			target.style.height = showmore ? `${showmore}px` : '0px'
			target.style.paddingTop = 0
			target.style.paddingBottom = 0
			target.style.marginTop = 0
			target.style.marginBottom = 0
			target.offsetHeight
			target.style.transitionProperty = 'height, margin, padding'
			target.style.transitionDuration = `${duration}ms`
			target.style.height = `${height}px`
			target.style.removeProperty('padding-top')
			target.style.removeProperty('padding-bottom')
			target.style.removeProperty('margin-top')
			target.style.removeProperty('margin-bottom')
			window.setTimeout(() => {
				target.style.removeProperty('height')
				target.style.removeProperty('overflow')
				target.style.removeProperty('transition-duration')
				target.style.removeProperty('transition-property')
				target.classList.remove('_slide')
				// Создаем событие
				document.dispatchEvent(
					new CustomEvent('slideDownDone', {
						detail: {
							target,
						},
					})
				)
			}, duration)
		}
	}

	const _slideToggle = (target, duration = 500) => {
		if (target.hidden) {
			return _slideDown(target, duration)
		}
		return _slideUp(target, duration)
	}

	const spollersArray = document.querySelectorAll('[data-spollers]')
	if (spollersArray.length > 0) {
		// Получение обычных слойлеров
		const spollersRegular = Array.from(spollersArray).filter(
			(item, index, self) => !item.dataset.spollers.split(',')[0]
		)
		// Инициализация обычных слойлеров
		if (spollersRegular.length) {
			initSpollers(spollersRegular)
		}
		// Получение слойлеров с медиа запросами
		const mdQueriesArray = dataMediaQueries(spollersArray, 'spollers')
		if (mdQueriesArray && mdQueriesArray.length) {
			mdQueriesArray.forEach(mdQueriesItem => {
				// Событие
				mdQueriesItem.matchMedia.addEventListener('change', () => {
					initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia)
				})
				initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia)
			})
		}
		// Инициализация
		function initSpollers(spollersArray, matchMedia = false) {
			spollersArray.forEach(spollersBlock => {
				spollersBlock = matchMedia ? spollersBlock.item : spollersBlock
				if (matchMedia.matches || !matchMedia) {
					spollersBlock.classList.add('_spoller-init')
					initSpollerBody(spollersBlock)
					spollersBlock.addEventListener('click', setSpollerAction)
				} else {
					spollersBlock.classList.remove('_spoller-init')
					initSpollerBody(spollersBlock, false)
					spollersBlock.removeEventListener('click', setSpollerAction)
				}
			})
		}
		// Работа с контентом
		function initSpollerBody(spollersBlock, hideSpollerBody = true) {
			let spollerTitles = spollersBlock.querySelectorAll('[data-spoller]')
			if (spollerTitles.length) {
				spollerTitles = Array.from(spollerTitles).filter(
					item => item.closest('[data-spollers]') === spollersBlock
				)
				spollerTitles.forEach(spollerTitle => {
					if (hideSpollerBody) {
						spollerTitle.removeAttribute('tabindex')
						if (!spollerTitle.classList.contains('_spoller-active')) {
							spollerTitle.nextElementSibling.hidden = true
						}
					} else {
						spollerTitle.setAttribute('tabindex', '-1')
						spollerTitle.nextElementSibling.hidden = false
					}
				})
			}
		}
		function setSpollerAction(e) {
			const el = e.target
			if (el.closest('[data-spoller]')) {
				const spollerTitle = el.closest('[data-spoller]')
				const spollersBlock = spollerTitle.closest('[data-spollers]')
				const oneSpoller = spollersBlock.hasAttribute('data-one-spoller')
				const spollerSpeed = spollersBlock.dataset.spollersSpeed
					? parseInt(spollersBlock.dataset.spollersSpeed)
					: 500
				if (!spollersBlock.querySelectorAll('._slide').length) {
					if (
						oneSpoller &&
						!spollerTitle.classList.contains('_spoller-active')
					) {
						hideSpollersBody(spollersBlock)
					}
					spollerTitle.classList.toggle('_spoller-active')
					_slideToggle(spollerTitle.nextElementSibling, spollerSpeed)
				}
				e.preventDefault()
			}
		}
		function hideSpollersBody(spollersBlock) {
			const spollerActiveTitle = spollersBlock.querySelector(
				'[data-spoller]._spoller-active'
			)
			const spollerSpeed = spollersBlock.dataset.spollersSpeed
				? parseInt(spollersBlock.dataset.spollersSpeed)
				: 500
			if (
				spollerActiveTitle &&
				!spollersBlock.querySelectorAll('._slide').length
			) {
				spollerActiveTitle.classList.remove('_spoller-active')
				_slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed)
			}
		}
		// Закрытие при клике вне спойлера
		const spollersClose = document.querySelectorAll('[data-spoller-close]')
		if (spollersClose.length) {
			document.addEventListener('click', e => {
				const el = e.target
				if (!el.closest('[data-spollers]')) {
					spollersClose.forEach(spollerClose => {
						const spollersBlock = spollerClose.closest('[data-spollers]')
						const spollerSpeed = spollersBlock.dataset.spollersSpeed
							? parseInt(spollersBlock.dataset.spollersSpeed)
							: 500
						spollerClose.classList.remove('_spoller-active')
						_slideUp(spollerClose.nextElementSibling, spollerSpeed)
					})
				}
			})
		}
	}

	function dataMediaQueries(array, dataSetValue) {
		// Получение объектов с медиа запросами
		const media = Array.from(array).filter((item, index, self) => {
			if (item.dataset[dataSetValue]) {
				return item.dataset[dataSetValue].split(',')[0]
			}
		})
		// Инициализация объектов с медиа запросами
		if (media.length) {
			const breakpointsArray = []
			media.forEach(item => {
				const params = item.dataset[dataSetValue]
				const breakpoint = {}
				const paramsArray = params.split(',')
				breakpoint.value = paramsArray[0]
				breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max'
				breakpoint.item = item
				breakpointsArray.push(breakpoint)
			})
			// Получаем уникальные брейкпоинты
			let mdQueries = breakpointsArray.map(
				item =>
					`(${item.type}-width: ${item.value}px),${item.value},${item.type}`
			)
			mdQueries = uniqArray(mdQueries)
			const mdQueriesArray = []

			if (mdQueries.length) {
				// Работаем с каждым брейкпоинтом
				mdQueries.forEach(breakpoint => {
					const paramsArray = breakpoint.split(',')
					const mediaBreakpoint = paramsArray[1]
					const mediaType = paramsArray[2]
					const matchMedia = window.matchMedia(paramsArray[0])
					// Объекты с нужными условиями
					const itemsArray = breakpointsArray.filter(item => {
						if (item.value === mediaBreakpoint && item.type === mediaType) {
							return true
						}
					})
					mdQueriesArray.push({
						itemsArray,
						matchMedia,
					})
				})
				return mdQueriesArray
			}
		}
	}
})
$(document).ready(function () {
	if ($('.follow__slider-wrapper')) {
		$('.follow__slider-wrapper').slick({
			infinite: true,
			slidesToShow: 3,
			slidesToScroll: 1,
			arrows: true,
			prevArrow: $('.prev-arrow'),
			nextArrow: $('.next-arrow'),
			responsive: [
				{
					breakpoint: 768,
					settings: {
						arrows: false,
						slidesToShow: 2,
					},
				},
			],
		})
	}
})
$(document).ready(function () {
	const burger = document.querySelector('.burger')
	const nav = document.querySelector('.main-nav')
	const btnclose = document.querySelector('.close-nav')

	burger.addEventListener('click', () => {
		nav.classList.add('open')
	})
	btnclose.addEventListener('click', () => {
		nav.classList.remove('open')
	})
})
$(document).ready(function () {
	if (document.querySelector('.promo__num')) {
		const num = document.querySelector('.promo__num')
		const price = document.querySelector('.promo__price span')
		const minus = document.querySelector('.promo__controls-btn.btn-minus')
		const plus = document.querySelector('.promo__controls-btn.btn-plus')

		let numS = +num.textContent
		let priceS = +price.textContent
		let priceN = priceS

		minus.addEventListener('click', () => {
			if (numS >= 2) {
				numS--
				priceN -= priceS

				num.textContent = numS
				price.textContent = priceN.toFixed(2)
			}
		})

		plus.addEventListener('click', () => {
			numS++
			priceN += priceS

			num.textContent = numS
			price.textContent = priceN.toFixed(2)
		})
	}
})

$(document).ready(function () {
	const ibg = document.querySelectorAll('.ibg')
	for (let i = 0; i < ibg.length; i++) {
		if (ibg[i].querySelector('img')) {
			ibg[i].style.backgroundImage = `url(${ibg[i]
				.querySelector('img')
				.getAttribute('src')})`
		}
	}
})
