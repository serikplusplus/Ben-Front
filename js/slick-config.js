// slick config
$('selector').slick({
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  arrows: true,
  dots: true,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 2
      }
    }
  ]
});