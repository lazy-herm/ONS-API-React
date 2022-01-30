import styles from '../css/FormDropDown.module.css';
const FormDropDown = (props) => {
  return (
    <div className={styles.formField}>
      <label htmlFor={props.name}>{props.label}</label>
      <select name={props.name} onChange={props.onChangeProp} defaultValue={props.name !== 'time' && props.grouping === 'dimensions' && props.options.length > 1 && props.options[1].value}>
        {props.options.map((option) => {
          const name = 'test';
          return (
            <option key={option.newId} value={option.value} newid={option.newId} >
              {option.label}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default FormDropDown;
