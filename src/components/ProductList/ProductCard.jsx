import React, { useState, useEffect } from "react";
import DragAndDropIcon from '../../assets/dragAndDrop.svg'
import Discount from "../Discount";
import Edit from '../../assets/Edit.svg'
import VariantCard from "./VariantCard";
import Arrow from '../../assets/Arrow.svg'

const ProductCard = ({ setAreProductsPresent, statusOfProducts, handleEditProductIndex, product, i, handleDragStart, handleDragOver, handleDragDrop, handleProductRemove, openModal }) => {
    const [showVariants, setShowVariants] = useState(false)
    const [showDiscountBtn, setShowDiscountBtn] = useState(true)

    useEffect(() => {
        if ((statusOfProducts[product.id] === 'checked' || statusOfProducts[product.id] === 'indeterminate')) {
            setAreProductsPresent(true)
        } else {
            setAreProductsPresent(false)
        }
    }, [product])

    return (statusOfProducts[product.id] === 'checked' || statusOfProducts[product.id] === 'indeterminate') && (
        <>
            <div
                className="productCard"
                draggable={!showVariants}
                onDragStart={(e) => !showVariants ? handleDragStart({ e, i }) : null}
                onDragOver={(e) => !showVariants ? handleDragOver(e) : null}
                onDrop={(e) => !showVariants ? handleDragDrop({ e }) : null}
                productindex={i}>
                <div className={`product`}>
                    <div>
                        <div className="dragIcon">
                            <img src={DragAndDropIcon} />
                        </div>
                        <div className={`title`}>
                            <div>{product.title}</div>
                            <img onClick={() => {
                                openModal()
                                handleEditProductIndex({ i })
                            }}
                                src={Edit} />
                        </div>
                    </div>
                    <div>
                        <Discount showDiscountBtn={showDiscountBtn} setShowDiscountBtn={setShowDiscountBtn} />
                        <div className="closeBtn" onClick={() => handleProductRemove({ type: 'product', i })}>X</div>
                    </div>
                </div>
                {product.variants.length > 1 && (
                    <>
                        <div className="showVariants" onClick={() => setShowVariants(!showVariants)}>{showVariants ? 'Hide Variants' : 'show variants'} <img className={`${!showVariants ? 'arrowDown' : 'arrowUp'}`} src={Arrow} /></div>
                        <div>
                            {showVariants && product.variants?.map((variant, j) => (
                                <>
                                    {
                                        statusOfProducts[variant.id] === 'checked' ? <VariantCard i={i} j={j} handleDragOver={handleDragOver} handleDragDrop={handleDragDrop} handleDragStart={handleDragStart} handleProductRemove={handleProductRemove} variant={variant} /> : null
                                    }
                                </>
                            ))}
                        </div>
                    </>
                )}
            </div>
            <hr style={{ width: '500px' }} />
        </>
    )
};

export default ProductCard;
