import React, { useContext, useEffect, useState } from "react";
import Header from "../Header";
import ProductsList from "../ProductList";
import { ProductsContext } from "../../contexts/ProductsContext";
import { useModal } from "../../hooks";

const ProductsDashboard = ({ openModal }) => {

    const { products: { status, productsList, userSelectedProducts, statusOfProducts }, handleProductsSwap, handleFetchProducts, handleEditProductIndex, handleProductRemove } = useContext(ProductsContext)

    const handleDragStart = ({ e, i }) => {
        e.dataTransfer.setData('text/plain', i)
    }

    const handleDragOver = e => {
        e.preventDefault()
    }

    const handleDragDrop = ({ e, i, type }) => {
        const dragIndex = e.dataTransfer.getData('text/plain')
        let dropIndex

        if (type) {
            dropIndex = e.target.closest('.variantCard').getAttribute('variantindex')
        } else {
            dropIndex = e.target.closest('.productCard').getAttribute('productindex')
        }

        handleProductsSwap({ i: dragIndex, j: dropIndex, type, productIndex: i })
    }

    return (
        <>
            <h1>Add Products</h1>
            <>
                <Header />
                <ProductsList statusOfProducts={statusOfProducts} handleEditProductIndex={handleEditProductIndex} handleProductRemove={handleProductRemove} userSelectedProducts={userSelectedProducts} handleDragStart={handleDragStart} handleDragDrop={handleDragDrop} handleDragOver={handleDragOver} products={productsList} openModal={openModal} />
            </>
        </>
    )
};

export default ProductsDashboard;
