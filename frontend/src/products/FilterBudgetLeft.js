import { useState } from "react";

function FilterBudgetLeft({ getFilter }) {
  const [ budget, setBudget ] = useState(100000);
  const [ category, setCategory ] = useState([]);
  const categories = ['가구', '주방용품', '수납·정리', '생활용품', '패브릭', '공구·DIY', '데코·식물', '조명'];

  return (
    <>
    <ul className="list-group list-group-flush rounded">
      <li className="list-group-item hideMenu">
        <h5 className="mt-1 mb-2">Your Budget</h5>
        <div className="d-grid d-block mb-3">
          <div className="form-floating mb-2">
            <input
              type="number"
              className="form-control budget"
              placeholder="Min"
              defaultValue={ budget }
              onChange= {(event)=> setBudget(event.target.valueAsNumber)}
            />
            <label htmlFor="floatingInput">Budget</label>
          </div>
          <h5 className="mt-1 mb-2">Category</h5>
          <div className="filterCategory">
            { categories.map((cat,index) => {
                return (
                  <>
                  <button value={ cat } className='btn btn-outline-secondary' key={`category${index}`} onClick={ (event) => {
                    const ca = event.target.value;
                    const click = event.target.className;
                    if(click === 'btn btn-secondary') {
                      setCategory(category.filter(c => c !== ca));
                      event.target.className = 'btn btn-outline-secondary';
                    } else {
                      setCategory([...category, ca]);
                      event.target.className = 'btn btn-secondary';
                    }
                  } }>{ cat }</button>
                  </>
                )
            })}
            </div>
          <br/>
          <button className="btn btn-secondary apply" onClick={ () => getFilter(minprice, maxprice, category) }>Apply</button>
        </div>
      </li>
    </ul>
  </>
  );
}

export default FilterBudgetLeft;