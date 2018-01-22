##### PROPS & METHODS

---

| Prop name | Type | Default | Description                                      |
| --------- | ---- | ------- | ------------------------------------------------ |
| addToCart | bool | false   | Adds the _ADD TO CART_ button and functionality. |

```
<ProductCard alt="Instant Pot" price="$299.95" sku="3436474" />
```

With _ADD TO CART_:

```
<ProductCard addToCart alt="Instant Pot" price="$299.95" sku="3436474" />
```

```
<div
	data-component="ProductCard"
	data-prop-alt="Instant Pot"
	data-prop-price="$299.95"
	data-prop-sku="3436474"
	data-prop-add-to-cart="true"
></div>
```
