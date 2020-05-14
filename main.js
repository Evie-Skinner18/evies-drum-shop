Vue.component('product-review', {
    template:
    `
    <form class="review-form" @submit.prevent="onSubmit">
      <h3>Leave a review</h3>
      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review" required></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>    
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null
        }
    },
    methods: {
        onSubmit() {
            var productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating
            };
            // send this product review up to the Product component
            this.$emit('review-submitted', productReview);
            this.name = null,
            this.review = null,
            this.rating = null
        }
    }

});


Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template:
    `    
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `,
    data(){
        return {
        }
    }
});



Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
    <button @click="addToTrolley" :disabled="numberInStock === 0" :class="{ disabledButton: numberInStock === 0 }">Add to trolley</button>
    <button @click="removeFromTrolley">Remove from trolley</button>
    <div class="product-image">
        <img v-bind:src="image" alt="Photo of the current product"/>
    </div>
    <div class="product-info">
        <span v-show="isOnSale">{{ saleMessage }}</span>
        <h1>{{ productTitle }}</h1>
        <h2>These {{ product }}s are SO fancy! What are the deetz?</h2>
        <product-details :details="details"></product-details>
        <h2>Options for this product</h2>
        <h3>Colours (hover to see!)</h3>
        <div v-for="(variant, index) in variants" :key="variant.variantId">
            <div @mouseover="changeSelectedVariant(index)" class="colour-box" :style="{ backgroundColor: variant.variantColour }"></div>
        </div>
        <h3>Sizes</h3>
        <ul>
            <li v-for="size in sizes">{{ size }}</li>
        </ul>
        <p v-if="numberInStock > 0">In stock</p>
        <p v-else>Out of stock</p>  
        <p>Shipping: {{ shipping }}</p>         
    </div>
    <div class="review">
        <h2>{{ product }} Reviews</h2>
        <p v-if="reviews.length === 0">There are no reviews yet</p>
        <ul>
            <li v-for="review in reviews">{{ review.name }} says "{{ review.review }}". {{ review.rating }} out of 5.</li>
        </ul>
    </div>
    <product-review @review-submitted="addReview"></product-review>
    <div class="product-video">
        <a v-bind:href="video"><h2>See this wicked {{ product }} in action!</h2></a>
    </div>
    </div> `,
    data() {
        return {
            brand: 'DW',
            product: 'Collector\'s Series drumkit',
            details: ['100% Maple Shells', 'chrome hardware', 'Heavy duty lugs'],
            reviews: [],
            selectedVariant: 0,
            video: 'https://www.youtube.com/watch?v=lNjOFNBkja4',
            isOnSale: false,
            variants: [
                {
                    variantId: 2847,
                    variantName: 'Mineral shells',
                    variantColour: '#1e92b9',
                    variantImage: './public/mineralDrums.jpg',
                    variantStockLevel: 5
                },
                {
                    variantId: 2848,
                    variantName: 'Tobacco shells',
                    variantColour: '#893123',
                    variantImage: './public/tobaccoDrums.jpg',
                    variantStockLevel: 0
                },
            ],
            sizes: ['22\", 12\", 14\"', '20\", 10\", 14\"', '18\", 10\", 12\"']       
        }
    },   
    // our trolley is no longer on this component so here we send the variantId up to the parent component to go in the cart
    methods: {
        addToTrolley() {
            this.$emit('add-to-trolley', this.variants[this.selectedVariant].variantId);
        },
        removeFromTrolley: function() {
            this.$emit('remove-from-trolley', this.variants[this.selectedVariant].variantId);
        },
        changeSelectedVariant(index) {
            this.selectedVariant = index;
        },
        // the product review component will send a new review up to this function
        addReview(productReview) {
            this.reviews.push(productReview);
        }
    },
    computed: {
        productTitle() {
            return `${this.brand} ${this.product}`;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        // how many of the variant we're currently hovering on are in stock?
        numberInStock() {
            return this.variants[this.selectedVariant].variantStockLevel;
        },
        saleMessage() {
            return this.isOnSale ? `${this.product}s are on sale! Cheers ${this.brand}` : '';
        },
        shipping()
        {
            return this.premium ? 'Free' : '£2';
        }
    }
});







// methods and data inside our Vue instance are accessible everywhere in all the components
var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        trolley: []
    },
    methods : {
        addToTrolley(variantId) {
            this.trolley.push(variantId);
        },
        removeFromTrolley(variantId) {
            for(var i=this.trolley.length - 1; i >= 0; i--){
                var currentVariantId = this.trolley[i];
                if(currentVariantId === variantId){
                    this.trolley.splice(i, 1);
                }
            }
        }
    }
    
});