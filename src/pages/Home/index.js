import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MdAddShoppingCart } from 'react-icons/md';
import Lottie from 'react-lottie';
import PropTypes from 'prop-types';
import Loader from 'react-loader-spinner';
import { formatPrice } from '../../util/format';
import api from '../../services/api';
import animationData from '../../animations/loadingShoes.json';

import * as CartActions from '../../store/modules/cart/actions';

import { ProductList } from './styles';

class Home extends Component {
  static propTypes = {
    addToCartRequest: PropTypes.func.isRequired,
    amount: PropTypes.shape().isRequired,
    addingProducts: PropTypes.shape().isRequired,
  };

  state = {
    products: [],
    loading: true,
  };

  async componentDidMount() {
    const response = await api.get('products');

    const data = response.data.map(product => ({
      ...product,
      priceFormatted: formatPrice(product.price),
    }));

    this.setState({
      products: data,
      loading: false,
    });
  }

  handleAddProduct = id => {
    const { addToCartRequest } = this.props;
    const { loading } = this.state;

    addToCartRequest(id, loading);
  };

  render() {
    const { products, loading } = this.state;
    const { amount, addingProducts } = this.props;

    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice',
      },
    };

    if (loading) {
      return <Lottie options={defaultOptions} height={400} width={400} />;
    }

    return (
      <ProductList>
        {products.map(product => (
          <li key={product.id}>
            <img src={product.image} alt={product.title} />
            <strong>{product.title}</strong>
            <span>{product.priceFormatted}</span>

            <button
              type="button"
              onClick={() => this.handleAddProduct(product.id)}
              disabled={addingProducts.includes(product.id)}
            >
              <div>
                <MdAddShoppingCart size={16} color="#FFF" />{' '}
                {amount[product.id] || 0}
                {addingProducts.includes(product.id) && (
                  <div className="loading">
                    <Loader type="Oval" color="#FFF" width={18} height={18} />
                  </div>
                )}
              </div>

              <span>ADICIONAR AO CARRINHO</span>
            </button>
          </li>
        ))}
      </ProductList>
    );
  }
}

const mapStateToProps = state => ({
  amount: state.cart.reduce((amount, product) => {
    amount[product.id] = product.amount;
    return amount;
  }, {}),
  addingProducts: state.cart.addingProducts,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
