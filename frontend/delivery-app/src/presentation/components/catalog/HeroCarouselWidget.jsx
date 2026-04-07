import { Carousel } from 'react-bootstrap'

export default function HeroCarouselWidget({ images = [] }) {
  if (!images.length) {
    return (
      <div className="hero-carousel__empty">
        No promotional banners are available right now.
      </div>
    )
  }

  const shouldLoop = images.length > 1

  return (
    <Carousel
      indicators={shouldLoop}
      controls={shouldLoop}
      interval={5000}
      className="hero-carousel"
    >
      {images.map((image, index) => (
        <Carousel.Item key={`${image.desktopUrl}-${index}`}>
          <a className="hero-carousel__link" href={image.link || '#'} aria-label="Open banner link">
            <div className="hero-carousel__frame">
              <picture>
                <source media="(max-width: 768px)" srcSet={image.mobileUrl || image.desktopUrl} />
                <img
                  className="hero-carousel__image"
                  src={image.desktopUrl}
                  alt={`Promotional banner ${index + 1}`}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.classList.add('is-hidden')
                  }}
                />
              </picture>
              <div className="hero-carousel__fallback">Banner unavailable</div>
            </div>
          </a>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}
