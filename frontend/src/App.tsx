// import { useEffect } from "react";
import ProductSearch from "./components/search/ProductSearch";
import type { SearchData } from "./components/search/ProductSearch";
// import { deleteProduct } from "./services/products";
import "./App.css";

// const initState = {
//   products: []
// }

function App() {
  // useEffect(() => {
  //   const testApiConnection = async () => {
  //     try {
  //       console.log("Intentando conectar con el backend...");

  //       const response = await deleteProduct(1);

  //       console.log("¡Conexión exitosa! Datos recibidos:");
  //       console.log(response);
  //     } catch (error) {
  //       console.error("Error al conectar con el backend:", error);
  //     }
  //   };

  //   testApiConnection();
  // }, []); // El array vacío asegura que se ejecute solo una vez al cargar

  //   const [state, setState] =  useState (
  //     initState
  // )

  const handleSearch = (searchData: SearchData) => {
    console.log("Datos de busqueda:", searchData);
  };

  const categories = [
    { value: "electronics", label: "Electronics" },
    { value: "clothing", label: "Clothing" },
    { value: "books", label: "Books" },
  ];

  return (
    <>
      <ProductSearch onSearch={handleSearch} categories={categories} />
    </>
  );
}

export default App;
