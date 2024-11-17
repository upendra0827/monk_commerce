import React, { useEffect, useRef, useState } from "react";
import ProductPickerCard from "./ProductPickerCard";
import { ProductsContext } from "../../contexts/ProductsContext";
import { useContext } from "react";

const ProductPicker = ({ products, setUserSelectedProducts, closeModal }) => {
    const { products: { status, noOfSelectedProducts, statusOfProducts }, handleFetchProducts, handleProductsChecked, handleVariantChecked, handleAddUserSelectedProducts, editProductIndex } = useContext(ProductsContext)
    const [query, setQuery] = useState('')
    const [page, setPage] = useState(0)
    const inputRefs = useRef([])
    const [selectedProducts, setSelectedProducts] = useState([])

    useEffect(() => {
        handleFetchProducts({ query: query })
    }, [query])

    const handleSelectProducts = ({ checked, product, i }) => {
        if (checked) {
            setSelectedProducts(prev => [...prev, product])
        } else {
            setSelectedProducts(prev => prev.filter(_ => _.id !== product.id))
        }
        handleProductsChecked({ checked, product, i })
    }

    const handleSelectVariants = ({ checked, variant, product, i, j }) => {

        if (checked) {
            if (product.checked === 'unchecked' || !product.checked) {
                setSelectedProducts(prev => [...prev, product])
            }
        }

        handleVariantChecked({ checked, variant, product, i, j })
    }

    const lastElementRef = useRef()

    const observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            handleFetchProducts({ page: page + 1 })
            setPage(prev => prev + 1)
        }
    })

    useEffect(() => {
        if (lastElementRef.current) {
            observer.observe(lastElementRef.current)
        }

        return () => {
            if (lastElementRef.current) observer.unobserve(lastElementRef.current)
        }
    }, [lastElementRef, products])

    return (
        <div className="productPicker">
            <div>
                <input onChange={(e) => {
                    e.preventDefault()
                    setQuery(e.target.value)
                }} className="searchInput" placeholder="Search Product" />
            </div>
            <hr />
            <div>
                <div className="productPickerCard">
                    {products?.length > 0 && products?.map((product, i) => (
                        <ProductPickerCard statusOfProducts={statusOfProducts} handleSelectVariants={handleSelectVariants} handleSelectProducts={handleSelectProducts} inputRefs={inputRefs} handleVariantChecked={handleVariantChecked} i={i} key={`${product.id}-${i}`} handleProductChecked={handleProductsChecked} product={product} status={status} ref={i === products.length - 1 ? lastElementRef : null} />
                    ))}
                    {status === 'pending' && <div className="loading">Loading............</div>}
                    {status === 'error' && <div className="loading">Oops, something went wrong on our end. Please try again after sometime.</div>}
                    {!products && <div>Oops... No products found.....</div>}
                </div>
            </div>
            <div className="productPickerFooter">
                <div>
                    {noOfSelectedProducts}  Products Selected
                </div>
                <div>
                    <button className="cancelBtn" onClick={() => {
                        closeModal()
                        setSelectedProducts([])
                    }}>Cancel</button>
                    <button className="addButton-2" onClick={() => {
                        handleAddUserSelectedProducts({ selectedProducts })
                        closeModal()
                    }}>Add</button>
                </div>
            </div>
        </div>
    )
};

export default ProductPicker;
