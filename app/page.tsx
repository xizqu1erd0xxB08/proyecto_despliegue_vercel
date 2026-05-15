"use client";

import { FormEvent, useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
};

const initialProducts: Product[] = [
  { id: 1, name: "Arroz Diana 500g", category: "Granos", price: 2600, stock: 34 },
  { id: 2, name: "Pan tajado familiar", category: "Panaderia", price: 5200, stock: 12 },
  { id: 3, name: "Leche entera 1L", category: "Lacteos", price: 4300, stock: 18 },
  { id: 4, name: "Huevos AA x12", category: "Canasta", price: 9600, stock: 9 },
];

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function Home() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProductId, setSelectedProductId] = useState(initialProducts[0].id);
  const [quantity, setQuantity] = useState(1);
  const [lastSale, setLastSale] = useState("");
  const [contactSent, setContactSent] = useState(false);

  const totals = useMemo(() => {
    const inventoryValue = products.reduce(
      (sum, product) => sum + product.price * product.stock,
      0,
    );
    const lowStock = products.filter((product) => product.stock <= 10).length;
    return { inventoryValue, lowStock, items: products.length };
  }, [products]);

  const selectedProduct = products.find((product) => product.id === selectedProductId);

  function createProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const product: Product = {
      id: Date.now(),
      name: String(form.get("name") ?? "").trim(),
      category: String(form.get("category") ?? "").trim(),
      price: Number(form.get("price")),
      stock: Number(form.get("stock")),
    };

    if (!product.name || !product.category || product.price <= 0 || product.stock < 0) {
      return;
    }

    setProducts((current) => [product, ...current]);
    setSelectedProductId(product.id);
    event.currentTarget.reset();
  }

  function registerSale(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedProduct || quantity < 1 || quantity > selectedProduct.stock) {
      return;
    }

    setProducts((current) =>
      current.map((product) =>
        product.id === selectedProduct.id
          ? { ...product, stock: product.stock - quantity }
          : product,
      ),
    );
    setLastSale(
      `${quantity} x ${selectedProduct.name} vendido por ${currency.format(
        selectedProduct.price * quantity,
      )}`,
    );
    setQuantity(1);
  }

  function sendContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setContactSent(true);
    event.currentTarget.reset();
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Ir al inicio">
          <span>T</span>
          Tienda Cercana
        </a>
        <nav aria-label="Navegacion principal">
          <a href="#inventario">Inventario</a>
          <a href="#ventas">Ventas</a>
          <a href="#acerca">Acerca</a>
          <a href="#contacto">Contacto</a>
        </nav>
      </header>

      <section className="hero" id="inicio">
        <img
          src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=1600&q=80"
          alt="Estanteria organizada de una tienda de barrio"
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">Sistema web para pequenos negocios</p>
          <h1>Controla inventario, ventas y clientes desde una sola pantalla.</h1>
          <p>
            Una experiencia practica para tiendas de barrio: registra productos,
            descuenta existencias al vender y recibe mensajes de contacto sin complicarte.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#inventario">
              Gestionar inventario
            </a>
            <a className="button secondary" href="#contacto">
              Solicitar asesoria
            </a>
          </div>
        </div>
      </section>

      <section className="metrics" aria-label="Resumen del negocio">
        <article>
          <span>{totals.items}</span>
          <p>Productos activos</p>
        </article>
        <article>
          <span>{currency.format(totals.inventoryValue)}</span>
          <p>Valor del inventario</p>
        </article>
        <article>
          <span>{totals.lowStock}</span>
          <p>Alertas de bajo stock</p>
        </article>
      </section>

      <section className="workbench" id="inventario">
        <div className="section-heading">
          <p className="eyebrow">Operacion diaria</p>
          <h2>Inventario y creacion de productos</h2>
          <p>
            Mantener la informacion clara ayuda a vender mas rapido y a saber que
            reponer antes de que se agote.
          </p>
        </div>

        <div className="dashboard-grid">
          <form className="panel" onSubmit={createProduct}>
            <h3>Nuevo producto</h3>
            <label>
              Nombre
              <input name="name" type="text" placeholder="Ej: Cafe molido 250g" required />
            </label>
            <label>
              Categoria
              <input name="category" type="text" placeholder="Ej: Abarrotes" required />
            </label>
            <div className="two-columns">
              <label>
                Precio
                <input name="price" type="number" min="1" placeholder="3500" required />
              </label>
              <label>
                Stock
                <input name="stock" type="number" min="0" placeholder="20" required />
              </label>
            </div>
            <button className="button primary full" type="submit">
              Crear producto
            </button>
          </form>

          <div className="panel table-panel">
            <h3>Productos disponibles</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Categoria</th>
                    <th>Precio</th>
                    <th>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>{currency.format(product.price)}</td>
                      <td>
                        <span className={product.stock <= 10 ? "badge warning" : "badge"}>
                          {product.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="sales-section" id="ventas">
        <div className="section-heading">
          <p className="eyebrow">Caja rapida</p>
          <h2>Registrar venta</h2>
        </div>
        <form className="sales-form" onSubmit={registerSale}>
          <label>
            Producto
            <select
              value={selectedProductId}
              onChange={(event) => setSelectedProductId(Number(event.target.value))}
            >
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} - {product.stock} und.
                </option>
              ))}
            </select>
          </label>
          <label>
            Cantidad
            <input
              type="number"
              min="1"
              max={selectedProduct?.stock ?? 1}
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
            />
          </label>
          <button className="button primary" type="submit" disabled={!selectedProduct?.stock}>
            Vender
          </button>
        </form>
        <p className="sale-result" aria-live="polite">
          {lastSale || "Selecciona un producto y registra la primera venta del dia."}
        </p>
      </section>

      <section className="about" id="acerca">
        <div>
          <p className="eyebrow">Acerca de nosotros</p>
          <h2>Hecho para tenderos que necesitan orden sin perder tiempo.</h2>
        </div>
        <p>
          Tienda Cercana es una propuesta academica pensada para pequenos negocios
          que desean digitalizar tareas basicas: consultar inventario, crear
          productos, controlar ventas y abrir un canal de contacto para clientes o
          proveedores. Su interfaz es responsiva, clara y preparada para crecer con
          conexion a MySQL.
        </p>
      </section>

      <section className="contact" id="contacto">
        <div className="section-heading">
          <p className="eyebrow">Contacto</p>
          <h2>Hablemos de tu tienda</h2>
          <p>Deja tus datos y te responderemos con una propuesta de organizacion.</p>
        </div>
        <form className="contact-form" onSubmit={sendContact}>
          <label>
            Nombre completo
            <input type="text" name="fullName" placeholder="Tu nombre" required />
          </label>
          <label>
            Correo
            <input type="email" name="email" placeholder="correo@ejemplo.com" required />
          </label>
          <label>
            Mensaje
            <textarea name="message" rows={5} placeholder="Cuentanos que necesitas" required />
          </label>
          <button className="button primary full" type="submit">
            Enviar mensaje
          </button>
          {contactSent && (
            <p className="form-status" role="status">
              Mensaje registrado correctamente. Gracias por contactarnos.
            </p>
          )}
        </form>
      </section>

      <footer>
        <div>
          <strong>Tienda Cercana</strong>
          <p>Inventario, ventas y contacto para negocios de barrio.</p>
        </div>
        <p>Proyecto Next.js listo para evidencia de despliegue en Vercel.</p>
      </footer>
    </main>
  );
}
