import StarRate from "./StarRate";
import Heart from "./Heart";

function Product(props) {
  const product = props.product;
  const id = product.item_ids;
  const name = product.titles;
  const price = product.selling_prices;
  const star = product.star_avgs;
  const Image = product.img_urls;
  const brand = product.brands;
  const field = props.field;
  const wish = props.wish;
  
  return (
      <div className={"card shadow-sm card" + field}>
        <a href={ "#/detail/" + id } className="link" target="blank">
          <img
            className="card-img-top bg-dark cover"
            height="200"
            alt=""
            src={ Image }
            loading="lazy"
          />
        </a>
        <div className="card-body">
          <a href={ "#/detail/" + id } className="link" target="blank">
          <h5 className="card-title text-center text-dark text-truncate title">
            { name }
          </h5>
          </a>
          <p className="card-text text-center text-muted mb-0 brand">{ brand }</p>
          <p className="card-text text-center text-muted mb-0 price">{ '￦' + [price].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }</p>
          <StarRate className="card-text text-center text-muted mb-0 star" star={ star } id={ id }/>
          <div className="d-grid d-block text-center">
            <Heart liked={ wish } id={ id }/>
          </div>
        </div>
      </div>
  );
}

export default Product;