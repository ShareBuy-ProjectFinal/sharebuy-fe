// {
//     "shop_id": "66f99faa619a1e0013e674e8",
//     "type": "IN", // OUT
//     "supplier": "samsung",
//     "inventory_history_details": [
//         {
//             "inventory_id": "66f9a2d6a95a6154c8ed89df", // product_detail_id
//             "quantity": 2,
//             "origin_price": 100000
//         },
//         {
//             "inventory_id": "66f9a2d6a95a6154c8ed89e1", // product_detail_id
//             "quantity": 2,
//             "origin_price": 100000
//         }
//     ]
// }
export interface IInventoryNew {
  shop_id: string;
  type: string;
  supplier: string;
  inventory_history_details: {
    inventory_id: string;
    quantity: number;
    origin_price: number;
  }[];
}
