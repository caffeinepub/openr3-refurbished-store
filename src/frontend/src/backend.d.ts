import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Coupon {
    code: string;
    description: string;
    discountPercent: bigint;
    isActive: boolean;
}
export interface ProductSpecs {
    ram: string;
    fingerPrintWorking: boolean;
    camerasWorking: boolean;
    speakerWorking: boolean;
    storage: string;
    batteryReplaced: boolean;
    backPanelReplaced: boolean;
    chargingSpeed: string;
    batteryHealth: bigint;
    wifiWorking: boolean;
    touchWorking: boolean;
    bluetoothWorking: boolean;
    micWorking: boolean;
    batteryCapacity: string;
    screenReplaced: boolean;
}
export interface Product {
    id: bigint;
    name: string;
    createdAt: bigint;
    description: string;
    isActive: boolean;
    specs: ProductSpecs;
    imageUrl: string;
    category: string;
    price: bigint;
    condition: string;
}
export interface Feedback {
    id: bigint;
    name: string;
    createdAt: bigint;
    email: string;
    message: string;
}
export interface backendInterface {
    addCoupon(coupon: Coupon): Promise<void>;
    addProduct(product: Product): Promise<bigint>;
    deleteCoupon(code: string): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAllCoupons(): Promise<Array<Coupon>>;
    getAllFeedback(): Promise<Array<Feedback>>;
    getAllProducts(): Promise<Array<Product>>;
    getProduct(id: bigint): Promise<Product>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    submitFeedback(name: string, email: string, message: string): Promise<bigint>;
    updateCoupon(code: string, coupon: Coupon): Promise<void>;
    updateProduct(id: bigint, product: Product): Promise<void>;
    validateCoupon(code: string): Promise<bigint | null>;
}
