import Masonry from 'react-masonry-css'
import '../styles/product.css'

const breakpointColumnsObj = {
  default: 4,
  1100: 3,
  700: 2,
  500: 1
};

const images = [
  { id: 1, url: '/img1.jpg' },
  { id: 2, url: '/img3.jpg' },
  { id: 3, url: '/img4.jpg' },
  { id: 4, url: '/img1.jpg' },
  { id: 5, url: '/img5.png' },
  { id: 6, url: '/img6.png' },
  { id: 6, url: '/vite.svg' },
  // ...
];

function MasonryTest() {
  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="masonry-grid"
      columnClassName="masonry-grid_column"
    >
      {images.map(img => (
        <div key={img.id} className="rounded overflow-hidden bg-main-2">
          <img src={img.url} alt="" className="w-full object-cover" />
        </div>
      ))}
    </Masonry>
  );
}

export default MasonryTest;