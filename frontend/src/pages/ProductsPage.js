import { useEffect, useState } from 'react';
import { getProducts } from '../api/api';
import { useNavigate } from 'react-router-dom'; 

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate(); 

  useEffect(() => {
    getProducts().then(res => setProducts(res.data));
  }, []);

  return (
    <div>
      <h2>Liste des produits</h2>
      <ul>
        {products.map(p => (
          <li key={p._id}>
            {p._id} -- {p.name} - {p.price}€ <br/>
            <button onClick={() => navigate('/orders')}>Acheter</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductsPage;
