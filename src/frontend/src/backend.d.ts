import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Feedback {
    id: bigint;
    name: string;
    createdAt: bigint;
    email: string;
    message: string;
}
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
    warrantyTerms: string;
    wifiWorking: boolean;
    warrantyType: string;
    touchWorking: boolean;
    warrantyDuration: string;
    bluetoothWorking: boolean;
    micWorking: boolean;
    batteryCapacity: string;
    screenReplaced: boolean;
}
export interface Review {
    id: bigint;
    createdAt: bigint;
    productId: bigint;
    reviewerName: string;
    comment: string;
    rating: bigint;
}
export interface Product {
    id: bigint;
    imageUrls: Array<string>;
    name: string;
    createdAt: bigint;
    chargerIncluded: boolean;
    description: string;
    billIncluded: boolean;
    isActive: boolean;
    specs: ProductSpecs;
    imageUrl: string;
    category: string;
    price: bigint;
    boxIncluded: boolean;
    condition: string;
}
export interface backendInterface {
    addCoupon(coupon: Coupon): Promise<void>;
    addProduct(product: Product): Promise<bigint>;
    addReview(productId: bigint, reviewerName: string, rating: bigint, comment: string): Promise<bigint>;
    deleteCoupon(code: string): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    deleteReview(id: bigint): Promise<void>;
    getAllCoupons(): Promise<Array<Coupon>>;
    getAllFeedback(): Promise<Array<Feedback>>;
    getAllProducts(): Promise<Array<Product>>;
    getProduct(id: bigint): Promise<Product>;
    getProductsByCategory(category: string): Promise<Array<Product>>;
    getReviewsByProduct(productId: bigint): Promise<Array<Review>>;
    submitFeedback(name: string, email: string, message: string): Promise<bigint>;
    updateCoupon(code: string, coupon: Coupon): Promise<void>;
    updateProduct(id: bigint, product: Product): Promise<void>;
    validateCoupon(code: string): Promise<bigint | null>;
}
