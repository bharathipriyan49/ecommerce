import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
import "./Home.css";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to load featured products:", error);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const featuredProducts = [...products]
    .sort((first, second) => (Number(second.rating) || 0) - (Number(first.rating) || 0))
    .slice(0, 4);

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-eyebrow">MY STORE · EVERYDAY FINDS</p>
          <h1>Find something worth keeping.</h1>
          <p>Browse the collection and discover a new favorite.</p>
          <Link className="home-shop-link" to="/products">
            Shop all products <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="home-featured" aria-labelledby="home-featured-title">
        <div className="home-featured-heading">
          <div>
            <p className="home-section-label">THE COLLECTION</p>
            <h2 id="home-featured-title">Customer favorites</h2>
          </div>
          <Link to="/products">View the full catalog <span aria-hidden="true">→</span></Link>
        </div>

        {hasError ? (
          <p className="home-products-message">Products could not be loaded right now.</p>
        ) : loading ? (
          <p className="home-products-message">Loading customer favorites...</p>
        ) : featuredProducts.length > 0 ? (
          <div className="products-grid home-featured-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="home-products-message">There are no products to show yet.</p>
        )}
      </section>
    </main>
  );
}

export default Home;