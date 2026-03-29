# OPENR3 Refurbished Store

## Current State
Fully functional e-commerce site for refurbished electronics. Backend: Products, Coupons, Feedback. Single imageUrl per product. No reviews, no warranty fields, no in-box details, no SmartWatch category, no currency toggle, no multiple images.

## Requested Changes (Diff)

### Add
- Multiple product images: imageUrls array; image gallery on product detail
- Warranty fields in ProductSpecs: warrantyDuration, warrantyType, warrantyTerms
- In-the-box fields on Product: chargerIncluded, billIncluded, boxIncluded
- Product Reviews: addReview, getReviewsByProduct, deleteReview
- Smart Watch category
- INR/USD currency toggle in header

### Modify
- Product type: add imageUrls, chargerIncluded, billIncluded, boxIncluded
- ProductSpecs: add warrantyDuration, warrantyType, warrantyTerms
- Product detail page: image gallery, warranty, in-box, reviews sections
- Admin panel: new fields, reviews tab
- Home page: SmartWatch section

### Remove
- Nothing

## Implementation Plan
1. Update Motoko backend with new fields and Review entity
2. Update all frontend pages and components
