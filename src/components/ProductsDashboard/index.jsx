import React, { useContext, useEffect, useState } from "react";
import Header from "../Header";
import ProductsList from "../ProductList";
import { ProductsContext } from "../../contexts/ProductsContext";
import { useModal } from "../../hooks";
import ModalComponent from "../Modal";
import ProductPicker from "../ProductPicker";
import ProductsDashboard from "./ProductsDashboard";

const ProductsDashboardContainer = () => {
  const { openModal, closeModal, isOpen } = useModal()
  const { products: { status, productsList }, handleFetchProducts } = useContext(ProductsContext)
  const [userSelectedProducts, setUserSelectedProducts] = useState([])

  return (
    <>
      <ProductsDashboard openModal={openModal} userSelectedProducts={userSelectedProducts} />
      <ModalComponent isOpen={isOpen} onClose={closeModal} heading={'Select Products'} >
        <ProductPicker products={productsList} openModal={openModal} closeModal={closeModal} setUserSelectedProducts={setUserSelectedProducts} />
      </ModalComponent>
    </>
  )
};

export default ProductsDashboardContainer;
