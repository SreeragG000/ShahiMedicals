import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, AlertTriangle, Package, Building, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { useProducts } from '@/contexts/ProductContext';
import { toast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { state } = useProducts();

  const product = state.products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addItem(product);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } else {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Product Image */}
          <Card>
            <CardContent className="p-6">
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
                {product.prescription && (
                  <Badge variant="destructive" className="flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Prescription Required
                  </Badge>
                )}
              </div>
              
              <p className="text-lg text-muted-foreground mb-4">
                {product.description}
              </p>

              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary" className="text-sm">
                  {product.category}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Building className="h-4 w-4 mr-1" />
                  {product.manufacturer}
                </div>
              </div>
            </div>

            <Separator />

            {/* Price and Stock */}
            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-primary">
                  ₹{product.price.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                <span className="font-medium">Stock Status:</span>
                {product.stock > 0 ? (
                  <Badge variant="default" className="bg-success text-success-foreground">
                    In Stock ({product.stock} available)
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Out of Stock
                  </Badge>
                )}
              </div>
            </div>

            <Separator />

            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-muted-foreground">Category:</span>
                    <p className="text-foreground">{product.category}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Manufacturer:</span>
                    <p className="text-foreground">{product.manufacturer}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Prescription:</span>
                    <p className="text-foreground">{product.prescription ? 'Required' : 'Not Required'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-muted-foreground">Stock:</span>
                    <p className="text-foreground">{product.stock} units</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add to Cart Button */}
            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;