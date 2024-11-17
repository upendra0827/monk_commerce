import { createContext, useReducer } from "react";
const X_API_KEY = import.meta.env.VITE_X_API_KEY

export const ProductsContext = createContext()

const ProductsProvider = ({ children }) => {

    const initialState = {
        status: '',
        productsList: [],
        noOfSelectedProducts: 0,
        userSelectedProducts: [],
        editProductIndex: null,
        statusOfProducts: {}
    }

    const reducers = (state = initialState, action) => {
        switch (action.type) {
            case 'fetchProductsInitiated':
                return {
                    ...state,
                    status: 'pending'
                }

            case 'fetchProductsSuccess':
                return {
                    ...state,
                    status: 'success',
                    productsList: [...state.productsList, ...action.payload]
                }
            case 'fetchQueryProductsSuccess':
                return {
                    ...state,
                    status: 'success',
                    productsList: action.payload
                }
            case 'fetchProductsFailure':
                return {
                    ...state,
                    status: 'error'
                }
            case 'handleProductsChecked':
                return {
                    ...state,
                    productsList: action.payload.newState,
                    noOfSelectedProducts: action.payload.noOfSelectedProducts
                }
            case 'handleVariantChecked':
                return {
                    ...state,
                    productsList: action.payload.newState,
                    noOfSelectedProducts: action.payload.noOfSelectedProducts
                }
            case 'handleAddProductsToUserSelectedProducts':
                return {
                    ...state,
                    userSelectedProducts: action.payload.products
                }
            case 'handleRemoveProductsFromUserSelectedProducts':
                return {
                    ...state,
                    userSelectedProducts: action.payload.products
                }

            case 'handleEditProductIndex':
                return {
                    ...state,
                    editProductIndex: action.payload.index
                }

            case 'handleProductsSwap':
                return {
                    ...state,
                    userSelectedProducts: action.payload.products
                }
            case 'handleStoreCheckedProducts':
                return {
                    ...state,
                    statusOfProducts: {
                        ...state.statusOfProducts,
                        ...action.payload.productStatuses
                    }
                }

            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducers, initialState)

    const handleFetchProducts = async ({ query = '', page = 0 }) => {
        dispatch({ type: 'fetchProductsInitiated' });

        try {
            const response = await fetch(`https://stageapi.monkcommerce.app/task/products/search?search=${query}&page=${page}&limit=10`, {
                method: 'GET',
                headers: {
                    'x-api-key': X_API_KEY
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const responseJson = await response.json();

            if (!responseJson) {
                dispatch({ type: 'fetchQueryProductsSuccess', payload: [] })
            }

            if (page > 0) {
                dispatch({ type: 'fetchProductsSuccess', payload: responseJson });
            } else dispatch({ type: 'fetchQueryProductsSuccess', payload: responseJson });

        } catch (error) {
            dispatch({ type: 'fetchProductsFailure' });
        }
    };

    const handleProductsChecked = ({ checked, product, i }) => {
        let index = i
        const objectToStoreCheckedProducts = {
            ...state.statusOfProducts
        }
        if (i === undefined) {
            for (let j = 0; j < state.productsList.length; j++) {
                if (state.productsList[j].id === product.id) {
                    index = j
                    break
                }
            }
        }

        const newState = [...state.productsList]
        let noOfSelectedProducts = state.noOfSelectedProducts
        newState[index] = {
            ...product,
            checked: checked ? 'checked' : 'unchecked'
        }

        objectToStoreCheckedProducts[newState[index].id] = checked ? 'checked' : 'unchecked'

        if (checked) {
            for (let variant of newState[index].variants) {
                variant.checked = 'checked'
                objectToStoreCheckedProducts[variant.id] = 'checked'
            }
            noOfSelectedProducts++
        } else {
            for (let variant of newState[index].variants) {
                variant.checked = 'unchecked'
                objectToStoreCheckedProducts[variant.id] = 'unchecked'
            }
            noOfSelectedProducts--
        }

        dispatch({ type: 'handleStoreCheckedProducts', payload: { productStatuses: objectToStoreCheckedProducts } })
        dispatch({ type: 'handleProductsChecked', payload: { newState, noOfSelectedProducts } });
    }

    const handleVariantChecked = ({ checked, variant, product, i, j }) => {
        const objectToStoreCheckedProducts = {
            ...state.statusOfProducts
        }

        const newState = [...state.productsList]
        let noOfSelectedProducts = state.noOfSelectedProducts
        let noOfCheckedVariants = ''
        newState[i].variants[j] = {
            ...newState[i].variants[j],
            checked: checked ? 'checked' : 'unchecked'
        }
        objectToStoreCheckedProducts[newState[i].variants[j].id] = checked ? 'checked' : 'unchecked'

        const noOfCheckedVariantsList = newState[i].variants.filter(variant => objectToStoreCheckedProducts[variant.id] === 'checked')


        if (noOfCheckedVariantsList.length === newState[i].variants.length) {
            noOfCheckedVariants = 'all'
        } else if (noOfCheckedVariantsList.length !== 0) {
            noOfCheckedVariants = 'some'
        } else {
            noOfCheckedVariants = 'none'
        }

        if ((newState[i].checked === 'unchecked' || !newState[i].checked) && (noOfCheckedVariants === 'some' || noOfCheckedVariants === 'all')) {
            noOfSelectedProducts++
        }

        if (noOfCheckedVariants === 'all') {
            newState[i].checked = 'checked'
            objectToStoreCheckedProducts[newState[i].id] = 'checked'
        } else if (noOfCheckedVariants === 'some') {
            newState[i].checked = 'indeterminate'
            objectToStoreCheckedProducts[newState[i].id] = 'indeterminate'
        } else {
            newState[i].checked = 'unchecked'
            objectToStoreCheckedProducts[newState[i].id] = 'unchecked'
        }

        dispatch({ type: 'handleStoreCheckedProducts', payload: { productStatuses: objectToStoreCheckedProducts } })
        dispatch({ type: 'handleProductsChecked', payload: { newState, noOfSelectedProducts } });
    }

    const handleProductRemove = ({ type, i, j }) => {
        const objectToStoreCheckedProducts = {
            ...state.statusOfProducts
        }

        let newState = [...state.userSelectedProducts]

        if (type === 'product') {
            const product = newState.splice(i, 1)
            handleProductsChecked({ checked: false, product: product[0] })
            objectToStoreCheckedProducts[product[0].id] = 'unchecked'
        } else {
            newState = [...state.userSelectedProducts]
            newState[i].variants[j].checked = 'unchecked'
            objectToStoreCheckedProducts[newState[i].variants[j].id] = 'unchecked'
        }
        dispatch({ type: 'handleStoreCheckedProducts', payload: { productStatuses: objectToStoreCheckedProducts } })
        dispatch({ type: 'handleRemoveProductsFromUserSelectedProducts', payload: { products: newState } });
    }

    const handleAddUserSelectedProducts = ({ selectedProducts }) => {
        let products = [...state.userSelectedProducts]

        if (state.editProductIndex != null) {
            products.splice(state.editProductIndex, 1, ...selectedProducts)
            handleProductRemove({ type: 'product', i: state.editProductIndex })
        } else {
            const newProducts = selectedProducts.filter(selectedProduct => {
                return products.some(product => product.id === selectedProduct.id) ? false : true
            })

            products = [...products, ...newProducts]
        }
        dispatch({ type: 'handleAddProductsToUserSelectedProducts', payload: { products: products } });

    }

    const handleEditProductIndex = ({ i }) => {
        dispatch({ type: 'handleEditProductIndex', payload: { index: i } });
    }

    const handleProductsSwap = ({ i, j, type, productIndex }) => {

        let products = [...state.userSelectedProducts];
        if (type) {
            [products[productIndex].variants[i], products[productIndex].variants[j]] = [products[productIndex].variants[j], products[productIndex].variants[i]]
        } else if (i != j) {
            [products[i], products[j]] = [products[j], products[i]]
        }

        dispatch({ type: 'handleProductsSwap', payload: { products: products } });
    }

    return (
        <ProductsContext.Provider value={{ products: state, handleProductsSwap, handleEditProductIndex, handleProductRemove, handleFetchProducts, handleProductsChecked, handleVariantChecked, handleAddUserSelectedProducts }}>
            {children}
        </ProductsContext.Provider>
    )
}

export default ProductsProvider