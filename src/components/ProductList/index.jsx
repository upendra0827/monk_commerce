import React, { useState, useRef, useEffect } from "react";
import ProductCard from "./ProductCard";
import './style.css'
import Discount from "../Discount";
import Edit from '../../assets/Edit.svg'
import DragAndDropIcon from '../../assets/dragAndDrop.svg'

const ProductsList = ({ statusOfProducts, handleEditProductIndex, userSelectedProducts, handleDragStart, handleProductRemove, handleDragOver, handleDragDrop, openModal }) => {

    const [areProductsPresent, setAreProductsPresent] = useState(false)
    const [noOfDeletedProducts, setNoOfDeletedProducts] = useState(0)
    const [selectedProducts, setSelectedProducts] = useState(userSelectedProducts)

    useEffect(() => {
        if (noOfDeletedProducts === userSelectedProducts.length) {
            setSelectedProducts([])
        }
    }, [noOfDeletedProducts])

    return (
        <div className="productsList">
            {userSelectedProducts?.map((product, i) => (
                <>
                    <ProductCard setNoOfDeletedProducts={setNoOfDeletedProducts} setAreProductsPresent={setAreProductsPresent} statusOfProducts={statusOfProducts} handleEditProductIndex={handleEditProductIndex} openModal={openModal} key={`${product.title}`} handleProductRemove={handleProductRemove} handleDragDrop={handleDragDrop} handleDragOver={handleDragOver} handleDragStart={handleDragStart} product={product} i={i} />
                </>
            ))}
            {
                (!areProductsPresent || selectedProducts.length === 0) && (
                    <div className={`product`}>
                        <div>
                            <div className="dragIcon">
                                <img src={DragAndDropIcon} />
                            </div>
                            {<div>{1}</div>}
                            <div className={`title`}>
                                <div>Select Product</div>
                                <img onClick={() => {
                                    openModal()
                                    handleEditProductIndex({ i })
                                }}
                                    src={Edit} />
                            </div>
                        </div>
                        <button className="discount" disabled={true}>Add Discount</button>
                        <div className="closeBtn" onClick={() => handleProductRemove({ type: 'product', i })}>X</div>
                    </div>
                )
            }
            <footer>
                <button onClick={() => {
                    handleEditProductIndex({ i: null })
                    openModal()
                }} className="">Add Product</button>
            </footer>
        </div>
    )
};


export default ProductsList;
