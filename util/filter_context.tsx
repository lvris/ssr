import React, { useEffect, useContext, useReducer } from "react";
import {productDataType} from "@/mocks/productData";

type filtersType =
{
  searchTerm: string,
  category: string,
  minPrice: number,
  maxPrice: number,
  price: number,
  forWhom: string,
  age: string[],
  height: string[]
}

export const defaultFilters: filtersType =
{
  searchTerm: '',
  category: 'all',
  minPrice: 0,
  maxPrice: 0,
  price: 0,
  forWhom: 'all',
  age: [],
  height: []
}

export type initialStateType =
{
  filteredProducts: productDataType[],
  allProducts: productDataType[],
  gridView: boolean,
  setGridView: () => void,
  setListView: () => void,
  sort: string,
  updateSort: (e: React.ChangeEvent<HTMLSelectElement>) => void,
  filters: filtersType,
  updateFilters: (e: any) => void,
  clearFilters: () => void,
  isClickFromServices: boolean,
  handleClickFromServices: () => void,
  resetIsClickFromServices: () => void
}

const initialState: initialStateType =
{
  filteredProducts: [],
  allProducts: [],
  gridView: true,
  setGridView: () => {},
  setListView: () => {},
  sort: 'price-lowest',
  updateSort: () => {},
  filters: defaultFilters,
  updateFilters: () => {},
  clearFilters: () => {},
  isClickFromServices: false,
  handleClickFromServices: () => {},
  resetIsClickFromServices: () => {}
}

const FilterContext = React.createContext<initialStateType>(initialState)

export const useFilterContext = () =>
{
  return useContext(FilterContext)
}
