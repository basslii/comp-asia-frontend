export interface Brand {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface ProductColor {
    id: number;
    color: string;
}

export interface Purchase {
    id: number;
    productId: number;
    productName: string;
    productColor: string;
    createdAt: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    brand: Brand;
    category: Category;
    color: ProductColor;
}