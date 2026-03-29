import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Order "mo:core/Order";

module {
  type OldProductSpecs = {
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

  type OldProduct = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    condition : Text;
    price : Nat;
    imageUrl : Text;
    isActive : Bool;
    specs : OldProductSpecs;
    createdAt : Int;
  };

  type OldFeedback = {
    id : Nat;
    name : Text;
    email : Text;
    message : Text;
    createdAt : Int;
  };

  type OldCoupon = {
    code : Text;
    discountPercent : Nat;
    isActive : Bool;
    description : Text;
  };

  module OldProduct {
    public func compare(product1 : OldProduct, product2 : OldProduct) : Order.Order {
      Nat.compare(product1.id, product2.id);
    };
  };

  module OldCoupon {
    public func compare(coupon1 : OldCoupon, coupon2 : OldCoupon) : Order.Order {
      Text.compare(coupon1.code, coupon2.code);
    };
  };

  module OldFeedback {
    public func compare(feedback1 : OldFeedback, feedback2 : OldFeedback) : Order.Order {
      Nat.compare(feedback1.id, feedback2.id);
    };
  };

  type OldActor = {
    productStore : Map.Map<Nat, OldProduct>;
    feedbackStore : Map.Map<Nat, OldFeedback>;
    couponStore : Map.Map<Text, OldCoupon>;
    nextProductId : Nat;
    nextFeedbackId : Nat;
  };

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
    warrantyDuration : Text;
    warrantyType : Text;
    warrantyTerms : Text;
  };

  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    category : Text;
    condition : Text;
    price : Nat;
    imageUrl : Text;
    imageUrls : [Text];
    isActive : Bool;
    chargerIncluded : Bool;
    billIncluded : Bool;
    boxIncluded : Bool;
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

  type Review = {
    id : Nat;
    productId : Nat;
    reviewerName : Text;
    rating : Nat;
    comment : Text;
    createdAt : Int;
  };

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
  };

  module Review {
    public func compare(review1 : Review, review2 : Review) : Order.Order {
      Int.compare(review2.createdAt, review1.createdAt);
    };
  };

  type NewActor = {
    productStore : Map.Map<Nat, Product>;
    feedbackStore : Map.Map<Nat, Feedback>;
    couponStore : Map.Map<Text, Coupon>;
    reviewStore : Map.Map<Nat, Review>;
    nextProductId : Nat;
    nextFeedbackId : Nat;
    nextReviewId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newProductStore = old.productStore.map<Nat, OldProduct, Product>(
      func(_id, oldProduct) {
        {
          oldProduct with
          imageUrls = []; // Default to empty array for legacy products
          isActive = true;
          chargerIncluded = true;
          billIncluded = true;
          boxIncluded = true;
          specs = {
            oldProduct.specs with
            batteryCapacity = oldProduct.specs.batteryCapacity # " mAh";
            chargingSpeed = oldProduct.specs.chargingSpeed # " W";
            warrantyDuration = "No Warranty";
            warrantyType = "";
            warrantyTerms = "No warranty provided for this product.";
          };
        };
      }
    );

    let newFeedbackStore = old.feedbackStore.map<Nat, OldFeedback, Feedback>(
      func(_id, oldFeedback) {
        oldFeedback;
      }
    );

    let newCouponStore = old.couponStore.map<Text, OldCoupon, Coupon>(
      func(_code, oldCoupon) {
        oldCoupon;
      }
    );

    let reviewStore = Map.empty<Nat, Review>();

    {
      productStore = newProductStore;
      feedbackStore = newFeedbackStore;
      couponStore = newCouponStore;
      reviewStore;
      nextProductId = old.nextProductId;
      nextFeedbackId = old.nextFeedbackId;
      nextReviewId = 1;
    };
  };
};
