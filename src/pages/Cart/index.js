import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  MdRemoveCircleOutline,
  MdAddCircleOutline,
  MdDelete,
  MdRemoveShoppingCart,
} from 'react-icons/md';

import { formatPrice } from '../../util/format';

import * as CartActions from '../../store/modules/cart/actions';

import { Container, ProductTable, Total, EmptyCart } from './styles';

function Cart({ cart, total, removeFromCart, updateAmountRequest }) {
  function increment(product) {
    updateAmountRequest(product.id, product.amount + 1);
  }

  function decrement(product) {
    updateAmountRequest(product.id, product.amount - 1);
  }

  if (!cart.length) {
    return (
      <Container>
        <EmptyCart>
          <MdRemoveShoppingCart size={140} />
          <h2>O carrinho está vazio</h2>
          <p>Você não tem nenhum produto em seu carrinho.</p>
          <Link to="/">
            <button type="button">Ir para a loja</button>
          </Link>
        </EmptyCart>
      </Container>
    );
  }

  return (
    <Container>
      <ProductTable>
        <thead>
          <tr>
            <th />
            <th>PRODUTO</th>
            <th>QTD</th>
            <th>SUBTOTAL</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {cart.map(product => (
            <tr>
              <td>
                <img src={product.image} alt={product.title} />
              </td>
              <td>
                <strong>{product.title}</strong>
                <span>{product.priceFormatted}</span>
              </td>
              <td>
                <div>
                  <button type="button" onClick={() => decrement(product)}>
                    <MdRemoveCircleOutline size={20} color="#7159c1" />
                  </button>
                  <input type="number" readOnly value={product.amount} />
                  <button type="button" onClick={() => increment(product)}>
                    <MdAddCircleOutline size={20} color="#7159c1" />
                  </button>
                </div>
              </td>
              <td>
                <strong>{product.subtotal}</strong>
              </td>
              <td>
                <button
                  type="button"
                  onClick={() => removeFromCart(product.id)}
                >
                  <MdDelete size={20} color="#7159c1" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </ProductTable>

      <footer>
        <button type="button">Finalizar pedido</button>

        <Total>
          <span>TOTAL</span>
          <strong>{total}</strong>
        </Total>
      </footer>
    </Container>
  );
}

const mapStateToProps = state => ({
  cart: state.cart.products.map(product => ({
    ...product,
    subtotal: formatPrice(product.price * product.amount),
  })),
  total: formatPrice(
    state.cart.products.reduce((total, product) => {
      return total + product.price * product.amount;
    }, 0)
  ),
});

Cart.propTypes = {
  cart: PropTypes.shape().isRequired,
  total: PropTypes.shape().isRequired,
  removeFromCart: PropTypes.func.isRequired,
  updateAmountRequest: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart);
