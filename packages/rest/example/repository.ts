/**
 * Extra dummy file for testing of "persistense" :)
 */

export const organizations: any[] = [];
export const users: any[] = [];

export const findById = (array: any, id: number) =>
  array.find((item: any) => item.id === id);
export const addItem = (array: any, item: any) => {
  item.id = array.length + 1;
  array.push(item);
  return item;
};
export const updateItem = (array: any, id: number, newItem: any) => {
  const index = array.findIndex((item: any) => item.id === id);
  if (index !== -1) {
    array[index] = { ...array[index], ...newItem };
    return newItem;
  }
};
export const deleteItem = (array: any, id: number) => {
  const index = array.findIndex((item: any) => item.id === id);
  if (index !== -1) {
    array.splice(index, 1);
    return true;
  }
};
