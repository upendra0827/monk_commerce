import React, { useState } from "react";

const Discount = ({ showDiscountBtn, setShowDiscountBtn, isVariant }) => {
    return (
        <>
            {showDiscountBtn ? <button className="discount" onClick={() => setShowDiscountBtn(false)}>Add Discount</button> : (
                <div className={`discountOptions ${isVariant && 'variantDiscount'}`}>
                    <div contentEditable={true}>0</div>
                    <select onChange={handleSelect}>
                        <option>% off</option>
                        <option>Flat off</option>
                    </select>
                </div>
            )}
        </>
    )
};

export default Discount;
