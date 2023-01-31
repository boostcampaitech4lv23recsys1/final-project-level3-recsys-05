import { useState } from "react";

function FilterMenuLeft({ getFilter }) {
  const [ minprice, setMinprice ] = useState(0);
  const [ maxprice, setMaxprice ] = useState(0);
  const [ category, setCategory ] = useState('가구');
  const [ style, setStyle ] = useState('모던');
  const categories = ['가구', '주방용품', '수납·정리', '생활용품', '패브릭', '가전·디지털', '공구·DIY', '데코·식물', '인테리어시공',
  '조명', '캠핑·레저', '생필품', '유아·아동', '반려동물', '식품', '렌탈'];
  const styles = ['모던', '빈티지&레트로', '북유럽', '내추럴', '러블리&로맨틱', '미니멀&심플', '유니크&믹스매치', '한국&아시아',
  '프렌치&프로방스', '클래식&앤틱', '인더스트리얼'];

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
          <h5 className="mt-1 mb-2">Category</h5>
          <select onChange={(event) => setCategory(categories[event.target.options.selectedIndex])}>
            { categories.map((cat) => {
              return (
                <option key={ cat }>{ cat }</option>
              )
            })}
          </select>
          <br/>
          <h5 className="mt-1 mb-2">Style</h5>
          <select onChange={(event) => setStyle(styles[event.target.options.selectedIndex])}>
            { styles.map((st) => {
              return (
                <option key={ st }>{ st }</option>
              )
            })}
          </select>
          <br/>
          <button className="btn btn-dark apply" onClick={ () => getFilter(minprice, maxprice, category, style) }>Apply</button>
        </div>
      </li>
    </ul>
  );
}

export default FilterMenuLeft;