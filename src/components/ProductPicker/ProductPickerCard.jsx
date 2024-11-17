import React, { forwardRef, Fragment, useEffect, useState } from "react";

const ProductPickerCard = forwardRef(({ product, statusOfProducts, handleSelectProducts, handleSelectVariants, i, handleVariantChecked, inputRefs }, ref) => {
    useEffect(() => {
        if (statusOfProducts[product.id] === 'indeterminate' && inputRefs.current[i]) {
            inputRefs.current[i].indeterminate = true
        } else if (statusOfProducts[product.id] === 'checked' || statusOfProducts[product.id] === 'unchecked') {
            inputRefs.current[i].indeterminate = false
        }
    }, [product?.checked])

    return (
        <div ref={ref} className="cardd" key={`${product.id}-${i}`}>
            <div className="info">
                <input
                    ref={el => inputRefs.current[i] = el}
                    type="checkbox"
                    // checked={product.checked ? product.checked === 'checked' : false}
                    checked={statusOfProducts[product.id] === 'checked' ? true : false}
                    id={product.title}
                    onChange={(e) => {
                        handleSelectProducts({ checked: e.target.checked, product, i })
                    }} />
                <img loading="eager" style={{ margin: 'auto 10px' }} src={product.image.src} />
                <label htmlFor={product.title}>
                    {product.title}
                </label>
            </div>
            <hr />
            {product?.variants?.length && product.variants.map((variant, j) => (
                <>
                    <div className="info productPickerCardVariant" key={`${variant.id}-${j}`}>
                        <input type="checkbox"
                            // checked={variant.checked === 'checked'}
                            checked={(statusOfProducts[variant.id] === 'checked' && (statusOfProducts[product.id] === 'checked' || statusOfProducts[product.id] === 'indeterminate')) ? true : false}
                            onChange={e => {
                                handleSelectVariants({ checked: e.target.checked, variant, product, i, j })
                            }}
                            id={product.title} />
                        <label htmlFor={product.title}>
                            <div>{variant.title}</div>
                            <div>{variant.price}</div>
                        </label>
                    </div>
                    <hr />
                </>
            ))}
        </div>
    )
});

export default ProductPickerCard;
