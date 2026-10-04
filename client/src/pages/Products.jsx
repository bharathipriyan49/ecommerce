import { useEffect, useState } from "react";
import api from "../services/api";
import "./Products.css";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <h2>Loading products...</h2>;
  }

  // 🔍 Search products
  const filteredProducts = products.filter((product) => {
    const search = searchInput.trim().toLowerCase();

    // Search empty என்றால் எல்லா products-ம் காட்டும்
    if (!search) {
      return true;
    }

    return [
      product.name,
      product.description,
      product.category,
    ].some((value) =>
      String(value ?? "").toLowerCase().includes(search)
    );
  });

  return (
    <div className="products-page">
      <h1>Our Products</h1>

      {/* 🔍 Search Bar */}
      <form
        className="product-search"
        onSubmit={(event) => event.preventDefault()}
      >
        <input
          type="search"
          aria-label="Search products"
          placeholder="Search products..."
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
        />

        <button type="submit">
          Search
        </button>
      </form>

      {/* Products */}
      <div className="products-grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>

      {/* No Products */}
      {filteredProducts.length === 0 && (
        <p className="no-products-message">
          No products found
          {searchInput.trim() && ` for "${searchInput}"`}.
        </p>
      )}
    </div>
  );
}

export default Products;