import { useProducts } from "@/contexts/ProductContext";
import { ProductCard } from "@/components/ProductCard";
import { useState } from "react";
import { categories } from "@/data/products";

const Categories = () => {
  const { state } = useProducts();
  const { products } = state;
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const filteredProducts = selectedCategory === "All Categories" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const getProductCountByCategory = (category: string) => {
    if (category === "All Categories") return products.length;
    return products.filter(product => product.category === category).length;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Browse by Categories</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Find the medicines and healthcare products you need organized by category
        </p>
      </div>

      {/* Category Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full border-2 transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground border-border hover:border-primary/50"
              }`}
            >
              {category} ({getProductCountByCategory(category)})
            </button>
          ))}
        </div>
      </div>

      {/* Selected Category Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-foreground">
          {selectedCategory} 
          <span className="text-muted-foreground ml-2">
            ({filteredProducts.length} products)
          </span>
        </h2>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-2xl font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground">
            No products available in the "{selectedCategory}" category at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default Categories;