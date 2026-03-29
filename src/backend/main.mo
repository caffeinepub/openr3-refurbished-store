import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

actor {
  type ProductSpecs = {
    ram : Text;
    storage : Text;
    batteryCapacity : Text;
    chargingSpeed : Text;
    screenReplaced : Bool;
    batteryReplaced : Bool;
    backPanelReplaced : Bool;
    wifiWorking : Bool;
    bluetoothWorking : Bool;
    touchWorking : Bool;
    camerasWorking : Bool;
    speakerWorking : Bool;
    micWorking : Bool;
    fingerPrintWorking : Bool;
    batteryHealth : Nat;
  };

  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    condition : Text;
    price : Nat;
    imageUrl : Text;
    isActive : Bool;
    specs : ProductSpecs;
    createdAt : Int;
  };

  type Feedback = {
    id : Nat;
    name : Text;
    email : Text;
    message : Text;
    createdAt : Int;
  };

  type Coupon = {
    code : Text;
    discountPercent : Nat;
    isActive : Bool;
    description : Text;
  };

  // Persistent Stores
  let productStore = Map.empty<Nat, Product>();
  let feedbackStore = Map.empty<Nat, Feedback>();
  let couponStore = Map.empty<Text, Coupon>();

  // Id counters
  var nextProductId = 1;
  var nextFeedbackId = 1;

  module Product {
    public func compare(product1 : Product, product2 : Product) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };
  };

  module Coupon {
    public func compare(coupon1 : Coupon, coupon2 : Coupon) : Order.Order {
      Text.compare(coupon1.code, coupon2.code);
    };
  };

  module Feedback {
    public func compare(feedback1 : Feedback, feedback2 : Feedback) : Order.Order {
      Nat.compare(feedback1.id, feedback2.id);
    };

    public func compareByEmail(feedback1 : Feedback, feedback2 : Feedback) : Order.Order {
      Text.compare(feedback1.email, feedback2.email);
    };
  };

  public shared ({ caller }) func addProduct(product : Product) : async Nat {
    let newProduct = { product with id = nextProductId; createdAt = Time.now() };
    productStore.add(nextProductId, newProduct);
    nextProductId += 1;
    newProduct.id;
  };

  public shared ({ caller }) func updateProduct(id : Nat, product : Product) : async () {
    let existingProduct = switch (productStore.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
    let updatedProduct = { product with id; createdAt = existingProduct.createdAt };
    productStore.add(id, updatedProduct);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not productStore.containsKey(id)) {
      Runtime.trap("Product not found");
    };
    productStore.remove(id);
  };

  public query ({ caller }) func getProduct(id : Nat) : async Product {
    switch (productStore.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    productStore.values().toArray().filter<Product>(
      func(product) { product.isActive }
    ).sort();
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    productStore.values().toArray().filter<Product>(
      func(product) { product.isActive and (product.category == category) }
    ).sort();
  };

  public shared ({ caller }) func addCoupon(coupon : Coupon) : async () {
    if (couponStore.containsKey(coupon.code)) {
      Runtime.trap("Coupon code already exists");
    };
    couponStore.add(
      coupon.code,
      {
        coupon with
        isActive = true;
      },
    );
  };

  public shared ({ caller }) func updateCoupon(code : Text, coupon : Coupon) : async () {
    if (not couponStore.containsKey(code)) {
      Runtime.trap("Coupon not found");
    };
    couponStore.add(code, coupon);
  };

  public shared ({ caller }) func deleteCoupon(code : Text) : async () {
    if (not couponStore.containsKey(code)) {
      Runtime.trap("Coupon not found");
    };
    couponStore.remove(code);
  };

  public query ({ caller }) func validateCoupon(code : Text) : async ?Nat {
    switch (couponStore.get(code)) {
      case (null) { null };
      case (?coupon) {
        if (coupon.isActive) { ?coupon.discountPercent } else { null };
      };
    };
  };

  public query ({ caller }) func getAllCoupons() : async [Coupon] {
    couponStore.values().toArray().sort();
  };

  public shared ({ caller }) func submitFeedback(name : Text, email : Text, message : Text) : async Nat {
    let newFeedback = {
      id = nextFeedbackId;
      name;
      email;
      message;
      createdAt = Time.now();
    };
    feedbackStore.add(nextFeedbackId, newFeedback);
    nextFeedbackId += 1;
    newFeedback.id;
  };

  public query ({ caller }) func getAllFeedback() : async [Feedback] {
    feedbackStore.values().toArray().sort();
  };

  system func preupgrade() {
    let persistentProducts = productStore.toArray();
    let persistentFeedback = feedbackStore.toArray();
    let persistentCoupons = couponStore.toArray();
  };

  system func postupgrade() {
    productStore.clear();
    feedbackStore.clear();
    couponStore.clear();
    nextProductId := 1;
    nextFeedbackId := 1;
  };
};
