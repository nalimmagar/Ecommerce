import { useState } from 'react';
import axios from 'axios';

function AddProduct() {
  const [product, setProduct] = useState({
    title: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    salePrice: '',
    totalStock: '',
  });
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // First upload image to cloudinary
      const formData = new FormData();
      formData.append('image', image);
      
      const imageResponse = await axios.post('http://localhost:5000/api/admin/upload', formData);
      
      // Then create product with image URL
      const productData = {
        ...product,
        image: imageResponse.data.url,
        averageReview: 0
      };
      
      const response = await axios.post('http://localhost:5000/api/admin/products/add', productData);
      console.log('Product added:', response.data);
      
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Title"
        onChange={(e) => setProduct({...product, title: e.target.value})}
      />
      <input 
        type="file"
        onChange={(e) => setImage(e.target.files[0])}
      />
      {/* Add other fields similarly */}
      <button type="submit">Add Product</button>
    </form>
  );
}

export default AddProduct; 