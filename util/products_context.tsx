import React, {useContext} from "react";
import {productDataType} from "@/mocks/productData";

export type initialStateType =
{
  isSidebarOpen: boolean,
  allProducts: productDataType[] | [],
  featuredProducts: productDataType[] | [],
  singleProduct: productDataType | {},
  openSidebar: () => void,
  closeSidebar: () => void,
  fetchSingleProduct: (id: string) => void,
  productsLoading: boolean,
  productsError: boolean,
  singleProductLoading: boolean,
  singleProductError: boolean
}

const initialState: initialStateType =
{
  isSidebarOpen: false,
  allProducts: [],
  featuredProducts: [],
  singleProduct: {},
  openSidebar: () => {},
  closeSidebar: () => {},
  fetchSingleProduct: (id: string) => {},
  productsLoading: false,
  productsError: false,
  singleProductLoading: false,
  singleProductError: false
}

const ProductsContext = React.createContext<initialStateType>(initialState)

export const useProductsContext = () =>
{
  return useContext(ProductsContext)
}
