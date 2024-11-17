import React, { useState } from "react";
import DragAndDropIcon from '../../assets/dragAndDrop.svg'
import Discount from "../Discount";
import Edit from '../../assets/Edit.svg'

const VariantCard = ({ variant, handleDragDrop, handleDragOver, handleDragStart, handleProductRemove, i, j }) => {
    const [showDiscountBtn, setShowDiscountBtn] = useState(true)

    return (
        <div
            variantindex={j}
            className={`variantCard`}
            draggable onDrop={(e) => handleDragDrop({ e: e, i, type: 'variant' })}
            onDragStart={(e) => handleDragStart({ e, i: j })}
            onDragOver={handleDragOver} >
            <div>
                <div className="dragIcon" >
                    <img width={'7px'} height={'14px'} src={DragAndDropIcon} />
                </div>
                <div className={`variantTitle variant`}>
                    <div>{variant.title}</div>
                </div>
            </div>
            <div>
                <Discount isVariant={true} showDiscountBtn={showDiscountBtn} setShowDiscountBtn={setShowDiscountBtn} />
                <div className="closeBtn" onClick={() => handleProductRemove({ type: 'variant', i, j })}>X</div>
            </div>
        </div>
    )
};

export default VariantCard;
