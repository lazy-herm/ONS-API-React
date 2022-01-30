import { Fragment, useContext} from "react";
import Context from "../context/context";
import FormDropDown from "./FormDropDown";
const ViewDimensions = (props) => {
  const ctx = useContext(Context);
  const onChange=()=>{
    ctx.observationsHandler();
  }
  return (
    <Fragment>
      {props.dimension && (
          <FormDropDown
            label={props.dimension.label}
            options={props.dimension.options}
            name={props.dimension.name}
            grouping="dimensions"
            onChangeProp={onChange}
          />
      )}
    </Fragment>
  );
};

export default ViewDimensions;
