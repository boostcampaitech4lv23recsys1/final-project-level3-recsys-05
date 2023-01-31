import axios from "axios";
import { useEffect, useState } from "react";

function FilterMenuLeft(props) {
  const [ minprice, setMinprice ] = useState(0);
  const [ maxprice, setMaxprice ] = useState(0);
  const geter = () => {
    console.log(props);
    props.getting(minprice, maxprice);
  }
  console.log(props.getting(minprice, maxprice));
    return (
      <ul className="list-group list-group-flush rounded">
        <li className="list-group-item">
          <h5 className="mt-1 mb-2">Price Range</h5>
          <div className="d-grid d-block mb-3">
            <div className="form-floating mb-2">
              <input
                type="number"
                className="form-control min-price"
                placeholder="Min"
                defaultValue={ minprice }
                onChange= {(event)=> setMinprice(event.target.valueAsNumber)}
              />
              <label htmlFor="floatingInput">Min Price</label>
            </div>
            <div className="form-floating mb-2">
              <input
                type="number"
                className="form-control max-price"
                placeholder="Max"
                defaultValue= { maxprice }
                onChange = {(event)=> setMaxprice(event.target.valueAsNumber)}
              />
              <label htmlFor="floatingInput">Max Price</label>
            </div>
            <button className="btn btn-dark apply" onClick={ geter }>Apply</button>
          </div>
        </li>
      </ul>
    );
  }

export default FilterMenuLeft;