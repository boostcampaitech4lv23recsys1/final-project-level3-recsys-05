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
                  <button value={ cat } className='deactivate category_item' key={`category${index}`}onClick={ (event) => {
                    const ca = event.target.value;
                    const click = event.target.className;
                    if(click === 'activate category_item') {
                      setCategory(category.filter(c => c !== ca));
                      event.target.className = 'deactivate category_item';
                    } else {
                      setCategory([...category, ca]);
                      event.target.className = 'activate category_item';
                    }
                  } }>{ cat }</button>
                  </>
                )
            })}
            </div>
          <br/>
        </div>
      </li>
    <button className="btn btn-dark apply" onClick={ () => getFilter(budget, category) }>Apply</button>
    </ul>
  </>
  );
}

export default FilterBudgetLeft;