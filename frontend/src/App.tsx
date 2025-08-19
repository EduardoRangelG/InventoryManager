import { useEffect } from "react";
import { deleteProduct } from "./api/products";
import "./App.css";

// const initState = {
//   products: []
// }

function App() {
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        console.log("Intentando conectar con el backend...");

        const response = await deleteProduct(1);

        console.log("¡Conexión exitosa! Datos recibidos:");
        console.log(response);
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
      }
    };

    testApiConnection();
  }, []); // El array vacío asegura que se ejecute solo una vez al cargar

  //   const [state, setState] =  useState (
  //     initState
  // )

  return (
    <div>
      <h1>Prueba de conexión al Backend</h1>
      <p>Revisa la consola de tu navegador para ver los resultados.</p>
    </div>
  );
}

export default App;
