import { create } from "zustand";

const initialState = [];


export const useTabStore = create((set, get) => ({
  activeTab: '',
  setActiveTab: (activeTab) => set(() => ({ activeTab })),
}));
export const useStateStore = create((set, get) => ({
  garden: initialState,
  addPlanter: (name, color, size, index, trolley) =>
    set((state) => {
      if (state.garden.length > state.maxQuantity){
        return { garden: state.garden };
      }
      return {
        garden: [...state.garden, { name, color, size, trolley }],
        activeIndex: index,
      };
    }),
  setPlantColor: (color) =>
    set((state) => {
      const updatedPlants = [...state.garden];
      updatedPlants[state.activeIndex] = {
        ...updatedPlants[state.activeIndex],
        color,
      };
      return {
        garden: updatedPlants,
      };
    }),

  setTrolley: (trolley) =>
    set((state) => {
      const updatedPlants = [...state.garden];
      updatedPlants[state.activeIndex] = {
        ...updatedPlants[state.activeIndex],
        trolley,
      };
      return {
        garden: updatedPlants,
      };
    }),

  setPlantSize: (size) =>
    set((state) => {
      const updatedPlants = [...state.garden];
      updatedPlants[state.activeIndex] = {
        ...updatedPlants[state.activeIndex],
        size: size,
      };
      return {
        garden: updatedPlants,
      };
    }),
 deletePlanter: (name) =>
    set((state) => ({
      garden: state.garden.filter((item, _i) => item.name !== name),
    })),
  activeIndex: undefined,
  setActive: (index) => set(() => ({ activeIndex: index })),
  width: 20,
  height: 20,
  maxQuantity: 2,
  quantity: 2,
  terrain: 'leaf',
  setTerrain: (terrain) => set(() => ({ terrain })),
  setMaxQuantity: (quantity) => set(() => ({ maxQuantity: quantity })),
  setQuantity: (quantity) => set(() => ({ quantity })),
  changeHeight: (height) => set(() => ({ height })),
  changeWidth: (width) => set(() => ({ width })),
}));
