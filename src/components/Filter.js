import { useContext, Fragment, useEffect } from "react";
import Context from "../context/context";
import FormDropDown from "./FormDropDown";
import {
  getDatasetList,
  getEditionList,
  getVersionList,
  getDimensionList,
  getOptionList,
  getObservations,
} from "../functions/ApiFunctions.js";
import ViewDimensions from "./ViewDimensions";
import Observations from "./Observations";
import styles from '../css/Filter.module.css';
const Filter = () => {
  const ctx = useContext(Context);
  useEffect(() => {
    async function initialFetch() {
      const datasetList = await getDatasetList();
      ctx.datasetHandler(await datasetList);
      ctx.datasetIdHandler(
        await { newId: datasetList[0].newId, value: datasetList[0].value }
      );
      const editionList = await getEditionList(datasetList[0].value);
      ctx.editionListHandler(await editionList);
      ctx.editionHandler(
        await { newId: editionList[0].newId, value: editionList[0].value }
      );
      const versionList = await getVersionList(
        datasetList[0].value,
        editionList[0].value
      );
      ctx.versionListHandler(await versionList);
      ctx.versionHandler({
        newId: versionList[0].newId,
        value: versionList[0].value,
      });
      let dimensionList = [];
      for (let i = 0; i < (await versionList[0].dimensions.length); i++) {
        let optionList = getOptionList(
          datasetList[0].value,
          editionList[0].value,
          versionList[0].value,
          versionList[0].dimensions[i].value
        );
        versionList[0].dimensions[i].options = await optionList;
        dimensionList.push(await versionList[0].dimensions[i]);
      }

      ctx.dimensionListHandler(await dimensionList);
    }
    initialFetch();
  }, []);
  const onDatasetChange = async (event) => {
    const datasetValue = event.target.value;
    const datasetNewId =
      event.target[event.target.selectedIndex].getAttribute("newid");
    ctx.datasetIdHandler({ newId: datasetNewId, value: datasetValue });
    const editionList = await getEditionList(datasetValue);
    ctx.editionListHandler(await editionList);
    ctx.editionHandler(
      await { newId: editionList[0].newId, value: editionList[0].value }
    );
    const versionList = await getVersionList(
      datasetValue,
      editionList[0].value
    );
    ctx.versionListHandler(await versionList);
    ctx.versionHandler({
      newId: versionList[0].newId,
      value: versionList[0].value,
    });
    let dimensionList = [];
    for (let i = 0; i < (await versionList[0].dimensions.length); i++) {
      let optionList = getOptionList(
        datasetValue,
        editionList[0].value,
        versionList[0].value,
        versionList[0].dimensions[i].value
      );
      versionList[0].dimensions[i].options = await optionList;
      dimensionList.push(await versionList[0].dimensions[i]);
    }

    ctx.dimensionListHandler(await dimensionList);
    ctx.observationsHandler();
  };
  const onEditionChange = async (event) => {
    const editionValue = event.target.value;
    const editionNewId =
      event.target[event.target.selectedIndex].getAttribute("newid");
    ctx.editionHandler(await { newId: editionNewId, value: editionValue });
    const versionList = await getVersionList(ctx.datasetId.value, editionValue);
    ctx.versionListHandler(await versionList);
    ctx.versionHandler({
      newId: versionList[0].newId,
      value: versionList[0].value,
    });
    let dimensionList = [];
    for (let i = 0; i < (await versionList[0].dimensions.length); i++) {
      let optionList = getOptionList(
        ctx.datasetId.value,
        editionValue,
        versionList[0].value,
        versionList[0].dimensions[i].value
      );
      versionList[0].dimensions[i].options = await optionList;
      dimensionList.push(await versionList[0].dimensions[i]);
    }
    ctx.dimensionListHandler(await dimensionList);
    ctx.observationsHandler();
  };
  const onVersionChange = async (event) => {
    const versionValue = event.target.value;
    const versionNewId =
      event.target[event.target.selectedIndex].getAttribute("newid");
    ctx.versionHandler({
      newId: versionNewId,
      value: versionValue,
    });
    const dimensionList = await getDimensionList(
      ctx.datasetId.value,
      ctx.edition.value,
      versionValue
    );
    ctx.dimensionListHandler(await dimensionList);
    ctx.observationsHandler();
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    let observations = await getObservations(
      event.target["dataset"].value,
      event.target["edition"].value,
      event.target["version"].value,
      event.target.elements.dimensions.elements
    );
    ctx.observationsHandler(await observations);

  };
 
  return (
    <Fragment>
      <form onSubmit={formSubmitHandler} className={styles.form}>
        <h2>Select Dataset and Filters</h2>
        <p>ONS Data API is in beta and not all datasets have complete series of values making the below chart and table look incomplete or broken.</p>
        {ctx.datasets && (
          <FormDropDown
            label="Dataset"
            name="dataset"
            options={ctx.datasets}
            onChangeProp={onDatasetChange}
          ></FormDropDown>
        )}
        {ctx.editionList && (
          <FormDropDown
            label="Edition"
            name="edition"
            options={ctx.editionList}
            onChangeProp={onEditionChange}
          ></FormDropDown>
        )}
        {ctx.versionList && (
          <FormDropDown
            label="Version"
            name="version"
            options={ctx.versionList}
            onChangeProp={onVersionChange}
          ></FormDropDown>
        )}
        {ctx.dimensionList && (
          <fieldset name="dimensions">
            <label className={styles.filterLabel}>Filters</label>
            {ctx.dimensionList.map((dimension) => {
              return (
                <ViewDimensions key={dimension.newId} dimension={dimension} />
              );
            })}
          </fieldset>
        )}
        {ctx.dimensionList && <button>Fetch Data</button>}
      </form>
      {ctx.observations && (
        <Observations ></Observations>
      )}
    </Fragment>
  );
};

export default Filter;
